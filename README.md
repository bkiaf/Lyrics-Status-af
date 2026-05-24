# AF — Lyrics Status

> A polished local control panel that updates your Discord custom status with real-time Spotify lyrics.

<p align="center">
  <strong>Lyrics Status af · v7.0.3</strong><br>
  Glass UI · Smooth animations · Spotify lyrics sync · Discord status updates
</p>

<p align="center">
  <a href="https://github.com/bkiaf/Lyrics-Status-af">Project GitHub</a>
  ·
  <a href="https://guns.lol/boykisseraf">AF Profile</a>
</p>

---

## About

**Lyrics Status af** is a Node.js + TypeScript app that automatically updates your Discord custom status with the current lyric line from the song you are listening to on Spotify.

It runs locally on your machine and includes a redesigned web panel for authentication, display customization, timing controls, themes, updates, and status monitoring.

---

## Features

- Real-time Spotify playback detection.
- Synced lyric fetching from multiple sources.
- Automatic Discord custom status updates.
- Clean glass-style control panel.
- Built-in theme presets and custom theme colors.
- Animated background snow dots.
- Smooth sidebar navigation and tab transitions.
- Improved startup layout with CSS loaded immediately.
- What's New popup powered by GitHub release notes.
- Option to hide the What's New popup until the next update.
- Smooth update flow with check, install, loading, success, and error states.
- Premium AF-styled `install.bat` and `run.bat` launchers.

---

## Requirements

| Requirement | Version |
|---|---:|
| [Node.js](https://nodejs.org/en) | v17 or higher |
| Windows | 10 / 11 recommended |
| Spotify account | Free or Premium |
| Discord account | Required |

---

## Installation

### Option 1 — Use the BAT installer

1. Download the latest ZIP from the GitHub release.
2. Extract the ZIP anywhere on your computer.
3. Double-click **`install.bat`**.
4. Wait until the dependency installation is complete.

### Option 2 — Manual install

Open a terminal inside the project folder and run:

```bash
npm install
```

---

## Running the App

### Option 1 — Use the BAT launcher

Double-click **`run.bat`**.

The launcher starts the local server and opens the panel in your browser.

### Option 2 — Manual run

Open a terminal inside the project folder and run:

```bash
npm run start
```

Then open:

```text
http://localhost:8999
```

To stop the app, press **Ctrl + C** in the terminal.

---

## Setup Guide

### 1. Discord Token

Paste your Discord user token into:

```text
Auth → User token
```

Then click **Check** to verify it.

> ⚠️ Never share your Discord token with anyone. It gives access to your account. Use this tool at your own risk.

### 2. Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a new app.
3. Copy your **Client ID** and **Client Secret**.
4. Add this Redirect URI in the Spotify app settings:

```text
http://localhost/callback
```

5. Paste the same Redirect URI into the panel.
6. Click **Authorize Spotify**.
7. Complete the Spotify login flow.

### 3. Play Music

Open Spotify and play a song. If synced lyrics are available, the app will update your Discord status automatically.

---

## Panel Overview

| Tab | What it does |
|---|---|
| **Auth** | Add Discord and Spotify credentials. |
| **Display** | Customize how lyrics appear in your Discord status. |
| **Timing** | Adjust lyric sync and offset behavior. |
| **Theme** | Choose presets or create a custom theme. |
| **Updates** | Check GitHub for updates and install new versions. |

---

## Display Template Placeholders

Use these placeholders in the custom display template:

| Placeholder | Description |
|---|---|
| `{lyrics}` | Current lyric line |
| `{song_name}` | Song title |
| `{song_author}` | Artist name |
| `{timestamp}` | Playback timestamp |
| `{lyrics_upper}` | Lyrics in uppercase |
| `{lyrics_lower}` | Lyrics in lowercase |
| `{lyrics_letters_only}` | Lyrics with symbols removed |

---

## Theme Presets

The panel includes five built-in presets:

- Dark
- Purple
- Ocean
- Sunset
- Forest

You can also set a fully custom accent color and background color.

---

## Updates

The app can check GitHub releases directly from the **Updates** tab.

The update screen includes:

- Smooth check animation.
- Update progress states.
- Install and restart stages.
- Success and error feedback.
- A GitHub project shortcut.

After updating, the **What's New** popup shows the latest release notes from GitHub. You can hide it until the next update.

---

## v7.0.3 — Visual Polish & Experience Update

This release focuses on making Lyrics Status feel smoother, cleaner, and more premium across the whole app. It improves the UI, animations, update experience, startup behavior, background effects, and launcher files.

### What's New

- Improved the overall UI with a cleaner glass-style layout.
- Moved important styling into CSS so the interface is ready immediately on startup.
- Fixed startup layout flashing where the content briefly appeared far from the sidebar.
- Improved sidebar spacing and panel alignment.
- Added a smooth **What's New** popup that loads release notes from GitHub.
- Added a **Don't show this again until the next update** option for the What's New popup.
- Added animated background snow dots with a soft, theme-matching look.
- Improved background and theme switching speed.
- Added a **Project GitHub** section inside the Updates page.
- Improved the update screen with smoother check, install, loading, success, and error animations.
- Added smoother transitions for update stages appearing and disappearing.
- Improved buttons, cards, toggles, hover states, and glass effects.
- Improved `install.bat` and `run.bat` with a premium AF-styled launcher look.
- Added project and profile links inside the BAT launcher frames.
- Removed the old duplicated console logo from `run.bat`.

### Fixes

- Fixed empty tab content after switching sidebar sections.
- Fixed layout jump on first page load.
- Fixed visual clipping around cards and panels.
- Fixed What's New popup visibility and animation issues.
- Reduced animation lag in the popup and update screen.
- Fixed BAT frame alignment issues.

---

## Troubleshooting

### Panel does not open

Make sure Node.js is installed:

```bash
node --version
```

If the port is already in use, close any old running instance and try again.

### Status stays orange or says Not playing

Make sure Spotify is open and a song is actively playing.

### Discord token shows incomplete

Re-paste the token in the **Auth** tab and click **Check**.

### Spotify is not connected

Click **Authorize Spotify** again and complete the login flow.

### Lyrics are early or late

Open the **Timing** tab and adjust the manual offset. Auto-offset is recommended.

### No lyrics found

Some songs do not have synced lyrics available. The app will try multiple lyric sources automatically.

---

## Tech Stack

- **TypeScript** — app source code
- **Node.js** — runtime
- **Express** — local web server
- **WebSocket (ws)** — real-time panel communication
- **jQuery** — panel UI logic
- **CSS** — glass UI, transitions, themes, and animations

---

## Credits

The original concept and core idea are based on:

- [OvalQuilter/lyrics-status](https://github.com/OvalQuilter/lyrics-status)

This AF fork includes visual redesigns, UI improvements, update flow polish, launcher styling, and additional fixes.

---

## Disclaimer

This project is provided as-is. Use it at your own risk.

Automating Discord actions with a user token may violate Discord's Terms of Service.
