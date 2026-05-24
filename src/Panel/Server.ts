import express from "express"
import { createServer } from "node:http"
import { WebSocketServer } from "ws"
import { join } from "node:path"
import { Settings } from "../Settings"
import { SpotifyService } from "../SpotifyService"
import { Updater } from "../Updater"
import { PlaybackState } from "../PlaybackState"
import { StatusChanger } from "../StatusChanger"

export function startServer(playbackState?: PlaybackState, statusChanger?: StatusChanger): void {
    const app = express()
    const httpServer = createServer(app)
    const wss = new WebSocketServer({
        server: httpServer,
        path: "/ws"
    })

    app.use(express.json())
    app.use("/", express.static(join(__dirname, "../../static")))

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../../static/index.html"))
    })

    app.get("/callback", (req, res) => {
        if (Settings.credentials.useExternalAuthServer) {
            if (!req.query.refresh_token) return res.sendStatus(401)

            const refreshToken = req.query.refresh_token
            console.log(refreshToken)
            Settings.credentials.refreshToken = refreshToken as string
            Settings.save()
        } else {
            if (!req.query.code) return res.sendStatus(401)

            const code = req.query.code
            Settings.credentials.code = code as string
            SpotifyService.exchange().then(() => Settings.save())
        }
        res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Spotify authorization complete</title>
        <script>
            // Try to close the popup window once the callback has been received
            (function () {
                try {
                    // If this window was opened by another page, attempt to close it
                    if (window.opener && !window.opener.closed) {
                        window.close();
                    }
                } catch (e) {
                    // Ignore cross-origin or other errors
                }
            })();
        </script>
    </head>
    <body>
        <p>Authorization complete. This window should close automatically. If it doesn't, you can close it now.</p>
    </body>
    </html>`)
    })

    app.get("/api/version", (req, res) => {
        res.json({ version: Updater.getCurrentVersion() })
    })

    app.get("/api/check-update", async (req, res) => {
        try {
            const result = await Updater.checkForUpdate()
            res.json(result)
        } catch(e) {
            res.status(500).json({ error: (e as Error).message })
        }
    })

    app.post("/api/do-update", async (req, res) => {
        const { downloadUrl } = req.body || {}
        if (!downloadUrl) return res.status(400).json({ error: "No download URL provided" })

        res.json({ started: true })

        const broadcast = (type: string, message: string) => {
            const payload = JSON.stringify({ type, message })
            wss.clients.forEach(client => {
                if (client.readyState === 1) client.send(payload)
            })
        }

        try {
            await Updater.doUpdate(downloadUrl, (msg) => {
                console.log("[Updater]", msg)
                if (msg !== "done") broadcast("update_progress", msg)
            })

            broadcast("update_done", "Update applied successfully! Restarting...")
            setTimeout(() => process.exit(2), 3000)
        } catch(e) {
            console.error("[Updater] Error:", (e as Error).message)
            broadcast("update_error", (e as Error).message)
        }
    })

    wss.on("connection", (ws) => {
        ws.on("message", (data) => {
            const settings = JSON.parse(data.toString())
            // Not typed but it's necessary

            Settings.credentials = settings.credentials
            Settings.view = settings.view
            Settings.timings = settings.timings
            Settings.update = settings.update

            Settings.save()
        })

        const settings = JSON.stringify({
            type: "settings",
            credentials: Settings.credentials,
            view: Settings.view,
            timings: Settings.timings,
            update: Settings.update,
            version: Updater.getCurrentVersion()
        })

        ws.send(settings)
    })

    setInterval(() => {
        if (!playbackState || !statusChanger) return

        const msg = JSON.stringify({
            type: "playback",
            isPlaying: playbackState.isPlaying,
            songName: playbackState.songName || "",
            songAuthor: playbackState.songAuthor || "",
            hasLyrics: playbackState.hasLyrics,
            currentLine: (playbackState.currentLine && playbackState.currentLine.text) || "",
            lyricsActive: !!(playbackState.isPlaying && playbackState.hasLyrics && playbackState.currentLine)
        })

        wss.clients.forEach(client => {
            if (client.readyState === 1) client.send(msg)
        })
    }, 1000)

    httpServer.listen(8999)
}
