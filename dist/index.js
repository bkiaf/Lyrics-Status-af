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

Settings_1.Settings.load();
const AF_CONSOLE_ACCENT = "\x1b[38;2;146;152;255m";
const AF_CONSOLE_RESET = "\x1b[0m";

// ─── AUTO-UPDATE CHECK ────────────────────────────────────────────────────────
async function checkAutoUpdate() {
    if (!Settings_1.Settings.update || !Settings_1.Settings.update.enableAutoupdate) return;

    console.log("\n  [Update] Auto-update enabled — checking for updates...\n");
    try {
        const result = await Updater_1.Updater.checkForUpdate();
        if (!result.hasUpdate) {
            console.log("  [Update] Already up to date (" + result.current + ")\n");
            return;
        }

        console.log("  [Update] New version available: " + result.latest + " (current: " + result.current + ")\n");
        console.log("  [Update] Downloading...\n");

        await Updater_1.Updater.doUpdate(result.downloadUrl, (msg) => {
            console.log("  [Update] " + msg);
        });

        console.log("\n  [Update] ✓ Update applied! Restarting...\n");
        // Exit code 2 = update applied → run.bat will restart
        setTimeout(() => process.exit(2), 1000);
    } catch(e) {
        console.log("  [Update] Check failed: " + e.message + " (continuing with current version)\n");
    }
}

checkAutoUpdate().then(() => init());

function init() {
    if (!Settings_1.Settings.credentials.uuid) {
        Settings_1.Settings.credentials.uuid = (0, uuid_1.v4)();
        Settings_1.Settings.save();
    }
    ExternalAuthServerAPI_1.ExternalAuthServerAPI.register();
    SpotifyService_1.SpotifyService.refresh();
    const lyricsFetcher = new LyricsFetcher_1.LyricsFetcher();
    lyricsFetcher.addSource(new SpotifySource_1.SpotifySource());
    lyricsFetcher.addSource(new LrcLibSource_1.LrcLibSource());
    lyricsFetcher.addSource(new NetEaseMusicSource_1.NetEaseMusicSource());
    lyricsFetcher.addSource(new QQMusicSource_1.QQMusicSource());
    const playbackState = new PlaybackState_1.PlaybackState();
    const playbackStateUpdater = new PlaybackStateUpdater_1.PlaybackStateUpdater(playbackState, lyricsFetcher);
    const statusChanger = new StatusChanger_1.StatusChanger(playbackState);
    setInterval(() => {
        playbackStateUpdater.update();
    }, 5000);
    let lastTick = Date.now();
    let lastSeenSongId = "";
    setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTick;
        lastTick = now;
        if (playbackState.isPlaying) {
            playbackState.songProgress += elapsed;
        }
        if (playbackState.songId !== lastSeenSongId) {
            lastSeenSongId = playbackState.songId;
            statusChanger.songChanged();
        }
        statusChanger.changeStatus();
        if (playbackState.ended)
            statusChanger.songChanged();
        console.clear();
        console.log(`${AF_CONSOLE_ACCENT}
    ────────────────────────────
    Song:          ${playbackState.songName || "Not listening"}
    Author:        ${playbackState.songAuthor || "Not listening"}
    Progress:      ${statusChanger.formatSeconds(+(playbackState.songProgress / 1000).toFixed(0))}
    Current line:  ${(playbackState.currentLine && playbackState.currentLine.text) || (playbackState.hasLyrics ? "Waiting..." : "No lyrics")}
    Fetched from:  ${lyricsFetcher.lastFetchedFrom}
    ────────────────────────────
    ${AF_CONSOLE_RESET}`);
    }, 250);
    (0, Server_1.startServer)(playbackState, statusChanger);
}
process.on("uncaughtException", (e) => {
    Debug_1.Debug.write(e.stack + "\n" + e.cause);
    if (!e.message.includes("fetch failed")) {
        process.exit(1);
    }
});
