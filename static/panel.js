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
      <span id="version-badge" class="version-badge">v7</span>
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
  --radius: 14px;
  --radius-sm: 9px;
  --sidebar: 210px;
  --card-label-h: 34px;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar);
  min-height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  animation: slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) both;
}

@keyframes slideInLeft {
  from { transform: translateX(-32px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
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

.nav { display: flex; flex-direction: column; gap: 2px; position: relative; }

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
  transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
  text-align: left;
  width: 100%;
  letter-spacing: -0.01em;
  position: relative;
}

.nav-btn:hover {
  background: var(--surface2);
  color: var(--text);
  border-color: var(--border);
  transform: translateX(3px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
}

.nav-btn.active {
  background: var(--accent-bg);
  color: var(--accent);
  border-color: var(--accent-border);
  font-weight: 500;
}

.nav-btn svg { opacity: 0.65; flex-shrink: 0; transition: opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1); }
.nav-btn.active svg { opacity: 1; transform: scale(1.1); }
.nav-btn:hover svg { opacity: 0.9; }

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
  transition: background 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.65s cubic-bezier(0.22,1,0.36,1), box-shadow 0.65s cubic-bezier(0.22,1,0.36,1);
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
  transition: background 0.65s cubic-bezier(0.22,1,0.36,1), box-shadow 0.65s cubic-bezier(0.22,1,0.36,1);
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

.np-sub.show { opacity: 1; height: auto; }

/* ── CONTENT ── */
.content {
  margin-left: var(--sidebar);
  flex: 1;
  padding: 36px 40px;
  max-width: 740px;
}

.tab { display: none; }
.tab.active { display: block; animation: tabIn 0.45s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }

@keyframes tabIn {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.tab-header { margin-bottom: 24px; animation: fadeDown 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both; }

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tab-header h1 {
  font-size: 21px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 5px;
  letter-spacing: -0.02em;
}

.tab-header p { color: var(--text2); font-size: 13px; }

/* ── CARDS ── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: rgba(255,255,255,0.13);
  box-shadow: 0 14px 44px rgba(0,0,0,0.32), 0 3px 10px rgba(0,0,0,0.15);
  transform: translateY(-3px);
}
.card { transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1); }

.anim-card { animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
.anim-card:nth-child(2) { animation-delay: 0.09s; }
.anim-card:nth-child(3) { animation-delay: 0.18s; }
.anim-card:nth-child(4) { animation-delay: 0.26s; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.card-label {
  padding: 9px 20px 8px;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text3);
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
}

.card-section { padding: 18px 20px; }
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
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  padding: 8px 11px;
  outline: none;
  transition: border-color 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s ease;
  -webkit-appearance: none;
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-bg), 0 2px 8px rgba(0,0,0,0.2);
  background: var(--surface3);
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
  padding: 8px 15px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.btn:active { transform: scale(0.93) !important; }

.btn-secondary {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border2);
}

.btn-secondary:hover { background: var(--surface3); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

.btn-primary {
  background: var(--accent);
  color: #0c1911;
  font-weight: 600;
}

.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 16px var(--accent-border); }
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
  transition: background 0.25s, border-color 0.25s;
  margin-top: 2px;
}

.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 11px; height: 11px;
  background: var(--text3);
  border-radius: 50%;
  transition: transform 0.45s cubic-bezier(0.34,1.7,0.64,1), background 0.35s ease;
}

.toggle-row input:checked + .toggle-track { background: var(--accent-bg); border-color: var(--accent); }
.toggle-row input:checked + .toggle-track .toggle-thumb { transform: translateX(15px); background: var(--accent); }
.toggle-row:hover .toggle-track { border-color: var(--accent-border); }

.toggle-label { display: block; font-size: 13.5px; font-weight: 500; color: var(--text); line-height: 1.4; }
.toggle-group { display: flex; flex-direction: column; gap: 16px; }

/* ── STATUS PREVIEW ── */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 7px 15px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text);
  margin-top: 4px;
  transition: border-color 0.2s;
}

.status-pill:hover { border-color: var(--accent-border); }
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
  transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
  font-family: 'Inter', sans-serif;
}

.theme-preset:hover {
  border-color: var(--accent-border);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
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
  transition: transform 0.2s;
}

.theme-preset:hover .preset-swatch { transform: scale(1.1); }
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

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 10px; }
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
    nowPlaying              = $("#now-playing");

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
$(".nav-btn").click(function () {
    const tab = $(this).data("tab");
    $(".nav-btn").removeClass("active");
    $(this).addClass("active");
    $(".tab").removeClass("active");
    $("#tab-" + tab).addClass("active");
    // Re-trigger card animations
    $("#tab-" + tab + " .anim-card").each(function(i) {
      $(this).css('animation', 'none');
      const el = this;
      setTimeout(() => { $(el).css('animation', ''); }, 10 + i * 60);
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
            } else {
                // settings message (type === "settings" or legacy no-type)
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
