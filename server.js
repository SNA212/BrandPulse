
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Seksama — Instant Brand Analysis</title>
  <meta name="description" content="Instantly analyze your brand's online presence. See top mentions, sentiment, and key metrics in seconds." />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root{
      --blue:#2b8eff;
      --blue-700:#2563eb;
      --green:#4ade80;
      --red:#f87171;
      --bg:#f8fafc;
      --text:#0f172a;
      --muted:#64748b;
      --card:#ffffff;
      --border:#e2e8f0;
      --radius:16px;
      --shadow:0 12px 34px rgba(15,23,42,.07);
      --header-h:72px;
      
      --dark-bg-start: #1e293b;
      --dark-bg-end: #0f172a;
      --dark-card: #162033;
      --dark-border: #334155;
      --dark-text: #e2e8f0;
      --dark-muted: #94a3b8;

      --instagram-color: #E4405F;
      --tiktok-color: #000000;
      --facebook-color: #1877F2;
      --email-color: #f59e0b;
    }
    @media (prefers-color-scheme: dark){
      :root{
        --bg:#0b1020; --text:#e2e8f0; --muted:#94a3b8; --card:#0f172a; --border:#1f2a44;
      }
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;background:var(--bg);color:var(--text);
      font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";
      -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;line-height:1.5;
    }
    a{color:inherit;text-decoration:none}
    .container{width:100%;max-width:1200px; margin:0 auto;padding-left:clamp(16px,5vw,40px);padding-right:clamp(16px,5vw,40px)}
    section{padding:48px 0}

    /* Header */
    header{
      position:sticky;top:0;z-index:60;height:var(--header-h);
      backdrop-filter:saturate(180%) blur(8px);
      background:color-mix(in srgb, var(--bg) 80%, transparent);
      border-bottom:1px solid var(--border);
      transition:height .25s ease, background .25s ease, box-shadow .25s ease;
    }
    header.scrolled{ --header-h:60px; box-shadow:0 8px 18px rgba(15,23,42,.05); }
    .nav{height:100%;display:flex;align-items:center;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px}
    .logo{
      width:28px;height:28px;border-radius:50%;
      background:radial-gradient(100% 100% at 30% 30%, #a8c7ff 0%, var(--blue) 60%, #1d4ed8 100%);
      box-shadow:0 8px 18px rgba(37,99,235,.35);position:relative;isolation:isolate;
    }
    .logo::after{
      content:"";position:absolute;right:-6px;bottom:-6px;width:10px;height:10px;border:2px solid var(--card);border-radius:50%;background:var(--blue-700)
    }
    nav ul{display:none;gap:20px;list-style:none;margin:0;padding:0}
    @media (min-width: 900px) { nav ul { display: flex; } }
    nav a{color:var(--muted);font-weight:700;font-size:14px; transition: color .2s ease;}
    nav a:hover{color:var(--text)}
    .btn{
      display:inline-flex;align-items:center;justify-content:center;gap:8px;
      padding:10px 14px;border:1px solid var(--border);border-radius:12px;background:transparent;
      font-weight:800;cursor:pointer;transition:transform .08s ease, background .22s ease, color .22s ease, box-shadow .22s ease
    }
    .btn:hover{background:var(--card);box-shadow:0 8px 18px rgba(15,23,42,.08)}
    .btn:active{transform:translateY(1px)}
    .btn-primary{
      background:linear-gradient(180deg,#43a0ff 0%,var(--blue) 100%);
      color:white;border-color:#1870ff;box-shadow:0 12px 26px rgba(43,142,255,.35)
    }
    .menu{display:none !important}
    @media (max-width:899px){ .menu{display:inline-flex} }
    .mobile-panel{
      position:fixed;left:0;right:0;top:var(--header-h);z-index:50;
      background:var(--bg);border-bottom:1px solid var(--border);
      transform-origin:top;transform:scaleY(0);opacity:0;transition:transform .25s ease, opacity .25s ease;
    }
    .mobile-panel.open{transform:scaleY(1);opacity:1}
    .mobile-links{display:flex;flex-direction:column;gap:12px;padding:18px 20px}
    .mobile-links a{padding:10px 12px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-weight:700}

    /* NEW: Search-focused Hero */
    .hero{
      padding: 80px 0 60px; text-align:center; position:relative; overflow:hidden;
      background: radial-gradient(1200px 400px at 80% -50%, rgba(43,142,255,.15), transparent 70%);
    }
    .orb{position:absolute;border-radius:50%;filter:blur(24px);opacity:.12;pointer-events:none}
    .orb-1{width:400px;height:400px;left:-150px;top:-100px;background:#60a5fa;animation:drift 18s ease-in-out infinite}
    .orb-2{width:500px;height:500px;right:-200px;bottom:-150px;background:#34d399;animation:drift 22s ease-in-out infinite reverse}
    @keyframes drift{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(40px, -20px, 0)}100%{transform:translate3d(0,0,0)}}
    h1{
      margin:12px auto 10px; text-align:center;
      font-size: clamp(32px, 5vw + 12px, 52px);
      line-height:1.1; letter-spacing:-.025em; max-width:800px;
    }
    .lead{color:var(--muted);max-width:650px;margin:8px auto 28px;font-size:clamp(16px,1vw+12px,18px)}

    .hero-search{
        max-width:640px; margin: 0 auto;
        display:flex; gap:10px; padding:8px;
        background: var(--card); border:1px solid var(--border);
        border-radius:16px; box-shadow: var(--shadow);
    }
    .hero-search input{
      flex:1;min-width:180px; padding:12px 14px; border-radius:12px;
      border:1px solid transparent; background:var(--bg); color:var(--text);
      font-size:16px; transition:box-shadow .2s ease, border-color .2s ease;
    }
    .hero-search input:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(43,142,255,.12)}

    /* Result Sections Styling */
    .results-wrapper {
        display: none; /* Initially hidden, shown by JS */
    }
    #top-analytics { padding: 32px 0 24px 0; }
    .analytics-container{position:relative;}
    .loading-overlay{
      position:absolute;inset:0;background:rgba(248,250,252,.85);border-radius:12px;
      display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:10;
    }
    .loading .loading-overlay{opacity:1;pointer-events:auto}
    
    .row{display:grid;grid-template-columns:1.1fr 1fr;gap:16px}
    @media (max-width:900px){.row{grid-template-columns:1fr}}
    .panel{border:1px solid var(--border);border-radius:12px;padding:14px;background:var(--card)}
    .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:10px}
    @media (max-width:780px){.kpis{grid-template-columns:1fr}}
    .kpi .label{color:var(--muted);font-size:12px}
    .kpi .value{font-size:22px;font-weight:800;margin-top:4px;letter-spacing:-.02em}
    .bar{height:8px;border-radius:999px;background:#e6edf6;overflow:hidden;margin-top:10px;display:grid;grid-template-columns:var(--pos) var(--neu) var(--neg)}
    .bar span{display:block;height:100%}
    .pos{background:var(--green)}.neu{background:#9aa7b6}.neg{background:var(--red)}
    .tags{display:flex;gap:8px;flex-direction:column;margin-top:10px}
    .tag {
        display: inline-flex; /* Gunakan inline-flex agar bisa di-align */
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background-color: var(--bg); /* Latar belakang yang sedikit berbeda */
        border: 1px solid var(--border);
        border-radius: 8px; /* Sedikit lebih kotak */
        font-size: 13px;
        font-weight: 500;
        color: var(--muted);
        text-decoration: none;
        transition: background-color 0.2s ease, color 0.2s ease;
    }
    .tag {
        display: inline-flex; /* Gunakan inline-flex agar bisa di-align */
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background-color: var(--bg); /* Latar belakang yang sedikit berbeda */
        border: 1px solid var(--border);
        border-radius: 8px; /* Sedikit lebih kotak */
        font-size: 13px;
        font-weight: 500;
        color: var(--muted);
        text-decoration: none;
        transition: background-color 0.2s ease, color 0.2s ease;
    }
    .chart{height:180px;border:1px dashed var(--border);border-radius:12px;background:var(--bg);padding:8px;display:flex;align-items:center;justify-content:center}
    .chart svg{width:100%;height:100%}
    .chart .area{fill:url(#grad);opacity:0;transition:opacity .6s ease}
    .chart .line{stroke:var(--blue);stroke-width:2;fill:none;stroke-linecap:round}
    .axis line{stroke:#d3dae6}

    /* Spinners & Button Loading */
    .spinner{animation:spin .8s linear infinite;width:18px;height:18px}
    .loading-overlay .spinner{width:32px;height:32px}
    @keyframes spin{to{transform:rotate(360deg)}}
    .btn .spinner-wrap{display:none}.btn.loading .btn-text{display:none}.btn.loading .spinner-wrap{display:inline-flex}.btn:disabled{cursor:wait;filter:brightness(.9)}
    
    /* Colorful Mentions Section */
    #mentions-section {
        background: linear-gradient(160deg, var(--dark-bg-start) 0%, var(--dark-bg-end) 100%);
        color: var(--dark-text); padding: 34px 0; border-top: 1px solid var(--dark-border);
        position: relative;
    }
    .section-title{font-size:clamp(20px,3vw,28px);font-weight:700;margin-bottom:24px}
    .mentions-grid{display:grid;grid-template-columns:3fr 2fr;gap:32px;}
    @media (max-width: 1024px) { .mentions-grid { grid-template-columns: 1fr; gap: 48px; } }
    
    .mention-card{
      display:flex;gap:16px;padding:16px;background:var(--dark-card);
      border:1px solid var(--dark-border);border-radius:var(--radius);
      transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }
    .mention-card:not(:last-child){margin-bottom:16px}
    .mention-card:hover{transform:translateY(-3px);border-color:rgba(43,142,255,0.4);box-shadow:0 10px 30px rgba(0,0,0,0.3);}
    .source-icon{width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0; background:var(--dark-border);}
    .source-icon.round{border-radius:50%}
    .author-name{font-weight:700; color:var(--dark-text)}
    .author-meta{font-size:12px;color:var(--dark-muted)}
    .mention-body{font-size:14px;color:var(--dark-muted);line-height:1.5}
    .mention-body b{color:var(--dark-text);font-weight:600}
    
    .mention-sentiment{font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;height:fit-content;white-space:nowrap;margin-left:auto;}
    .sentiment-positive{background:rgba(74,222,128,0.1);color:var(--green)}
    .sentiment-neutral{background:rgba(148,163,184,0.15);color:var(--dark-muted)}
    .sentiment-negative{background:rgba(248,113,113,0.1);color:var(--red)}

    .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .stat-block{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:12px;padding:16px;transition:transform .2s ease, box-shadow .2s ease;}
    .stat-block:hover{transform:translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2);}
    .stat-label{font-size:12px;color:var(--dark-muted);margin-bottom:4px}
    .stat-value{font-size:clamp(20px, 3vw, 28px);font-weight:800;letter-spacing:-.02em; color: var(--dark-text);}
    .stat-change{font-weight:700;font-size:13px;display:flex;align-items:center;gap:4px}
    .stat-change.positive{color:var(--green)}
    .stat-change.negative{color:var(--red)}

    /* NEW: Get in Touch Notification */
    .touch-notification {
        background: var(--card); border: 1px solid var(--border);
        border-radius: var(--radius); padding: 16px 20px;
        margin-bottom: 32px; display: flex; align-items: center; gap: 16px;
        box-shadow: var(--shadow); opacity: 0; transform: translateY(10px);
        transition: opacity .4s ease, transform .4s ease;
    }
    .touch-notification.visible { opacity: 1; transform: translateY(0); }
    .touch-icon {
        flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
        background: rgba(43, 142, 255, 0.1); color: var(--blue);
        display: flex; align-items: center; justify-content: center;
    }
    .touch-icon svg { width: 20px; height: 20px; }
    .touch-text p { margin: 0; font-weight: 500; color: var(--muted); }
    .touch-text strong { color: var(--text); }
    .touch-close {
        margin-left: auto; cursor: pointer; background: none; border: none;
        color: var(--muted); padding: 4px;
    }
    .touch-close:hover { color: var(--text); }

    /* General */
    .reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease, transform .6s ease}
    .reveal.in{opacity:1;transform:translateY(0)}
    @media (prefers-reduced-motion: reduce){*, *::before, *::after{animation:none!important;transition:none!important}html{scroll-behavior:auto}}
    :focus-visible{outline:2px solid var(--blue);outline-offset:2px;border-radius:8px}

    /* Tambahkan ini di dalam tag <style> Anda */
    .mention-body mark {
        background-color: rgba(43, 142, 255, 0.2); /* Warna biru muda semi-transparan */
        color: inherit; /* Gunakan warna teks dari parent */
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: 600;
    }

    /* Tambahkan ini di dalam tag <style> Anda */

    /* Utility class untuk menyembunyikan elemen */
    .hidden {
        display: none !important;
    }

    /* Styling untuk panel notifikasi */
    .info-panel {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        background: var(--card);
        border: 1px solid var(--border);
        border-left: 4px solid #facc15; /* Aksen warna kuning untuk info/peringatan */
        border-radius: var(--radius);
        padding: 20px;
        margin: 24px 0;
        box-shadow: var(--shadow);
    }
    .info-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        color: #f59e0b; /* Warna ikon kuning */
        margin-top: 2px;
    }
    .info-text h4 {
        margin: 0 0 4px 0;
        color: var(--text);
        font-size: 16px;
    }
    .info-text p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.5;
    }
    .info-close {
        margin-left: auto;
        cursor: pointer;
        background: none;
        border: none;
        font-size: 24px;
        line-height: 1;
        color: var(--muted);
        padding: 0;
    }
    .info-close:hover {
        color: var(--text);
    }

    #sentimentText {
        font-size:12px;
        font-weight:700;
        padding:4px 10px;
        border-radius:999px;
        height:fit-content;
        white-space:nowrap;
        margin-left:auto;
        text-align:center;
    }
    
    /* Tambahkan ini di dalam tag <style> Anda */

    .cta-block {
        background: var(--dark-card);
        border: 1px solid var(--dark-border);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 8px;
        border-left: 4px solid var(--red); /* Aksen biru */
        transition: .2s ease;
    }

    .cta-block:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-color: rgba(43, 142, 255, 0.4);
    }

    .cta-block h5 {
        margin: 0;
        font-size: 16px;
        color: var(--dark-text);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .cta-block p {
        margin: 0;
        font-size: 13px;
        color: var(--dark-muted);
        flex-grow: 1; /* Mendorong tombol ke bawah */
    }

    .cta-block .btn-cta {
        width: 100%;
        text-align: center;
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--blue);
        color: white;
        font-weight: 600;
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: background-color .2s ease;
    }

    .cta-block .btn-cta:hover {
        background: var(--blue-700);
    }

    /* Tambahkan ini di dalam tag <style> Anda */

  .info-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px; /* Memberi jarak dari grid overview di atasnya */
      padding: 8px 16px;
      font-size: 13px;
      color: var(--dark-muted); /* Warna teks yang tidak terlalu menonjol */
      background-color: rgba(0, 0, 0, 0.1); /* Latar belakang sangat transparan */
      border-radius: 999px; /* Bentuk pil */
      max-width: max-content; /* Lebar sesuai konten */
      margin-left: auto;
      margin-right: auto;
  }

  .info-note svg {
      flex-shrink: 0;
      color: var(--blue);
  }

  .social-links {
      display: flex;
      align-items: center;
      gap: 16px;
  }

  .social-links a {
      color: var(--muted);
      display: inline-flex;
      transition: color 0.2s ease, transform 0.2s ease;
  }

  .social-links a:hover {
      transform: translateY(-2px);
  }

  .social-links svg {
      width: 22px;
      height: 22px;
  }

  .social-links a:nth-child(1):hover {
      color: var(--instagram-color);
  }

  .social-links a:nth-child(2):hover {
      color: var(--tiktok-color);
  }

  .social-links a:nth-child(3):hover {
      color: var(--facebook-color);
  }

  .social-links a:nth-child(4):hover {
      color: var(--email-color);
  }
  </style>
</head>
<body>
  <header id="siteHeader">
    <div class="container nav">
      <a class="brand" href="#"><span class="logo" aria-hidden="true"></span><span>Seksama</span></a>
      <nav aria-label="Primary">
        <ul>
          <li><a href="#results-wrapper">Results</a></li>
          <li><a href="mailto:hello@seksama.com">Contact</a></li>
        </ul>
      </nav>
      <div class="actions social-links">
        <a href="https://instagram.com/tigadikalilima" target="_blank" rel="noopener noreferrer" aria-label="Instagram Seksama">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="https://tiktok.com/bwhkhkhk" target="_blank" rel="noopener noreferrer" aria-label="TikTok Seksama">
            <!-- SVG TIKTOK YANG SUDAH DIPERBAIKI -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM6 12a6 6 0 1 1 12 0A6 6 0 0 1 6 12z"></path>
                <path d="M12 12v8"></path>
                <path d="M12 8a4 4 0 0 0-4 4"></path>
            </svg>
        </a>
        <a href="https://facebook.com/senseisaysrelax" target="_blank" rel="noopener noreferrer" aria-label="Facebook Seksama">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="mailto:hello@seksama.io" aria-label="Email Seksama">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
    </div>
    </div>
    <div id="mobilePanel" class="mobile-panel" aria-hidden="true">
      <div class="mobile-links container"><a href="#results-wrapper">Results</a><a href="mailto:hello@Seksama.com">Contact</a></div>
    </div>
  </header>

  <main>
    <section class="hero">
      <span class="orb orb-1"></span><span class="orb orb-2"></span>
      <div class="container">
        <h1 class="reveal">Get Instant Analysis of Your Brand</h1>
        <p class="lead reveal">Enter a brand, product, or keyword to see its online presence in seconds.</p>
        
        <form id="searchForm" class="hero-search reveal" autocomplete="off" aria-label="Brand search">
            <input id="brandInput" type="text" placeholder="e.g., Lexus, iPhone 15, skincare..." aria-label="Keyword" />
            <button class="btn btn-primary" type="submit" id="analyzeBtn">
                <span class="btn-text">Analyze</span>
                <span class="spinner-wrap"><svg class="spinner" viewBox="0 0 50 50" role="status"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle></svg></span>
            </button>
        </form>
      </div>
    </section>
    
    <!-- RESULTS WRAPPER (Initially Hidden) -->
    <div id="results-wrapper" class="results-wrapper">
        <!-- TOP ANALYTICS SECTION -->
        <section id="top-analytics">
            <div class="container">
                <!-- GET IN TOUCH NOTIFICATION -->
                <div id="touch-notification" class="touch-notification">
                    <div class="touch-icon" aria-hidden="true">
                        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <div class="touch-text">
                        <p><strong>Need more detail?</strong> Get in touch for automated reports and full data access.</p>
                    </div>
                    <a href="mailto:hello@Seksama.com" class="btn btn-primary" style="padding: 8px 12px; font-size: 14px; white-space: nowrap;">Contact Us</a>
                    <button id="close-touch-btn" class="touch-close" aria-label="Close notification">&times;</button>
                </div>

                <div id="analyticsContainer" class="analytics-container">
                    <div class="loading-overlay">
                        <svg class="spinner" viewBox="0 0 50 50" role="status"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4"></circle></svg>
                    </div>
                    <div class="row">
                        <div class="panel"><div class="kpis"><div class="kpi"><div class="label">Live mentions (24h)</div><div class="value" id="mentionsValue">—</div></div><div class="kpi"><div class="label">Sentiment</div><div class="bar" id="sentBar"><span class="pos"></span><span class="neu"></span><span class="neg"></span></div><div id="sentimentText" class="muted">—</div></div><div class="kpi"><div class="label label-with-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
                            <span>Top Sources</span>
                        </div><div id="sourceTags"><span class="tag">—</span></div></div></div></div>
                        <div class="panel chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="grad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(43,142,255,.35)"></stop><stop offset="100%" stop-color="rgba(43,142,255,0)"></stop></linearGradient></defs><g class="axis"><line x1="0" y1="95" x2="100" y2="95"></line><line x1="0" y1="5" x2="0" y2="95"></line></g><path id="areaPath" class="area" d=""></path><path id="linePath" class="line" d=""></path></svg></div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- COLORFUL MENTIONS SECTION -->
        <section id="mentions-section">
          <div class="info-note">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
            <span>Overview metrics are derived from the top 100++ recent posts.</span>
          </div>
            <div class="container">
                <div id="mentionsContainer" class="mentions-grid">
                    <div class="loading-overlay" style="background: transparent;">
                        <svg class="spinner" viewBox="0 0 50 50" role="status"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4"></circle></svg>
                    </div>
                    <div class="mentions-feed"><h2 class="section-title">Mentions</h2><div id="feed-items-container"></div></div>
                    <div class="mentions-overview"><h2 class="section-title">Overview </h2><div id="overview-grid" class="overview-grid"></div></div>
                    
                  </div>
                
                
            </div>
        </section>
        
    </div>

  </main>
  
  <footer id="contact">
    <div class="container" style="text-align:center; padding: 40px 0;">
      <a class="brand" href="#"><span class="logo" aria-hidden="true"></span><span>Seksama</span></a>
      <p style="margin-top: 8px; color: var(--muted);">&copy; <span id="year"></span> Seksama, Inc. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Elements
    const menuBtn = document.getElementById('menuBtn'), panel = document.getElementById('mobilePanel'), header = document.getElementById('siteHeader'),
          form = document.getElementById('searchForm'), analyzeBtn = document.getElementById('analyzeBtn'), 
          resultsWrapper = document.getElementById('results-wrapper'),
          analyticsContainer = document.getElementById('analyticsContainer'), mentionsContainer = document.getElementById('mentionsContainer'),
          brandInput = document.getElementById('brandInput'), mentionsEl = document.getElementById('mentionsValue'),
          feedContainer = document.getElementById('feed-items-container'), overviewGrid = document.getElementById('overview-grid'),
          touchNotification = document.getElementById('touch-notification'), closeTouchBtn = document.getElementById('close-touch-btn');

    // Mobile menu
    menuBtn?.addEventListener('click', ()=>{panel.classList.toggle('open');panel.setAttribute('aria-hidden',!panel.classList.contains('open'))});
    // Shrink header
    const onScroll = ()=>header.classList.toggle('scrolled',window.scrollY > 10);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    // Close notification
    closeTouchBtn?.addEventListener('click', ()=> touchNotification.style.display = 'none');

    // --- UTILITIES ---
    const nf = new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1});
    function animateValue(el,end,duration=800){
      let start=0,t0=performance.now(); const v=parseFloat(el.textContent.replace(/[^0-9.]/g,''))||0; if(v>0)start=v;
      function frame(t){const p=Math.min(1,(t-t0)/duration),val=start+(end-start)*p;el.textContent=nf.format(val);if(p<1)requestAnimationFrame(frame)}
      requestAnimationFrame(frame)
    }
    const random=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;

    // --- DUMMY DATA AND RENDERERS ---
    const dummyMentions=[{icon:'<svg class="source-icon round" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 0C229.22 0 0 229.22 0 512s229.22 512 512 512s512-229.22 512-512S794.78 0 512 0Zm252.12 607.95c-15.08 4.31-31.25 6.43-48.31 6.43c-36.2 0-70.31-10.4-99.31-29.69V793.5c0 33.24-27.08 60.31-60.31 60.31s-60.31-27.08-60.31-60.31V459.62c0-11.83 9.61-21.44 21.44-21.44h115.43c74.39 0 134.62 60.23 134.62 134.62c0 31.52-10.95 60.38-29.31 83.69c-2.47-27.48-15.19-52.13-33.88-71.13c-15.08-15.08-33.88-25.88-55.38-30.81c-4.13-0.94-8.38-1.44-12.63-1.44c-25.13 0-47.5 13.69-58.88 34.69c-1.44 2.69-2.31 5.63-2.88 8.63a43.38 43.38 0 0 0-0.31 7.31c0 23.99 19.45 43.44 43.44 43.44c12.26 0 23.36-5.09 31.2-13.23c19.1-19.89 25.17-48.03 20.3-75.59Z"/></svg>',author:'liizkkkkaaa.z',meta:'1.4M views • 162 followers • 18 Oct, 2025',content:'#lexus 🫦🃏',sentiment:'Positive'},{icon:'<img class="source-icon" src="https://placehold.co/40x40?text=W" alt="Wordpress">',author:'Menembus Batas',meta:'kerjasmartonline.wordpress.com • 09 Oct, 2025',content:'Pagi itu, Jakarta masih sibuk dengan denyut rutinnya... Mobil <b>Lexus</b> itu melaju...',sentiment:'Neutral'},{icon:'<img class="source-icon" src="https://via.placeholder.com/40/1DA1F2/FFFFFF?text=X" alt="X">',author:'car_enthusiast',meta:'twitter.com • 19 Oct, 2025',content:'Just saw the new <b>Lexus</b> sedan, and wow, what a beauty. The design language is on another level.',sentiment:'Positive'},{icon:'<img class="source-icon" src="https://placehold.co/40x40?text=S" alt="Suara">',author:'Viral Mobil Mewah Sri Sultan',meta:'suara.com • 14 Oct, 2025',content:'Baca 10 detik Viral Mobil Mewah <b>Lexus</b> LM350h... Perbedaan Lexus LM350h dengan New Toyota Alphard [...]',sentiment:'Neutral'}];
    // Ganti fungsi renderMentions yang lama dengan yang ini
function renderMentions(mentionsData){
    feedContainer.innerHTML = '';
    if (!mentionsData || mentionsData.length === 0) {
        feedContainer.innerHTML = '<p style="color: var(--dark-muted);">No mentions found from last 24 hours.</p>';
        return;
    }
    mentionsData.forEach(item => {
        const cardHTML = `
            <a href="${item.link}" target="_blank" rel="noopener noreferrer nofollow" class="mention-card">
                ${item.icon}
                <div class="mention-content">
                    <div class="author-name">${item.title}</div>
                    <div class="author-meta">${item.displayLink}</div>
                    <p class="mention-body">${item.snippet}</p>
                </div>
                <span class="mention-sentiment sentiment-${item.sentiment.toLowerCase()}">${item.sentiment}</span>
            </a>`;
        feedContainer.innerHTML += cardHTML;
    });
}
    const overviewMetrics=[{label:'Live Mentions (7 days)',id:'overview-total-mentions'},{label:'Positive mentions (24h)',id:'overview-positive-mentions'},{label:'Negative mentions (24 hours)',id:'overview-negative-mentions'},{label:'Estimated Reach',id:'overview-aps'},{label:'Unique Sources (Top 5)',id:'overview-social-reach'},{label:'AI Sentiment Score',id:'overview-ugc'}];
function renderOverview(){
  overviewGrid.innerHTML='';
  overviewMetrics.forEach(m=>{const h=`<div class="stat-block"><div class="stat-label">${m.label}</div><div class="stat-value" id="${m.id}">0</div><div class="stat-change" id="${m.id}-change"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg><span>0%</span></div></div>`;overviewGrid.innerHTML+=h})
}
    // Ganti fungsi updateOverview yang lama dengan yang ini
// GANTI FUNGSI LAMA DENGAN VERSI BARU INI DI public/index.html

function updateOverview(data){
    overviewGrid.innerHTML = '';
    console.log(data)
    // 1. Render Blok Rekomendasi AI terlebih dahulu
    if (data.ai_recommendations) {
        const recommendationsHTML = data.ai_recommendations.split('\n').map(rec => `<li>${rec.replace(/^\d+\.\s*/, '')}</li>`).join('');
        const summaryHTML=`<div class="ai-recommendation-block"><h4><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m-2.7-10.3l5 5c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.4-.4-.4-1 0-1.4s1-.4 1.4 0m-2.8 4.2c.3.3.3.8 0 1.1-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0M15.5 6c.8 0 1.5.7 1.5 1.5S16.3 9 15.5 9 14 8.3 14 7.5 14.7 6 15.5 6z"/></svg>Actionable Recommendations</h4><ol>${recommendationsHTML}</ol></div>`;
        //overviewGrid.innerHTML += summaryHTML;
    }
    
    // 2. Perbaikan di sini: Akses data.stats untuk iterasi
    if (data.stats && Array.isArray(data.stats)) {
        data.stats.forEach(metric => {
            const valText = nf.format(metric.value) + (metric.suffix || '');
            const changeIcon = metric.change >= 0 ? '<path d="M12 8l-6 6h12z"/>' : '<path d="M12 16l-6-6h12z"/>';
            const changeClass = metric.change >= 0 ? 'positive' : 'negative';
            
            const blockHTML = `
                <div class="stat-block">
                    <div class="stat-label">${metric.label}</div>
                    <div class="stat-value" data-target="${metric.value}" data-initial="0">${valText}</div>
                    <div class="stat-change ${changeClass}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">${changeIcon}</svg>
                        <span>${Math.abs(metric.change || 0)}%</span>
                    </div>
                </div>`;
            overviewGrid.innerHTML += blockHTML;
        });

        const ctaCardHTML = `
                <div class="cta-block">
                    <h5>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                        Go Deeper
                    </h5>
                    <p>Track competitors and unlock historical data with our Pro plan.</p>
                </div>
                <div class="cta-block" style="border-left: 4px solid var(--blue);">
                    <h5>
                        ⚡️  Get Real-time Alerts 
                    </h5>
                    <p>Never miss a conversation.  Get instant notifications for new mentions on Pro.</p>
                </div>
                <div class="cta-block" style="border-left: 4px solid var(--green);">
                    <h5>
                        🧠  Emotion & Intent Analysis
                    </h5>
                    <p>Go beyond Positive and Negative. Understand user emotion and urgency with our advanced AI</p>
                </div>
            `;
        overviewGrid.innerHTML += ctaCardHTML;
        //overviewGrid.innerHTML += '<div class="stat-block cta-card"><div class="cta-decoration"><div class="Seksama-circle"></div><div class="gradient-orb"></div></div><div class="cta-content"><div class="cta-header"><span class="cta-icon">🚀</span><h3 class="cta-title">Go Beyond The Numbers</h3></div><p class="cta-description">Upgrade to Pro to track competitors<br>and get real-time alerts.</p><button class="cta-button"><span class="button-text">Upgrade to Pro</span><svg class="button-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button></div><div class="accent-line"></div></div>';
    }
    
    // 3. Panggil animasi setelah semua elemen HTML dibuat
    document.querySelectorAll('#overview-grid .stat-value').forEach(el => {
        const target = parseFloat(el.dataset.target);
        if (!isNaN(target)) {
            // Set nilai awal dari dataset untuk animasi yang lebih mulus
            el.dataset.initial = el.textContent.replace(/[^0-9.]/g,'') || '0';
            animateValue(el, target);
        }
    });
}
// Ganti renderTopAnalytics yang lama
function renderTopAnalytics(analyticsData){
    animateValue(mentionsEl, analyticsData.mentions);
    const s = analyticsData.sentiment;
    document.getElementById('sentBar').style.cssText = `--pos:${s.pos}%;--neu:${s.neu}%;--neg:${s.neg}%`;
    document.getElementById('sentimentText').textContent = `👍 ${s.pos}% • 😐 ${s.neu}% • 👎 ${s.neg}%`;
    const tags=document.getElementById('sourceTags'); tags.innerHTML='';
    
    //analyticsData.topSources.forEach(n=>{const s=document.createElement('span');s.className='tag';s.textContent=n;tags.appendChild(s)});
    if (analyticsData.topSources && analyticsData.topSources.length > 0) {
        analyticsData.topSources.forEach(domain => {
            // Buat elemen anchor (<a>) agar bisa diklik
            const link = document.createElement('a');
            link.href = `http://${domain}`; // Buat tautan ke domain
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'tag';

            // Buat elemen gambar (<img>) untuk favicon
            const favicon = document.createElement('img');
            favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`; // Gunakan Google Favicon API
            favicon.alt = `${domain} favicon`;
            favicon.className = 'favicon';
            // Tambahkan error handler jika favicon tidak ditemukan
            favicon.onerror = () => { favicon.src = 'https://via.placeholder.com/16/E2E8F0/94A3B8?text=X'; };

            // Buat elemen span untuk teks nama domain
            const text = document.createElement('span');
            text.textContent = domain;

            // Gabungkan elemen-elemen
            link.appendChild(favicon);

            // Tambahkan ke kontainer
            tags.appendChild(link);
        });
    } else {
        // Tampilkan placeholder jika tidak ada sumber
        tags.innerHTML = '<span class="tag">No sources found</span>';
    }

    const series = analyticsData.trend.map((v, i) => ({ x: i / (analyticsData.trend.length - 1) * 100, y: 100 - v }));
    const area=document.getElementById('areaPath'),line=document.getElementById('linePath'),dTop=`M ${series[0].x},${series[0].y} `+series.map(p=>`L ${p.x},${p.y}`).join(' ');
    area.setAttribute('d',dTop+' L 100,95 L 0,95 Z');line.setAttribute('d',dTop);
    const len=line.getTotalLength();line.style.strokeDasharray=String(len);line.style.strokeDashoffset=String(len);area.style.opacity='0';
    requestAnimationFrame(()=>{line.style.transition='stroke-dashoffset .9s cubic-bezier(.25,.8,.25,1)';line.style.strokeDashoffset='0';area.style.transition='opacity .6s ease';area.style.opacity='1'});
}

// Ganti form submit handler yang lama
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    analyzeBtn.classList.add('loading'); analyzeBtn.disabled = true;
    
    resultsWrapper.style.display = 'block';
    analyticsContainer.classList.add('loading');
    mentionsContainer.classList.add('loading');
    touchNotification.classList.remove('visible');

    try {
        const keyword = brandInput.value.trim();
        if (!keyword) {
            alert("Please enter a keyword to analyze.");
            return;
        }
        const encodedKeyword = encodeURIComponent(keyword);

        const response = await fetch(`/api/analyze?keyword=${encodedKeyword}`);
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Render data dari backend
        renderTopAnalytics(data.topAnalytics);
        // Ganti data mentions dari backend ke fungsi render
        renderMentions(data.mentions); 
        // Ganti data overview dari backend ke fungsi render
        updateOverview(data.overview); 

    } catch (error) {
        console.error("Failed to fetch analysis:", error);
        alert(`Analysis failed: ${error.message}. Something went wrong. This may be blocking automated requests. Try again later.`);
    } finally {
        analyticsContainer.classList.remove('loading');
        mentionsContainer.classList.remove('loading');
        analyzeBtn.classList.remove('loading'); analyzeBtn.disabled = false;
        
        resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(()=> touchNotification.classList.add('visible'), 500);
    }
});


    // Scroll-reveal observer
    const io=new IntersectionObserver((e)=>e.forEach(i=>(i.isIntersecting&&(i.target.classList.add('in'),io.unobserve(i.target)))),{threshold:0.1});
    [...document.querySelectorAll('.reveal')].forEach(el=>io.observe(el));

    // Initial load
    document.getElementById('year').textContent = new Date().getFullYear();
    renderOverview();
  </script>
</body>
</html>
