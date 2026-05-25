# AF — Lyrics Status

🎵 Automatically updates your Discord custom status with real-time Spotify lyrics.

**Quick Start**: Download, extract, run `Lyrics Status.exe`. That's it.

Lyrics Status runs locally on your PC.

---

## Features

- Real-time Discord custom status updates.
- Spotify playback detection.
- Synced lyrics from multiple sources.
- Local web control panel.
- Timing and offset controls.
- Built-in updater.

---

## Download

Download the latest release from GitHub Releases, then extract the ZIP anywhere you want.

After extracting, open the folder and run:

```text
Lyrics Status.exe
```

---

## What the EXE Does

`Lyrics Status.exe`

When you run it, it automatically:

- Checks the project files.
- Downloads a portable Node.js copy into `.af-node/` if needed.
- Installs missing dependencies with npm.
- Starts Lyrics Status locally.
- Opens or refreshes the control panel.
- Handles app restarts after updates.

Generated local folders such as `.af-node/` and `node_modules/` are not included in the download because the launcher creates them when needed.

---

## Updating

Open the **Updates** tab inside the panel.

If a newer version is available, the app downloads the release ZIP, installs it, cleans old files, and restarts.

Your local settings are kept, including:

```text
settings.json
```

This means your Discord token, Spotify settings, and saved preferences stay on the user's device during updates.

---

## Setup

After launching the app, complete setup from the **Auth** tab.

### Discord

Enter your Discord account setting locally inside the **Auth** tab.

Never share private tokens, secrets, or `settings.json` with anyone.

### Spotify App

1. Go to the Spotify Developer Dashboard.
2. Create an app.
3. Add this Redirect URI:

```text
http://localhost/callback
```

4. Copy the Client ID and Client Secret into the panel.
5. Paste the same Redirect URI into the panel.
6. Click **Authorize Spotify**.

After authorization, play a song on Spotify. If synced lyrics are available, they will appear in your Discord custom status.

---

## Troubleshooting

### The panel does not open

Run `Lyrics Status.exe` again and keep the launcher window open. The panel uses:

```text
http://localhost:8999
```

### Dependencies are missing

The launcher installs them automatically. If it fails, delete `node_modules/` and run `Lyrics Status.exe` again.

### Node.js errors appear

Delete `.af-node/` and run `Lyrics Status.exe` again. It will download a fresh portable Node.js copy.

### Spotify is not connected

Open the **Auth** tab and authorize Spotify again.

### Discord status is not updating

Re-check your local Discord setting in the **Auth** tab.

---

## Credits

The original concept and core idea is based on [OvalQuilter/lyrics-status](https://github.com/OvalQuilter/lyrics-status).

This fork includes its own UI, updater, launcher, and setup improvements.

---

## Disclaimer

Use this tool at your own risk. Connected services may have their own rules and limitations.
