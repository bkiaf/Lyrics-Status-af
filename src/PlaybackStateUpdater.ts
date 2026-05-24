import { PlaybackState } from "./PlaybackState"
import { LyricsFetcher } from "./LyricsFetcher"
import { SpotifyService } from "./SpotifyService"
import { Settings } from "./Settings"
import { ExternalAuthServerAPI } from "./ExternalAuthServerAPI"

interface PlaybackResponse {
    item: {
        name: string
        id: string

        artists: {
            name: string
        }[]

        duration_ms: number
    }

    progress_ms: number

    is_playing: boolean
}

export class PlaybackStateUpdater {
    public playbackState: PlaybackState
    public lyricsFetcher: LyricsFetcher

    // Prevent overlapping update calls
    private _isUpdating: boolean = false

    constructor(playbackState: PlaybackState, lyricsFetcher: LyricsFetcher) {
        this.playbackState = playbackState
        this.lyricsFetcher = lyricsFetcher
    }

    public async update(): Promise<void> {
        // Skip if a previous update is still in progress
        if (this._isUpdating) return
        this._isUpdating = true

        try {
            await this._doUpdate()
        } catch {
            // Network failure — will retry next interval
        } finally {
            this._isUpdating = false
        }
    }

    private async _doUpdate(): Promise<void> {
        const roundTripTimeStart = Date.now()
        const request = await fetch("https://api.spotify.com/v1/me/player", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + SpotifyService.token
            }
        })

        if (request.status === 401 || request.status === 400) {
            if (Settings.credentials.useExternalAuthServer) {
                SpotifyService.token = await ExternalAuthServerAPI.getToken() || ""
            } else {
                await SpotifyService.refresh()
            }
            return
        }

        if (request.status === 200) {
            const json = await request.json() as PlaybackResponse
            const playbackState = this.playbackState

            playbackState.songProgress = json.progress_ms + (Date.now() - roundTripTimeStart)
            playbackState.isPlaying = json.is_playing

            const newId = json.item && json.item.id

            if (playbackState.songId !== newId) {
                playbackState.songName = json.item.name.replace(/ \(.+\)/, "")
                playbackState.songAuthor = json.item.artists[0].name

                playbackState.oldSongId = playbackState.songId
                playbackState.songId = json.item.id
                playbackState.songDuration = json.item.duration_ms

                // Reset lyrics for new song
                playbackState.lyrics = null
                playbackState.currentLine = null
                playbackState.hasLyrics = false

                // Fetch lyrics async — don't block the update
                const songName = playbackState.songName
                const songAuthor = playbackState.songAuthor

                this.lyricsFetcher.fetchLyrics(songName, songAuthor).then((lyrics) => {
                    // Only apply if we're still on the same song
                    if (playbackState.songName === songName && playbackState.songAuthor === songAuthor) {
                        playbackState.lyrics = lyrics
                        playbackState.hasLyrics = !!lyrics
                        playbackState.currentLine = null
                    }
                })
            }
        }
        // 204 = nothing playing, 429 = rate limited — do nothing, wait for next interval
    }
}
