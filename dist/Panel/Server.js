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

function startServer(playbackState, statusChanger, lyricsFetcher) {
    const app = (0, express_1.default)();
    const httpServer = (0, node_http_1.createServer)(app);
    const wss = new ws_1.WebSocketServer({ server: httpServer, path: "/ws" });

    const buildSettingsPayload = () => JSON.stringify({
        type: "settings",
        credentials: Settings_1.Settings.credentials,
        view: Settings_1.Settings.view,
        timings: Settings_1.Settings.timings,
        update: Settings_1.Settings.update,
        version: Updater_1.Updater.getCurrentVersion()
    });

    const broadcastSettings = () => {
        const payload = buildSettingsPayload();
        wss.clients.forEach(client => {
            if (client.readyState === 1) client.send(payload);
        });
    };

    const getActiveLineIndex = () => {
        const lines = playbackState && playbackState.lyrics && Array.isArray(playbackState.lyrics.lines) ? playbackState.lyrics.lines : [];
        if (!lines.length)
            return -1;
        const progress = Number(playbackState.songProgress || 0);
        let active = -1;
        for (let i = 0; i < lines.length; i++) {
            if (Number(lines[i].time || 0) <= progress) active = i;
            else break;
        }
        return active;
    };
    const normalizeLyricLine = (line) => {
        const normalized = { time: Number(line && line.time) || 0, text: String(line && line.text || "") };
        if (line && Array.isArray(line.words)) {
            const textWords = String(normalized.text || "").trim().split(/\s+/).filter(Boolean);
            const words = textWords.map((word, index) => {
                const raw = line.words[index] || {};
                const duration = Math.max(80, Math.min(12000, Math.round(Number(raw.duration || raw.ms || 0) || 0)));
                return duration > 0 ? { text: word, duration } : null;
            }).filter(Boolean);
            if (words.length) normalized.words = words;
        }
        return normalized;
    };
    const buildLyricsPayload = () => {
        const lines = playbackState && playbackState.lyrics && Array.isArray(playbackState.lyrics.lines)
            ? playbackState.lyrics.lines.map(normalizeLyricLine)
            : [];
        const activeLineIndex = getActiveLineIndex();
        return {
            songId: playbackState.songId || "",
            songName: playbackState.songName || "",
            songAuthor: playbackState.songAuthor || "",
            songDuration: playbackState.songDuration || 0,
            songProgress: playbackState.songProgress || 0,
            lyricsSource: (lyricsFetcher && lyricsFetcher.lastFetchedFrom) || "Not fetched",
            hasLyrics: !!lines.length,
            activeLineIndex,
            lines
        };
    };
    const broadcastLyrics = () => {
        const payload = JSON.stringify({ type: "lyrics", ...buildLyricsPayload() });
        wss.clients.forEach(client => {
            if (client.readyState === 1) client.send(payload);
        });
    };

    app.use(express_1.default.json({ limit: "5mb" }));

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
            broadcastSettings();
        } else {
            if (!req.query.code) return res.sendStatus(401);
            const code = req.query.code;
            Settings_1.Settings.credentials.code = code;
            Settings_1.Settings.save();
            broadcastSettings();
            SpotifyService_1.SpotifyService.exchange()
                .then(() => {
                    Settings_1.Settings.save();
                    broadcastSettings();
                })
                .catch((e) => {
                    console.error("[Spotify Auth] Exchange failed:", e.message);
                    broadcastSettings();
                });
        }
        res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Spotify authorization complete</title><script>(function(){try{if(window.opener&&!window.opener.closed){window.opener.postMessage({type:'spotify_authorized'},'*');window.close();}}catch(e){}})()</script></head><body><p>Authorization complete. You can return to Lyrics Status.</p></body></html>`);
    });

    app.get("/api/settings", (req, res) => {
        res.type("application/json").send(buildSettingsPayload());
    });

    app.get("/api/lyrics/current", (req, res) => {
        res.json(buildLyricsPayload());
    });

    app.post("/api/lyrics/custom", (req, res) => {
        try {
            if (!lyricsFetcher || typeof lyricsFetcher.saveCustomLyrics !== "function") {
                return res.status(500).json({ error: "Lyrics editor is not available" });
            }
            const body = req.body || {};
            const trackId = String(body.trackId || playbackState.songId || "");
            const name = String(body.songName || playbackState.songName || "");
            const artist = String(body.songAuthor || playbackState.songAuthor || "");
            const lines = Array.isArray(body.lines) ? body.lines : [];
            if (!trackId && !name) return res.status(400).json({ error: "No current song" });
            if (!lines.length) return res.status(400).json({ error: "No lyrics lines provided" });
            const saved = lyricsFetcher.saveCustomLyrics(name, artist, trackId, lines);
            lyricsFetcher.lastFetchedFrom = "Custom edit";
            lyricsFetcher.lastFetchedFor = trackId || (name + artist);
            if (!trackId || playbackState.songId === trackId) {
                playbackState.lyrics = saved;
                playbackState.hasLyrics = !!(saved.lines && saved.lines.length);
                playbackState.currentLine = null;
                if (statusChanger && typeof statusChanger.songChanged === "function") statusChanger.songChanged();
            }
            broadcastLyrics();
            res.json({ ok: true, ...buildLyricsPayload() });
        }
        catch (e) {
            res.status(500).json({ error: e.message || String(e) });
        }
    });


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

            broadcast("update_done", "Update applied successfully! The app will restart automatically.");

            setTimeout(() => process.exit(2), 3000);

        } catch(e) {
            console.error("[Updater] Error:", e.message);
            broadcast("update_error", e.message);
        }
    });


    wss.on("connection", (ws) => {
        ws.on("message", (data) => {
            const s = JSON.parse(data.toString());
            Settings_1.Settings.credentials = s.credentials;
            Settings_1.Settings.view = s.view;
            Settings_1.Settings.timings = s.timings;
            Settings_1.Settings.update = s.update;
            Settings_1.Settings.save();
        });
        ws.send(buildSettingsPayload());
        ws.send(JSON.stringify({ type: "lyrics", ...buildLyricsPayload() }));
    });

    setInterval(() => {
        if (!playbackState || !statusChanger) return;
        const msg = JSON.stringify({
            type: "playback",
            isPlaying: playbackState.isPlaying,
            songName: playbackState.songName || "",
            songAuthor: playbackState.songAuthor || "",
            hasLyrics: playbackState.hasLyrics,
            currentLine: (playbackState.currentLine && playbackState.currentLine.text) || "",
            lyricsActive: !!(playbackState.isPlaying && playbackState.hasLyrics && playbackState.currentLine),
            songId: playbackState.songId || "",
            songDuration: playbackState.songDuration || 0,
            songProgress: playbackState.songProgress || 0,
            lyricsSource: (lyricsFetcher && lyricsFetcher.lastFetchedFrom) || "Not fetched",
            activeLineIndex: getActiveLineIndex(),
            lines: playbackState.lyrics && Array.isArray(playbackState.lyrics.lines)
                ? playbackState.lyrics.lines.map(normalizeLyricLine)
                : []
        });
        wss.clients.forEach(client => {
            if (client.readyState === 1) client.send(msg);
        });
    }, 350);

    httpServer.listen(8999);
}
