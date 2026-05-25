"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const ws_1 = require("ws");
const node_path_1 = require("node:path");
const Settings_1 = require("../Settings");
const SpotifyService_1 = require("../SpotifyService");
const Updater_1 = require("../Updater");

function startServer(playbackState, statusChanger) {
    const app = (0, express_1.default)();
    const httpServer = (0, node_http_1.createServer)(app);
    const wss = new ws_1.WebSocketServer({ server: httpServer, path: "/ws" });

    app.use(express_1.default.json());

    app.post("/api/refresh-dashboard", (req, res) => {
        let refreshed = 0;
        const payload = JSON.stringify({ type: "force_reload" });
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                refreshed++;
                client.send(payload);
            }
        });
        res.json({ refreshed });
    });

    app.use("/", express_1.default.static((0, node_path_1.join)(__dirname, "../../static")));

    app.get("/", (req, res) => {
        res.sendFile((0, node_path_1.join)(__dirname, "../../static/index.html"));
    });

    app.get("/callback", (req, res) => {
        if (Settings_1.Settings.credentials.useExternalAuthServer) {
            if (!req.query.refresh_token) return res.sendStatus(401);
            const refreshToken = req.query.refresh_token;
            console.log(refreshToken);
            Settings_1.Settings.credentials.refreshToken = refreshToken;
            Settings_1.Settings.save();
        } else {
            if (!req.query.code) return res.sendStatus(401);
            const code = req.query.code;
            Settings_1.Settings.credentials.code = code;
            SpotifyService_1.SpotifyService.exchange().then(() => Settings_1.Settings.save());
        }
        res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Spotify authorization complete</title><script>(function(){try{if(window.opener&&!window.opener.closed){window.close();}}catch(e){}})()</script></head><body><p>Authorization complete. This window should close automatically.</p></body></html>`);
    });

    // ─── UPDATE ENDPOINTS ────────────────────────────────────────────────────────

    app.get("/api/version", (req, res) => {
        res.json({ version: Updater_1.Updater.getCurrentVersion() });
    });

    app.get("/api/check-update", async (req, res) => {
        try {
            const result = await Updater_1.Updater.checkForUpdate();
            res.json(result);
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post("/api/do-update", async (req, res) => {
        const { downloadUrl } = req.body || {};
        if (!downloadUrl) return res.status(400).json({ error: "No download URL provided" });

        // Respond immediately so client knows it started
        res.json({ started: true });

        const broadcast = (type, message) => {
            const payload = JSON.stringify({ type, message });
            wss.clients.forEach(client => {
                if (client.readyState === 1) client.send(payload);
            });
        };

        try {
            await Updater_1.Updater.doUpdate(downloadUrl, (msg) => {
                console.log("[Updater]", msg);
                if (msg !== "done") broadcast("update_progress", msg);
            });

            broadcast("update_done", "Update applied successfully! Please restart run.bat.");

            // Give clients 3 seconds to receive the done message, then exit
            // run.bat will auto-restart if it has the restart loop
            setTimeout(() => process.exit(2), 3000);

        } catch(e) {
            console.error("[Updater] Error:", e.message);
            broadcast("update_error", e.message);
        }
    });

    // ─── WEBSOCKET ────────────────────────────────────────────────────────────────

    wss.on("connection", (ws) => {
        ws.on("message", (data) => {
            const s = JSON.parse(data.toString());
            Settings_1.Settings.credentials = s.credentials;
            Settings_1.Settings.view = s.view;
            Settings_1.Settings.timings = s.timings;
            Settings_1.Settings.update = s.update;
            Settings_1.Settings.save();
        });
        const settings = JSON.stringify({
            type: "settings",
            credentials: Settings_1.Settings.credentials,
            view: Settings_1.Settings.view,
            timings: Settings_1.Settings.timings,
            update: Settings_1.Settings.update,
            version: Updater_1.Updater.getCurrentVersion()
        });
        ws.send(settings);
    });

    // Broadcast live playback state to all connected clients every second
    setInterval(() => {
        if (!playbackState || !statusChanger) return;
        const msg = JSON.stringify({
            type: "playback",
            isPlaying: playbackState.isPlaying,
            songName: playbackState.songName || "",
            songAuthor: playbackState.songAuthor || "",
            hasLyrics: playbackState.hasLyrics,
            currentLine: (playbackState.currentLine && playbackState.currentLine.text) || "",
            lyricsActive: !!(playbackState.isPlaying && playbackState.hasLyrics && playbackState.currentLine)
        });
        wss.clients.forEach(client => {
            if (client.readyState === 1) client.send(msg);
        });
    }, 1000);

    httpServer.listen(8999);
}
