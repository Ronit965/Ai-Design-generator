/**
 * Generates HTML and CSS code snippets based on the design prompt and style.
 * These are realistic code examples that simulate what an AI model would generate.
 */

const colorPalettes = {
  modern: {
    bg: '#0f0f1a',
    card: '#1a1a2e',
    accent: '#7c5cfc',
    text: '#f0f0f5',
    textSub: '#a0a0b8',
  },
  minimal: {
    bg: '#fafafa',
    card: '#ffffff',
    accent: '#111111',
    text: '#1a1a1a',
    textSub: '#666666',
  },
  bold: {
    bg: '#0a0a0a',
    card: '#141414',
    accent: '#ff3366',
    text: '#ffffff',
    textSub: '#999999',
  },
  glassmorphism: {
    bg: '#0d0d1a',
    card: 'rgba(255, 255, 255, 0.05)',
    accent: '#a78bfa',
    text: '#f0f0f5',
    textSub: '#8888aa',
  },
};

function extractKeywords(prompt) {
  const lower = prompt.toLowerCase();
  const keywords = {
    hasDashboard: /dashboard|analytics|chart|stats/i.test(lower),
    hasLanding: /landing|hero|homepage/i.test(lower),
    hasCard: /card|product|item/i.test(lower),
    hasNav: /nav|header|menu/i.test(lower),
    hasForm: /form|input|login|signup|contact/i.test(lower),
    hasProfile: /profile|user|avatar|social/i.test(lower),
    hasPlayer: /music|player|audio|video/i.test(lower),
    hasGrid: /grid|gallery|portfolio/i.test(lower),
    hasPricing: /pricing|plan|subscription/i.test(lower),
  };
  return keywords;
}

export function generateCode(prompt, style = 'modern') {
  const palette = colorPalettes[style] || colorPalettes.modern;
  const kw = extractKeywords(prompt);

  let htmlCode = '';
  let cssCode = '';

  if (kw.hasDashboard) {
    htmlCode = generateDashboardHTML(prompt);
    cssCode = generateDashboardCSS(palette, style);
  } else if (kw.hasLanding || kw.hasCard) {
    htmlCode = generateLandingHTML(prompt);
    cssCode = generateLandingCSS(palette, style);
  } else if (kw.hasForm) {
    htmlCode = generateFormHTML(prompt);
    cssCode = generateFormCSS(palette, style);
  } else if (kw.hasProfile) {
    htmlCode = generateProfileHTML(prompt);
    cssCode = generateProfileCSS(palette, style);
  } else if (kw.hasPlayer) {
    htmlCode = generatePlayerHTML(prompt);
    cssCode = generatePlayerCSS(palette, style);
  } else if (kw.hasPricing) {
    htmlCode = generatePricingHTML(prompt);
    cssCode = generatePricingCSS(palette, style);
  } else {
    htmlCode = generateLandingHTML(prompt);
    cssCode = generateLandingCSS(palette, style);
  }

  return { htmlCode, cssCode };
}

// ─── Dashboard ──────────────────
function generateDashboardHTML(prompt) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">◆</span>
        <span>Dashboard</span>
      </div>
      <nav class="sidebar-nav">
        <a href="#" class="nav-item active">📊 Overview</a>
        <a href="#" class="nav-item">📈 Analytics</a>
        <a href="#" class="nav-item">👥 Users</a>
        <a href="#" class="nav-item">⚙️ Settings</a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-bar">
        <h1>Overview</h1>
        <div class="user-info">
          <span class="notification">🔔</span>
          <div class="avatar"></div>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Revenue</span>
          <span class="stat-value">$48,560</span>
          <span class="stat-change positive">+12.5%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Active Users</span>
          <span class="stat-value">2,450</span>
          <span class="stat-change positive">+8.2%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Conversion</span>
          <span class="stat-value">3.6%</span>
          <span class="stat-change negative">-2.1%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Sessions</span>
          <span class="stat-value">12,840</span>
          <span class="stat-change positive">+5.4%</span>
        </div>
      </section>

      <!-- Chart Area -->
      <section class="chart-section">
        <div class="chart-card">
          <h3>Revenue Over Time</h3>
          <div class="chart-placeholder">
            <div class="bar" style="height: 40%"></div>
            <div class="bar" style="height: 65%"></div>
            <div class="bar" style="height: 50%"></div>
            <div class="bar" style="height: 80%"></div>
            <div class="bar" style="height: 60%"></div>
            <div class="bar" style="height: 90%"></div>
            <div class="bar" style="height: 75%"></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;
}

function generateDashboardCSS(p, style) {
  const blur = style === 'glassmorphism' ? 'backdrop-filter: blur(20px);' : '';
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
  min-height: 100vh;
}

.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: ${p.card};
  border-right: 1px solid rgba(255,255,255,0.06);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  ${blur}
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
}

.logo-icon { color: ${p.accent}; font-size: 1.3rem; }

.sidebar-nav { display: flex; flex-direction: column; gap: 4px; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: ${p.textSub};
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-item:hover { background: rgba(255,255,255,0.04); color: ${p.text}; }
.nav-item.active { background: ${p.accent}20; color: ${p.accent}; }

.main-content { flex: 1; padding: 24px 32px; }

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.top-bar h1 { font-size: 1.5rem; font-weight: 700; }

.user-info { display: flex; align-items: center; gap: 16px; }
.notification { font-size: 1.2rem; cursor: pointer; }

.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: ${p.accent};
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${blur}
}

.stat-label { font-size: 0.82rem; color: ${p.textSub}; }
.stat-value { font-size: 1.6rem; font-weight: 700; }
.stat-change { font-size: 0.78rem; font-weight: 500; }
.stat-change.positive { color: #22c55e; }
.stat-change.negative { color: #ef4444; }

.chart-card {
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 24px;
  ${blur}
}

.chart-card h3 { font-size: 1rem; margin-bottom: 20px; }

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
}

.bar {
  flex: 1;
  background: linear-gradient(to top, ${p.accent}, ${p.accent}88);
  border-radius: 6px 6px 0 0;
  transition: height 0.3s;
}

.bar:hover { opacity: 0.8; }`;
}

// ─── Landing Page ───────────────
function generateLandingHTML(prompt) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landing Page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="landing">
    <!-- Header -->
    <header class="header">
      <a href="#" class="brand">✦ BrandName</a>
      <nav class="nav">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
        <a href="#" class="btn btn-primary">Get Started</a>
      </nav>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">✨ Now Available</div>
      <h1 class="hero-title">
        Build Something<br />
        <span class="highlight">Extraordinary</span>
      </h1>
      <p class="hero-desc">
        The next generation platform for creators 
        and developers to bring ideas to life.
      </p>
      <div class="hero-actions">
        <a href="#" class="btn btn-primary btn-lg">Start Free Trial</a>
        <a href="#" class="btn btn-ghost btn-lg">Watch Demo →</a>
      </div>
    </section>

    <!-- Feature Cards -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Optimized for speed and performance.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Beautiful Design</h3>
        <p>Crafted with attention to every detail.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure & Safe</h3>
        <p>Enterprise-grade security built in.</p>
      </div>
    </section>
  </div>
</body>
</html>`;
}

function generateLandingCSS(p, style) {
  const blur = style === 'glassmorphism' ? 'backdrop-filter: blur(20px);' : '';
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
  min-height: 100vh;
}

.landing { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.brand {
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  color: ${p.text};
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav a {
  text-decoration: none;
  color: ${p.textSub};
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav a:hover { color: ${p.text}; }

.btn {
  display: inline-flex;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: ${p.accent};
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-ghost {
  color: ${p.text};
  border: 1px solid rgba(255,255,255,0.1);
}

.btn-lg { padding: 14px 28px; font-size: 0.95rem; }

.hero {
  text-align: center;
  padding: 100px 0 80px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 100px;
  background: ${p.accent}15;
  color: ${p.accent};
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}

.highlight {
  background: linear-gradient(135deg, ${p.accent}, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.1rem;
  color: ${p.textSub};
  max-width: 480px;
  margin: 0 auto 36px;
  line-height: 1.7;
}

.hero-actions { display: flex; gap: 14px; justify-content: center; }

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-bottom: 80px;
}

.feature-card {
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 28px;
  transition: all 0.3s;
  ${blur}
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: ${p.accent}40;
}

.feature-icon {
  font-size: 1.8rem;
  margin-bottom: 14px;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.88rem;
  color: ${p.textSub};
  line-height: 1.5;
}`;
}

// ─── Form ───────────────────────
function generateFormHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">◆</div>
        <h1>Welcome back</h1>
        <p>Sign in to your account to continue</p>
      </div>
      <form class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" />
        </div>
        <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" class="btn-submit">Sign In</button>
      </form>
      <p class="auth-footer">
        Don't have an account? <a href="#">Sign up</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function generateFormCSS(p, style) {
  const blur = style === 'glassmorphism' ? 'backdrop-filter: blur(20px);' : '';
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container { width: 100%; max-width: 420px; padding: 24px; }

.auth-card {
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 40px;
  ${blur}
}

.auth-header { text-align: center; margin-bottom: 32px; }

.auth-logo {
  font-size: 2rem;
  color: ${p.accent};
  margin-bottom: 16px;
}

.auth-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
.auth-header p { font-size: 0.9rem; color: ${p.textSub}; }

.form-group { margin-bottom: 20px; }

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${p.textSub};
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  background: rgba(0,0,0,0.2);
  color: ${p.text};
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: ${p.accent};
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 0.82rem;
}

.form-options a { color: ${p.accent}; text-decoration: none; }
.checkbox { color: ${p.textSub}; display: flex; align-items: center; gap: 6px; }

.btn-submit {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: ${p.accent};
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:hover { opacity: 0.9; }

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.85rem;
  color: ${p.textSub};
}

.auth-footer a { color: ${p.accent}; text-decoration: none; }`;
}

// ─── Profile ────────────────────
function generateProfileHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Profile</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-cover"></div>
      <div class="profile-info">
        <div class="avatar-large"></div>
        <h1>Alex Johnson</h1>
        <p class="username">@alexjohnson</p>
        <p class="bio">Designer & Developer. Building beautiful things on the web.</p>
        <div class="profile-stats">
          <div class="stat"><strong>1,240</strong><span>Posts</span></div>
          <div class="stat"><strong>18.5K</strong><span>Followers</span></div>
          <div class="stat"><strong>520</strong><span>Following</span></div>
        </div>
        <button class="btn-follow">Follow</button>
      </div>
    </div>
    <div class="posts-grid">
      <div class="post-card"></div>
      <div class="post-card"></div>
      <div class="post-card"></div>
      <div class="post-card"></div>
      <div class="post-card"></div>
      <div class="post-card"></div>
    </div>
  </div>
</body>
</html>`;
}

function generateProfileCSS(p) {
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
}

.profile-page { max-width: 680px; margin: 0 auto; }

.profile-cover {
  height: 200px;
  background: linear-gradient(135deg, ${p.accent}, #c084fc);
  border-radius: 0 0 16px 16px;
}

.profile-info {
  text-align: center;
  padding: 0 24px;
  margin-top: -50px;
}

.avatar-large {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: ${p.card};
  border: 4px solid ${p.bg};
  margin: 0 auto 16px;
}

.profile-info h1 { font-size: 1.4rem; font-weight: 700; }
.username { color: ${p.textSub}; font-size: 0.9rem; margin-bottom: 12px; }
.bio { color: ${p.textSub}; font-size: 0.9rem; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto; }

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}

.stat { text-align: center; }
.stat strong { display: block; font-size: 1.1rem; }
.stat span { font-size: 0.78rem; color: ${p.textSub}; }

.btn-follow {
  padding: 10px 32px;
  border: none;
  border-radius: 100px;
  background: ${p.accent};
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 32px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  padding: 0 24px 24px;
}

.post-card {
  aspect-ratio: 1;
  background: ${p.card};
  border-radius: 4px;
}`;
}

// ─── Player ─────────────────────
function generatePlayerHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Music Player</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="player">
    <div class="album-art"></div>
    <div class="track-info">
      <h2 class="track-name">Midnight Dreams</h2>
      <p class="artist-name">Luna Eclipse</p>
    </div>
    <div class="waveform">
      <div class="wave-bar" style="height: 20px"></div>
      <div class="wave-bar" style="height: 35px"></div>
      <div class="wave-bar" style="height: 50px"></div>
      <div class="wave-bar" style="height: 30px"></div>
      <div class="wave-bar active" style="height: 60px"></div>
      <div class="wave-bar" style="height: 45px"></div>
      <div class="wave-bar" style="height: 25px"></div>
      <div class="wave-bar" style="height: 55px"></div>
      <div class="wave-bar" style="height: 40px"></div>
      <div class="wave-bar" style="height: 30px"></div>
    </div>
    <div class="progress">
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="time-display">
        <span>1:32</span>
        <span>3:45</span>
      </div>
    </div>
    <div class="controls">
      <button class="ctrl-btn">⏮</button>
      <button class="ctrl-btn play-btn">▶</button>
      <button class="ctrl-btn">⏭</button>
    </div>
  </div>
</body>
</html>`;
}

function generatePlayerCSS(p) {
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player {
  width: 340px;
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
}

.album-art {
  width: 200px; height: 200px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${p.accent}, #c084fc);
  margin: 0 auto 24px;
}

.track-name { font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; }
.artist-name { font-size: 0.88rem; color: ${p.textSub}; margin-bottom: 24px; }

.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  margin-bottom: 20px;
}

.wave-bar {
  width: 4px;
  border-radius: 2px;
  background: ${p.textSub}40;
}

.wave-bar.active { background: ${p.accent}; }

.progress { margin-bottom: 20px; }

.progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  width: 42%;
  height: 100%;
  background: ${p.accent};
  border-radius: 2px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${p.textSub};
  margin-top: 6px;
}

.controls { display: flex; justify-content: center; gap: 16px; }

.ctrl-btn {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${p.text};
  font-size: 1.1rem;
  cursor: pointer;
}

.play-btn {
  width: 56px; height: 56px;
  background: ${p.accent};
  color: white;
  font-size: 1.3rem;
}`;
}

// ─── Pricing ────────────────────
function generatePricingHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pricing</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="pricing-page">
    <div class="pricing-header">
      <h1>Simple, transparent pricing</h1>
      <p>Choose the plan that works best for you</p>
    </div>
    <div class="pricing-grid">
      <div class="plan-card">
        <h3>Starter</h3>
        <div class="price"><span class="amount">$9</span>/month</div>
        <ul class="features-list">
          <li>✓ 5 Projects</li>
          <li>✓ Basic Analytics</li>
          <li>✓ Email Support</li>
        </ul>
        <button class="plan-btn">Get Started</button>
      </div>
      <div class="plan-card featured">
        <div class="popular-tag">Most Popular</div>
        <h3>Pro</h3>
        <div class="price"><span class="amount">$29</span>/month</div>
        <ul class="features-list">
          <li>✓ Unlimited Projects</li>
          <li>✓ Advanced Analytics</li>
          <li>✓ Priority Support</li>
          <li>✓ Custom Domain</li>
        </ul>
        <button class="plan-btn primary">Get Started</button>
      </div>
      <div class="plan-card">
        <h3>Enterprise</h3>
        <div class="price"><span class="amount">$99</span>/month</div>
        <ul class="features-list">
          <li>✓ Everything in Pro</li>
          <li>✓ Dedicated Manager</li>
          <li>✓ SLA Guarantee</li>
          <li>✓ Custom Integrations</li>
        </ul>
        <button class="plan-btn">Contact Sales</button>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generatePricingCSS(p, style) {
  const blur = style === 'glassmorphism' ? 'backdrop-filter: blur(20px);' : '';
  return `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: ${p.bg};
  color: ${p.text};
  min-height: 100vh;
  padding: 60px 24px;
}

.pricing-page { max-width: 1000px; margin: 0 auto; }

.pricing-header {
  text-align: center;
  margin-bottom: 48px;
}

.pricing-header h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; }
.pricing-header p { color: ${p.textSub}; font-size: 1rem; }

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.plan-card {
  background: ${p.card};
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  transition: transform 0.3s;
  ${blur}
}

.plan-card:hover { transform: translateY(-4px); }

.plan-card.featured {
  border-color: ${p.accent};
  box-shadow: 0 0 40px ${p.accent}15;
}

.popular-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 14px;
  background: ${p.accent};
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 100px;
}

.plan-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 16px; }

.price { margin-bottom: 24px; }
.amount { font-size: 2.4rem; font-weight: 800; }

.features-list {
  list-style: none;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.features-list li { font-size: 0.88rem; color: ${p.textSub}; }

.plan-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  background: transparent;
  color: ${p.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-btn:hover { background: rgba(255,255,255,0.04); }

.plan-btn.primary {
  background: ${p.accent};
  color: white;
  border-color: ${p.accent};
}`;
}
