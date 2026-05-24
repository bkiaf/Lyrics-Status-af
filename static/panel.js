// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    label: 'Dark',
    vars: {
      '--bg': '#0d0d0f', '--surface': '#141417', '--surface2': '#1c1c21',
      '--surface3': '#242429', '--border': 'rgba(255,255,255,0.06)',
      '--border2': 'rgba(255,255,255,0.10)', '--text': '#e8e8ed',
      '--text2': '#9898a8', '--text3': '#5a5a6a',
      '--accent': '#7dd3b0', '--accent-vivid': '#5ecea5',
      '--accent-bg': 'rgba(125,211,176,0.07)', '--accent-border': 'rgba(125,211,176,0.2)',
    }
  },
  purple: {
    label: 'Purple',
    vars: {
      '--bg': '#0e0d14', '--surface': '#14121e', '--surface2': '#1e1a2a',
      '--surface3': '#28233a', '--border': 'rgba(255,255,255,0.06)',
      '--border2': 'rgba(255,255,255,0.11)', '--text': '#e8e5f0',
      '--text2': '#9890aa', '--text3': '#5a5068',
      '--accent': '#b08de8', '--accent-vivid': '#9a73e0',
      '--accent-bg': 'rgba(176,141,232,0.07)', '--accent-border': 'rgba(176,141,232,0.2)',
    }
  },
  ocean: {
    label: 'Ocean',
    vars: {
      '--bg': '#0a0f14', '--surface': '#111820', '--surface2': '#18222e',
      '--surface3': '#202d3c', '--border': 'rgba(255,255,255,0.06)',
      '--border2': 'rgba(255,255,255,0.10)', '--text': '#e0ecf8',
      '--text2': '#8898aa', '--text3': '#4a5a6a',
      '--accent': '#5bb8f5', '--accent-vivid': '#3aa8f0',
      '--accent-bg': 'rgba(91,184,245,0.07)', '--accent-border': 'rgba(91,184,245,0.2)',
    }
  },
  sunset: {
    label: 'Sunset',
    vars: {
      '--bg': '#130d0a', '--surface': '#1e1310', '--surface2': '#2a1b17',
      '--surface3': '#36231e', '--border': 'rgba(255,255,255,0.06)',
      '--border2': 'rgba(255,255,255,0.10)', '--text': '#f0e8e0',
      '--text2': '#a89080', '--text3': '#6a5048',
      '--accent': '#f0845a', '--accent-vivid': '#e86a3c',
      '--accent-bg': 'rgba(240,132,90,0.07)', '--accent-border': 'rgba(240,132,90,0.2)',
    }
  },
  forest: {
    label: 'Forest',
    vars: {
      '--bg': '#090e0b', '--surface': '#0f1812', '--surface2': '#16221a',
      '--surface3': '#1e2e22', '--border': 'rgba(255,255,255,0.06)',
      '--border2': 'rgba(255,255,255,0.10)', '--text': '#e0f0e5',
      '--text2': '#80a088', '--text3': '#485855',
      '--accent': '#6dd68a', '--accent-vivid': '#52cc72',
      '--accent-bg': 'rgba(109,214,138,0.07)', '--accent-border': 'rgba(109,214,138,0.2)',
    }
  },
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = v => Math.min(255, Math.max(0, Math.round(v)));
  const toHex = v => v.toString(16).padStart(2, '0');
  return `#${toHex(clamp(r+amount))}${toHex(clamp(g+amount))}${toHex(clamp(b+amount))}`;
}

function applyTheme(key, skipSave) {
  const theme = THEMES[key];
  if (!theme) return;
  let el = document.getElementById('ls-theme');
  if (!el) { el = document.createElement('style'); el.id = 'ls-theme'; document.head.appendChild(el); }
  const css = Object.entries(theme.vars).map(([k,v]) => `  ${k}: ${v};`).join('\n');
  el.textContent = `:root {\n${css}\n}`;
  if (!skipSave) localStorage.setItem('ls-theme', key);
  localStorage.removeItem('ls-custom');
  $('.theme-preset').removeClass('active');
  $(`.theme-preset[data-key="${key}"]`).addClass('active');
}

function applyCustom() {
  const accent = $('#cp-accent').val();
  const bg = $('#cp-bg').val();
  const { r, g, b } = hexToRgb(accent);
  const s1 = lighten(bg, 7); const s2 = lighten(bg, 14); const s3 = lighten(bg, 22);
  let el = document.getElementById('ls-theme');
  if (!el) { el = document.createElement('style'); el.id = 'ls-theme'; document.head.appendChild(el); }
  el.textContent = `:root {
  --bg: ${bg};
  --surface: ${s1};
  --surface2: ${s2};
  --surface3: ${s3};
  --border: rgba(255,255,255,0.06);
  --border2: rgba(255,255,255,0.10);
  --accent: ${accent};
  --accent-vivid: ${accent};
  --accent-bg: rgba(${r},${g},${b},0.07);
  --accent-border: rgba(${r},${g},${b},0.2);
}`;
  localStorage.setItem('ls-custom', JSON.stringify({ accent, bg }));
  localStorage.removeItem('ls-theme');
  $('.theme-preset').removeClass('active');
}

// ─── HTML ─────────────────────────────────────────────────────────────────────
$(`
<div id="app">
  <div class="sidebar">
    <div class="brand">
      <span class="brand-icon"><span class="af-logo">AF</span></span>
      <span class="brand-name">Lyrics Status</span>
      <span id="version-badge" class="version-badge">7.0.3</span>
    </div>
    <nav class="nav">
      <div class="nav-indicator"></div>
      <button class="nav-btn active" data-tab="auth">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Auth
      </button>
      <button class="nav-btn" data-tab="display">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Display
      </button>
      <button class="nav-btn" data-tab="timing">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Timing
      </button>
      <button class="nav-btn" data-tab="theme">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 8a4 4 0 0 1 0 8"/></svg>
        Theme
      </button>
      <button class="nav-btn" data-tab="update" id="nav-update-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
        Update
        <span id="update-nav-dot" class="update-nav-dot hid"></span>
      </button>
    </nav>

    <div class="now-playing" id="now-playing">
      <div class="np-indicator" id="np-indicator">
        <span class="np-dot" id="np-dot"></span>
        <div style="overflow:hidden;flex:1;min-width:0;">
          <span class="np-label" id="np-label">Disconnected</span>
          <div class="np-sub" id="np-sub"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <!-- AUTH TAB -->
    <div class="tab active" id="tab-auth">
      <div class="tab-header">
        <h1>Authentication</h1>
        <p>Credentials are stored locally and only used to communicate with Discord and Spotify on your behalf.</p>
      </div>

      <div class="card anim-card">
        <div class="card-label">Discord</div>
        <div class="card-section">
          <label class="field-label">User token</label>
          <div class="input-row">
            <input type="password" id="user-token" class="input" placeholder="Paste your Discord user token">
            <button id="check-token" class="btn btn-secondary">
              <span class="btn-label">Check</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card anim-card" style="margin-top:12px;">
        <div class="card-label">Spotify</div>
        <div class="card-section">
          <div class="section-row">
            <div>
              <label class="field-label">Client ID</label>
              <input type="text" id="client-id" class="input" placeholder="Your Spotify app client ID">
            </div>
            <div>
              <label class="field-label">Client secret</label>
              <input type="password" id="client-secret" class="input" placeholder="Your Spotify app client secret">
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <label class="field-label">Redirect URI</label>
          <input type="text" id="custom-redirect-uri" class="input" placeholder="https://localhost/callback">
          <p class="field-hint">Must exactly match a redirect URI in your Spotify app settings.</p>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <div class="auth-footer">
            <label class="toggle-row">
              <input type="checkbox" id="use-external-auth-server">
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <span>Use external auth server</span>
            </label>
            <button id="authorize-spotify" class="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              Authorize Spotify
            </button>
          </div>
          <div id="spotify-authorized-indicator" class="auth-success hid">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Spotify authorized
          </div>
        </div>
      </div>
    </div>

    <!-- DISPLAY TAB -->
    <div class="tab" id="tab-display">
      <div class="tab-header">
        <h1>Display</h1>
        <p>Choose what appears in your Discord custom status while music is playing.</p>
      </div>

      <div class="card anim-card">
        <div class="card-label">Basic options</div>
        <div class="card-section">
          <div class="toggle-group">
            <label class="toggle-row">
              <input type="checkbox" id="enable-timestamp" checked>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <div>
                <span class="toggle-label">Show timestamp</span>
                <span class="field-hint">Adds playback position like [2:17]</span>
              </div>
            </label>
            <label class="toggle-row">
              <input type="checkbox" id="enable-label" checked>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <div>
                <span class="toggle-label">Show "Song lyrics -" label</span>
                <span class="field-hint">Prefix before the lyrics line</span>
              </div>
            </label>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <label class="field-label">Live preview</label>
          <div id="status-preview" class="status-pill">
            <span class="pill-note">🎶</span>
            <span id="status-preview-text">[2:17] Song lyrics - La-la-la</span>
          </div>
        </div>
      </div>

      <div class="card anim-card" style="margin-top:12px;">
        <div class="card-label">Advanced</div>
        <div class="card-section">
          <label class="toggle-row">
            <input type="checkbox" id="enable-advanced-swt">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <div>
              <span class="toggle-label">Custom status template</span>
              <span class="field-hint">Override with your own format using placeholders</span>
            </div>
          </label>
        </div>

        <div id="advanced-swt" class="hid">
          <div class="divider"></div>
          <div class="card-section">
            <div class="section-row">
              <div style="max-width:130px;">
                <label class="field-label">Custom emoji</label>
                <input type="text" id="custom-emoji" class="input" maxlength="4" placeholder="🎶">
              </div>
              <div style="flex:1;">
                <label class="field-label">Status template</label>
                <textarea id="custom-status" class="input textarea" rows="3" placeholder="[{timestamp}] Song lyrics - {lyrics}"></textarea>
                <p class="field-hint">Placeholders: {lyrics}, {song_name}, {song_author}, {timestamp}, {lyrics_upper}, {lyrics_lower}, {lyrics_letters_only}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TIMING TAB -->
    <div class="tab" id="tab-timing">
      <div class="tab-header">
        <h1>Timing</h1>
        <p>Fine-tune how early or late your status updates relative to the audio.</p>
      </div>

      <div class="card anim-card">
        <div class="card-label">Offset settings</div>
        <div class="card-section">
          <label class="toggle-row">
            <input type="checkbox" id="enable-autooffset">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <div>
              <span class="toggle-label">Auto-offset</span>
              <span class="field-hint">Automatically accounts for the average Discord request delay + 100ms</span>
            </div>
          </label>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <div class="section-row">
            <div>
              <label class="field-label">Manual offset (ms)</label>
              <p class="field-hint">Applied when auto-offset is off. Default: 500.<br>Use negative values if lyrics appear too early.</p>
              <input type="number" id="send-time-offset" class="input" style="max-width:120px;margin-top:10px;" value="500">
            </div>
            <div>
              <label class="field-label">Auto-offset samples</label>
              <p class="field-hint">Number of recent requests to average over.</p>
              <input type="number" id="autooffset" class="input" style="max-width:120px;margin-top:10px;" min="1" max="20">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- THEME TAB -->
    <div class="tab" id="tab-theme">
      <div class="tab-header">
        <h1>Theme</h1>
        <p>Customize the look and feel of the panel.</p>
      </div>

      <div class="card anim-card">
        <div class="card-label">Preset Themes</div>
        <div class="card-section">
          <div class="preset-grid">
            <button class="theme-preset active" data-key="dark">
              <span class="preset-swatch" style="--s1:#0d0d0f;--s2:#7dd3b0;"></span>
              <span class="preset-label">Dark</span>
            </button>
            <button class="theme-preset" data-key="purple">
              <span class="preset-swatch" style="--s1:#0e0d14;--s2:#b08de8;"></span>
              <span class="preset-label">Purple</span>
            </button>
            <button class="theme-preset" data-key="ocean">
              <span class="preset-swatch" style="--s1:#0a0f14;--s2:#5bb8f5;"></span>
              <span class="preset-label">Ocean</span>
            </button>
            <button class="theme-preset" data-key="sunset">
              <span class="preset-swatch" style="--s1:#130d0a;--s2:#f0845a;"></span>
              <span class="preset-label">Sunset</span>
            </button>
            <button class="theme-preset" data-key="forest">
              <span class="preset-swatch" style="--s1:#090e0b;--s2:#6dd68a;"></span>
              <span class="preset-label">Forest</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card anim-card" style="margin-top:12px;">
        <div class="card-label">Custom Colors</div>
        <div class="card-section">
          <div class="color-row">
            <div class="color-field">
              <label class="field-label">Accent color</label>
              <div class="color-input-wrap">
                <input type="color" id="cp-accent" class="color-picker" value="#7dd3b0">
                <span class="color-hex" id="hex-accent">#7dd3b0</span>
              </div>
              <p class="field-hint">Used for highlights, active states, and buttons.</p>
            </div>
            <div class="color-field">
              <label class="field-label">Background color</label>
              <div class="color-input-wrap">
                <input type="color" id="cp-bg" class="color-picker" value="#0d0d0f">
                <span class="color-hex" id="hex-bg">#0d0d0f</span>
              </div>
              <p class="field-hint">Surface colors are auto-derived from this.</p>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <div class="color-preview-row">
            <div class="color-preview-label">Preview</div>
            <div class="color-preview-pill" id="color-preview-pill">
              <span class="pill-dot"></span>
              <span>Lyrics Status v7</span>
            </div>
          </div>
          <button id="apply-custom-btn" class="btn btn-primary" style="margin-top:14px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Apply custom theme
          </button>
        </div>
      </div>
    </div>

    <!-- UPDATE TAB -->
    <div class="tab" id="tab-update">
      <div class="tab-header">
        <h1>Updates</h1>
        <p>Keep Lyrics Status up to date with the latest features and fixes from GitHub.</p>
      </div>

      <!-- Version card -->
      <div class="card anim-card">
        <div class="card-label">Version</div>
        <div class="card-section">
          <div class="update-version-row">
            <div class="update-ver-block">
              <span class="update-ver-label">Current</span>
              <span class="update-ver-val" id="upd-current">—</span>
            </div>
            <div class="update-ver-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div class="update-ver-block">
              <span class="update-ver-label">Latest</span>
              <span class="update-ver-val" id="upd-latest">—</span>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-section">
          <div class="update-action-row">
            <button id="btn-check-update" class="btn btn-secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span class="btn-label">Check for updates</span>
            </button>
            <button id="btn-do-update" class="btn btn-primary hid">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span class="btn-label">Update now</span>
            </button>
          </div>
          <div id="upd-status" class="update-status hid"></div>
          <div id="upd-progress" class="update-progress hid"><span></span></div>
        </div>
      </div>

      <!-- Auto-update card -->
      <div class="card anim-card" style="margin-top:12px;">
        <div class="card-label">Auto Update</div>
        <div class="card-section">
          <label class="toggle-row">
            <input type="checkbox" id="enable-autoupdate">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>Auto-update on startup</span>
          </label>
          <p class="field-hint" style="margin-top:8px;">When enabled, the app automatically checks for and installs updates every time it starts. The app will restart itself after updating.</p>
        </div>
      </div>

      <!-- Release notes card -->
      <div class="card anim-card hid" id="upd-notes-card" style="margin-top:12px;">
        <div class="card-label">Release Notes</div>
        <div class="card-section">
          <div id="upd-notes" class="update-notes"></div>
        </div>
      </div>
    </div>

  </div>
</div>
`).appendTo(document.body);

// ─── STYLES ───────────────────────────────────────────────────────────────────
$(`<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d0d0f;
  --surface: #141417;
  --surface2: #1c1c21;
  --surface3: #242429;
  --border: rgba(255,255,255,0.06);
  --border2: rgba(255,255,255,0.10);
  --text: #e8e8ed;
  --text2: #9898a8;
  --text3: #5a5a6a;
  --accent: #7dd3b0;
  --accent-vivid: #5ecea5;
  --accent-bg: rgba(125,211,176,0.07);
  --accent-border: rgba(125,211,176,0.2);
  --blue: #7ab4f5;
  --orange: #f5d05a;
  --red: #f47f7f;
  --green: #6ad090;
  --radius: 18px;
  --radius-sm: 12px;
  --sidebar: 218px;
  --card-label-h: 34px;
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --shadow-soft: 0 18px 60px rgba(0,0,0,0.26);
  --shadow-hover: 0 22px 70px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.035);
  --glow: 0 0 32px var(--accent-border);
}

::selection { background: var(--accent-bg); color: var(--accent); }

body {
  background:
    radial-gradient(circle at 18% 10%, var(--accent-bg) 0, transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(255,255,255,0.045) 0, transparent 24%),
    linear-gradient(145deg, var(--bg) 0%, #09090b 100%);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px);
  background-size: 42px 42px;
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 72%);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 72%);
  opacity: 0.34;
}

#app { display: flex; min-height: 100vh; position: relative; isolation: isolate; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar);
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015)), var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 22px 14px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 10;
  box-shadow: 12px 0 48px rgba(0,0,0,0.22);
  backdrop-filter: blur(18px);
  animation: slideInLeft 0.72s var(--ease-smooth) both;
}

@keyframes slideInLeft {
  from { transform: translate3d(-34px,0,0); opacity: 0; filter: blur(8px); }
  to   { transform: translate3d(0,0,0); opacity: 1; filter: blur(0); }
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 4px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.brand-icon { display: flex; }


.brand-name {
  font-weight: 600;
  font-size: 14.5px;
  color: var(--text);
  flex: 1;
  letter-spacing: -0.01em;
}

.version-badge {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
  padding: 2px 7px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  animation: badgePop 0.55s 0.35s cubic-bezier(0.34,1.7,0.64,1) both;
}

@keyframes badgePop {
  from { transform: scale(0.4) rotate(-8deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* ── UPDATE TAB ── */
.update-nav-dot {
  width: 6px; height: 6px;
  background: var(--orange);
  border-radius: 50%;
  margin-left: 4px;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 0 0 rgba(240,160,90,0.45);
  animation: pulse-dot 1.65s ease-in-out infinite;
}
.update-nav-dot::after {
  content: "";
  position: absolute;
  inset: -5px;
  border-radius: inherit;
  border: 1px solid rgba(240,160,90,0.45);
  animation: dot-ring 1.65s ease-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 rgba(240,160,90,0.0); }
  50% { opacity: 0.78; transform: scale(0.86); box-shadow: 0 0 14px rgba(240,160,90,0.45); }
}
@keyframes dot-ring {
  0% { opacity: 0.8; transform: scale(0.55); }
  70%, 100% { opacity: 0; transform: scale(1.55); }
}
.update-version-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.update-ver-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding: 12px 13px;
  border-radius: var(--radius-sm);
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018));
  border: 1px solid rgba(255,255,255,0.055);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
  transition: transform 0.48s var(--ease-smooth), border-color 0.48s ease, background 0.48s ease, box-shadow 0.48s ease;
}
.update-ver-block:hover {
  transform: translateY(-3px);
  border-color: rgba(255,255,255,0.13);
  background: rgba(255,255,255,0.045);
  box-shadow: 0 12px 30px rgba(0,0,0,0.18);
}
.update-ver-label {
  font-size: 11px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.update-ver-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  transition: color 0.35s ease, text-shadow 0.35s ease, transform 0.35s cubic-bezier(0.34,1.7,0.64,1);
}
.update-ver-val.has-update {
  color: var(--green);
  text-shadow: 0 0 14px rgba(106,208,144,0.22);
  animation: versionGlow 1.8s ease-in-out infinite;
}
@keyframes versionGlow {
  0%,100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1px) scale(1.025); }
}
.update-ver-arrow {
  color: var(--text3);
  flex-shrink: 0;
  animation: arrowFloat 1.9s ease-in-out infinite;
}
@keyframes arrowFloat {
  0%,100% { transform: translateX(0); opacity: 0.72; }
  50% { transform: translateX(3px); opacity: 1; }
}
.update-action-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.update-action-row .btn {
  position: relative;
  overflow: hidden;
}
.update-action-row .btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.18) 45%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.75s cubic-bezier(0.22,1,0.36,1);
  pointer-events: none;
}
.update-action-row .btn:hover::after { transform: translateX(120%); }
.update-action-row .btn.is-loading svg { animation: updateSpin 0.95s linear infinite; }
.update-action-row .btn.is-loading {
  filter: brightness(1.08);
  box-shadow: 0 0 0 3px var(--accent-bg), 0 8px 24px rgba(0,0,0,0.28);
}
.update-status {
  position: relative;
  margin-top: 10px;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-family: 'JetBrains Mono', monospace;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text2);
  line-height: 1.5;
  overflow: hidden;
  transform-origin: top center;
  animation: updateStatusIn 0.42s cubic-bezier(0.22,1,0.36,1) both;
}
.update-status.flash { animation: updateStatusPulse 0.48s cubic-bezier(0.22,1,0.36,1) both; }
.update-status-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 9px;
}
.update-status-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
  margin-top: 1px;
  background: rgba(255,255,255,0.08);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
}
.update-status-copy { min-width: 0; }
.update-status.info::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.055) 42%, transparent 72%);
  transform: translateX(-105%);
  animation: statusShimmer 1.8s ease-in-out infinite;
}
.update-status.info .update-status-icon { animation: updateSpin 1s linear infinite; }
.update-status.success .update-status-icon { animation: donePop 0.52s cubic-bezier(0.34,1.7,0.64,1) both; }
.update-status.error .update-status-icon { animation: errorShake 0.42s cubic-bezier(0.36,0.07,0.19,0.97) both; }
.update-status.success { background: rgba(106,208,144,0.08); border-color: rgba(106,208,144,0.25); color: var(--green); box-shadow: 0 0 0 1px rgba(106,208,144,0.05), 0 10px 30px rgba(106,208,144,0.055); }
.update-status.error   { background: rgba(244,127,127,0.08); border-color: rgba(244,127,127,0.25); color: var(--red); box-shadow: 0 0 0 1px rgba(244,127,127,0.04), 0 10px 30px rgba(244,127,127,0.05); }
.update-status.info    { background: var(--accent-bg); border-color: var(--accent-border); color: var(--accent); box-shadow: 0 0 0 1px rgba(255,255,255,0.02), 0 10px 30px rgba(0,0,0,0.16); }
@keyframes updateStatusIn {
  from { opacity: 0; transform: translateY(8px) scale(0.985); filter: blur(3px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes updateStatusPulse {
  0% { opacity: 0.78; transform: translateY(4px) scale(0.99); }
  65% { opacity: 1; transform: translateY(0) scale(1.012); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes updateSpin { to { transform: rotate(360deg); } }
@keyframes statusShimmer {
  0% { transform: translateX(-105%); }
  55%,100% { transform: translateX(105%); }
}
@keyframes donePop {
  0% { transform: scale(0.45); opacity: 0; }
  65% { transform: scale(1.18); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes errorShake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-3px); }
  40%, 60% { transform: translateX(3px); }
}
.update-progress {
  position: relative;
  height: 6px;
  margin-top: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.065);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.22);
  animation: progressIn 0.38s var(--ease-smooth) both;
}
.update-progress span {
  display: block;
  height: 100%;
  width: 48%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent 0%, var(--accent) 48%, var(--accent-vivid) 60%, transparent 100%);
  filter: drop-shadow(0 0 10px var(--accent-border));
  animation: progressSlide 1.38s var(--ease-smooth) infinite;
}
.update-progress.active { box-shadow: inset 0 1px 2px rgba(0,0,0,0.22), var(--glow); }
@keyframes progressIn {
  from { opacity: 0; transform: scaleX(0.72); filter: blur(3px); }
  to { opacity: 1; transform: scaleX(1); filter: blur(0); }
}
@keyframes progressSlide {
  0% { transform: translate3d(-125%,0,0); opacity: 0.5; }
  12% { opacity: 1; }
  100% { transform: translate3d(245%,0,0); opacity: 0.85; }
}
.upd-inline-notes {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 12px;
    line-height: 1.6;
    white-space: pre-wrap;
    opacity: 0.85;
    animation: notesIn 0.42s 0.04s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes notesIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 0.85; transform: translateY(0); }
}
.update-notes {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.7;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  animation: notesIn 0.48s cubic-bezier(0.22,1,0.36,1) both;
}


.nav { display: flex; flex-direction: column; gap: 4px; position: relative; }

.nav-indicator {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 35px;
  border-radius: var(--radius-sm);
  background:
    linear-gradient(135deg, var(--accent-bg), rgba(255,255,255,0.022)),
    var(--surface2);
  border: 1px solid var(--accent-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 26px rgba(0,0,0,0.16), var(--glow);
  opacity: 0;
  transform: translate3d(0,0,0);
  transition: transform 0.58s var(--ease-smooth), height 0.42s var(--ease-smooth), opacity 0.26s ease, background 0.45s ease, border-color 0.45s ease;
  pointer-events: none;
  z-index: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text2);
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: color 0.38s var(--ease-smooth), transform 0.38s var(--ease-smooth), background 0.38s var(--ease-smooth), border-color 0.38s var(--ease-smooth);
  text-align: left;
  width: 100%;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.035);
  color: var(--text);
  border-color: rgba(255,255,255,0.08);
  transform: translateX(4px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.025);
}

.nav-btn.active {
  background: transparent;
  color: var(--accent);
  border-color: transparent;
  font-weight: 600;
  transform: translateX(2px);
}

.nav-btn svg { opacity: 0.65; flex-shrink: 0; transition: opacity 0.38s var(--ease-smooth), transform 0.38s var(--ease-smooth), filter 0.38s ease; }
.nav-btn.active svg { opacity: 1; transform: scale(1.12); filter: drop-shadow(0 0 8px var(--accent-border)); }
.nav-btn:hover svg { opacity: 0.95; transform: scale(1.07); }

/* ── NOW PLAYING ── */
.now-playing { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }

.np-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  background: rgba(244,127,127,0.06);
  border: 1px solid rgba(244,127,127,0.18);
  transition: background 0.7s var(--ease-smooth), border-color 0.7s var(--ease-smooth), box-shadow 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth);
}

.np-indicator.live {
  background: rgba(106,208,144,0.07);
  border-color: rgba(106,208,144,0.22);
  box-shadow: 0 0 12px rgba(106,208,144,0.06);
}

.np-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--red);
  box-shadow: 0 0 6px rgba(244,127,127,0.5);
  animation: pulseDead 2.5s ease-in-out infinite;
  transition: background 0.7s var(--ease-smooth), box-shadow 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth);
}

.np-dot.live {
  background: var(--green);
  box-shadow: 0 0 8px rgba(106,208,144,0.6);
  animation: pulseAlive 2s ease-in-out infinite;
}

@keyframes pulseDead {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%       { opacity: 0.35; transform: scale(0.72); }
}

@keyframes pulseAlive {
  0%, 100% { opacity: 1;   transform: scale(1);    box-shadow: 0 0 8px rgba(106,208,144,0.6); }
  50%       { opacity: 0.65; transform: scale(0.82); box-shadow: 0 0 3px rgba(106,208,144,0.25); }
}

.np-label {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--red);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.65s cubic-bezier(0.22,1,0.36,1);
}

.np-label.live { color: var(--green); }

.np-indicator.partial {
  background: rgba(240,160,90,0.07);
  border-color: rgba(240,160,90,0.25);
  box-shadow: 0 0 12px rgba(240,160,90,0.05);
}

.np-dot.partial {
  background: #f5d05a;
  box-shadow: 0 0 7px rgba(245,208,90,0.55);
  animation: pulseOrange 2.2s ease-in-out infinite;
}

.np-label.partial { color: #f5d05a; }

@keyframes pulseOrange {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 7px rgba(245,208,90,0.55); }
  50% { opacity: 0.6; transform: scale(0.78); box-shadow: 0 0 3px rgba(245,208,90,0.2); }
}

.np-indicator.buffering {
  background: rgba(255,230,50,0.07);
  border-color: rgba(255,230,50,0.28);
  box-shadow: 0 0 12px rgba(255,230,50,0.05);
}

.np-dot.buffering {
  background: #ffe51e;
  box-shadow: 0 0 7px rgba(255,229,30,0.6);
  animation: pulseYellow 2.2s ease-in-out infinite;
}

.np-label.buffering { color: #ffe51e; }

@keyframes pulseYellow {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 7px rgba(255,229,30,0.6); }
  50% { opacity: 0.6; transform: scale(0.78); box-shadow: 0 0 3px rgba(255,229,30,0.2); }
}

.np-sub {
  font-size: 10px;
  font-weight: 400;
  color: var(--text3);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  transition: opacity 0.4s ease;
  opacity: 0;
  height: 0;
}

.np-sub.show { opacity: 1; height: auto; animation: subIn 0.42s var(--ease-smooth) both; }
@keyframes subIn { from { transform: translateY(-3px); filter: blur(3px); } to { transform: translateY(0); filter: blur(0); } }

/* ── CONTENT ── */
.content {
  margin-left: var(--sidebar);
  flex: 1;
  padding: 38px 42px 54px;
  max-width: 780px;
}

.tab { display: none; }
.tab.active { display: block; animation: tabIn 0.62s var(--ease-smooth) both; will-change: transform, opacity, filter; }

@keyframes tabIn {
  from { opacity: 0; transform: translate3d(0,18px,0) scale(0.982); filter: blur(6px); }
  to   { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); }
}

.tab-header { margin-bottom: 25px; animation: fadeDown 0.58s 0.08s var(--ease-smooth) both; }

@keyframes fadeDown {
  from { opacity: 0; transform: translate3d(0,-12px,0); filter: blur(5px); }
  to   { opacity: 1; transform: translate3d(0,0,0); filter: blur(0); }
}

.tab-header h1 {
  font-size: 23px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 5px;
  letter-spacing: -0.02em;
}

.tab-header p { color: var(--text2); font-size: 13px; }

/* ── CARDS ── */
.card {
  position: relative;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.042), rgba(255,255,255,0.014)),
    var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 10px 34px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.03);
  transform: translateZ(0);
  transition: border-color 0.5s var(--ease-smooth), box-shadow 0.5s var(--ease-smooth), transform 0.5s var(--ease-smooth), background 0.5s ease;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 0 0, var(--accent-bg), transparent 36%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.card:hover {
  border-color: rgba(255,255,255,0.14);
  box-shadow: var(--shadow-hover);
  transform: translate3d(0,-4px,0);
}
.card:hover::before { opacity: 0.8; }

.anim-card { animation: cardIn 0.68s var(--ease-smooth) both; will-change: transform, opacity, filter; }
.anim-card:nth-child(2) { animation-delay: 0.07s; }
.anim-card:nth-child(3) { animation-delay: 0.14s; }
.anim-card:nth-child(4) { animation-delay: 0.21s; }

@keyframes cardIn {
  from { opacity: 0; transform: translate3d(0,30px,0) scale(0.975); filter: blur(7px); }
  to   { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); }
}

.card-label {
  position: relative;
  z-index: 1;
  padding: 10px 20px 9px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--text2);
  background: linear-gradient(90deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018));
  border-bottom: 1px solid var(--border);
}

.card-section { position: relative; z-index: 1; padding: 19px 20px; }
.divider { height: 1px; background: var(--border); }
.section-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* ── FORM ── */
.field-label {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 8px;
}

.field-hint { font-size: 11.5px; color: var(--text3); margin-top: 5px; line-height: 1.5; }

.input {
  width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012)), var(--surface2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.36s var(--ease-smooth), box-shadow 0.36s var(--ease-smooth), background 0.36s ease, transform 0.36s var(--ease-smooth);
  -webkit-appearance: none;
}

.input:hover { border-color: rgba(255,255,255,0.16); transform: translateY(-1px); }

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-bg), 0 8px 22px rgba(0,0,0,0.22), var(--glow);
  background: var(--surface3);
  transform: translateY(-1px);
}

.input::placeholder { color: var(--text3); }
.textarea { resize: vertical; min-height: 76px; line-height: 1.5; }

.input-row { display: flex; gap: 8px; align-items: center; }
.input-row .input { flex: 1; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
  transition: transform 0.36s var(--ease-smooth), box-shadow 0.36s var(--ease-smooth), filter 0.36s ease, background 0.36s ease, border-color 0.36s ease;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.btn:active { transform: scale(0.96) translateY(0) !important; }
.btn svg, .btn .btn-label { position: relative; z-index: 1; }

.btn-secondary {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border2);
}

.btn-secondary:hover { background: var(--surface3); transform: translateY(-2px); box-shadow: 0 9px 22px rgba(0,0,0,0.25); }

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-vivid));
  color: #0c1911;
  font-weight: 700;
  box-shadow: 0 8px 22px var(--accent-border);
}

.btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 14px 34px var(--accent-border), 0 0 0 4px var(--accent-bg); }
.btn.success { background: rgba(106,208,144,0.12); color: var(--green); border: 1px solid rgba(106,208,144,0.25); }
.btn.error   { background: rgba(244,127,127,0.12); color: var(--red);   border: 1px solid rgba(244,127,127,0.25); }

/* ── TOGGLES ── */
.toggle-row {
  display: flex; align-items: flex-start; gap: 12px;
  cursor: pointer; user-select: none;
}

.toggle-row input[type="checkbox"] { display: none; }

.toggle-track {
  flex-shrink: 0;
  width: 34px; height: 19px;
  background: var(--surface3);
  border: 1px solid var(--border2);
  border-radius: 20px;
  position: relative;
  transition: background 0.38s var(--ease-smooth), border-color 0.38s var(--ease-smooth), box-shadow 0.38s var(--ease-smooth);
  margin-top: 2px;
}

.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 11px; height: 11px;
  background: var(--text3);
  border-radius: 50%;
  transition: transform 0.5s var(--ease-spring), background 0.35s ease, box-shadow 0.35s ease;
}

.toggle-row input:checked + .toggle-track { background: var(--accent-bg); border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
.toggle-row input:checked + .toggle-track .toggle-thumb { transform: translateX(15px); background: var(--accent); box-shadow: 0 0 10px var(--accent-border); }
.toggle-row:hover .toggle-track { border-color: var(--accent-border); }

.toggle-label { display: block; font-size: 13.5px; font-weight: 500; color: var(--text); line-height: 1.4; }
.toggle-group { display: flex; flex-direction: column; gap: 16px; }

/* ── STATUS PREVIEW ── */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, var(--accent-bg), rgba(255,255,255,0.025)), var(--surface2);
  border: 1px solid var(--accent-border);
  border-radius: 999px;
  padding: 8px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text);
  margin-top: 4px;
  transition: transform 0.42s var(--ease-smooth), border-color 0.42s ease, box-shadow 0.42s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.16);
  animation: previewFloat 4s ease-in-out infinite;
}

.status-pill:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,0.24), var(--glow); }
@keyframes previewFloat {
  0%,100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(0,-2px,0); }
}
.pill-note { font-size: 13px; }

/* ── AUTH FOOTER ── */
.auth-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }

.auth-success {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--green); font-size: 12.5px; font-weight: 500; margin-top: 10px;
  animation: successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}

@keyframes successPop {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* ── THEME TAB ── */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.theme-preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
  background: var(--surface2);
  cursor: pointer;
  transition: transform 0.38s var(--ease-smooth), border-color 0.38s var(--ease-smooth), background 0.38s ease, box-shadow 0.38s var(--ease-smooth);
  font-family: 'Inter', sans-serif;
}

.theme-preset:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.26), var(--glow);
}

.theme-preset.active {
  border-color: var(--accent);
  background: var(--accent-bg);
  box-shadow: 0 0 0 2px var(--accent-border);
}

.preset-swatch {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: block;
  background: linear-gradient(135deg, var(--s1) 50%, var(--s2) 50%);
  border: 2px solid rgba(255,255,255,0.08);
  transition: transform 0.38s var(--ease-spring), box-shadow 0.38s ease;
}

.theme-preset:hover .preset-swatch { transform: scale(1.12) rotate(-4deg); box-shadow: 0 8px 22px rgba(0,0,0,0.24); }
.theme-preset.active .preset-swatch { border-color: var(--accent-border); }

.preset-label {
  font-size: 11.5px;
  color: var(--text2);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.theme-preset.active .preset-label { color: var(--accent); }

.color-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.color-field {}

.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.color-picker {
  width: 40px; height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border2);
  background: var(--surface2);
  padding: 3px;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  transition: transform 0.18s, box-shadow 0.18s;
}

.color-picker::-webkit-color-swatch-wrapper { padding: 0; }
.color-picker::-webkit-color-swatch { border-radius: 5px; border: none; }

.color-picker:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.color-picker:focus { outline: none; box-shadow: 0 0 0 2px var(--accent-border); }

.color-hex {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text2);
  letter-spacing: 0.03em;
}

.color-preview-row { display: flex; align-items: center; gap: 14px; }
.color-preview-label { font-size: 11.5px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }

.color-preview-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--accent);
  transition: all 0.25s;
}

.pill-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

.hid { display: none !important; }
.input-error { border-color: var(--red) !important; box-shadow: 0 0 0 3px rgba(244,127,127,0.1) !important; }


/* ── AF LOGO ── */
.af-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-vivid) 100%);
  color: #0c1911;
  font-size: 10px;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 10px var(--accent-border);
  transition: transform 0.45s cubic-bezier(0.34,1.7,0.64,1), box-shadow 0.4s ease;
}

.brand:hover .af-logo {
  transform: scale(1.15) rotate(-5deg);
  box-shadow: 0 6px 22px var(--accent-border);
}

/* ── MICRO-POLISH ── */
.card, .btn, .input, .theme-preset, .status-pill, .np-indicator, .update-ver-block { will-change: transform; }
button:disabled { opacity: 0.62; cursor: default; transform: none !important; box-shadow: none !important; }
.hid { display: none !important; }

@media (max-width: 760px) {
  :root { --sidebar: 100%; }
  #app { display: block; }
  .sidebar { position: relative; width: 100%; min-height: auto; padding: 16px; }
  .content { margin-left: 0; padding: 24px 18px 38px; max-width: none; }
  .nav { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 6px; }
  .nav-indicator { display: none; }
  .nav-btn { justify-content: center; font-size: 0; padding: 10px; }
  .nav-btn svg { width: 17px; height: 17px; }
  .section-row, .color-row, .preset-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: linear-gradient(var(--surface3), var(--surface2)); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
::-webkit-scrollbar-thumb:hover { background: var(--border2); }
</style>`).appendTo(document.head);

// ─── ELEMENT REFS ─────────────────────────────────────────────────────────────
let userTokenInput          = $("#user-token"),
    checkTokenButton        = $("#check-token"),
    clientIDInput           = $("#client-id"),
    clientSecretInput       = $("#client-secret"),
    customRedirectUriInput  = $("#custom-redirect-uri"),
    useExternalAuthServer   = $("#use-external-auth-server"),
    authorizeButton         = $("#authorize-spotify"),
    spotifyAuthorizedIndicator = $("#spotify-authorized-indicator"),
    enableTimestampCheckbox = $("#enable-timestamp"),
    enableLabelCheckbox     = $("#enable-label"),
    statusPreviewText       = $("#status-preview-text"),
    enableAdvancedSWT       = $("#enable-advanced-swt"),
    advancedSWT             = $("#advanced-swt"),
    customEmoji             = $("#custom-emoji"),
    customStatus            = $("#custom-status"),
    sendTimeOffset          = $("#send-time-offset"),
    enableAutooffset        = $("#enable-autooffset"),
    autooffset              = $("#autooffset"),
    nowPlaying              = $("#now-playing"),
    enableAutoupdateChk     = $("#enable-autoupdate"),
    btnCheckUpdate          = $("#btn-check-update"),
    btnDoUpdate             = $("#btn-do-update"),
    updCurrent              = $("#upd-current"),
    updLatest               = $("#upd-latest"),
    updStatus               = $("#upd-status"),
    updProgress             = $("#upd-progress"),
    updNotesCard            = $("#upd-notes-card"),
    updNotes                = $("#upd-notes"),
    updateNavDot            = $("#update-nav-dot");

// ─── STATE ────────────────────────────────────────────────────────────────────
let settings = {
    credentials: {
        token: "", cookies: "", clientID: "", clientSecret: "",
        useExternalAuthServer: false, code: "", refreshToken: "", uuid: "", customRedirectUri: ""
    },
    view: {
        timestamp: true, label: true,
        advanced: { enabled: false, customEmoji: "🎶", customStatus: "[{timestamp}] Song lyrics - {lyrics}" }
    },
    timings: { sendTimeOffset: 500, enableAutooffset: true, autooffset: 3 },
    update: { enableAutoupdate: false }
};

let settingsLoaded = false;

// ─── THEME INIT ───────────────────────────────────────────────────────────────
(function initTheme() {
  const savedCustom = localStorage.getItem('ls-custom');
  const savedTheme = localStorage.getItem('ls-theme');
  if (savedCustom) {
    try {
      const c = JSON.parse(savedCustom);
      $('#cp-accent').val(c.accent);
      $('#cp-bg').val(c.bg);
      applyCustom();
    } catch(e) {}
  } else if (savedTheme && THEMES[savedTheme]) {
    applyTheme(savedTheme, true);
  } else {
    applyTheme('dark', true);
  }
})();

// ─── NAV ──────────────────────────────────────────────────────────────────────
function moveNavIndicator(target) {
    const btn = target && target.length ? target : $(".nav-btn.active");
    const indicator = $(".nav-indicator");
    if (!btn.length || !indicator.length) return;

    const navTop = btn.parent()[0].getBoundingClientRect().top;
    const rect = btn[0].getBoundingClientRect();
    indicator.css({
        height: rect.height + "px",
        transform: "translate3d(0," + (rect.top - navTop) + "px,0)",
        opacity: 1
    });
}

setTimeout(() => moveNavIndicator($(".nav-btn.active")), 80);
$(window).on("resize", () => moveNavIndicator($(".nav-btn.active")));

$(".nav-btn").click(function () {
    const tab = $(this).data("tab");
    $(".nav-btn").removeClass("active");
    $(this).addClass("active");
    moveNavIndicator($(this));
    $(".tab").removeClass("active");
    $("#tab-" + tab).addClass("active");
    // Re-trigger card animations
    $("#tab-" + tab + " .anim-card").each(function(i) {
      $(this).css('animation', 'none');
      const el = this;
      setTimeout(() => { $(el).css('animation', ''); }, 10 + i * 55);
    });
});

// ─── AUTH EVENTS ──────────────────────────────────────────────────────────────
userTokenInput.on("change input", () => {
    settings.credentials.token = userTokenInput.val().replace(/"/g, "");
    saveSettings();
    updateConnectionStatus();
});

checkTokenButton.click(() => {
    const label = checkTokenButton.find(".btn-label");
    const orig = label.text();
    label.text("...");
    checkTokenButton.removeClass("success error");

    const valid = checkToken(settings.credentials.token);

    setTimeout(() => {
        if (valid) {
            checkTokenButton.addClass("success");
            label.text("✓ Valid");
        } else {
            checkTokenButton.addClass("error");
            label.text("✗ Invalid");
        }
        updateConnectionStatus();
        setTimeout(() => {
            checkTokenButton.removeClass("success error");
            label.text(orig);
        }, 2500);
    }, 300);
});

clientIDInput.on("change input", () => { settings.credentials.clientID = clientIDInput.val(); saveSettings(); });
clientSecretInput.on("change input", () => { settings.credentials.clientSecret = clientSecretInput.val(); saveSettings(); });
customRedirectUriInput.on("change input", () => { settings.credentials.customRedirectUri = customRedirectUriInput.val(); saveSettings(); });

useExternalAuthServer.change(() => {
    settings.credentials.useExternalAuthServer = useExternalAuthServer.prop("checked");
    saveSettings();
});

authorizeButton.click(() => {
    if (settings.credentials.useExternalAuthServer) {
        window.open("https://rocky-quintessential-island.glitch.me/login/" + settings.credentials.uuid, "_blank");
    } else {
        const clientId = settings.credentials.clientID;
        const redirectUri = settings.credentials.customRedirectUri;
        window.open(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent("user-read-playback-state user-read-currently-playing")}`, '_blank');
    }
});

// ─── DISPLAY EVENTS ───────────────────────────────────────────────────────────
enableTimestampCheckbox.change(() => {
    settings.view.timestamp = enableTimestampCheckbox.prop("checked");
    saveSettings(); updatePreview();
});

enableLabelCheckbox.change(() => {
    settings.view.label = enableLabelCheckbox.prop("checked");
    saveSettings(); updatePreview();
});

enableAdvancedSWT.change(() => {
    const state = enableAdvancedSWT.prop("checked");
    settings.view.advanced.enabled = state;
    saveSettings();
    advancedSWT.toggleClass("hid", !state);
    enableTimestampCheckbox.prop("disabled", state);
    enableLabelCheckbox.prop("disabled", state);
});

customEmoji.on("input", () => { settings.view.advanced.customEmoji = customEmoji.val(); saveSettings(); });
customStatus.on("input", () => { settings.view.advanced.customStatus = customStatus.val(); saveSettings(); });

// ─── TIMING EVENTS ────────────────────────────────────────────────────────────
sendTimeOffset.on("input", () => {
    const v = +sendTimeOffset.val();
    if (!isNaN(v)) { settings.timings.sendTimeOffset = v; saveSettings(); }
    sendTimeOffset.toggleClass("input-error", isNaN(+sendTimeOffset.val()));
});

enableAutooffset.change(() => {
    settings.timings.enableAutooffset = enableAutooffset.prop("checked");
    saveSettings();
});

autooffset.on("input", () => {
    const v = +autooffset.val();
    if (!isNaN(v) && v > 0) { settings.timings.autooffset = v; saveSettings(); }
});

// ─── THEME EVENTS ─────────────────────────────────────────────────────────────
$('.theme-preset').click(function() {
    applyTheme($(this).data('key'));
});

function syncColorHex() {
  const accent = $('#cp-accent').val();
  const bg = $('#cp-bg').val();
  $('#hex-accent').text(accent);
  $('#hex-bg').text(bg);
  // Update preview pill
  const { r, g, b } = hexToRgb(accent);
  $('#color-preview-pill').css({
    'background': `rgba(${r},${g},${b},0.08)`,
    'border-color': `rgba(${r},${g},${b},0.25)`,
    'color': accent,
  });
  $('#color-preview-pill .pill-dot').css('background', accent);
}

$('#cp-accent, #cp-bg').on('input change', syncColorHex);

$('#apply-custom-btn').click(() => {
    applyCustom();
    const btn = $('#apply-custom-btn');
    btn.html('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Applied!');
    btn.addClass('success');
    setTimeout(() => {
        btn.html('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Apply custom theme');
        btn.removeClass('success');
    }, 1800);
});

// Init color hex display
syncColorHex();

// ─── UPDATE EVENTS ────────────────────────────────────────────────────────────
let _pendingDownloadUrl = null;

function setUpdStatus(msg, cls, working) {
    const icon = cls === "success" ? "✓" : (cls === "error" ? "!" : "⟳");
    updStatus.removeClass("hid success error info flash");
    if (cls) updStatus.addClass(cls);
    updStatus.html(
        '<div class="update-status-main">' +
          '<span class="update-status-icon">' + icon + '</span>' +
          '<div class="update-status-copy">' + msg + '</div>' +
        '</div>'
    );
    updProgress.toggleClass("hid", !working);
    updProgress.toggleClass("active", !!working);
    if (updStatus[0]) {
        void updStatus[0].offsetWidth;
        updStatus.addClass("flash");
    }
}

function setUpdateButtonsLoading(isLoading) {
    btnDoUpdate.toggleClass("is-loading", isLoading);
    btnCheckUpdate.toggleClass("is-loading", isLoading && btnDoUpdate.hasClass("hid"));
}

enableAutoupdateChk.change(() => {
    settings.update.enableAutoupdate = enableAutoupdateChk.prop("checked");
    saveSettings();
});

btnCheckUpdate.click(async () => {
    const lbl = btnCheckUpdate.find(".btn-label");
    lbl.text("Checking...");
    btnCheckUpdate.addClass("is-loading");
    btnCheckUpdate.prop("disabled", true);
    btnDoUpdate.addClass("hid");
    updStatus.addClass("hid");
    updProgress.addClass("hid");
    updNotesCard.addClass("hid");
    _pendingDownloadUrl = null;

    try {
        const res = await fetch("/api/check-update");
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        updCurrent.text(data.current || "?");
        updLatest.text(data.latest || "?").removeClass("has-update");

        if (data.hasUpdate) {
            updLatest.addClass("has-update");
            _pendingDownloadUrl = data.downloadUrl;
            btnDoUpdate.removeClass("hid");
            updateNavDot.removeClass("hid");

            // Build status message with release notes inline
            let notesHtml = "";
            if (data.releaseNotes && data.releaseNotes.trim()) {
                const notes = data.releaseNotes.trim();
                notesHtml = "<div class=\"upd-inline-notes\">" + notes.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>") + "</div>";
            }
            setUpdStatus("New version " + data.latest + " is available!" + notesHtml, "info", false);

            if (data.releaseNotes && data.releaseNotes.trim()) {
                updNotes.text(data.releaseNotes.trim());
                updNotesCard.removeClass("hid");
            }
        } else {
            setUpdStatus("You're up to date (" + data.current + ")", "success", false);
        }
    } catch(e) {
        setUpdStatus("Error: " + e.message, "error", false);
    } finally {
        lbl.text("Check for updates");
        btnCheckUpdate.removeClass("is-loading");
        btnCheckUpdate.prop("disabled", false);
    }
});

btnDoUpdate.click(async () => {
    if (!_pendingDownloadUrl) return;

    const lbl = btnDoUpdate.find(".btn-label");
    lbl.text("Updating...");
    btnDoUpdate.addClass("is-loading");
    btnDoUpdate.prop("disabled", true);
    btnCheckUpdate.prop("disabled", true);
    setUpdStatus("Starting update...", "info", true);

    try {
        const res = await fetch("/api/do-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ downloadUrl: _pendingDownloadUrl })
        });

        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Failed to start update");

        setUpdStatus("Update started. Please keep this window open...", "info", true);
    } catch(e) {
        setUpdStatus("Error: " + e.message, "error", false);
        btnDoUpdate.removeClass("is-loading");
        btnDoUpdate.prop("disabled", false);
        btnCheckUpdate.prop("disabled", false);
        lbl.text("Update now");
    }
});

// ─── UTILS ────────────────────────────────────────────────────────────────────
function formatSeconds(s) {
    s = Math.round(s);
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}

function updatePreview() {
    const text = `${settings.view.timestamp ? '[2:17] ' : ''}${settings.view.label ? 'Song lyrics - ' : ''}La-la-la`;
    statusPreviewText.text(text);
}

function checkToken(token) {
    let success = true;
    $.get({
        url: "https://discordapp.com/api/v8/users/@me",
        headers: { "Authorization": token },
        async: false,
        statusCode: { 401: () => success = false }
    });
    return success;
}

function saveSettings() {
    if (!settingsLoaded) return;
    ws.send(JSON.stringify(settings));
}

function loadSettings(raw) {
    const loaded = JSON.parse(raw);
    settings = $.extend(true, settings, loaded);

    try {
        userTokenInput.val(settings.credentials.token);
        clientIDInput.val(settings.credentials.clientID);
        clientSecretInput.val(settings.credentials.clientSecret);
        customRedirectUriInput.val(settings.credentials.customRedirectUri);
        useExternalAuthServer.prop("checked", settings.credentials.useExternalAuthServer);
        enableTimestampCheckbox.prop("checked", settings.view.timestamp);
        enableLabelCheckbox.prop("checked", settings.view.label);

        if (settings.view.advanced.enabled) {
            enableAdvancedSWT.prop("checked", true).trigger("change");
        }

        customEmoji.val(settings.view.advanced.customEmoji);
        customStatus.val(settings.view.advanced.customStatus);
        sendTimeOffset.val(settings.timings.sendTimeOffset);
        enableAutooffset.prop("checked", settings.timings.enableAutooffset);
        autooffset.val(settings.timings.autooffset);

        // Update settings
        if (settings.update) {
            enableAutoupdateChk.prop("checked", !!settings.update.enableAutoupdate);
        }

        // Version badge from server
        if (loaded.version) {
            $("#version-badge").text(loaded.version);
            updCurrent.text(loaded.version);
        }

        const authorized = !!(settings.credentials && (settings.credentials.refreshToken || settings.credentials.code));
        spotifyAuthorizedIndicator.toggleClass("hid", !authorized);

        updatePreview();
        settingsLoaded = true;
    } catch (e) {
        console.error("loadSettings error:", e);
    }

    updateConnectionStatus();
}

// ─── CONNECTION STATUS ────────────────────────────────────────────────────────
// Playback state received from server via WS broadcasts
window._playback = { isPlaying: false, songName: "", songAuthor: "", hasLyrics: false, lyricsActive: false };

function updateConnectionStatus() {
    const wsOpen  = window.ws && window.ws.readyState === WebSocket.OPEN;
    const discord = !!(settings.credentials.token && settings.credentials.token.trim().length > 20);
    const spotify = !!(settings.credentials.refreshToken || settings.credentials.code);
    const pb      = window._playback;

    const dot = $(".np-dot");
    const lbl = $(".np-label");
    const ind = $(".np-indicator");
    const sub = $("#np-sub");

    dot.removeClass("live partial buffering");
    lbl.removeClass("live partial buffering");
    ind.removeClass("live partial buffering");
    sub.removeClass("show").text("");

    if (!wsOpen) {
        lbl.text("Disconnected");
        return;
    }

    if (!discord && !spotify) {
        // ❌ Nothing configured
        lbl.text("Not configured");
        sub.addClass("show").text("Set up Discord & Spotify");
        return;
    }

    if (!discord) {
        // 🟠 Spotify set, Discord missing
        dot.addClass("partial"); lbl.addClass("partial"); ind.addClass("partial");
        lbl.text("Incomplete");
        sub.addClass("show").text("Discord token missing");
        return;
    }

    if (!spotify) {
        // 🟠 Discord set, Spotify missing
        dot.addClass("partial"); lbl.addClass("partial"); ind.addClass("partial");
        lbl.text("Incomplete");
        sub.addClass("show").text("Spotify not connected");
        return;
    }

    // Both credentials present — check playback
    if (!pb.isPlaying) {
        // 🟠 Connected but nothing playing
        dot.addClass("partial"); lbl.addClass("partial"); ind.addClass("partial");
        lbl.text("Not playing");
        sub.addClass("show").text("Open Spotify and play a song");
        return;
    }

    if (!pb.lyricsActive) {
        // 🟡 Playing but lyrics not flowing yet
        dot.addClass("buffering"); lbl.addClass("buffering"); ind.addClass("buffering");
        lbl.text("Buffering...");
        if (pb.songName) sub.addClass("show").text(pb.songName);
        return;
    }

    // ✅ Fully live — lyrics reaching Discord
    dot.addClass("live"); lbl.addClass("live"); ind.addClass("live");
    lbl.text("Live");
    if (pb.songName) sub.addClass("show").text(pb.songName);
}

// ─── WEBSOCKET ────────────────────────────────────────────────────────────────
function connectWS() {
    const ws = new WebSocket("ws://localhost:8999/ws");

    ws.onopen = () => {
        window.ws = ws;
        updateConnectionStatus();
    };

    ws.onmessage = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.type === "playback") {
                window._playback = data;
                updateConnectionStatus();
            } else if (data.type === "update_progress") {
                setUpdStatus(data.message, "info", true);
            } else if (data.type === "update_done") {
                setUpdStatus(data.message, "success", false);
                updateNavDot.addClass("hid");
                btnDoUpdate.addClass("hid").removeClass("is-loading");
                btnCheckUpdate.removeClass("is-loading").prop("disabled", false);
                btnDoUpdate.find(".btn-label").text("Update now");
            } else if (data.type === "update_error") {
                setUpdStatus("Error: " + data.message, "error", false);
                btnDoUpdate.removeClass("is-loading");
                btnDoUpdate.prop("disabled", false);
                btnCheckUpdate.prop("disabled", false);
                btnDoUpdate.find(".btn-label").text("Update now");
            } else {
                // settings message
                loadSettings(msg.data);
            }
        } catch(e) {
            loadSettings(msg.data);
        }
    };

    ws.onclose = () => {
        window.ws = null;
        updateConnectionStatus();
        setTimeout(connectWS, 3000);
    };

    window.ws = ws;
}

connectWS();
