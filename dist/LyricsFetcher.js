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
    addSource(source) {
        this.sources.push(source);
    }
    async fetchLyrics(name, artist) {
        const key = name + "||" + artist;
        if (this._fetchingKey === key && this._fetchPromise) {
            return this._fetchPromise;
        }
        this._fetchingKey = key;
        this._fetchPromise = this._doFetch(name, artist);
        const result = await this._fetchPromise;
        this._fetchPromise = null;
        return result;
    }
    async _doFetch(name, artist) {
        this.lastFetchedFrom = "Not fetched";
        const cache = this.fetchCachedLyrics(name, artist);
        if (cache) {
            this.lastFetchedFrom = `Cache (${cache.appName})`;
            this.lastFetchedFor = name + artist;
            return cache;
        }
        let result = null;
        for (const source of this.sources) {
            try {
                this.lastFetchedFor = name + artist;
                result = await source.getLyrics(name, artist);
                if (result) {
                    this.lastFetchedFrom = source.getAppName();
                    this.cacheLyrics(name, artist, result, this.lastFetchedFrom);
                    break;
                }
            }
            catch { }
        }
        return result;
    }
    fetchCachedLyrics(name, artist) {
        const safeName = name.replace(/[/\\:*?"<>|]/g, "_");
        const safeArtist = artist.replace(/[/\\:*?"<>|]/g, "_");
        const path = `./cache/${safeName}-${safeArtist}.json`;
        let lyrics = null;
        try {
            lyrics = JSON.parse((0, fs_1.readFileSync)(path).toString());
        }
        catch { }
        return lyrics;
    }
    cacheLyrics(name, artist, lyrics, appName) {
        if (!(0, fs_1.existsSync)("./cache"))
            (0, fs_1.mkdirSync)("./cache");
        const safeName = name.replace(/[/\\:*?"<>|]/g, "_");
        const safeArtist = artist.replace(/[/\\:*?"<>|]/g, "_");
        (0, fs_1.writeFileSync)(`./cache/${safeName}-${safeArtist}.json`, JSON.stringify({
            ...lyrics,
            appName
        }));
    }
}
exports.LyricsFetcher = LyricsFetcher;
