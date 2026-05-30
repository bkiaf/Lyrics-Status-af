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

const OBSOLETE_ITEMS = [
    "run.bat",
    "install.bat",
    "src",
    "tools",
    "tsconfig.json",
    "tsconfig.tsbuildinfo",
    "README(1).md",
    "README(2).md",
    "_update.zip",
    "_update_tmp"
];

const PRESERVE_NAMES = new Set([
    "settings.json",
    "node_modules",
    ".af-node",
    ".af-npm-cache",
    "cache",
    "custom-lyrics",
    "_pending_launcher"
]);

function readCurrentVersion() {
    try {
        return fs.readFileSync(path.join(ROOT_DIR, "VERSION"), "utf-8").trim();
    } catch(e) {
        return "0.0.0";
    }
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.2" } };
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
        const opts = { headers: { "User-Agent": "Lyrics-Status-Updater/1.2" } };
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
    const parse = v => String(v || "")
        .trim()
        .replace(/^v/i, "")
        .split(/[.\-+]/)
        .map(x => {
            const m = String(x).match(/\d+/);
            return m ? parseInt(m[0], 10) : 0;
        });
    const aa = parse(a);
    const bb = parse(b);
    const len = Math.max(aa.length, bb.length);
    for (let i = 0; i < len; i++) {
        const av = aa[i] || 0;
        const bv = bb[i] || 0;
        if (av !== bv) return av > bv;
    }
    return false;
}

function cleanupObsoleteFiles() {
    for (const item of OBSOLETE_ITEMS) {
        try { fs.rmSync(path.join(ROOT_DIR, item), { recursive: true, force: true }); } catch(e) {}
    }
}

function copyFileSafe(src, dst) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
}

function copyUpdateTree(srcRoot, dstRoot) {
    const pendingLauncherDir = path.join(dstRoot, "_pending_launcher");
    try { fs.rmSync(pendingLauncherDir, { recursive: true, force: true }); } catch(e) {}

    const walk = (src, rel = "") => {
        const base = path.basename(src);
        const dst = path.join(dstRoot, rel);

        if (rel && PRESERVE_NAMES.has(rel)) return;
        if (base === "settings.json") return;
        if (base === ".af-node" || base === ".af-npm-cache" || base === "node_modules" || base === "cache" || base === "custom-lyrics") return;

        if (base.toLowerCase() === "lyrics status.exe") {
            fs.mkdirSync(pendingLauncherDir, { recursive: true });
            copyFileSafe(src, path.join(pendingLauncherDir, "Lyrics Status.exe"));
            return;
        }

        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
            fs.mkdirSync(dst, { recursive: true });
            for (const child of fs.readdirSync(src)) {
                walk(path.join(src, child), rel ? path.join(rel, child) : child);
            }
            return;
        }
        copyFileSafe(src, dst);
    };

    for (const child of fs.readdirSync(srcRoot)) {
        walk(path.join(srcRoot, child), child);
    }
}

function findAppRoot(dir) {
    const direct = path.join(dir, "package.json");
    if (fs.existsSync(direct) && fs.existsSync(path.join(dir, "dist")) && fs.existsSync(path.join(dir, "static"))) {
        return dir;
    }
    const stack = [dir];
    while (stack.length) {
        const current = stack.shift();
        let items = [];
        try { items = fs.readdirSync(current, { withFileTypes: true }); } catch(e) { continue; }
        if (fs.existsSync(path.join(current, "package.json")) && fs.existsSync(path.join(current, "dist")) && fs.existsSync(path.join(current, "static"))) {
            return current;
        }
        for (const item of items) {
            if (item.isDirectory() && !item.name.startsWith(".")) {
                stack.push(path.join(current, item.name));
            }
        }
    }
    return dir;
}

function copyUpdateFiles(src, dest, onProgress) {
    const preserved = new Map();
    for (const name of ["settings.json"]) {
        const p = path.join(dest, name);
        if (fs.existsSync(p)) preserved.set(name, fs.readFileSync(p));
    }

    const pendingLauncherDir = path.join(dest, "_pending_launcher");

    function copyRecursive(from, to) {
        const st = fs.statSync(from);
        const base = path.basename(from);

        if (base === "node_modules" || base === ".af-node" || base === ".af-npm-cache" || base === ".git" || base === "settings.json" || base === "cache" || base === "custom-lyrics") {
            return;
        }

        if (st.isDirectory()) {
            fs.mkdirSync(to, { recursive: true });
            for (const item of fs.readdirSync(from)) {
                copyRecursive(path.join(from, item), path.join(to, item));
            }
            return;
        }

        if (base.toLowerCase() === "lyrics status.exe") {
            fs.mkdirSync(pendingLauncherDir, { recursive: true });
            fs.copyFileSync(from, path.join(pendingLauncherDir, "Lyrics Status.exe"));
            return;
        }

        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
    }

    copyRecursive(src, dest);

    for (const [name, content] of preserved) {
        fs.writeFileSync(path.join(dest, name), content);
    }
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

        let downloadUrl = release.zipball_url;
        for (const asset of (release.assets || [])) {
            if (String(asset.name || "").toLowerCase().endsWith(".zip")) {
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
        const settingsPath = path.join(ROOT_DIR, "settings.json");
        let settingsBackup = null;

        try {
            if (fs.existsSync(settingsPath)) settingsBackup = fs.readFileSync(settingsPath);
        } catch(e) {}

        onProgress("Downloading update...");
        await downloadFile(downloadUrl, tmpZip);

        onProgress("Extracting files...");

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

        const items = fs.readdirSync(tmpDir);
        let srcDir = tmpDir;
        if (items.length === 1) {
            const candidate = path.join(tmpDir, items[0]);
            if (fs.statSync(candidate).isDirectory()) srcDir = candidate;
        }
        srcDir = findAppRoot(srcDir);

        cleanupObsoleteFiles();
        copyUpdateTree(srcDir, ROOT_DIR);
        cleanupObsoleteFiles();

        try {
            if (settingsBackup) fs.writeFileSync(settingsPath, settingsBackup);
        } catch(e) {}

        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e) {}
        try { fs.unlinkSync(tmpZip); } catch(e) {}

        onProgress("done");
    }

    static getCurrentVersion() {
        return readCurrentVersion();
    }
}

exports.Updater = Updater;
