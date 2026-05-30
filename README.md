# Lyrics Status v7.1.3

🎵 Automatically update your Discord custom status with real-time, synchronized Spotify lyrics.

Lyrics Status is a lightweight, local Windows application that monitors your Spotify playback, fetches synchronized lyrics, and updates your Discord status line-by-line in real-time.

---

## 🚀 Quick Start
1. Download the latest release from the [GitHub Releases Page](https://github.com/bkiaf/Lyrics-Status-af/releases).
2. Extract the ZIP file to a dedicated folder.
3. Run **Lyrics Status.exe**. The app will automatically create a **Lyrics Status** shortcut on your Desktop.
4. Access your control panel at: `http://localhost:8999`

---

## 🛠 Features
* **Real-time Synchronization:** Dynamic lyric updates matching Spotify playback.
* **Local Control Panel:** Manage your settings and view lyrics through a local web interface.
* **Customization:** Edit lyrics, adjust timing/offsets, and use custom status templates.
* **Automated Setup:** Automatically manages dependencies and Node.js environments.

---

## ⚙️ Configuration & Setup

### 1. Discord Authentication
To connect the application to Discord, you need your User Token. 

**⚠️ SECURITY WARNING:** Your Discord token grants full, unrestricted access to your account. Anyone with this token can impersonate you, read your messages, and manage your servers. **Never share this token with anyone, do not upload it to GitHub, and treat it with the same level of security as your password.** If you suspect your token has been exposed, reset your Discord password immediately to invalidate it.

**How to obtain your token:**
1. Open Discord in your web browser and log in.
2. Press `Ctrl + Shift + I`OR `F12` to open Developer Tools.
3. Navigate to the **Network** tab.
4. Refresh the page (`F5`) and search for `library` in the filter bar.
5. Click on any result, go to the **Headers** tab, and locate the `authorization` header under **Request Headers**. The string provided there is your Token.

### 2. Spotify Integration
You must register an application on the Spotify Developer Dashboard to obtain your credentials.

* **Step A:** Navigate to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
* **Step B:** Create a new app and copy your **Client ID** and **Client Secret**.
* **Step C:** In your Spotify App settings, you **must** use the following exact Redirect URI:
    `http://127.0.0.1:8999/callback`
* **Step D:** Paste your Client ID and Secret into the **Auth** tab in the Lyrics Status panel (`http://localhost:8999`).

---

## Credits

The original concept and core idea is based on [OvalQuilter/lyrics-status](https://github.com/OvalQuilter/lyrics-status).

This fork includes its own UI, updater, launcher, and setup improvements.

---

## ⚠️ Disclaimer
Use this tool at your own risk. Connected services have their own terms of service and usage limitations. Always keep your private tokens, `settings.json`, and environment files secure. Do not share your configuration files or screenshots containing sensitive information.