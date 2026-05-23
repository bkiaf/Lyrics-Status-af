# AF — Lyrics Status v7

> Automatically updates your Discord custom status with real-time song lyrics from Spotify.

---

## Credits

The original concept and core idea is based on [OvalQuilter/lyrics-status](https://github.com/OvalQuilter/lyrics-status).

This fork (v7) includes several fixes, improvements, and a fully redesigned control panel:

- Redesigned UI panel
- Real-time playback state
- Fixed template literal rendering in the console output

---

## What It Does

While you're listening to Spotify, this tool fetches the current song's lyrics and updates your Discord custom status line by line in sync with the music. It pulls lyrics from multiple sources (LrcLib, Spotify, NetEase, QQ Music) and picks the best match automatically.

---

## Requirements

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org/en) | v17 or higher |
| Windows | 10 / 11 (for `.bat` launchers) |
| A Spotify account | Free or Premium |

---

## Installation

### 1. Download

Download the ZIP and extract it anywhere on your machine.

### 2. Install dependencies

Double-click **`install.bat`** — it will run `npm install` automatically.

Or manually in a terminal:

```bash
npm install
```

> If you get a permissions error, right-click `install.bat` and choose **Run as administrator**.

---

## Running

Double-click **`run.bat`** — it will start the server and open the panel in your browser automatically.

Or manually:

```bash
npm run start
```

Then open **http://localhost:8999** in your browser.

Press **Ctrl+C** in the terminal to stop the app.

---

## Setup Guide

Once the panel is open at `http://localhost:8999`, follow these steps:

### Step 1 — Discord Token

You need your Discord user token so the tool can update your status.

**How to find it:**

1. Open Discord in your browser (discord.com)
2. Press `F12` to open DevTools
3. Go to the **Network** tab
4. Reload the page or send any message
5. Look for a request to `discord.com/api` and click it
6. Under **Request Headers**, find `Authorization` — that's your token

Paste it into the **Auth → User token** field and click **Check** to verify it.

> ⚠️ Never share your token with anyone. It gives full access to your account.

---

### Step 2 — Spotify App

You need to create a free Spotify developer app to get API credentials.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in and click **Create app**
3. Fill in any name and description
4. Under **Redirect URIs**, add: `http://localhost/callback`
5. Save the app

Now copy your **Client ID** and **Client Secret** into the **Auth** tab of the panel.

In the **Redirect URI** field, paste the same URI you added: `http://localhost/callback`

---

### Step 3 — Authorize Spotify

Click the **Authorize Spotify** button in the panel.

A browser popup will open asking you to log in to Spotify and grant access. After you approve, the window will close automatically and the panel will show **Spotify authorized**.

---

### Step 4 — Play Something

Open Spotify and play any song. If lyrics are available, they'll start appearing in your Discord status within a few seconds.

---

## Connection Status

The bottom-left corner of the panel shows the current status:

| Color | State | Meaning |
|---|---|---|
| 🔴 Red | Disconnected | Server is not running or panel can't reach it |
| ⚪ Gray | Not configured | No credentials entered yet |
| 🟠 Orange | Incomplete | One service is missing or not set up |
| 🟠 Orange | Not playing | Both connected but Spotify isn't playing |
| 🟠 Orange | Buffering… | Playing but lyrics haven't synced yet |
| 🟢 Green | Live | Everything is working — lyrics are updating |

---

## Display Settings

In the **Display** tab you can customize what shows in your Discord status:

- **Show timestamp** — adds playback position like `[2:17]`
- **Show label** — adds `Song lyrics -` prefix before the lyric
- **Custom template** — use your own format with placeholders:

| Placeholder | Description |
|---|---|
| `{lyrics}` | Current lyrics line |
| `{song_name}` | Song title |
| `{song_author}` | Artist name |
| `{timestamp}` | Current playback position |
| `{lyrics_upper}` | Lyrics in ALL CAPS |
| `{lyrics_lower}` | Lyrics in all lowercase |
| `{lyrics_letters_only}` | Lyrics with symbols removed |

---

## Timing Settings

In the **Timing** tab you can adjust sync:

- **Auto-offset** — automatically compensates for Discord API delay (recommended: on)
- **Manual offset** — how many milliseconds before the lyric line to send the update (default: 500ms)
- **Auto-offset samples** — how many recent requests to average for delay calculation

---

## Themes

Open the **Theme** tab to choose from 5 built-in presets:

- Dark
- Purple
- Ocean
- Sunset
- Forest

Or set a fully custom accent color and background color.

---

## Troubleshooting

**Status stays orange / "Not playing"**
Make sure Spotify is open and a song is actively playing (not paused). The tool polls Spotify every 5 seconds.

**"Incomplete" — Discord token missing**
Re-paste your Discord token in the Auth tab and click Check.

**"Incomplete" — Spotify not connected**
Click Authorize Spotify again and complete the login flow.

**Panel doesn't open**
Make sure Node.js is installed (`node --version` in a terminal). If the port is taken, check if another process is using port 8999.

**Lyrics are slightly off-sync**
Try enabling Auto-offset in the Timing tab. If they're still early or late, adjust the Manual offset value.

**No lyrics found**
Some songs don't have synced lyrics in any of the sources. The tool tries LrcLib, Spotify, NetEase, and QQ Music automatically.

---

## Tech Stack

- **TypeScript** — source code
- **Node.js** — runtime
- **Express** — local web server for the panel
- **WebSocket (ws)** — real-time communication between server and panel
- **jQuery** — panel UI

---

*Use at your own risk. Automating Discord actions using a user token is against Discord's Terms of Service.*
