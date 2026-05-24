import { LyricsFetcher } from "./LyricsFetcher"
import { SpotifySource} from "./Sources/SpotifySource"
import { NetEaseMusicSource } from "./Sources/NetEaseMusicSource"
import { LrcLibSource } from "./Sources/LrcLibSource"
import { QQMusicSource } from "./Sources/QQMusicSource"
import { PlaybackStateUpdater } from "./PlaybackStateUpdater"
import { PlaybackState } from "./PlaybackState"
import { StatusChanger } from "./StatusChanger"
import { Debug } from "./Debug"
import { startServer } from "./Panel/Server"
import { Settings } from "./Settings"
import { SpotifyService } from "./SpotifyService"
import { v4 as uuidv4 } from "uuid"
import { ExternalAuthServerAPI } from "./ExternalAuthServerAPI"
import { Updater } from "./Updater"

Settings.load()

const AF_CONSOLE_ACCENT = "\x1b[38;2;146;152;255m"
const AF_CONSOLE_RESET = "\x1b[0m"

async function checkAutoUpdate(): Promise<void> {
    if (!Settings.update || !Settings.update.enableAutoupdate) return

    console.log("\n  [Update] Auto-update enabled — checking for updates...\n")

    try {
        const result = await Updater.checkForUpdate()
        if (!result.hasUpdate) {
            console.log("  [Update] Already up to date (" + result.current + ")\n")
            return
        }

        console.log("  [Update] New version available: " + result.latest + " (current: " + result.current + ")\n")
        await Updater.doUpdate(result.downloadUrl, (msg) => console.log("  [Update] " + msg))

        console.log("\n  [Update] ✓ Update applied! Restarting...\n")
        setTimeout(() => process.exit(2), 1000)
    } catch(e) {
        console.log("  [Update] Check failed: " + (e as Error).message + " (continuing with current version)\n")
    }
}

checkAutoUpdate().then(() => init())

function init(): void {
    if (!Settings.credentials.uuid) {
        Settings.credentials.uuid = uuidv4()
        Settings.save()
    }
    ExternalAuthServerAPI.register()

    SpotifyService.refresh()

    const lyricsFetcher = new LyricsFetcher()
    lyricsFetcher.addSource(new SpotifySource())
    lyricsFetcher.addSource(new LrcLibSource())
    lyricsFetcher.addSource(new NetEaseMusicSource())
    lyricsFetcher.addSource(new QQMusicSource())

    const playbackState = new PlaybackState()
    const playbackStateUpdater = new PlaybackStateUpdater(playbackState, lyricsFetcher)

    const statusChanger = new StatusChanger(playbackState)

    // Poll Spotify every 5s — update() guards against overlapping calls internally
    setInterval(() => {
        playbackStateUpdater.update()
    }, 5000)

    // Lyrics sync ticker — runs at 250ms (plenty for line-level sync, low CPU)
    let lastTick = Date.now()
    let lastSeenSongId = ""
    setInterval(() => {
        const now = Date.now()
        const elapsed = now - lastTick
        lastTick = now

        if (playbackState.isPlaying) {
            playbackState.songProgress += elapsed
        }

        // Clear sent lines when the song changes (including manual skips)
        if (playbackState.songId !== lastSeenSongId) {
            lastSeenSongId = playbackState.songId
            statusChanger.songChanged()
        }

        statusChanger.changeStatus()

        if (playbackState.ended) statusChanger.songChanged()

        console.clear()
        console.log(`${AF_CONSOLE_ACCENT}
    ────────────────────────────
    Song:          ${playbackState.songName || "Not listening"}
    Author:        ${playbackState.songAuthor || "Not listening"}
    Progress:      ${statusChanger.formatSeconds(+(playbackState.songProgress / 1000).toFixed(0))}
    Current line:  ${(playbackState.currentLine && playbackState.currentLine.text) || (playbackState.hasLyrics ? "Waiting..." : "No lyrics")}
    Fetched from:  ${lyricsFetcher.lastFetchedFrom}
    ────────────────────────────
    ${AF_CONSOLE_RESET}`)
    }, 250)

    startServer(playbackState, statusChanger)
}

process.on("uncaughtException", (e) => {
    Debug.write(e.stack + "\n" + e.cause)

    if (!e.message.includes("fetch failed")) {
        process.exit(1)
    }
})
