"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LyricsFetcher_1 = require("./LyricsFetcher");
const SpotifySource_1 = require("./Sources/SpotifySource");
const NetEaseMusicSource_1 = require("./Sources/NetEaseMusicSource");
const LrcLibSource_1 = require("./Sources/LrcLibSource");
const QQMusicSource_1 = require("./Sources/QQMusicSource");
const PlaybackStateUpdater_1 = require("./PlaybackStateUpdater");
const PlaybackState_1 = require("./PlaybackState");
const StatusChanger_1 = require("./StatusChanger");
const Debug_1 = require("./Debug");
const Server_1 = require("./Panel/Server");
const Settings_1 = require("./Settings");
const SpotifyService_1 = require("./SpotifyService");
const uuid_1 = require("uuid");
const ExternalAuthServerAPI_1 = require("./ExternalAuthServerAPI");
const Updater_1 = require("./Updater");

const fs = require("node:fs");
const path = require("node:path");
const child_process = require("node:child_process");
function afPowerShellString(value) {
    return "'" + String(value).replace(/'/g, "''") + "'";
}
function afCreateShortcut() {
    if (process.platform !== "win32") return;
    try {
        const rootDir = path.resolve(__dirname, "..");
        const exePath = path.join(rootDir, "Lyrics Status.exe");
        if (!fs.existsSync(exePath)) return;
        const ps = [
            "$TargetPath = " + afPowerShellString(exePath),
            "$ShortcutPath = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Lyrics Status.lnk')",
            "$WorkingDirectory = [System.IO.Path]::GetDirectoryName($TargetPath)",
            "$Shell = New-Object -ComObject WScript.Shell",
            "$Shortcut = $Shell.CreateShortcut($ShortcutPath)",
            "$Shortcut.TargetPath = $TargetPath",
            "$Shortcut.WorkingDirectory = $WorkingDirectory",
            "$Shortcut.IconLocation = $TargetPath",
            "$Shortcut.Save()"
        ].join("; ");
        child_process.execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-EncodedCommand", Buffer.from(ps, "utf16le").toString("base64")], { windowsHide: true, stdio: "ignore" });
    } catch(e) {}
}

afCreateShortcut();

Settings_1.Settings.load();
const AF_CONSOLE_ACCENT = "\x1b[38;2;146;152;255m";
const AF_CONSOLE_RESET = "\x1b[0m";
const AF_CONSOLE_LOGO = [
    "          █████╗ ███████╗        Lyrics Status AF",
    "         ██╔══██╗██╔════╝        GitHub : github.com/bkiaf/Lyrics-Status-af",
    "         ███████║█████╗          Profile: guns.lol/boykisseraf",
    "         ██╔══██║██╔══╝",
    "         ██║  ██║██║",
    "         ╚═╝  ╚═╝╚═╝"
].join("\n");
const AF_CONSOLE_SEPARATOR = "     " + "─".repeat(76);
let afConsoleStarted = false;
let afLastConsoleFrame = "";
function afRenderConsole(frame) {
    if (!afConsoleStarted) {
        process.stdout.write("\x1b[2J\x1b[3J\x1b[H\x1b[?25l");
        afConsoleStarted = true;
    }
    if (frame === afLastConsoleFrame) return;
    afLastConsoleFrame = frame;
    process.stdout.write("\x1b[H" + frame + "\x1b[J");
}
function afRestoreConsoleCursor() {
    if (afConsoleStarted) process.stdout.write("\x1b[?25h");
}
process.on("exit", afRestoreConsoleCursor);
process.on("SIGINT", () => {
    afRestoreConsoleCursor();
    process.exit(0);
});
process.on("SIGTERM", () => {
    afRestoreConsoleCursor();
    process.exit(0);
});

async function checkAutoUpdate() {
    if (!Settings_1.Settings.update || !Settings_1.Settings.update.enableAutoupdate) return false;

    console.log("\n  [Update] Auto-update enabled — checking for updates...\n");
    try {
        const result = await Updater_1.Updater.checkForUpdate();
        if (!result.hasUpdate) {
            console.log("  [Update] Already up to date (" + result.current + ")\n");
            return false;
        }

        console.log("  [Update] New version available: " + result.latest + " (current: " + result.current + ")\n");
        console.log("  [Update] Downloading...\n");

        await Updater_1.Updater.doUpdate(result.downloadUrl, (msg) => {
            console.log("  [Update] " + msg);
        });

        console.log("\n  [Update] ✓ Update applied! Restarting...\n");
        process.exit(2);
        return true;
    } catch(e) {
        console.log("  [Update] Check failed: " + e.message + " (continuing with current version)\n");
        return false;
    }
}

checkAutoUpdate().then((updated) => {
    if (!updated) init();
});

function init() {
    if (!Settings_1.Settings.credentials.uuid) {
        Settings_1.Settings.credentials.uuid = (0, uuid_1.v4)();
        Settings_1.Settings.save();
    }
    if (Settings_1.Settings.credentials.useExternalAuthServer) {
        ExternalAuthServerAPI_1.ExternalAuthServerAPI.register().catch((e) => {
            Debug_1.Debug.write("External auth registration failed: " + (e && e.stack ? e.stack : e));
        });
    }
    else if (Settings_1.Settings.credentials.refreshToken) {
        SpotifyService_1.SpotifyService.refresh().catch((e) => {
            Debug_1.Debug.write("Spotify refresh failed: " + (e && e.stack ? e.stack : e));
        });
    }
    const lyricsFetcher = new LyricsFetcher_1.LyricsFetcher();
    lyricsFetcher.addSource(new SpotifySource_1.SpotifySource());
    lyricsFetcher.addSource(new LrcLibSource_1.LrcLibSource());
    lyricsFetcher.addSource(new NetEaseMusicSource_1.NetEaseMusicSource());
    lyricsFetcher.addSource(new QQMusicSource_1.QQMusicSource());
    const playbackState = new PlaybackState_1.PlaybackState();
    const playbackStateUpdater = new PlaybackStateUpdater_1.PlaybackStateUpdater(playbackState, lyricsFetcher);
    const statusChanger = new StatusChanger_1.StatusChanger(playbackState);
    playbackStateUpdater.update();
    setInterval(() => {
        playbackStateUpdater.update();
    }, 850);
    let lastTick = Date.now();
    let lastSeenSongId = "";
    let lastSeenProgress = 0;
    setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTick;
        lastTick = now;
        if (playbackState.isPlaying) {
            playbackState.songProgress += elapsed;
        }
        const songChanged = playbackState.songId !== lastSeenSongId;
        const progressJumpedBack = !songChanged && playbackState.songId && playbackState.songProgress + 1500 < lastSeenProgress;
        if (songChanged || progressJumpedBack) {
            lastSeenSongId = playbackState.songId;
            statusChanger.songChanged();
        }
        lastSeenProgress = playbackState.songProgress;
        statusChanger.changeStatus();
        if (playbackState.ended)
            statusChanger.songChanged();
        const displaySong = playbackState.songName || "Not listening";
        const displayArtist = playbackState.songAuthor || (playbackState.songName ? "Unknown artist" : "—");
        const frame = `${AF_CONSOLE_ACCENT}${AF_CONSOLE_LOGO}

${AF_CONSOLE_SEPARATOR}
     Song:          ${displaySong}
     Artist:        ${displayArtist}
     Progress:      ${statusChanger.formatSeconds(+(playbackState.songProgress / 1000).toFixed(0))}
     Current line:  ${(playbackState.currentLine && playbackState.currentLine.text) || (playbackState.hasLyrics ? "Waiting..." : "No lyrics")}
     Fetched from:  ${lyricsFetcher.lastFetchedFrom}
${AF_CONSOLE_SEPARATOR}
${AF_CONSOLE_RESET}`;
        afRenderConsole(frame);
    }, 250);
    (0, Server_1.startServer)(playbackState, statusChanger, lyricsFetcher);
}
process.on("uncaughtException", (e) => {
    Debug_1.Debug.write(e.stack + "\n" + e.cause);
    if (!e.message.includes("fetch failed")) {
        process.exit(1);
    }
});

process.on("unhandledRejection", (e) => {
    Debug_1.Debug.write("Unhandled rejection: " + (e && e.stack ? e.stack : e));
});
