import { BaseSource, CachedSongLyrics, SongLyrics } from "./Sources/BaseSource"
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"

export class LyricsFetcher {
    public sources: BaseSource[]

    public lastFetchedFrom: string
    public lastFetchedFor: string

    // Prevent concurrent fetches for the same song
    private _fetchingKey: string = ""
    private _fetchPromise: Promise<SongLyrics | null> | null = null

    constructor() {
        this.sources = []
        this.lastFetchedFrom = "Not fetched"
        this.lastFetchedFor = ""
    }

    public addSource(source: BaseSource): void {
        this.sources.push(source)
    }

    public async fetchLyrics(name: string, artist: string): Promise<SongLyrics | null> {
        const key = name + "||" + artist

        // Deduplicate concurrent requests for the same song
        if (this._fetchingKey === key && this._fetchPromise) {
            return this._fetchPromise
        }

        this._fetchingKey = key
        this._fetchPromise = this._doFetch(name, artist)
        const result = await this._fetchPromise
        this._fetchPromise = null
        return result
    }

    private async _doFetch(name: string, artist: string): Promise<SongLyrics | null> {
        this.lastFetchedFrom = "Not fetched"

        // Check cache first
        const cache = this.fetchCachedLyrics(name, artist)
        if (cache) {
            this.lastFetchedFrom = `Cache (${cache.appName})`
            this.lastFetchedFor = name + artist
            return cache as SongLyrics
        }

        let result: SongLyrics | null = null

        for (const source of this.sources) {
            try {
                this.lastFetchedFor = name + artist

                result = await source.getLyrics(name, artist)

                if (result) {
                    this.lastFetchedFrom = source.getAppName()
                    this.cacheLyrics(name, artist, result, this.lastFetchedFrom)
                    break
                }
            } catch {
                // Source failed, try next
            }
        }

        return result
    }

    public fetchCachedLyrics(name: string, artist: string): CachedSongLyrics | null {
        const safeName = name.replace(/[/\\:*?"<>|]/g, "_")
        const safeArtist = artist.replace(/[/\\:*?"<>|]/g, "_")
        const path = `./cache/${safeName}-${safeArtist}.json`

        let lyrics: CachedSongLyrics | null = null

        try {
            lyrics = JSON.parse(readFileSync(path).toString())
        } catch {}

        return lyrics
    }

    public cacheLyrics(name: string, artist: string, lyrics: SongLyrics, appName: string): void {
        if (!existsSync("./cache")) mkdirSync("./cache")

        const safeName = name.replace(/[/\\:*?"<>|]/g, "_")
        const safeArtist = artist.replace(/[/\\:*?"<>|]/g, "_")

        writeFileSync(`./cache/${safeName}-${safeArtist}.json`, JSON.stringify({
            ...lyrics,
            appName
        }))
    }
}
