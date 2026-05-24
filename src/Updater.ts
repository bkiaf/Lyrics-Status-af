import https from "https"
import http from "http"
import { readFileSync, existsSync, rmSync, mkdirSync, readdirSync, statSync, cpSync, unlinkSync, createWriteStream } from "node:fs"
import { join } from "node:path"
import StreamZip from "node-stream-zip"

const REPO = "bkiaf/Lyrics-Status-af"
const ROOT_DIR = join(__dirname, "..")

function readCurrentVersion(): string {
    try {
        return readFileSync(join(ROOT_DIR, "VERSION"), "utf-8").trim()
    } catch(e) {
        return "0.0.0"
    }
}

function fetchJSON(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.0" } }
        const mod = url.startsWith("https") ? https : http
        const req = mod.get(url, opts, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                if (!res.headers.location) return reject(new Error("Redirect missing location"))
                return fetchJSON(res.headers.location).then(resolve).catch(reject)
            }

            let data = ""
            res.on("data", chunk => data += chunk)
            res.on("end", () => {
                try { resolve(JSON.parse(data)) }
                catch(e) { reject(new Error("JSON parse error: " + data.slice(0, 200))) }
            })
        })

        req.on("error", reject)
        req.setTimeout(15000, () => { req.destroy(); reject(new Error("Request timed out")) })
    })
}

function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.0" } }
        const mod = url.startsWith("https") ? https : http
        const req = mod.get(url, opts, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                if (!res.headers.location) return reject(new Error("Redirect missing location"))
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
            }

            if (res.statusCode !== 200) return reject(new Error("Download failed: HTTP " + res.statusCode))

            const file = createWriteStream(dest)
            res.pipe(file)
            file.on("finish", () => file.close(() => resolve()))
            file.on("error", (e) => { try { unlinkSync(dest) } catch(_) {}; reject(e) })
        })

        req.on("error", (e) => { try { unlinkSync(dest) } catch(_) {}; reject(e) })
        req.setTimeout(60000, () => { req.destroy(); reject(new Error("Download timed out")) })
    })
}

function versionGt(a: string, b: string): boolean {
    const parse = (v: string) => v.replace(/^v/, "").split(".").map(x => parseInt(x) || 0)
    const [a1, a2, a3] = parse(a)
    const [b1, b2, b3] = parse(b)

    if (a1 !== b1) return a1 > b1
    if (a2 !== b2) return a2 > b2
    return a3 > b3
}

export class Updater {
    public static async checkForUpdate() {
        const current = readCurrentVersion()
        const release = await fetchJSON(`https://api.github.com/repos/${REPO}/releases/latest`)

        if (release.message) throw new Error("GitHub API: " + release.message)

        const latestTag = release.tag_name || "0.0.0"
        const hasUpdate = versionGt(latestTag, current)

        let downloadUrl = release.zipball_url
        for (const asset of (release.assets || [])) {
            if (asset.name.endsWith(".zip")) {
                downloadUrl = asset.browser_download_url
                break
            }
        }

        return {
            current,
            latest: latestTag,
            hasUpdate,
            downloadUrl,
            releaseNotes: release.body || "",
            publishedAt: release.published_at || ""
        }
    }

    public static async doUpdate(downloadUrl: string, onProgress: (msg: string) => void): Promise<void> {
        const tmpZip = join(ROOT_DIR, "_update.zip")
        const tmpDir = join(ROOT_DIR, "_update_tmp")

        onProgress("Downloading update...")
        await downloadFile(downloadUrl, tmpZip)

        onProgress("Extracting files...")
        if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true })
        mkdirSync(tmpDir)

        await new Promise<void>((resolve, reject) => {
            const zip = new StreamZip.async({ file: tmpZip })
            zip.extract(null, tmpDir)
                .then(() => zip.close())
                .then(() => resolve())
                .catch(reject)
        })

        onProgress("Installing...")

        const items = readdirSync(tmpDir)
        let srcDir = tmpDir
        if (items.length === 1) {
            const candidate = join(tmpDir, items[0])
            if (statSync(candidate).isDirectory()) srcDir = candidate
        }

        cpSync(srcDir, ROOT_DIR, { recursive: true, force: true })

        try { rmSync(tmpDir, { recursive: true, force: true }) } catch(e) {}
        try { unlinkSync(tmpZip) } catch(e) {}

        onProgress("done")
    }

    public static getCurrentVersion(): string {
        return readCurrentVersion()
    }
}
