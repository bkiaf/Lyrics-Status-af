# Lyrics Status v7

**Lyrics Status** is a tool that automatically updates your Discord custom status to display the current lyrics of any song you're listening to on Spotify.

Built with TypeScript, runs on Node.js.

---

## Setup

### Requirements

- [Node.js](https://nodejs.org/en) v17 or higher

### Installation

Run `install.bat` to install all dependencies automatically, or run manually:

```
npm install
```

### Running

Run `run.bat` to start the app, or run manually:

```
npm run start
```

Then open `http://localhost:8999` in your browser.

---

## Configuration

### Discord Token

You'll need your Discord user token. You can find it through the browser's DevTools under the Network tab (look for requests to `discord.com/api` and check the `Authorization` header).

Paste it in the **Auth → User token** field.

### Spotify

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app.
2. Copy your **Client ID** and **Client Secret** into the Auth tab.
3. Add a Redirect URI in your Spotify app settings and paste the same one into the panel.
4. Click **Authorize Spotify** and complete the flow.

Once authorized, start any song on Spotify — if it has lyrics, they'll appear in your Discord status.

---

## Themes

Open the **Theme** tab to switch between 5 built-in presets (Dark, Purple, Ocean, Sunset, Forest) or set a fully custom accent and background color.

---

## Troubleshooting

**Windows:** Try running `run.bat` as administrator, or disable your firewall temporarily.

**Linux:** Try running from a terminal with elevated privileges (`sudo`).

---

*This tool is provided as-is. Use at your own risk.*


## v7.0.3 Premium UI Polish
- Refined glassy card styling, spacing, sidebar, buttons, inputs, toggles, theme cards, and update panels.
- Kept the version at 7.0.3 as requested.
