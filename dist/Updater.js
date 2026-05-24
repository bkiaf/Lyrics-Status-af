"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updater = void 0;

const https = require("https");
const http = require("http");
const fs = require("node:fs");
const path = require("node:path");
const StreamZip = require("node-stream-zip");

const REPO = "bkiaf/Lyrics-Status-af";
const ROOT_DIR = path.join(__dirname, "..");

function readCurrentVersion() {
    try {
        return fs.readFileSync(path.join(ROOT_DIR, "VERSION"), "utf-8").trim();
    } catch(e) {
        return "0.0.0";
    }
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.0" } };
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, opts, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchJSON(res.headers.location).then(resolve).catch(reject);
            }
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { reject(new Error("JSON parse error: " + data.slice(0, 200))); }
            });
        });
        req.on("error", reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error("Request timed out")); });
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.0" } };
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, opts, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error("Download failed: HTTP " + res.statusCode));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
            file.on("error", (e) => { fs.unlink(dest, () => {}); reject(e); });
        });
        req.on("error", (e) => { fs.unlink(dest, () => {}); reject(e); });
        req.setTimeout(60000, () => { req.destroy(); reject(new Error("Download timed out")); });
    });
}

function versionGt(a, b) {
    // Returns true if a > b (semver-ish, strips leading v)
    const parse = v => v.replace(/^v/, "").split(".").map(x => parseInt(x) || 0);
    const [a1, a2, a3] = parse(a);
    const [b1, b2, b3] = parse(b);
    if (a1 !== b1) return a1 > b1;
    if (a2 !== b2) return a2 > b2;
    return a3 > b3;
}

class Updater {
    static async checkForUpdate() {
        const current = readCurrentVersion();
        const release = await fetchJSON(`https://api.github.com/repos/${REPO}/releases/latest`);

        if (release.message) {
            throw new Error("GitHub API: " + release.message);
        }

        const latestTag = release.tag_name || "0.0.0";
        const hasUpdate = versionGt(latestTag, current);

        // Prefer a .zip asset over zipball (zipball needs token on private repos)
        let downloadUrl = release.zipball_url;
        for (const asset of (release.assets || [])) {
            if (asset.name.endsWith(".zip")) {
                downloadUrl = asset.browser_download_url;
                break;
            }
        }

        return {
            current,
            latest: latestTag,
            hasUpdate,
            downloadUrl,
            releaseNotes: release.body || "",
            publishedAt: release.published_at || ""
        };
    }

    static async doUpdate(downloadUrl, onProgress) {
        const tmpZip = path.join(ROOT_DIR, "_update.zip");
        const tmpDir = path.join(ROOT_DIR, "_update_tmp");

        onProgress("Downloading update...");
        await downloadFile(downloadUrl, tmpZip);

        onProgress("Extracting files...");

        // Clean up temp dir
        if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.mkdirSync(tmpDir);

        await new Promise((resolve, reject) => {
            const zip = new StreamZip({ file: tmpZip, storeEntries: true });
            zip.on("error", reject);
            zip.on("ready", () => {
                zip.extract(null, tmpDir, (err) => {
                    zip.close();
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        onProgress("Installing...");

        // Find the extracted top-level folder
        const items = fs.readdirSync(tmpDir);
        let srcDir = tmpDir;
        if (items.length === 1) {
            const candidate = path.join(tmpDir, items[0]);
            if (fs.statSync(candidate).isDirectory()) {
                srcDir = candidate;
            }
        }

        // Copy everything to the root dir (overwrite existing files)
        fs.cpSync(srcDir, ROOT_DIR, { recursive: true, force: true });

        // Cleanup temp files
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e) {}
        try { fs.unlinkSync(tmpZip); } catch(e) {}

        onProgress("done");
    }

    static getCurrentVersion() {
        return readCurrentVersion();
    }
}

exports.Updater = Updater;
