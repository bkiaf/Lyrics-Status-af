"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsFetcher = void 0;
const fs_1 = require("fs");
class LyricsFetcher {
    constructor() {
        this.sources = [];
        this.lastFetchedFrom = "Not fetched";
        this.lastFetchedFor = "";
        this._fetchingKey = "";
        this._fetchPromise = null;
    }

    cleanWordTimingsForLine(line) {
        const text = String(line && line.text || "");
        const lyricWords = text.trim().split(/\s+/).filter(Boolean);
        const rawWords = Array.isArray(line && line.words) ? line.words : [];
        if (!lyricWords.length || !rawWords.length)
            return null;
        const cleaned = lyricWords.map((word, index) => {
            const raw = rawWords[index] || {};
            const duration = Math.max(80, Math.min(12000, Math.round(Number(raw.duration || raw.ms || 0) || 0)));
            return duration > 0 ? { text: word, duration } : null;
        }).filter(Boolean);
        return cleaned.length ? cleaned : null;
    }
    cleanLyricsLines(lines = []) {
        return (Array.isArray(lines) ? lines : [])
            .map(line => {
                const cleaned = {
                    time: Math.max(0, Number(line && line.time) || 0),
                    text: String(line && line.text || "")
                };
                const words = this.cleanWordTimingsForLine(line || {});
                if (words) cleaned.words = words;
                return cleaned;
            })
            .sort((a, b) => a.time - b.time);
    }
    addSource(source) {
        this.sources.push(source);
    }
    customPathFor(name, artist, trackId = "") {
        if (trackId) {
            const safeTrackId = String(trackId).replace(/[/\:*?"<>|]/g, "_");
            return `./custom-lyrics/track-${safeTrackId}.json`;
        }
        const safeName = String(name || "unknown").replace(/[/\:*?"<>|]/g, "_");
        const safeArtist = String(artist || "unknown").replace(/[/\:*?"<>|]/g, "_");
        return `./custom-lyrics/${safeName}-${safeArtist}.json`;
    }
    fetchCustomLyrics(name, artist, trackId = "") {
        const path = this.customPathFor(name, artist, trackId);
        let lyrics = null;
        try {
            lyrics = JSON.parse((0, fs_1.readFileSync)(path).toString());
        }
        catch { }
        if (lyrics && Array.isArray(lyrics.lines)) {
            return {
                lines: this.cleanLyricsLines(lyrics.lines),
                appName: lyrics.appName || "Custom edit"
            };
        }
        return null;
    }
    saveCustomLyrics(name, artist, trackId = "", lines = []) {
        if (!(0, fs_1.existsSync)("./custom-lyrics"))
            (0, fs_1.mkdirSync)("./custom-lyrics");
        const cleaned = this.cleanLyricsLines(lines);
        (0, fs_1.writeFileSync)(this.customPathFor(name, artist, trackId), JSON.stringify({
            lines: cleaned,
            appName: "Custom edit",
            updatedAt: new Date().toISOString()
        }, null, 2));
        return { lines: cleaned, appName: "Custom edit" };
    }
    getSourceTimeoutMs(source) {
        const appName = source && typeof source.getAppName === "function" ? source.getAppName() : "";
        if (appName === "Spotify") return 2600;
        if (appName === "LrcLib") return 1600;
        return 1200;
    }
    withTimeout(promise, ms, label) {
        let timer = null;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`${label || "Lyrics source"} timed out`)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => {
            if (timer) clearTimeout(timer);
        });
    }
    async fetchLyrics(name, artist, trackId = "") {
        const key = `${trackId || "no-track-id"}||${name}||${artist}`;
        if (this._fetchingKey === key && this._fetchPromise) {
            return this._fetchPromise;
        }
        this._fetchingKey = key;
        this._fetchPromise = this._doFetch(name, artist, trackId);
        try {
            return await this._fetchPromise;
        }
        finally {
            if (this._fetchingKey === key) {
                this._fetchPromise = null;
                this._fetchingKey = "";
            }
        }
    }
    async _doFetch(name, artist, trackId = "") {
        this.lastFetchedFrom = "Loading...";
        const custom = this.fetchCustomLyrics(name, artist, trackId);
        if (custom) {
            this.lastFetchedFrom = custom.appName || "Custom edit";
            this.lastFetchedFor = trackId || (name + artist);
            return custom;
        }
        const cache = this.fetchCachedLyrics(name, artist, trackId);
        if (cache) {
            this.lastFetchedFrom = `Cache (${cache.appName})`;
            this.lastFetchedFor = trackId || (name + artist);
            return cache;
        }
        let result = null;
        for (const source of this.sources) {
            try {
                this.lastFetchedFor = trackId || (name + artist);
                const appName = source && typeof source.getAppName === "function" ? source.getAppName() : "Lyrics source";
                result = await this.withTimeout(source.getLyrics(name, artist, trackId), this.getSourceTimeoutMs(source), appName);
                if (result) {
                    this.lastFetchedFrom = source.getAppName();
                    this.cacheLyrics(name, artist, result, this.lastFetchedFrom, trackId);
                    break;
                }
            }
            catch { }
        }
        if (!result) {
            this.lastFetchedFrom = "Not found";
        }
        return result;
    }
    cachePathFor(name, artist, trackId = "") {
        if (trackId) {
            const safeTrackId = String(trackId).replace(/[/\\:*?"<>|]/g, "_");
            return `./cache/track-${safeTrackId}.json`;
        }
        const safeName = name.replace(/[/\\:*?"<>|]/g, "_");
        const safeArtist = artist.replace(/[/\\:*?"<>|]/g, "_");
        return `./cache/${safeName}-${safeArtist}.json`;
    }
    fetchCachedLyrics(name, artist, trackId = "") {
        const path = this.cachePathFor(name, artist, trackId);
        let lyrics = null;
        try {
            lyrics = JSON.parse((0, fs_1.readFileSync)(path).toString());
        }
        catch { }
        return lyrics;
    }
    cacheLyrics(name, artist, lyrics, appName, trackId = "") {
        if (!(0, fs_1.existsSync)("./cache"))
            (0, fs_1.mkdirSync)("./cache");
        (0, fs_1.writeFileSync)(this.cachePathFor(name, artist, trackId), JSON.stringify({
            ...lyrics,
            appName
        }));
    }
}
exports.LyricsFetcher = LyricsFetcher;
