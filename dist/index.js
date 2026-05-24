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
Settings_1.Settings.load();
init();
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
        // Reset sent lines when song changes (manual skip or auto-next)
        if (playbackState.songId !== lastSeenSongId) {
            lastSeenSongId = playbackState.songId;
            statusChanger.songChanged();
        }
        statusChanger.changeStatus();
        if (playbackState.ended)
            statusChanger.songChanged();
        console.clear();
        console.log(`
  ░▒▓██████▓▒░░▒▓████████▓▒░
  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
  ░▒▓████████▓▒░▒▓██████▓▒░░░
  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░
  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░░░░░░░

  ────────────────────────────
  Song:          ${playbackState.songName || "Not listening"}
  Author:        ${playbackState.songAuthor || "Not listening"}
  Progress:      ${statusChanger.formatSeconds(+(playbackState.songProgress / 1000).toFixed(0))}
  Current line:  ${(playbackState.currentLine && playbackState.currentLine.text) || (playbackState.hasLyrics ? "Waiting..." : "No lyrics")}
  Fetched from:  ${lyricsFetcher.lastFetchedFrom}
  ────────────────────────────
`);
    }, 250);
    (0, Server_1.startServer)(playbackState, statusChanger);
}
process.on("uncaughtException", (e) => {
    Debug_1.Debug.write(e.stack + "\n" + e.cause);
    if (!e.message.includes("fetch failed")) {
        process.exit(1);
    }
});
