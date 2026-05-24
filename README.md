# AF — Lyrics Status

> Automatically updates your Discord custom status with real-time song lyrics from Spotify.

Lyrics Status is a local Node.js app with a web control panel. It listens to your current Spotify playback, finds synced lyrics from supported sources, and updates your Discord custom status line by line.

---

## Features

- Real-time Discord custom status updates
- Synced lyrics support from multiple sources
- Local web control panel
- Timing and offset controls
- Windows launchers for install and run

---

## Requirements

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org/en) | v17 or higher |
| Windows | 10 / 11 for `.bat` launchers |
| Spotify account | Free or Premium |
| Discord account | Required |

---

## Installation

### 1. Download

Download the project ZIP and extract it anywhere on your computer.

### 2. Install dependencies

Double-click:

```bat
install.bat
```

Or install manually from a terminal:

```bash
npm install
```

> If you get a permissions error, right-click `install.bat` and choose **Run as administrator**.

---

## Running

Double-click:

```bat
run.bat
```

Or run manually:

```bash
npm run start
```

Then open:

```text
http://localhost:8999
```

Press **Ctrl+C** in the terminal to stop the app.

---

## Setup Guide

Once the panel is open, complete the setup from the **Auth** tab.

### Discord Token

You need your Discord user token so the tool can update your custom status.

1. Open Discord in your browser.
2. Press `F12` to open DevTools.
3. Go to the **Network** tab.
4. Reload Discord or send any message.
5. Look for a request to `discord.com/api`.
6. Open the request and check **Request Headers**.
7. Copy the value from the `Authorization` header.
8. Paste it into **Auth → User token** and click **Check**.

> ⚠️ Never share your Discord token with anyone. It gives access to your account.

### Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in and click **Create app**.
3. Fill in any name and description.
4. Add this Redirect URI:

```text
http://localhost/callback
```

5. Save the app.
6. Copy your **Client ID** and **Client Secret** into the panel.
7. Paste the same Redirect URI into the panel.
8. Click **Authorize Spotify**.

After authorization, play a song on Spotify. If synced lyrics are available, they will start appearing in your Discord custom status.

---

## Connection Status

The status indicator in the panel shows what the app is currently doing.

| State | Meaning |
|---|---|
| Disconnected | The server is not running or the panel cannot reach it |
| Incomplete | Discord or Spotify setup is missing |
| Not playing | Spotify is connected, but nothing is currently playing |
| Buffering | A song is playing, but lyrics are still syncing |
| Live | Everything is working and lyrics are updating |

---

## Display Settings

In the **Display** tab, you can customize what appears in your Discord status.

Available template placeholders:

| Placeholder | Description |
|---|---|
| `{lyrics}` | Current lyrics line |
| `{song_name}` | Song title |
| `{song_author}` | Artist name |
| `{timestamp}` | Current playback position |
| `{lyrics_upper}` | Lyrics in uppercase |
| `{lyrics_lower}` | Lyrics in lowercase |
| `{lyrics_letters_only}` | Lyrics with symbols removed |

---

## Timing Settings

In the **Timing** tab, you can adjust how lyrics sync with the song.

- **Auto-offset** automatically adjusts for Discord API delay.
- **Manual offset** lets you control the timing manually.
- **Auto-offset samples** controls how many recent requests are used for delay averaging.

---

## Themes

In the **Theme** tab, you can choose a built-in theme or create your own custom colors.

Built-in presets include:

- Purple
- Ocean
- Sunset
- Forest
- custom

---

## Updates

The **Updates** tab can check GitHub for new releases and install updates when available.

For updates to work correctly, the release ZIP should contain the project folder directly:

```text
lyrics-status-v7/
  package.json
  VERSION
  static/
  dist/
  run.bat
  install.bat
```

Avoid wrapping the project folder inside an extra folder.

---

## Troubleshooting

### Status stays on Not playing

Make sure Spotify is open and a song is actively playing.

### Discord token is missing or invalid

Re-paste your Discord token in the **Auth** tab and click **Check**.

### Spotify is not connected

Click **Authorize Spotify** again and complete the login flow.

### Panel does not open

Make sure Node.js is installed:

```bash
node --version
```

Also make sure nothing else is using port `8999`.

### Lyrics are off-sync

Enable **Auto-offset** in the **Timing** tab. If needed, adjust the manual offset.

### No lyrics found

Some songs do not have synced lyrics available. The app will try supported lyric sources automatically.

---

## Tech Stack

- **TypeScript**
- **Node.js**
- **Express**
- **WebSocket**
- **jQuery**

---

## Credits

The original concept and core idea is based on [OvalQuilter/lyrics-status](https://github.com/OvalQuilter/lyrics-status).

This fork adds its own fixes, UI work, launcher styling, and control panel improvements.

---

## Disclaimer

Use this tool at your own risk. Automating Discord actions using a user token may violate Discord's Terms of Service.
