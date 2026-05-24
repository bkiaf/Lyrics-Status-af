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
            // Network failure — will retry next interval
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
        if (request.status === 200) {
            const json = await request.json();
            const playbackState = this.playbackState;
            playbackState.songProgress = json.progress_ms + (Date.now() - roundTripTimeStart);
            playbackState.isPlaying = json.is_playing;
            const newId = json.item && json.item.id;
            if (playbackState.songId !== newId) {
                playbackState.songName = json.item.name.replace(/ \(.+\)/, "");
                playbackState.songAuthor = json.item.artists[0].name;
                playbackState.oldSongId = playbackState.songId;
                playbackState.songId = json.item.id;
                playbackState.songDuration = json.item.duration_ms;
                playbackState.lyrics = null;
                playbackState.currentLine = null;
                playbackState.hasLyrics = false;
                const songName = playbackState.songName;
                const songAuthor = playbackState.songAuthor;
                this.lyricsFetcher.fetchLyrics(songName, songAuthor).then((lyrics) => {
                    if (playbackState.songName === songName && playbackState.songAuthor === songAuthor) {
                        playbackState.lyrics = lyrics;
                        playbackState.hasLyrics = !!lyrics;
                        playbackState.currentLine = null;
                    }
                });
            }
        }
    }
}
exports.PlaybackStateUpdater = PlaybackStateUpdater;
