// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    label: 'Midnight Mint',
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
    label: 'Royal Violet',
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
    label: 'Aqua Pulse',
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
    label: 'Sunset Ember',
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
    label: 'Emerald Night',
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

const THEME_VAR_KEYS = [
  '--bg', '--surface', '--surface2', '--surface3', '--border', '--border2',
  '--text', '--text2', '--text3', '--accent', '--accent-vivid', '--accent-bg', '--accent-border'
];

let __lsThemeFastSwitchTimer = null;

function beginFastThemeSwitch() {
  const root = document.documentElement;
  root.classList.add('theme-fast-switch');
  clearTimeout(__lsThemeFastSwitchTimer);
  __lsThemeFastSwitchTimer = setTimeout(() => {
    root.classList.remove('theme-fast-switch');
  }, 180);
}

function setThemeVars(vars) {
  const root = document.documentElement;
  beginFastThemeSwitch();
  THEME_VAR_KEYS.forEach(k => root.style.removeProperty(k));
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function applyTheme(key, skipSave) {
  const theme = THEMES[key];
  if (!theme) return;
  setThemeVars(theme.vars);
  if (!skipSave) localStorage.setItem('ls-theme', key);
  localStorage.removeItem('ls-custom');
  $('.theme-preset').removeClass('active just-selected');
  const activePreset = $(`.theme-preset[data-key="${key}"]`);
  activePreset.addClass('active just-selected');
  setTimeout(() => activePreset.removeClass('just-selected'), 520);
}

function applyCustom() {
  const accent = $('#cp-accent').val();
  const bg = $('#cp-bg').val();
  const { r, g, b } = hexToRgb(accent);
  const s1 = lighten(bg, 7); const s2 = lighten(bg, 14); const s3 = lighten(bg, 22);
  setThemeVars({
    '--bg': bg,
    '--surface': s1,
    '--surface2': s2,
    '--surface3': s3,
    '--border': 'rgba(255,255,255,0.06)',
    '--border2': 'rgba(255,255,255,0.10)',
    '--accent': accent,
    '--accent-vivid': accent,
    '--accent-bg': `rgba(${r},${g},${b},0.07)`,
    '--accent-border': `rgba(${r},${g},${b},0.2)`,
  });
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
      <span id="version-badge" class="version-badge">7.0.4.1</span>
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
            <button class="theme-preset active" data-key="dark" aria-label="Use Midnight Mint theme">
              <span class="preset-preview" style="--s1:#0d0d0f;--s2:#141417;--s3:#7dd3b0;--s4:#5ecea5;--a3:rgba(125,211,176,0.42);--a4:rgba(94,206,165,0.30);">
                <span class="preset-orb"></span>
                <span class="preset-lines"><i></i><i></i><i></i></span>
              </span>
              <span class="preset-info">
                <span class="preset-label">Midnight Mint</span>
                <span class="preset-sub">clean dark + soft green</span>
              </span>
              <span class="preset-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            </button>
            <button class="theme-preset" data-key="purple" aria-label="Use Royal Violet theme">
              <span class="preset-preview" style="--s1:#0e0d14;--s2:#1e1a2a;--s3:#b08de8;--s4:#9a73e0;--a3:rgba(176,141,232,0.42);--a4:rgba(154,115,224,0.30);">
                <span class="preset-orb"></span>
                <span class="preset-lines"><i></i><i></i><i></i></span>
              </span>
              <span class="preset-info">
                <span class="preset-label">Royal Violet</span>
                <span class="preset-sub">deep purple glow</span>
              </span>
              <span class="preset-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            </button>
            <button class="theme-preset" data-key="ocean" aria-label="Use Aqua Pulse theme">
              <span class="preset-preview" style="--s1:#0a0f14;--s2:#18222e;--s3:#5bb8f5;--s4:#3aa8f0;--a3:rgba(91,184,245,0.42);--a4:rgba(58,168,240,0.30);">
                <span class="preset-orb"></span>
                <span class="preset-lines"><i></i><i></i><i></i></span>
              </span>
              <span class="preset-info">
                <span class="preset-label">Aqua Pulse</span>
                <span class="preset-sub">blue glass energy</span>
              </span>
              <span class="preset-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            </button>
            <button class="theme-preset" data-key="sunset" aria-label="Use Sunset Ember theme">
              <span class="preset-preview" style="--s1:#130d0a;--s2:#2a1b17;--s3:#f0845a;--s4:#e86a3c;--a3:rgba(240,132,90,0.42);--a4:rgba(232,106,60,0.30);">
                <span class="preset-orb"></span>
                <span class="preset-lines"><i></i><i></i><i></i></span>
              </span>
              <span class="preset-info">
                <span class="preset-label">Sunset Ember</span>
                <span class="preset-sub">warm orange fade</span>
              </span>
              <span class="preset-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
            </button>
            <button class="theme-preset" data-key="forest" aria-label="Use Emerald Night theme">
              <span class="preset-preview" style="--s1:#090e0b;--s2:#16221a;--s3:#6dd68a;--s4:#52cc72;--a3:rgba(109,214,138,0.42);--a4:rgba(82,204,114,0.30);">
                <span class="preset-orb"></span>
                <span class="preset-lines"><i></i><i></i><i></i></span>
              </span>
              <span class="preset-info">
                <span class="preset-label">Emerald Night</span>
                <span class="preset-sub">calm green forest</span>
              </span>
              <span class="preset-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
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
      <div class="card anim-card update-main-card" id="update-main-card">
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
            <button id="btn-whats-new" class="btn btn-secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/></svg>
              <span class="btn-label">What's new</span>
            </button>
          </div>
          <div id="upd-status" class="update-status hid"></div>
          <div id="upd-progress" class="update-progress hid"><span></span></div>

          <div id="update-flow" class="update-flow hid" aria-live="polite">
            <div class="update-flow-topline">
              <span class="update-flow-kicker">Update flow</span>
              <span id="update-flow-pulse-text" class="update-flow-pulse-text">Ready</span>
            </div>
            <div class="update-flow-track" aria-hidden="true">
              <span class="update-flow-fill"></span>
            </div>
            <div class="update-step-row">
              <div class="update-step" data-step="check">
                <span class="update-step-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                <span class="update-step-copy"><b>Check</b><small>GitHub release</small></span>
              </div>
              <div class="update-step" data-step="download">
                <span class="update-step-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
                <span class="update-step-copy"><b>Install</b><small>Download update</small></span>
              </div>
              <div class="update-step" data-step="restart">
                <span class="update-step-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1 1 18.36 5.64L23 10"/></svg></span>
                <span class="update-step-copy"><b>Restart</b><small>Apply changes</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project GitHub card -->
      <div class="card anim-card github-project-card" style="margin-top:12px;">
        <div class="card-label">Project GitHub</div>
        <div class="card-section">
          <div class="github-project-row">
            <div class="github-project-info">
              <div class="github-project-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span>Lyrics Status AF</span>
              </div>
              <p class="field-hint">Open the GitHub repository to view releases, source code, and project updates.</p>
            </div>
            <a class="btn btn-secondary github-project-btn" href="https://github.com/bkiaf/Lyrics-Status-af" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span class="btn-label">Open GitHub</span>
            </a>
          </div>
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



// ── v7.0.4 HOVER NO-CLIP FIX ───────────────────────────────────────────────
// Gives lifted/scaled controls breathing room so hover animations do not get
// clipped by glass cards or tight rows. Keeps button shine clipped inside the
// button itself.

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
    btnWhatsNew             = $("#btn-whats-new"),
    updCurrent              = $("#upd-current"),
    updLatest               = $("#upd-latest"),
    updStatus               = $("#upd-status"),
    updProgress             = $("#upd-progress"),
    updateMainCard          = $("#update-main-card"),
    updateFlow              = $("#update-flow"),
    updateFlowPulseText     = $("#update-flow-pulse-text"),
    updateSteps             = $(".update-step"),
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

let _tabTransitionTimer = null;
let _tabTransitionId = 0;
const TAB_ORDER = ["auth", "display", "timing", "theme", "update"];
const TAB_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TAB_MAIN_DURATION = 300;
const TAB_OUT_DURATION = 220;

function clearMotionProps($el) {
    $el.css({
        opacity: "",
        transform: "",
        filter: "",
        visibility: "",
        pointerEvents: "",
        zIndex: ""
    });
}

function clearChildMotion($tab) {
    $tab.find(".tab-header, .anim-card").css({
        opacity: "",
        transform: "",
        filter: ""
    });
}

function finishAndCancelAnimations($root) {
    $root.add($root.find(".tab-header, .anim-card")).each(function () {
        if (!this.getAnimations) return;
        this.getAnimations().forEach(anim => {
            try { if (anim.playState !== "idle" && anim.commitStyles) anim.commitStyles(); } catch (e) {}
            try { anim.cancel(); } catch (e) {}
        });
    });
}

function computedAnimState(el) {
    const cs = window.getComputedStyle(el);
    return {
        opacity: cs.opacity || "1",
        transform: cs.transform === "none" ? "translate3d(0,0,0) scale(1)" : cs.transform
    };
}

function prepCardsForEntry($tab) {
    const $header = $tab.find(".tab-header");
    const $cards = $tab.find(".anim-card");

    $header.css({ opacity: 0, transform: "translate3d(0,-6px,0)" });
    $cards.each(function (i) {
        $(this).css({
            opacity: 0,
            transform: "translate3d(0," + (10 + i * 1) + "px,0) scale(0.995)"
        });
    });
}

function animateCardsIn($tab) {
    const header = $tab.find(".tab-header")[0];
    if (header && header.animate) {
        header.animate([
            { opacity: 0, transform: "translate3d(0,-6px,0)" },
            { opacity: 1, transform: "translate3d(0,0,0)" }
        ], { duration: 220, delay: 20, easing: TAB_EASE, fill: "forwards" });
    }

    $tab.find(".anim-card").each(function (i) {
        if (!this.animate) return;
        this.animate([
            { opacity: 0, transform: "translate3d(0," + (10 + i) + "px,0) scale(0.995)" },
            { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
        ], { duration: 260, delay: 35 + i * 28, easing: TAB_EASE, fill: "forwards" });
    });
}

function animateCardsOut($tab, direction) {
    const y = -3;
    const x = direction === "next" ? -4 : 4;
    $tab.find(".anim-card").each(function (i) {
        if (!this.animate) return;
        const from = computedAnimState(this);
        this.animate([
            from,
            { opacity: 0, transform: "translate3d(" + x + "px," + y + "px,0) scale(0.998)" }
        ], { duration: 140, delay: Math.min(i * 8, 24), easing: "cubic-bezier(0.4,0,0.2,1)", fill: "forwards" });
    });
}

function fallbackSwitch($nextTab, $currentTab) {
    if ($currentTab.length) {
        $currentTab.removeClass("active tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev");
        clearMotionProps($currentTab);
        clearChildMotion($currentTab);
    }
    $nextTab.addClass("active").removeClass("tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev");
    clearMotionProps($nextTab);
    clearChildMotion($nextTab);
}

// ── SAFE TAB TRANSITION ENGINE: fixes random blank tabs/race-condition cleanup ──
let _safeTabId = 0;
let _safeTabTimer = null;
let _safeActiveTab = ($(".tab.active").first().attr("id") || "tab-auth").replace("tab-", "");

function safeCancelTabAnimations($scope) {
    $scope.add($scope.find(".tab-header, .anim-card")).each(function () {
        if (!this.getAnimations) return;
        this.getAnimations().forEach(anim => {
            try { anim.onfinish = null; anim.oncancel = null; } catch (e) {}
            try { anim.cancel(); } catch (e) {}
        });
    });
}

function safeClearChildren($tab) {
    $tab.find(".tab-header, .anim-card").css({
        opacity: "",
        transform: "",
        filter: ""
    });
}

function safeHideTab($tab) {
    if (!$tab || !$tab.length) return;
    safeCancelTabAnimations($tab);
    safeClearChildren($tab);
    $tab
        .removeClass("active tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
        .css({
            visibility: "hidden",
            opacity: 0,
            pointerEvents: "none",
            transform: "translate3d(0,12px,0) scale(0.99)",
            filter: "none",
            zIndex: 0
        });
}

function safeShowTab($tab, interactive = true) {
    if (!$tab || !$tab.length) return;
    safeCancelTabAnimations($tab);
    safeClearChildren($tab);
    $tab
        .addClass("active")
        .removeClass("tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
        .css({
            visibility: "visible",
            opacity: 1,
            pointerEvents: interactive ? "auto" : "none",
            transform: "translate3d(0,0,0) scale(1)",
            filter: "none",
            zIndex: 4
        });
}

function safePrepTabChildren($tab) {
    $tab.find(".tab-header").css({ opacity: 0, transform: "translate3d(0,-5px,0)", filter: "none" });
    $tab.find(".anim-card").each(function (i) {
        $(this).css({
            opacity: 0,
            transform: "translate3d(0," + (8 + Math.min(i, 4)) + "px,0) scale(0.996)",
            filter: "none"
        });
    });
}

function safeAnimateChildrenIn($tab, token) {
    const header = $tab.find(".tab-header")[0];
    if (header && header.animate) {
        const a = header.animate([
            { opacity: 0, transform: "translate3d(0,-5px,0)" },
            { opacity: 1, transform: "translate3d(0,0,0)" }
        ], { duration: 180, delay: 15, easing: TAB_EASE, fill: "forwards" });
        a.onfinish = () => { if (token === _safeTabId) $(header).css({ opacity: "", transform: "" }); };
    }

    $tab.find(".anim-card").each(function (i) {
        if (!this.animate) return;
        const delay = 25 + Math.min(i * 18, 72);
        const a = this.animate([
            { opacity: 0, transform: "translate3d(0," + (8 + Math.min(i, 4)) + "px,0) scale(0.996)" },
            { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
        ], { duration: 210, delay, easing: TAB_EASE, fill: "forwards" });
        a.onfinish = () => { if (token === _safeTabId) $(this).css({ opacity: "", transform: "" }); };
    });
}

function safeNormalizeTabs(keepKey) {
    const $keep = $("#tab-" + keepKey);
    $(".tab").each(function () {
        const $tab = $(this);
        if ($tab.is($keep)) safeShowTab($tab, true);
        else safeHideTab($tab);
    });
}

safeNormalizeTabs(_safeActiveTab);

$(".nav-btn").off("click").on("click", function () {
    const tab = $(this).data("tab");
    const $next = $("#tab-" + tab);
    if (!$next.length) return;

    const $currentVisible = $("#tab-" + _safeActiveTab);
    const alreadyActive = tab === _safeActiveTab && $next.hasClass("active") && $next.css("visibility") !== "hidden";
    if (alreadyActive) {
        safeShowTab($next, true);
        moveNavIndicator($(this));
        return;
    }

    const token = ++_safeTabId;
    _tabTransitionId = token;
    if (_safeTabTimer) clearTimeout(_safeTabTimer);
    if (_tabTransitionTimer) clearTimeout(_tabTransitionTimer);

    // Kill every previous tab/card animation WITHOUT commitStyles.
    // commitStyles can preserve a half-hidden frame and is what caused the random blank tab bug.
    $(".tab").each(function () { safeCancelTabAnimations($(this)); });

    const currentKey = _safeActiveTab || ($(".tab.active").first().attr("id") || "tab-auth").replace("tab-", "");
    const currentIndex = Math.max(0, TAB_ORDER.indexOf(currentKey));
    const nextIndex = Math.max(0, TAB_ORDER.indexOf(tab));
    const direction = nextIndex >= currentIndex ? "next" : "prev";
    const inX = direction === "next" ? 18 : -18;
    const outX = direction === "next" ? -10 : 10;

    $(".nav-btn").removeClass("active");
    $(this).addClass("active");
    moveNavIndicator($(this));

    $(".tab").not($currentVisible).not($next).each(function () { safeHideTab($(this)); });

    if ($currentVisible.length && !$currentVisible.is($next)) {
        $currentVisible
            .removeClass("active entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
            .addClass("tab-animating")
            .css({
                visibility: "visible",
                opacity: 1,
                pointerEvents: "none",
                transform: "translate3d(0,0,0) scale(1)",
                filter: "none",
                zIndex: 2
            });

        if ($currentVisible[0].animate) {
            const outAnim = $currentVisible[0].animate([
                { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "none" },
                { opacity: 0, transform: "translate3d(" + outX + "px,0,0) scale(0.992)", filter: "none" }
            ], { duration: 160, easing: "cubic-bezier(0.4,0,0.2,1)", fill: "forwards" });

            outAnim.onfinish = () => {
                if (token !== _safeTabId) return;
                safeHideTab($currentVisible);
            };
        } else {
            safeHideTab($currentVisible);
        }
    }

    safeCancelTabAnimations($next);
    safePrepTabChildren($next);
    $next
        .removeClass("entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
        .addClass("active tab-animating")
        .css({
            visibility: "visible",
            opacity: 0,
            pointerEvents: "none",
            transform: "translate3d(" + inX + "px,0,0) scale(0.988)",
            filter: "none",
            zIndex: 5
        });

    // Lock the start-state before starting WAAPI, preventing first-frame flashes.
    $next[0].offsetHeight;

    if (!$next[0].animate) {
        _safeActiveTab = tab;
        safeNormalizeTabs(tab);
        return;
    }

    const inAnim = $next[0].animate([
        { opacity: 0, transform: "translate3d(" + inX + "px,0,0) scale(0.988)", filter: "none" },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "none" }
    ], { duration: 240, easing: TAB_EASE, fill: "forwards" });

    safeAnimateChildrenIn($next, token);

    inAnim.onfinish = () => {
        if (token !== _safeTabId) return;
        _safeActiveTab = tab;
        safeShowTab($next, true);
        $(".tab").not($next).each(function () { safeHideTab($(this)); });
    };

    // Safety net: if WebView drops an animation finish event, normalize instead of leaving a blank page.
    _safeTabTimer = setTimeout(() => {
        if (token !== _safeTabId) return;
        _safeActiveTab = tab;
        safeShowTab($next, true);
        $(".tab").not($next).each(function () { safeHideTab($(this)); });
        _safeTabTimer = null;
    }, 420);
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
        requestAnimationFrame(() => updStatus.addClass("flash"));
    }
}

function setUpdateButtonsLoading(isLoading) {
    btnDoUpdate.toggleClass("is-loading", isLoading);
    btnCheckUpdate.toggleClass("is-loading", isLoading && btnDoUpdate.hasClass("hid"));
}

const UPDATE_FLOW_STEPS = ["check", "download", "restart"];
let _lastUpdateFlowStage = "check";
let _updateFlowShowFrameA = null;
let _updateFlowShowFrameB = null;
let _updateFlowHideTimer = null;
let _updateFlowFinishHideTimer = null;

function revealUpdateFlowSmooth() {
    clearTimeout(_updateFlowHideTimer);
    clearTimeout(_updateFlowFinishHideTimer);
    if (_updateFlowShowFrameA) cancelAnimationFrame(_updateFlowShowFrameA);
    if (_updateFlowShowFrameB) cancelAnimationFrame(_updateFlowShowFrameB);

    updateFlow.removeClass("hid is-visible is-hiding").addClass("is-preparing");

    if (updateFlow[0]) void updateFlow[0].offsetHeight;

    _updateFlowShowFrameA = requestAnimationFrame(() => {
        _updateFlowShowFrameB = requestAnimationFrame(() => {
            updateFlow.removeClass("is-preparing is-hiding").addClass("is-visible");
        });
    });
}

function hideUpdateFlowSmooth(delay) {
    clearTimeout(_updateFlowHideTimer);
    clearTimeout(_updateFlowFinishHideTimer);
    _updateFlowHideTimer = setTimeout(() => {
        if (updateMainCard.hasClass("is-checking") || updateMainCard.hasClass("is-updating")) return;

        updateFlow.removeClass("is-visible is-preparing").addClass("is-hiding");
        _updateFlowFinishHideTimer = setTimeout(() => {
            if (!updateMainCard.hasClass("is-checking") && !updateMainCard.hasClass("is-updating")) {
                updateFlow
                    .addClass("hid")
                    .removeClass("is-hiding stage-check stage-ready stage-download stage-restart stage-done stage-error");
            }
        }, 620);
    }, delay || 0);
}

function setUpdateFlow(stage, message) {
    stage = stage || "check";
    _lastUpdateFlowStage = stage === "ready" ? "check" : (stage === "done" ? "restart" : (stage === "error" ? _lastUpdateFlowStage : stage));

    updateFlow
        .removeClass("stage-check stage-ready stage-download stage-restart stage-done stage-error")
        .addClass("stage-" + stage);

    revealUpdateFlowSmooth();

    updateMainCard
        .removeClass("is-checking is-ready is-updating is-done is-error")
        .addClass(stage === "check" ? "is-checking" : "")
        .addClass(stage === "ready" ? "is-ready" : "")
        .addClass(stage === "download" || stage === "restart" ? "is-updating" : "")
        .addClass(stage === "done" ? "is-done" : "")
        .addClass(stage === "error" ? "is-error" : "");

    updateFlowPulseText.text(message || "Working...");

    const activeStep = stage === "ready" ? "" : (stage === "done" ? "" : (stage === "error" ? _lastUpdateFlowStage : stage));
    const doneUntil = stage === "ready" ? 0 : (stage === "download" ? 0 : (stage === "restart" ? 1 : (stage === "done" ? 2 : -1)));

    updateSteps.each(function(index) {
        const $step = $(this);
        const key = String($step.data("step"));
        $step.removeClass("active done error idle just-changed");

        if (stage === "error" && key === activeStep) {
            $step.addClass("error just-changed");
        } else if (index <= doneUntil) {
            $step.addClass("done");
        } else if (key === activeStep) {
            $step.addClass("active just-changed");
        } else {
            $step.addClass("idle");
        }
    });
}

function hideUpdateFlowSoon() {
    hideUpdateFlowSmooth(4200);
}

enableAutoupdateChk.change(() => {
    settings.update.enableAutoupdate = enableAutoupdateChk.prop("checked");
    saveSettings();
});

btnCheckUpdate.click(async () => {
    const lbl = btnCheckUpdate.find(".btn-label");
    lbl.text("Checking...");
    btnCheckUpdate.addClass("is-loading is-checking");
    setUpdateFlow("check", "Checking GitHub for the latest release...");
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

        const hasUpdate = !!data.hasUpdate || versionIsGreater(data.latest, data.current);

        if (hasUpdate) {
            updLatest.addClass("has-update");
            _pendingDownloadUrl = data.downloadUrl;
            btnDoUpdate.removeClass("hid");
            updateNavDot.removeClass("hid");

            setUpdateFlow("ready", "Update found. Ready to install.");

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
            setUpdateFlow("done", "Everything is already up to date.");
            setUpdStatus("You're up to date (" + data.current + ")", "success", false);
            hideUpdateFlowSoon();
        }
    } catch(e) {
        setUpdateFlow("error", "Check failed. Try again.");
        setUpdStatus("Error: " + e.message, "error", false);
    } finally {
        lbl.text("Check for updates");
        btnCheckUpdate.removeClass("is-loading is-checking");
        btnCheckUpdate.prop("disabled", false);
    }
});

btnDoUpdate.click(async () => {
    if (!_pendingDownloadUrl) return;

    const lbl = btnDoUpdate.find(".btn-label");
    lbl.text("Updating...");
    btnDoUpdate.addClass("is-loading is-updating");
    setUpdateFlow("download", "Downloading and installing the update...");
    btnDoUpdate.prop("disabled", true);
    btnCheckUpdate.prop("disabled", true);
    setUpdStatus("Preparing update...", "info", true);

    try {
        const res = await fetch("/api/do-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ downloadUrl: _pendingDownloadUrl })
        });

        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Failed to start update");

        setUpdateFlow("restart", "Finishing up. The app will restart automatically...");
        setUpdStatus("Update started. Please keep this window open...", "info", true);
    } catch(e) {
        setUpdateFlow("error", "Update failed. Nothing was changed.");
        setUpdStatus("Error: " + e.message, "error", false);
        btnDoUpdate.removeClass("is-loading is-updating");
        btnDoUpdate.prop("disabled", false);
        btnCheckUpdate.prop("disabled", false);
        lbl.text("Update now");
    }
});


// ─── WHAT'S NEW POPUP ────────────────────────────────────────────────────────
// Pulls release notes from GitHub through /api/check-update and shows them
// after the app is on the latest version. CSS lives in panel.css, not JS.
const WHATS_NEW_DISMISSED_VERSION_KEY = "ls-whats-new-dismissed-version";
let _whatsNewVersion = "";
let _whatsNewAutoTimer = null;

function normalizeReleaseVersion(version) {
    return String(version || "").trim().replace(/^v/i, "");
}

function versionIsGreater(a, b) {
    const parse = (v) => normalizeReleaseVersion(v)
        .split(/[.\-+]/)
        .map(part => {
            const m = String(part).match(/\d+/);
            return m ? parseInt(m[0], 10) : 0;
        });
    const aa = parse(a);
    const bb = parse(b);
    const len = Math.max(aa.length, bb.length);
    for (let i = 0; i < len; i++) {
        const av = aa[i] || 0;
        const bv = bb[i] || 0;
        if (av !== bv) return av > bv;
    }
    return false;
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function inlineReleaseMarkdown(value) {
    let html = escapeHTML(value);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    return html;
}

function renderReleaseNotes(markdown) {
    const raw = String(markdown || "").replace(/\r\n/g, "\n").trim();
    if (!raw) {
        return '<p>No release notes were published for this GitHub release yet.</p>';
    }

    const lines = raw.split("\n");
    let html = "";
    let inList = false;
    let inOrderedList = false;

    function closeLists() {
        if (inList) { html += "</ul>"; inList = false; }
        if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
    }

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            closeLists();
            continue;
        }

        const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            closeLists();
            html += "<h3>" + inlineReleaseMarkdown(heading[2]) + "</h3>";
            continue;
        }

        const bullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (bullet) {
            if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
            if (!inList) { html += "<ul>"; inList = true; }
            html += "<li>" + inlineReleaseMarkdown(bullet[1]) + "</li>";
            continue;
        }

        const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
        if (ordered) {
            if (inList) { html += "</ul>"; inList = false; }
            if (!inOrderedList) { html += "<ol>"; inOrderedList = true; }
            html += "<li>" + inlineReleaseMarkdown(ordered[1]) + "</li>";
            continue;
        }

        closeLists();
        html += "<p>" + inlineReleaseMarkdown(trimmed) + "</p>";
    }

    closeLists();
    return html;
}

function ensureWhatsNewPopup() {
    if ($("#whats-new-backdrop").length) return;

    $(
        '<div id="whats-new-backdrop" class="whats-new-backdrop" aria-hidden="true">' +
            '<div class="whats-new-modal" role="dialog" aria-modal="true" aria-labelledby="whats-new-title">' +
                '<div class="whats-new-glow"></div>' +
                '<div class="whats-new-top">' +
                    '<div class="whats-new-badge" aria-hidden="true">✦</div>' +
                    '<button id="whats-new-close" class="whats-new-close" aria-label="Close">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' +
                '</div>' +
                '<div class="whats-new-copy">' +
                    '<div class="whats-new-kicker">GitHub release notes</div>' +
                    '<h2 id="whats-new-title">What\'s new</h2>' +
                    '<p id="whats-new-subtitle">Fresh changes are ready.</p>' +
                '</div>' +
                '<div id="whats-new-notes" class="whats-new-notes"></div>' +
                '<label class="whats-new-check-row" aria-label="Don\'t show this again until the next update">' +
                    '<input type="checkbox" id="whats-new-dismiss-check">' +
                    '<span class="whats-new-check-ui" aria-hidden="true"></span>' +
                    '<span class="whats-new-check-copy">' +
                        '<span class="whats-new-check-title">Don\'t show this again</span>' +
                        '<span class="whats-new-check-subtitle">Until the next update</span>' +
                    '</span>' +
                '</label>' +
                '<div class="whats-new-actions">' +
                    '<button id="whats-new-open-updates" class="btn btn-secondary">Open Updates</button>' +
                    '<button id="whats-new-got-it" class="btn btn-primary">Got it</button>' +
                '</div>' +
            '</div>' +
        '</div>'
    ).appendTo(document.body);

    $(document)
        .off("click.whatsNewClose")
        .on("click.whatsNewClose", "#whats-new-close, #whats-new-got-it", closeWhatsNewPopup)
        .on("click.whatsNewBackdrop", "#whats-new-backdrop", function (event) {
            if (event.target === this) closeWhatsNewPopup();
        })
        .on("click.whatsNewOpenUpdates", "#whats-new-open-updates", function () {
            closeWhatsNewPopup(false);
            const btn = $('.nav-btn[data-tab="update"]');
            if (btn.length) btn.trigger("click");
        })
        .on("keydown.whatsNewEsc", function (event) {
            if (event.key === "Escape" && $("#whats-new-backdrop").hasClass("show")) {
                closeWhatsNewPopup();
            }
        });
}

function openWhatsNewPopup(releaseInfo, force) {
    ensureWhatsNewPopup();

    const version = releaseInfo.latest || releaseInfo.current || $("#version-badge").text() || "";
    const normalized = normalizeReleaseVersion(version);
    if (!force && localStorage.getItem(WHATS_NEW_DISMISSED_VERSION_KEY) === normalized) return;

    _whatsNewVersion = normalized;

    const published = releaseInfo.publishedAt
        ? "Published " + new Date(releaseInfo.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "Loaded from GitHub";

    $("#whats-new-title").text("What's new in " + (version || "this update"));
    $("#whats-new-subtitle").text(published + ". These notes come from the latest GitHub release.");
    $("#whats-new-notes").html(renderReleaseNotes(releaseInfo.releaseNotes || ""));
    $("#whats-new-dismiss-check").prop("checked", false);

    const backdrop = $("#whats-new-backdrop");
    const modal = backdrop.find(".whats-new-modal");
    const notes = $("#whats-new-notes");

    notes.scrollTop(0);

    // Reset first so the hidden CSS state gets painted before the pop class is added.
    backdrop
        .attr("aria-hidden", "true")
        .removeClass("show closing");
    modal.removeClass("pop-ready").css("animation", "none");
    $(document.body).addClass("whats-new-open");

    // Force layout twice; this makes the entrance animation replay reliably
    // even when the popup DOM already exists from a previous open.
    if (backdrop[0]) backdrop[0].offsetHeight;
    if (modal[0]) modal[0].offsetHeight;

    setTimeout(() => {
        modal.css("animation", "");
        backdrop.attr("aria-hidden", "false");

        if (backdrop[0]) backdrop[0].offsetHeight;
        if (modal[0]) modal[0].offsetHeight;

        requestAnimationFrame(() => {
            modal.addClass("pop-ready");
            backdrop.addClass("show");
        });
    }, 40);

    setTimeout(() => $("#whats-new-got-it").trigger("focus"), 620);
}

function closeWhatsNewPopup(saveDismiss) {
    const shouldSave = saveDismiss !== false && $("#whats-new-dismiss-check").prop("checked") && _whatsNewVersion;
    if (shouldSave) {
        localStorage.setItem(WHATS_NEW_DISMISSED_VERSION_KEY, _whatsNewVersion);
    }

    const backdrop = $("#whats-new-backdrop");
    const modal = backdrop.find(".whats-new-modal");

    backdrop.removeClass("show").addClass("closing");
    modal.removeClass("pop-ready");

    setTimeout(() => {
        backdrop.attr("aria-hidden", "true").removeClass("closing show");
        $(document.body).removeClass("whats-new-open");
    }, 240);
}

async function loadWhatsNewFromGitHub(force) {
    try {
        const res = await fetch("/api/check-update", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Could not load GitHub release notes");

        updCurrent.text(data.current || updCurrent.text() || "?");
        updLatest.text(data.latest || updLatest.text() || "?");

        const hasUpdate = !!data.hasUpdate || versionIsGreater(data.latest, data.current);
        if (!force && hasUpdate) {
            return;
        }

        openWhatsNewPopup(data, !!force);
    } catch (e) {
        if (force) setUpdStatus("Error: " + e.message, "error", false);
    }
}

function scheduleWhatsNewPopup() {
    clearTimeout(_whatsNewAutoTimer);
    _whatsNewAutoTimer = setTimeout(() => loadWhatsNewFromGitHub(false), 1350);
}

btnWhatsNew.click(() => loadWhatsNewFromGitHub(true));
scheduleWhatsNewPopup();

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
            } else if (data.type === "force_reload") {
                setTimeout(() => window.location.reload(), 120);
            } else if (data.type === "update_progress") {
                setUpdateFlow("download", data.message || "Installing update...");
                setUpdStatus(data.message, "info", true);
            } else if (data.type === "update_done") {
                setUpdateFlow("done", data.message || "Update complete. Restarting...");
                setUpdStatus(data.message, "success", false);
                hideUpdateFlowSoon();
                try { localStorage.removeItem(WHATS_NEW_DISMISSED_VERSION_KEY); } catch (e) {}
                updateNavDot.addClass("hid");
                btnDoUpdate.addClass("hid").removeClass("is-loading is-updating");
                btnCheckUpdate.removeClass("is-loading is-checking").prop("disabled", false);
                btnDoUpdate.find(".btn-label").text("Update now");
            } else if (data.type === "update_error") {
                setUpdateFlow("error", data.message || "Update failed. Nothing was changed.");
                setUpdStatus("Error: " + data.message, "error", false);
                btnDoUpdate.removeClass("is-loading is-updating");
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


// ── v7.0.4 RAPID-SMOOTH TAB MOTION PATCH ────────────────────────────────────
// Keeps the luxe look, but makes fast menu switching continue from the current
// frame instead of restarting from a fixed start point.

(function rapidSmoothTabsV703() {
    const ORDER = ["auth", "display", "timing", "theme", "update"];
    const IN_EASE = "cubic-bezier(0.16, 0.96, 0.18, 1)";
    const OUT_EASE = "cubic-bezier(0.28, 0.72, 0.24, 1)";
    let token = 0;
    let settleTimer = null;
    let currentTarget = ($(".tab.active").first().attr("id") || "tab-auth").replace("tab-", "");
    let lastNavTime = 0;

    function cancelAnimations(el, includeChildren = true) {
        if (!el) return;
        const list = [];
        if (el.getAnimations) {
            try { list.push(...el.getAnimations()); } catch (e) {}
        }
        if (includeChildren) $(el).find(".tab-header, .anim-card").each(function () {
            if (!this.getAnimations) return;
            try { list.push(...this.getAnimations()); } catch (e) {}
        });
        list.forEach(a => {
            try { a.onfinish = null; a.oncancel = null; } catch (e) {}
            try { a.cancel(); } catch (e) {}
        });
    }

    function currentFrame($el) {
        if (!$el || !$el.length) {
            return { opacity: 0, transform: "translate3d(0,0,0) scale(1)" };
        }
        const cs = window.getComputedStyle($el[0]);
        return {
            opacity: Number.isFinite(parseFloat(cs.opacity)) ? parseFloat(cs.opacity) : 0,
            transform: cs.transform && cs.transform !== "none" ? cs.transform : "translate3d(0,0,0) scale(1)"
        };
    }

    function freezeElement($el) {
        if (!$el || !$el.length) return currentFrame($el);
        const frame = currentFrame($el);
        cancelAnimations($el[0], false);
        $el.css({
            visibility: "visible",
            opacity: frame.opacity,
            transform: frame.transform,
            filter: "none",
            pointerEvents: "none"
        });
        return frame;
    }

    function freezeChildren($tab) {
        $tab.find(".tab-header, .anim-card").each(function () {
            const $child = $(this);
            const st = currentFrame($child);
            if (this.getAnimations) {
                try { this.getAnimations().forEach(a => { a.onfinish = null; a.oncancel = null; a.cancel(); }); } catch (e) {}
            }
            $child.css({ opacity: st.opacity, transform: st.transform, filter: "none" });
        });
    }

    function clearChildren($tab) {
        $tab.find(".tab-header, .anim-card").css({ opacity: "", transform: "", filter: "" });
    }

    function hideTab($tab) {
        if (!$tab || !$tab.length) return;
        cancelAnimations($tab[0]);
        clearChildren($tab);
        $tab
            .removeClass("active tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
            .css({
                visibility: "hidden",
                opacity: 0,
                pointerEvents: "none",
                transform: "translate3d(0,10px,0) scale(0.992)",
                filter: "none",
                zIndex: 0
            });
    }

    function showTab($tab) {
        if (!$tab || !$tab.length) return;
        cancelAnimations($tab[0]);
        clearChildren($tab);
        $tab
            .addClass("active")
            .removeClass("tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
            .css({
                visibility: "visible",
                opacity: 1,
                pointerEvents: "auto",
                transform: "translate3d(0,0,0) scale(1)",
                filter: "none",
                zIndex: 4
            });
    }

    function isMoving($tab) {
        if (!$tab || !$tab.length || !$tab[0].getAnimations) return false;
        try { return $tab[0].getAnimations().some(a => a.playState === "running" || a.playState === "pending"); }
        catch (e) { return false; }
    }

    function isVisibleEnough($tab) {
        if (!$tab || !$tab.length) return false;
        const cs = window.getComputedStyle($tab[0]);
        return cs.visibility !== "hidden" || parseFloat(cs.opacity || "0") > 0.02 || isMoving($tab);
    }

    function animateChildrenIn($tab, id, wasAlreadyVisible, rapid) {
        const header = $tab.find(".tab-header")[0];
        const childDuration = rapid ? 190 : 335;
        const headerDuration = rapid ? 175 : 305;
        const baseDelay = wasAlreadyVisible ? 0 : (rapid ? 6 : 24);

        if (header && header.animate) {
            const $h = $(header);
            const from = wasAlreadyVisible ? currentFrame($h) : { opacity: 0, transform: "translate3d(0,-5px,0)" };
            $h.css({ opacity: from.opacity, transform: from.transform });
            const a = header.animate([
                from,
                { opacity: 1, transform: "translate3d(0,0,0)" }
            ], { duration: headerDuration, delay: baseDelay, easing: IN_EASE, fill: "forwards" });
            a.onfinish = () => { if (id === token) $h.css({ opacity: "", transform: "" }); };
        }

        $tab.find(".anim-card").each(function (i) {
            if (!this.animate) return;
            const $card = $(this);
            const delay = wasAlreadyVisible ? 0 : baseDelay + (rapid ? Math.min(i * 8, 34) : Math.min(i * 20, 92));
            const from = wasAlreadyVisible
                ? currentFrame($card)
                : { opacity: 0, transform: "translate3d(0," + (10 + Math.min(i * 2, 8)) + "px,0) scale(0.992)" };
            $card.css({ opacity: from.opacity, transform: from.transform });
            const a = this.animate([
                from,
                { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
            ], { duration: childDuration, delay, easing: IN_EASE, fill: "forwards" });
            a.onfinish = () => { if (id === token) $card.css({ opacity: "", transform: "" }); };
        });
    }

    function normalize(keep) {
        const $keep = $("#tab-" + keep);
        $(".tab").each(function () {
            const $tab = $(this);
            if ($tab.is($keep)) showTab($tab);
            else hideTab($tab);
        });
        currentTarget = keep;
    }

    normalize(currentTarget);

    $(".nav-btn").off("click.rapidSmooth click").on("click.rapidSmooth", function () {
        const tab = $(this).data("tab");
        const $next = $("#tab-" + tab);
        if (!tab || !$next.length) return;

        const now = performance.now ? performance.now() : Date.now();
        const rapid = now - lastNavTime < 285;
        lastNavTime = now;

        const $activeBtn = $(this);
        const noMotionNeeded = tab === currentTarget && $next.hasClass("active") && !isMoving($next);
        if (noMotionNeeded) {
            showTab($next);
            $(".nav-btn").removeClass("active");
            $activeBtn.addClass("active");
            moveNavIndicator($activeBtn);
            return;
        }

        const id = ++token;
        if (settleTimer) clearTimeout(settleTimer);
        if (typeof _safeTabTimer !== "undefined" && _safeTabTimer) clearTimeout(_safeTabTimer);
        if (typeof _tabTransitionTimer !== "undefined" && _tabTransitionTimer) clearTimeout(_tabTransitionTimer);

        const fromIndex = Math.max(0, ORDER.indexOf(currentTarget));
        const toIndex = Math.max(0, ORDER.indexOf(tab));
        const direction = toIndex >= fromIndex ? "next" : "prev";
        const inX = direction === "next" ? 24 : -24;
        const outX = direction === "next" ? -14 : 14;
        const inDuration = rapid ? 205 : 370;
        const outDuration = rapid ? 140 : 235;

        $(".nav-btn").removeClass("active");
        $activeBtn.addClass("active");
        moveNavIndicator($activeBtn);

        const targetWasVisible = isVisibleEnough($next);

        // Freeze everything exactly where it is first, so rapid clicks continue smoothly.
        $(".tab").each(function () {
            const $tab = $(this);
            if (isVisibleEnough($tab) || $tab.is($next)) {
                freezeElement($tab);
                freezeChildren($tab);
            }
        });

        $(".tab").not($next).each(function () {
            const $tab = $(this);
            if (!isVisibleEnough($tab)) { hideTab($tab); return; }
            const from = currentFrame($tab);
            $tab
                .removeClass("active entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
                .addClass("tab-animating")
                .css({ visibility: "visible", pointerEvents: "none", zIndex: 2, filter: "none" });

            if (this.animate) {
                const a = this.animate([
                    from,
                    { opacity: 0, transform: "translate3d(" + outX + "px,-3px,0) scale(0.990)", filter: "none" }
                ], { duration: outDuration, easing: OUT_EASE, fill: "forwards" });
                a.onfinish = () => { if (id === token) hideTab($tab); };
            } else {
                hideTab($tab);
            }
        });

        let nextFrom;
        if (targetWasVisible) {
            nextFrom = currentFrame($next);
        } else {
            nextFrom = { opacity: 0, transform: "translate3d(" + inX + "px,4px,0) scale(0.988)" };
            $next.css(nextFrom);
            freezeChildren($next);
        }

        $next
            .addClass("active tab-animating")
            .removeClass("entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
            .css({
                visibility: "visible",
                pointerEvents: "none",
                opacity: nextFrom.opacity,
                transform: nextFrom.transform,
                filter: "none",
                zIndex: 5
            });

        // Force the start frame before playback; prevents flash and makes reversal smooth.
        $next[0].offsetHeight;

        if (!$next[0].animate) {
            normalize(tab);
            return;
        }

        const inAnim = $next[0].animate([
            nextFrom,
            { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "none" }
        ], { duration: inDuration, easing: IN_EASE, fill: "forwards" });

        animateChildrenIn($next, id, targetWasVisible, rapid);
        currentTarget = tab;
        if (typeof _safeActiveTab !== "undefined") _safeActiveTab = tab;
        if (typeof _safeTabId !== "undefined") _safeTabId = id;
        if (typeof _tabTransitionId !== "undefined") _tabTransitionId = id;

        inAnim.onfinish = () => {
            if (id !== token) return;
            normalize(tab);
        };

        settleTimer = setTimeout(() => {
            if (id !== token) return;
            normalize(tab);
            settleTimer = null;
        }, inDuration + 120);
    });
})();


// ── v7.0.4 EXTRA MOTION + AF HOVER SMOOTH PATCH ─────────────────────────────
// Adds richer transform/opacity-only motion and smooth AF logo hover movement.

(function afHoverMotionV703() {
    let raf = null;
    let lastBrand = null;

    function setVars(el, x, y, r) {
        el.style.setProperty("--af-x", x.toFixed(2) + "px");
        el.style.setProperty("--af-y", y.toFixed(2) + "px");
        el.style.setProperty("--af-r", r.toFixed(2) + "deg");
    }

    $(document).on("mousemove.afHoverV703", ".brand", function (ev) {
        const icon = this.querySelector(".brand-icon");
        if (!icon) return;
        lastBrand = this;
        const rect = this.getBoundingClientRect();
        const px = ((ev.clientX - rect.left) / rect.width - 0.5);
        const py = ((ev.clientY - rect.top) / rect.height - 0.5);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            setVars(icon, px * 4.2, py * 3.2, px * 3.4);
            raf = null;
        });
    });

    $(document).on("mouseleave.afHoverV703", ".brand", function () {
        const icon = this.querySelector(".brand-icon");
        if (!icon) return;
        if (raf) cancelAnimationFrame(raf);
        setVars(icon, 0, 0, 0);
        lastBrand = null;
    });

    $(document).on("click.afPulseV703", ".nav-btn, .theme-preset, .btn", function () {
        const brand = document.querySelector(".brand");
        if (!brand) return;
        brand.classList.remove("af-soft-pulse");
        void brand.offsetWidth;
        brand.classList.add("af-soft-pulse");
        clearTimeout(window.__afSoftPulseTimerV703);
        window.__afSoftPulseTimerV703 = setTimeout(() => brand.classList.remove("af-soft-pulse"), 680);
    });
})();

// ── v7.0.4 AF LOGO SMOOTH SCALE ENTER/LEAVE PATCH ─────────────────────────
// Keeps the AF logo visual style, but makes mouse enter/leave scale smoothly
// without keyframe snapping on hover-out.

(function afSmoothScaleEnterLeaveV703() {
    let leaveTimer = null;

    $(document)
      .off("mouseenter.afScaleEnterLeaveV703 mouseleave.afScaleEnterLeaveV703", ".brand")
      .on("mouseenter.afScaleEnterLeaveV703", ".brand", function () {
          clearTimeout(leaveTimer);
          this.classList.remove("af-leaving");
          this.classList.add("af-hovering");
      })
      .on("mouseleave.afScaleEnterLeaveV703", ".brand", function () {
          const brand = this;
          clearTimeout(leaveTimer);
          brand.classList.remove("af-hovering");
          brand.classList.add("af-leaving");
          leaveTimer = setTimeout(() => brand.classList.remove("af-leaving"), 760);
      });
})();



// ── v7.0.4 FINAL CONTROL EDGE / NO-CUT FIX ────────────────────────────────
// Fixes controls that looked eaten/cropped even before hover by removing paint
// containment and negative breathing-space margins from the previous hover fix.


// ── v7.0.4 CLEAN OUTLINE / REMOVE SETTINGS BOX PATCH ─────────────────────
// Removes the heavy square fill around setting groups while keeping the clean border.
// Keeps the controls, hover motion, and glass/luxe feel without the boxy rectangle.
// ── v7.0.4 GLOBAL RANDOM REFLECTION BUG FIX ──────────────────────────────
// Bug-only fix: the random reflection was caused by global decorative overlay
// layers being blended/repainted through the glass UI in the embedded WebView.
// This keeps the UI, cards, themes, blur, and animations as-is; it only removes
// the unstable overlay layers that were showing up randomly across all tabs.

// ── v7.0.4 GLOBAL AUTH-STYLE UI UNIFICATION PATCH ─────────────────────────
// Make the whole app follow the same clean style seen in the Authentication
// page: rounded section cards, soft dark gradients, subtle borders, and tidy
// inputs/buttons without changing app logic.

// ── v7.0.4 MORE TRANSPARENT UI + GLASS SIDEBAR PATCH ─────────────────────

// ── v7.0.4 SIDEBAR / CONTENT GAP FIX ──────────────────────────────────────

// ── v7.0.4 SIDEBAR GAP FIX V2 (LEFT-ALIGNED CONTENT) ──────────────────────

// ── v7.0.4 HARD LEFT ALIGN PATCH ──────────────────────────────────────────
// Force the content panel to start immediately after the fixed sidebar.

// ── v7.0.4 TAB SWITCH BLANK GUARD PATCH ───────────────────────────────────
// Keeps the tight sidebar layout, but prevents tab panels from ending hidden
// after a menu switch.

(function tabSwitchBlankGuardV703() {
  const TAB_CLASSES = "active tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev";
  let guardTimerA = null;
  let guardTimerB = null;

  function cancelPanelAnimations($tab) {
    if (!$tab || !$tab.length) return;
    $tab.add($tab.find(".tab-header, .anim-card")).each(function () {
      if (!this.getAnimations) return;
      try {
        this.getAnimations().forEach(a => {
          try { a.onfinish = null; a.oncancel = null; } catch (e) {}
          try { a.cancel(); } catch (e) {}
        });
      } catch (e) {}
    });
  }

  function isActuallyBlank($tab) {
    if (!$tab || !$tab.length) return true;
    const el = $tab[0];
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return cs.display === "none" || cs.visibility === "hidden" || rect.width < 8 || rect.height < 8;
  }

  function forceVisibleTab(tabKey) {
    const $target = $("#tab-" + tabKey);
    if (!$target.length) return;

    $(".tab").each(function () {
      const $tab = $(this);
      cancelPanelAnimations($tab);
      $tab.find(".tab-header, .anim-card").css({ opacity: "", transform: "", filter: "" });

      if ($tab.is($target)) {
        $tab
          .addClass("active")
          .removeClass("tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev")
          .css({
            display: "block",
            visibility: "visible",
            opacity: 1,
            pointerEvents: "auto",
            transform: "translate3d(0,0,0) scale(1)",
            filter: "none",
            zIndex: 5
          });
      } else {
        $tab
          .removeClass(TAB_CLASSES)
          .css({
            display: "none",
            visibility: "hidden",
            opacity: 0,
            pointerEvents: "none",
            transform: "translate3d(0,0,0) scale(1)",
            filter: "none",
            zIndex: 0
          });
      }
    });

    if (typeof currentTarget !== "undefined") currentTarget = tabKey;
    if (typeof _safeActiveTab !== "undefined") _safeActiveTab = tabKey;
    $(".nav-btn").removeClass("active");
    const $btn = $('.nav-btn[data-tab="' + tabKey + '"]');
    $btn.addClass("active");
    if (typeof moveNavIndicator === "function") moveNavIndicator($btn);
  }

  function guard(tabKey) {
    const $target = $("#tab-" + tabKey);
    if (!$target.length) return;
    if (isActuallyBlank($target) || !$(".tab.active").length) {
      forceVisibleTab(tabKey);
    }
  }

  $(document)
    .off("click.tabBlankGuard703")
    .on("click.tabBlankGuard703", ".nav-btn", function () {
      const tabKey = $(this).data("tab");
      if (!tabKey) return;

      clearTimeout(guardTimerA);
      clearTimeout(guardTimerB);

      // Early guard only fixes display/visibility failure. It does not interrupt
      // a valid opacity animation.
      guardTimerA = setTimeout(() => guard(tabKey), 80);

      // Final guard catches WebView animation cleanup races that leave the panel
      // hidden after switching tabs.
      guardTimerB = setTimeout(() => guard(tabKey), 620);
    });
})();

// ── v7.0.4 MENU CONTENT VISIBLE GRID FIX ──────────────────────────────────
// The hard left-align patch made .content display:block, so hidden tab panels
// stayed in normal document flow and pushed the newly selected panel down.
// Keep the tight sidebar spacing, but restore the overlapping grid stack.

(function menuContentVisibleGridFix703() {
  function restoreGridAndActive(tabKey) {
    if (window.matchMedia && !window.matchMedia("(min-width: 761px)").matches) return;

    const $content = $(".content");
    $content.css({
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "auto",
      alignContent: "start",
      justifyItems: "start"
    });

    const key = tabKey || ($(".nav-btn.active").data("tab") || "auth");
    const $target = $("#tab-" + key);
    if (!$target.length) return;

    // If an older cleanup left the new tab hidden, normalize only after the
    // animation has had a chance to play.
    setTimeout(function () {
      const el = $target[0];
      const cs = window.getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity || "0") < 0.01) {
        $(".tab").not($target).removeClass("active tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev").css({
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 0
        });
        $target.addClass("active").removeClass("tab-animating entering leaving exiting-next exiting-prev pre-enter-next pre-enter-prev").css({
          display: "block",
          visibility: "visible",
          opacity: 1,
          pointerEvents: "auto",
          transform: "translate3d(0,0,0) scale(1)",
          filter: "none",
          zIndex: 5
        });
      }
    }, 520);
  }

  restoreGridAndActive();
  $(window).off("resize.menuContentGrid703").on("resize.menuContentGrid703", function () { restoreGridAndActive(); });
  $(document)
    .off("click.menuContentGrid703")
    .on("click.menuContentGrid703", ".nav-btn", function () {
      restoreGridAndActive($(this).data("tab"));
      setTimeout(() => restoreGridAndActive($(this).data("tab")), 40);
    });
})();

// ── v7.0.4 SILKY UPDATE STAGES MOTION PATCH ───────────────────────────────
// Adds smoother enter/exit/morph classes for Check / Install / Restart.
(function silkyUpdateStagesMotion703() {
  if (typeof setUpdateFlow !== "function" || typeof hideUpdateFlowSmooth !== "function") return;

  const originalSetUpdateFlow = setUpdateFlow;
  let cleanupTimer = null;
  let pulseTimer = null;

  function activeStageKey(stage) {
    if (stage === "done") return "restart";
    if (stage === "ready") return "check";
    if (stage === "error") return String(_lastUpdateFlowStage || "check");
    return stage || "check";
  }

  setUpdateFlow = function silkySetUpdateFlow(stage, message) {
    const beforeKey = String(updateSteps.filter(".active,.error").first().data("step") || "");
    updateSteps.removeClass("step-entering step-leaving");

    if (beforeKey) {
      updateSteps.filter('[data-step="' + beforeKey + '"]').addClass("step-leaving");
    }

    originalSetUpdateFlow(stage, message);

    const afterKey = activeStageKey(stage);
    const target = updateSteps.filter('[data-step="' + afterKey + '"]');

    clearTimeout(cleanupTimer);
    clearTimeout(pulseTimer);

    if (updateFlow[0]) void updateFlow[0].offsetWidth;

    requestAnimationFrame(function () {
      updateFlow.removeClass("flow-soft-pulse");
      if (updateFlow[0]) void updateFlow[0].offsetWidth;
      updateFlow.addClass("flow-soft-pulse");

      target.addClass("step-entering");

      cleanupTimer = setTimeout(function () {
        updateSteps.removeClass("step-entering step-leaving");
      }, 860);

      pulseTimer = setTimeout(function () {
        updateFlow.removeClass("flow-soft-pulse");
      }, 700);
    });
  };

  hideUpdateFlowSmooth = function silkyHideUpdateFlowSmooth(delay) {
    clearTimeout(_updateFlowHideTimer);
    clearTimeout(_updateFlowFinishHideTimer);
    _updateFlowHideTimer = setTimeout(function () {
      if (updateMainCard.hasClass("is-checking") || updateMainCard.hasClass("is-updating")) return;

      updateFlow.removeClass("is-visible is-preparing flow-soft-pulse").addClass("is-hiding");
      updateSteps.removeClass("step-entering").addClass("step-leaving");

      _updateFlowFinishHideTimer = setTimeout(function () {
        if (!updateMainCard.hasClass("is-checking") && !updateMainCard.hasClass("is-updating")) {
          updateFlow
            .addClass("hid")
            .removeClass("is-hiding stage-check stage-ready stage-download stage-restart stage-done stage-error");
          updateSteps.removeClass("step-entering step-leaving");
        }
      }, 920);
    }, delay || 0);
  };
})();
