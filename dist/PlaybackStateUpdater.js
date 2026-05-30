"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackStateUpdater = void 0;
const SpotifyService_1 = require("./SpotifyService");
const Settings_1 = require("./Settings");
const ExternalAuthServerAPI_1 = require("./ExternalAuthServerAPI");
class PlaybackStateUpdater {
    constructor(playbackState, lyricsFetcher) {
        this._isUpdating = false;
        this.playbackState = playbackState;
        this.lyricsFetcher = lyricsFetcher;
    }
    async update() {
        if (this._isUpdating)
            return;
        this._isUpdating = true;
        try {
            await this._doUpdate();
        }
        catch {
        }
        finally {
            this._isUpdating = false;
        }
    }
    async _doUpdate() {
        const roundTripTimeStart = Date.now();
        const request = await fetch("https://api.spotify.com/v1/me/player", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + SpotifyService_1.SpotifyService.token
            }
        });
        if (request.status === 401 || request.status === 400) {
            if (Settings_1.Settings.credentials.useExternalAuthServer) {
                SpotifyService_1.SpotifyService.token = await ExternalAuthServerAPI_1.ExternalAuthServerAPI.getToken() || "";
            }
            else {
                await SpotifyService_1.SpotifyService.refresh();
            }
            return;
        }
        const playbackState = this.playbackState;
        if (request.status === 204) {
            playbackState.isPlaying = false;
            playbackState.songProgress = 0;
            playbackState.currentLine = null;
            return;
        }
        if (request.status === 200) {
            const json = await request.json();
            if (!json || !json.item) {
                playbackState.isPlaying = false;
                playbackState.songProgress = 0;
                playbackState.currentLine = null;
                return;
            }
            playbackState.songProgress = (json.progress_ms || 0) + (Date.now() - roundTripTimeStart);
            playbackState.isPlaying = !!json.is_playing;
            const newId = json.item.id || "";
            if (playbackState.songId !== newId) {
                playbackState.songName = String(json.item.name || "").replace(/ \(.+\)/, "");
                playbackState.songAuthor = (json.item.artists && json.item.artists[0] && json.item.artists[0].name) || "Unknown artist";
                playbackState.oldSongId = playbackState.songId;
                playbackState.songId = newId;
                playbackState.songDuration = json.item.duration_ms || 0;
                playbackState.lyrics = null;
                playbackState.currentLine = null;
                playbackState.hasLyrics = false;
                const songName = playbackState.songName;
                const songAuthor = playbackState.songAuthor;
                const songId = playbackState.songId;
                this.lyricsFetcher.fetchLyrics(songName, songAuthor, songId).then((lyrics) => {
                    if (playbackState.songId === songId) {
                        playbackState.lyrics = lyrics;
                        playbackState.hasLyrics = !!lyrics;
                        playbackState.currentLine = null;
                    }
                }).catch(() => {
                    if (playbackState.songId === songId) {
                        playbackState.lyrics = null;
                        playbackState.hasLyrics = false;
                        playbackState.currentLine = null;
                    }
                });
            }
        }
    }
}
exports.PlaybackStateUpdater = PlaybackStateUpdater;
