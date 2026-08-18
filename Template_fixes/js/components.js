/* ============================================================
   CompareHub — components.js
   Reusable header, footer, and mobile nav components.
   Each page sets window.PAGE_CONFIG before loading this script.

   PAGE_CONFIG shape:
   {
     activePage: 'home' | 'how-it-works' | 'events' | 'contact' | ...
   }
   ============================================================ */

(function () {
  'use strict';

  const cfg = window.PAGE_CONFIG || {};
  const activePage = cfg.activePage || '';

  window.CompareHub = window.CompareHub || {};
  const CH = window.CompareHub;
  CH.auth = CH.auth || {};
  CH.vendor = CH.vendor || {};

  function navCls(page) {
    return activePage === page
      ? 'font-work font-medium text-[14px] text-[#155dfc]'
      : 'font-work font-medium text-[14px] text-[#364153] hover:text-[#155dfc] transition-colors';
  }

  /* ──────────────────────────────────────────────────────────
     DESKTOP HEADER (Customer)
     ────────────────────────────────────────────────────────── */
  const DESKTOP_HEADER_HTML = `
<header class="hidden sm:flex fixed top-0 left-0 right-0 z-50 h-[70px] items-center bg-white border-b border-[#f3f4f6]" style="box-shadow:0 2px 4px rgba(0,0,0,0.06)">
  <div class="w-full max-w-[1290px] mx-auto px-8 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-2 shrink-0">
      <img src="images/logos/logo-dark.svg" alt="CompareHub" class="h-8 w-auto">
    </a>
    <div class="flex items-center gap-8">
      <nav class="flex items-center gap-8">
        <a href="how-it-works.html" class="${navCls('how-it-works')}">How it works</a>
        <a href="events.html" class="${navCls('events')}">Events</a>
        <a href="become-vendor.html" class="${navCls('become-vendor')}">Become Vendor</a>
      </nav>
      <div class="flex items-center gap-3">
        <button id="open-compare-drawer" class="flex items-center gap-1.5 bg-[#155dfc] text-white font-work font-medium text-[14px] px-3 py-2 rounded-[14px] hover:bg-[#1447e6] transition-colors">
          <i data-lucide="git-compare" class="w-4 h-4"></i> Compare
        </button>

        <!-- Guest: visible when not logged in -->
        <button id="header-sign-in-btn" onclick="CompareHub.auth.show('login')" class="border border-[#e5e7eb] text-[#364153] font-work font-medium text-[14px] px-4 py-1.5 rounded-[14px] hover:bg-[#f9fafb] transition-colors">Sign in</button>

        <!-- Auth: visible when logged in (hidden by default) -->
        <div id="header-user-area" class="hidden relative">
          <button id="header-user-btn" class="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-[14px] hover:bg-[#f9fafb] transition-colors border border-[#e5e7eb]">
            <div class="w-7 h-7 rounded-[8px] bg-[#155dfc] flex items-center justify-center shrink-0">
              <span id="header-user-initials" class="font-inter font-bold text-[11px] text-white leading-none">AB</span>
            </div>
            <span id="header-user-first-name" class="font-work font-medium text-[14px] text-[#364153]">User</span>
            <i data-lucide="chevron-down" id="header-user-chevron" class="w-3.5 h-3.5 text-[#6a7282]" style="transition:transform 0.2s"></i>
          </button>
          <!-- Dropdown -->
          <div id="header-user-dropdown" class="hidden absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white rounded-[14px] border border-[#f3f4f6] py-1.5 z-50" style="box-shadow:0 8px 24px rgba(0,0,0,0.12)">
            <a href="dashboard.html" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#364153] hover:bg-[#f9fafb] transition-colors" style="text-decoration:none">
              <i data-lucide="layout-dashboard" class="w-3.5 h-3.5 text-[#6a7282] shrink-0"></i> Dashboard
            </a>
            <a href="wishlist.html" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#364153] hover:bg-[#f9fafb] transition-colors" style="text-decoration:none">
              <i data-lucide="heart" class="w-3.5 h-3.5 text-[#6a7282] shrink-0"></i> Wishlist
            </a>
            <hr class="border-[#f3f4f6] my-1">
            <button onclick="CompareHub.auth.signOut()" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#ef4444] hover:bg-[#fff5f5] transition-colors w-full text-left">
              <i data-lucide="log-out" class="w-3.5 h-3.5 shrink-0"></i> Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</header>`;

  /* ──────────────────────────────────────────────────────────
     DESKTOP HEADER (Vendor)
     ────────────────────────────────────────────────────────── */
  const VENDOR_HEADER_HTML = `
<header class="hidden sm:flex fixed top-0 left-0 right-0 z-50 h-[70px] items-center bg-white border-b border-[#f3f4f6]" style="box-shadow:0 2px 4px rgba(0,0,0,0.06)">
  <div class="w-full max-w-[1290px] mx-auto px-8 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-2 shrink-0">
      <img src="images/logos/logo-dark.svg" alt="CompareHub" class="h-8 w-auto">
    </a>
    <div class="flex items-center gap-8">
      <nav class="flex items-center gap-8">
        <a href="vendor-dashboard.html" class="${activePage === 'vendor' ? 'font-work font-medium text-[14px] text-[#155dfc]' : 'font-work font-medium text-[14px] text-[#364153] hover:text-[#155dfc] transition-colors'}">Dashboard</a>
      </nav>
      <div class="flex items-center gap-3">
        <!-- Vendor Area -->
        <div id="header-vendor-area" class="relative">
          <button id="header-vendor-btn" class="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-[14px] hover:bg-[#f9fafb] transition-colors border border-[#e5e7eb]">
            <div class="w-7 h-7 rounded-[8px] bg-[#032d71] flex items-center justify-center shrink-0">
              <span id="header-vendor-initials" class="font-inter font-bold text-[11px] text-white leading-none">--</span>
            </div>
            <span id="header-vendor-name" class="font-work font-medium text-[14px] text-[#364153]">Vendor</span>
            <i data-lucide="chevron-down" id="header-vendor-chevron" class="w-3.5 h-3.5 text-[#6a7282]" style="transition:transform 0.2s"></i>
          </button>
          <!-- Dropdown -->
          <div id="header-vendor-dropdown" class="hidden absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white rounded-[14px] border border-[#f3f4f6] py-1.5 z-50" style="box-shadow:0 8px 24px rgba(0,0,0,0.12)">
            <a href="vendor-dashboard.html" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#364153] hover:bg-[#f9fafb] transition-colors" style="text-decoration:none">
              <i data-lucide="layout-dashboard" class="w-3.5 h-3.5 text-[#6a7282] shrink-0"></i> Dashboard
            </a>
            <a href="vendor-products.html" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#364153] hover:bg-[#f9fafb] transition-colors" style="text-decoration:none">
              <i data-lucide="box" class="w-3.5 h-3.5 text-[#6a7282] shrink-0"></i> Products
            </a>
            <a href="vendor-settings.html" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#364153] hover:bg-[#f9fafb] transition-colors" style="text-decoration:none">
              <i data-lucide="settings" class="w-3.5 h-3.5 text-[#6a7282] shrink-0"></i> Settings
            </a>
            <hr class="border-[#f3f4f6] my-1">
            <button onclick="CompareHub.vendor.signOut()" class="flex items-center gap-2.5 px-4 py-2.5 font-work font-medium text-[13px] text-[#ef4444] hover:bg-[#fff5f5] transition-colors w-full text-left">
              <i data-lucide="log-out" class="w-3.5 h-3.5 shrink-0"></i> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>`;

  /* ──────────────────────────────────────────────────────────
     FOOTER  (desktop only — hidden on mobile by design)
     ────────────────────────────────────────────────────────── */
  const FOOTER_HTML = `
<footer class="hidden sm:block bg-[#181d25]">
  <!-- Newsletter banner -->
  <div class="border-b border-[#1e2939] px-[120px] py-5">
    <div class="max-w-[1272px] mx-auto">
      <div class="relative overflow-hidden rounded-[16px] flex flex-wrap items-center justify-between gap-6 px-10 py-7" style="background:linear-gradient(90deg,#155dfc 0%,#1447e6 100%)">
        <div class="relative flex items-center gap-4">
          <div class="bg-white/15 w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0">
            <i data-lucide="mail" class="w-6 h-6 text-white"></i>
          </div>
          <div>
            <h4 class="font-work font-bold text-[18px] text-white">Get the best deals in your inbox</h4>
            <p class="font-work text-[14px] text-[#bedbff]">Price alerts, flash deals &amp; new vendor arrivals — weekly, no spam.</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <input id="newsletter-email" type="email" placeholder="your@email.com" class="bg-white/10 border border-white/20 rounded-[14px] px-4 py-2.5 font-work text-[14px] text-[#8ec5ff] placeholder-[#8ec5ff] outline-none" style="width:220px">
          <button id="newsletter-btn" class="bg-white text-[#1447e6] font-work font-semibold text-[14px] h-[42px] px-5 rounded-[14px] flex items-center gap-2 hover:bg-blue-50 transition-colors whitespace-nowrap">
            Subscribe <i data-lucide="arrow-right" class="w-4 h-4 text-[#1447e6]"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Links grid -->
  <div class="px-[120px] py-12">
    <div class="flex items-start justify-between max-w-[1237px] mx-auto gap-8">
      <!-- Brand col -->
      <div class="w-[320px] shrink-0 space-y-6">
        <img src="images/logos/logo-footer.svg" alt="CompareHub" class="h-7 w-auto">
        <p class="font-work text-[12px] text-[#99a1af] leading-[19.5px]">Nigeria's #1 price comparison marketplace — find the cheapest price from verified vendors nationwide.</p>
        <div class="flex items-center gap-1.5">
          <a href="https://x.com/comparehubng" target="_blank" rel="noopener" class="bg-[#1e2939] w-7 h-7 rounded-[10px] flex items-center justify-center hover:bg-[#2d3a4a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://instagram.com/comparehubng" target="_blank" rel="noopener" class="bg-[#1e2939] w-7 h-7 rounded-[10px] flex items-center justify-center hover:bg-[#2d3a4a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/></svg>
          </a>
          <a href="https://facebook.com/comparehubng" target="_blank" rel="noopener" class="bg-[#1e2939] w-7 h-7 rounded-[10px] flex items-center justify-center hover:bg-[#2d3a4a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://linkedin.com/company/comparehubng" target="_blank" rel="noopener" class="bg-[#1e2939] w-7 h-7 rounded-[10px] flex items-center justify-center hover:bg-[#2d3a4a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
        <!-- App download -->
        <div class="space-y-2">
          <p class="font-work text-[12px] text-[#4a5565]">Download the app</p>
          <div class="flex gap-2">
            <a href="https://play.google.com/store" target="_blank" rel="noopener" class="bg-white/10 h-[40px] w-[129px] rounded-[10px] flex items-center gap-2 pl-3">
              <i data-lucide="play" class="w-4 h-4 text-white shrink-0"></i>
              <div>
                <p class="font-work text-[9px] text-[#6a7282] tracking-[0.17px]">GET IT ON</p>
                <p class="font-work font-semibold text-[12px] text-white">Google Play</p>
              </div>
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener" class="bg-white/10 h-[40px] w-[129px] rounded-[10px] flex items-center gap-2 pl-3">
              <i data-lucide="apple" class="w-4 h-4 text-white shrink-0"></i>
              <div>
                <p class="font-work text-[9px] text-[#6a7282] tracking-[0.17px]">DOWNLOAD ON</p>
                <p class="font-work font-semibold text-[12px] text-white">App Store</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <!-- Category col -->
      <div class="space-y-4">
        <p class="font-work font-semibold text-[12px] text-[#d1d5dc] tracking-[0.6px] uppercase">Category</p>
        <nav class="flex flex-col gap-4">
          <a href="category.html#cat=electronics" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Smartphones</a>
          <a href="category.html#cat=electronics" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Laptops</a>
          <a href="category.html#cat=electronics" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Headphones</a>
          <a href="category.html#cat=food" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Food &amp; Groceries</a>
          <a href="category.html#cat=all" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Gaming</a>
        </nav>
      </div>
      <!-- Company col -->
      <div class="space-y-4">
        <p class="font-work font-semibold text-[12px] text-[#d1d5dc] tracking-[0.6px] uppercase">Company</p>
        <nav class="flex flex-col gap-4">
          <a href="about.html" class="font-work font-medium text-[12px] ${activePage === 'about' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">About Us</a>
          <a href="how-it-works.html" class="font-work font-medium text-[12px] ${activePage === 'how-it-works' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">How It Works</a>
          <a href="become-vendor.html" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Become a Vendor</a>
          <a href="events.html" class="font-work font-medium text-[12px] ${activePage === 'events' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">Events</a>
        </nav>
      </div>
      <!-- Support col -->
      <div class="space-y-4">
        <p class="font-work font-semibold text-[12px] text-[#d1d5dc] tracking-[0.6px] uppercase">Support</p>
        <nav class="flex flex-col gap-4">
          <a href="contact.html" class="font-work font-medium text-[12px] ${activePage === 'contact' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">Contact Us</a>
          <a href="contact.html" class="font-work font-medium text-[12px] text-[#99a1af] hover:text-white transition-colors">Help Centre</a>
          <a href="privacy-policy.html" class="font-work font-medium text-[12px] ${activePage === 'privacy-policy' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">Privacy Policy</a>
          <a href="terms-of-use.html" class="font-work font-medium text-[12px] ${activePage === 'terms-of-use' ? 'text-white' : 'text-[#99a1af] hover:text-white'} transition-colors">Terms of Use</a>
        </nav>
        <div class="border-t border-[#1e2939] pt-4 space-y-1">
          <p class="font-work font-medium text-[12px] text-white">hello@comparehub.ng</p>
          <p class="font-work text-[12px] text-[#6a7282]">+234 801 234 5678</p>
        </div>
      </div>
    </div>
  </div>
  <!-- Bottom bar -->
  <div class="border-t border-[#1e2939] px-[152px]">
    <div class="flex items-center justify-between h-[64px]">
      <p class="font-work text-[14px] text-[#99a1af] tracking-[-0.15px]">© 2026 CompareHub Nigeria Limited. All rights reserved.</p>
      <div class="flex items-center gap-3">
        <span class="bg-[#0d542b] text-[#05df72] font-work font-medium text-[12px] px-2.5 py-1 rounded-full">🇳🇬 Made in Nigeria</span>
        <span class="font-work text-[12px] text-[#99a1af]">All prices in Nigerian Naira (₦)</span>
      </div>
    </div>
  </div>
</footer>`;

  /* ──────────────────────────────────────────────────────────
     MOBILE BOTTOM NAV
     ────────────────────────────────────────────────────────── */
  function navTabCls(page) {
    return activePage === page ? 'text-[#155dfc]' : 'text-[#99a1af]';
  }

  const MOBILE_NAV_HTML = `
<nav class="sm:hidden fixed bottom-0 left-0 right-0 bg-white z-50 flex items-center" style="height:71px;border-top:1px solid #f3f4f6;box-shadow:0 -4px 20px rgba(0,0,0,0.07)">
  <a href="index.html" class="flex flex-col items-center gap-[3px] py-2 flex-1">
    <div class="w-[34px] h-[34px] flex items-center justify-center">
      <i data-lucide="home" class="w-[22px] h-[22px] ${navTabCls('home')}"></i>
    </div>
    <span class="font-inter font-semibold text-[10px] ${navTabCls('home')}">Home</span>
  </a>
  <button id="mobile-nav-compare" class="flex flex-col items-center gap-[3px] py-2 flex-1">
    <div class="w-[34px] h-[34px] flex items-center justify-center">
      <i data-lucide="git-compare" class="w-[22px] h-[22px] ${navTabCls('compare')}"></i>
    </div>
    <span class="font-inter font-semibold text-[10px] ${navTabCls('compare')}">Compare</span>
  </button>
  <a href="events.html" class="flex flex-col items-center gap-[3px] py-2 flex-1">
    <div class="w-[34px] h-[34px] flex items-center justify-center">
      <i data-lucide="calendar" class="w-[22px] h-[22px] ${navTabCls('events')}"></i>
    </div>
    <span class="font-inter font-semibold text-[10px] ${navTabCls('events')}">Events</span>
  </a>
  <a href="account-settings.html" class="flex flex-col items-center gap-[3px] py-2 flex-1">
    <div class="w-[34px] h-[34px] flex items-center justify-center">
      <i data-lucide="user" class="w-[22px] h-[22px] ${navTabCls('account')}"></i>
    </div>
    <span class="font-inter font-semibold text-[10px] ${navTabCls('account')}">Account</span>
  </a>
</nav>`;

  /* ──────────────────────────────────────────────────────────
     MOUNT — inject into placeholder elements
     ────────────────────────────────────────────────────────── */
  function mount(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    el.outerHTML = html;
  }

  /* ──────────────────────────────────────────────────────────
     VENDOR AUTH STATE — check if vendor is logged in
     ────────────────────────────────────────────────────────── */
  function getStoredVendor() {
    try { return JSON.parse(localStorage.getItem('ch_vendor') || 'null'); } catch(e) { return null; }
  }

  /* ──────────────────────────────────────────────────────────
     MOUNT HEADER — choose between customer or vendor header
     ────────────────────────────────────────────────────────── */
  function mountHeader() {
    const vendor = getStoredVendor();
    const headerHTML = (vendor && vendor.isLoggedIn) ? VENDOR_HEADER_HTML : DESKTOP_HEADER_HTML;
    mount('app-header', headerHTML);
  }

  /* ──────────────────────────────────────────────────────────
     AUTH MODALS (Login / Create Account / OTP / Forgot)
     — Each outer overlay closes on click (backdrop behaviour)
     — Each inner card stops propagation so clicks don't close
     — Every card has an X close button
     ────────────────────────────────────────────────────────── */
  const GOOGLE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';

  // Reusable close-button HTML (absolute top-right of each card)
  const CLOSE_BTN = `<button onclick="CompareHub.auth.close()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors" title="Close">
    <i data-lucide="x" class="w-4 h-4 text-[#6a7282]"></i>
  </button>`;

  const AUTH_MODALS_HTML = `
<!-- ── LOGIN MODAL ─────────────────────────────────────── -->
<div id="auth-login" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4 overflow-y-auto py-8" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[400px] p-8 flex flex-col gap-4 my-auto" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="text-center">
      <h2 class="font-work font-bold text-[22px] text-[#101828]">Welcome</h2>
      <p class="font-work text-[13px] text-[#99a1af] mt-1">Start comparing products and save more</p>
    </div>
         <form id="login-form" method="POST" action="/user/login" class="flex flex-col gap-3">
       <input type="hidden" name="_csrf" value="">
       <div>
         <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Email Address / Phone</label>
         <input id="login-identifier" name="name" type="text" placeholder="Enter email or phone number" autocomplete="username" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
         <p id="login-identifier-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
       </div>
       <div>
         <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Password</label>
         <div class="relative">
           <input id="login-password" name="pass" type="password" placeholder="••••••••••" autocomplete="current-password" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors pr-11">
           <button type="button" onclick="CompareHub.auth.togglePwd('login-password',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#6a7282]">
             <i data-lucide="eye" class="w-4 h-4"></i>
           </button>
         </div>
         <p id="login-password-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
         <div class="text-right mt-1.5">
           <button type="button" onclick="CompareHub.auth.show('forgot')" class="font-work font-medium text-[12px] text-[#155dfc] hover:underline">Forgot Password?</button>
         </div>
       </div>
       <button type="submit" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Sign In</button>
     </form>
     <button type="button" onclick="CompareHub.auth.googleSignIn()" class="w-full flex items-center justify-center gap-2 border border-[#e5e7eb] text-[#364153] font-work font-semibold text-[14px] py-3 rounded-[12px] hover:bg-[#f9fafb] transition-colors">
       ${GOOGLE_SVG} Continue with Google
     </button>
     <p class="text-center font-work text-[13px] text-[#6a7282]">Don't have an account? <button type="button" onclick="CompareHub.auth.show('signup')" class="text-[#155dfc] font-semibold hover:underline">Sign Up</button></p>
  </div>
</div>

<!-- ── CREATE ACCOUNT MODAL ────────────────────────────── -->
<div id="auth-signup" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4 overflow-y-auto py-8" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[400px] p-8 flex flex-col gap-4 my-auto" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="text-center">
      <h2 class="font-work font-bold text-[22px] text-[#101828]">Create Account</h2>
      <p class="font-work text-[13px] text-[#99a1af] mt-1">Let's create your account right away.</p>
    </div>
    <div class="flex flex-col gap-3">
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Full Name</label>
        <input id="signup-name" type="text" placeholder="Your full name" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
        <p id="signup-name-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Email Address</label>
        <input id="signup-email" type="email" placeholder="your@email.com" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
        <p id="signup-email-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Phone Number</label>
        <div class="flex items-center border border-[#e5e7eb] rounded-[12px] overflow-hidden focus-within:border-[#155dfc] transition-colors" id="signup-phone-wrap">
          <div class="flex items-center gap-1.5 px-3 border-r border-[#e5e7eb] shrink-0 h-[50px]">
            <span>🇳🇬</span>
            <span class="font-work text-[14px] text-[#364153]">+234</span>
          </div>
          <input id="signup-phone" type="tel" placeholder="800 000 0000" class="flex-1 px-3 py-3 font-work text-[14px] text-[#101828] outline-none">
        </div>
        <p id="signup-phone-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Password</label>
        <div class="relative">
          <input id="signup-password" type="password" placeholder="Min. 6 characters" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors pr-11">
          <button type="button" onclick="CompareHub.auth.togglePwd('signup-password',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#6a7282]">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </div>
        <p id="signup-password-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
    </div>
    <button onclick="CompareHub.auth.doSignUp()" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Continue</button>
    <button onclick="CompareHub.auth.googleSignIn()" class="w-full flex items-center justify-center gap-2 border border-[#e5e7eb] text-[#364153] font-work font-semibold text-[14px] py-3 rounded-[12px] hover:bg-[#f9fafb] transition-colors">
      ${GOOGLE_SVG} Continue with Google
    </button>
    <p class="text-center font-work text-[13px] text-[#6a7282]">Already have an account? <button onclick="CompareHub.auth.show('login')" class="text-[#155dfc] font-semibold hover:underline">Sign In</button></p>
  </div>
</div>

<!-- ── OTP MODAL (Sign Up) ─────────────────────────────── -->
<div id="auth-otp" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[380px] p-8 flex flex-col items-center gap-5" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center">
      <i data-lucide="phone" class="w-7 h-7 text-[#155dfc]"></i>
    </div>
    <div class="text-center">
      <h2 class="font-work font-bold text-[20px] text-[#101828]">Verify your phone number</h2>
      <p class="font-work text-[13px] text-[#6a7282] mt-1.5">Enter the 5-digit code sent to<br><span class="text-[#101828] font-medium">all*******@gmail.com</span></p>
    </div>
    <div class="flex items-center gap-3">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,0,'otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="otp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,1,'otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="otp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,2,'otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="otp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,3,'otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="otp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,4,'otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="otp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
    </div>
    <p id="otp-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] -mt-2"></p>
    <button onclick="CompareHub.auth.doOTP('otp-inputs','dashboard.html')" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Verify</button>
    <p class="font-work text-[13px] text-[#6a7282]">Resend in <span id="otp-timer" class="text-[#155dfc] font-semibold underline cursor-pointer">04:59</span></p>
  </div>
</div>

<!-- ── FORGOT PASSWORD — EMAIL ─────────────────────────── -->
<div id="auth-forgot" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[400px] p-8 flex flex-col gap-5" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <button onclick="CompareHub.auth.show('login')" class="flex items-center gap-2 text-[#6a7282] hover:text-[#364153] transition-colors self-start -mb-1">
      <i data-lucide="arrow-left" class="w-4 h-4"></i>
      <span class="font-work text-[13px]">Back to Sign In</span>
    </button>
    <div class="text-center">
      <div class="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-3">
        <i data-lucide="mail" class="w-6 h-6 text-[#155dfc]"></i>
      </div>
      <h2 class="font-work font-bold text-[22px] text-[#101828]">Forgot Password?</h2>
      <p class="font-work text-[13px] text-[#99a1af] mt-1">Enter your email and we'll send a reset code</p>
    </div>
    <div>
      <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Email Address</label>
      <input id="forgot-email" type="email" placeholder="your@email.com" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <p id="forgot-email-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
    </div>
    <button onclick="CompareHub.auth.doForgot()" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Send Reset Code</button>
  </div>
</div>

<!-- ── FORGOT PASSWORD — OTP ───────────────────────────── -->
<div id="auth-forgot-otp" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[380px] p-8 flex flex-col items-center gap-5" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center">
      <i data-lucide="mail" class="w-7 h-7 text-[#155dfc]"></i>
    </div>
    <div class="text-center">
      <h2 class="font-work font-bold text-[20px] text-[#101828]">Check your email</h2>
      <p class="font-work text-[13px] text-[#6a7282] mt-1.5">Enter the 5-digit code sent to<br><span id="forgot-otp-email" class="text-[#101828] font-medium">your@email.com</span></p>
    </div>
    <div class="flex items-center gap-3">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,0,'forgot-otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="fotp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,1,'forgot-otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="fotp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,2,'forgot-otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="fotp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,3,'forgot-otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="fotp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
      <input type="text" maxlength="1" oninput="CompareHub.auth.otpNext(this,4,'forgot-otp-inputs')" onkeydown="CompareHub.auth.otpBack(event,this)" class="fotp-box w-12 h-14 text-center border border-[#e5e7eb] rounded-[12px] font-work font-bold text-[22px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors">
    </div>
    <p id="fotp-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] -mt-2"></p>
    <button onclick="CompareHub.auth.doOTP('forgot-otp-inputs','forgot-success')" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Verify Code</button>
    <p class="font-work text-[13px] text-[#6a7282]">Resend in <span id="fotp-timer" class="text-[#155dfc] font-semibold underline cursor-pointer">04:59</span></p>
  </div>
</div>

<!-- ── FORGOT PASSWORD — SUCCESS ──────────────────────── -->
<div id="auth-forgot-success" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[380px] p-8 flex flex-col items-center gap-5 text-center" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
      <i data-lucide="check" class="w-7 h-7 text-[#16a34a]"></i>
    </div>
    <div>
      <h2 class="font-work font-bold text-[22px] text-[#101828]">Code Verified!</h2>
      <p class="font-work text-[13px] text-[#99a1af] mt-1.5">Your identity has been confirmed. Now set your new password.</p>
    </div>
    <button onclick="CompareHub.auth.show('new-password')" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Set New Password</button>
  </div>
</div>

<!-- ── FORGOT PASSWORD — CHANGE PASSWORD ──────────────── -->
<div id="auth-new-password" class="hidden fixed inset-0 z-[201] flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)" onclick="CompareHub.auth.close()">
  <div class="relative bg-white rounded-[20px] w-full max-w-[400px] p-8 flex flex-col gap-5" style="box-shadow:0 24px 64px rgba(0,0,0,0.2)" onclick="event.stopPropagation()">
    ${CLOSE_BTN}
    <div class="text-center">
      <div class="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-3">
        <i data-lucide="lock" class="w-6 h-6 text-[#155dfc]"></i>
      </div>
      <h2 class="font-work font-bold text-[22px] text-[#101828]">Set New Password</h2>
      <p class="font-work text-[13px] text-[#99a1af] mt-1">Choose a strong password you haven't used before</p>
    </div>
    <div class="flex flex-col gap-3">
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">New Password</label>
        <div class="relative">
          <input id="newpwd-new" type="password" placeholder="Min. 6 characters" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors pr-11">
          <button type="button" onclick="CompareHub.auth.togglePwd('newpwd-new',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#6a7282]">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </div>
        <p id="newpwd-new-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
      <div>
        <label class="block font-work font-medium text-[12px] text-[#364153] mb-1.5">Confirm New Password</label>
        <div class="relative">
          <input id="newpwd-confirm" type="password" placeholder="Re-enter password" class="auth-input w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 font-work text-[14px] text-[#101828] outline-none focus:border-[#155dfc] transition-colors pr-11">
          <button type="button" onclick="CompareHub.auth.togglePwd('newpwd-confirm',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#6a7282]">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </div>
        <p id="newpwd-confirm-err" class="auth-err hidden font-work text-[11px] text-[#ef4444] mt-1"></p>
      </div>
    </div>
    <button onclick="CompareHub.auth.doNewPassword()" class="w-full bg-[#155dfc] text-white font-work font-semibold text-[15px] py-3 rounded-[12px] hover:bg-[#1447e6] transition-colors">Update Password</button>
  </div>
</div>`;

  /* ── Mount all components ── */
  // mountHeader();
  // mount('app-footer', FOOTER_HTML);
  // mount('app-mobile-nav', MOBILE_NAV_HTML);
  // document.body.insertAdjacentHTML('beforeend', AUTH_MODALS_HTML);

  // Re-render Lucide icons after injection
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  /* ──────────────────────────────────────────────────────────
     AUTH STATE — persisted in localStorage
     key: 'ch_user'  value: { name, email }
     ────────────────────────────────────────────────────────── */

  function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('ch_user') || 'null'); } catch(e) { return null; }
  }

  function saveUser(name, email) {
    localStorage.setItem('ch_user', JSON.stringify({ name: name.trim(), email: (email || '').trim() }));
  }

  // Update the header to reflect current auth state
  function authUpdateHeader() {
    const user = getStoredUser();
    const guestBtn  = document.getElementById('header-sign-in-btn');
    const authArea  = document.getElementById('header-user-area');

    if (user && user.name) {
      if (guestBtn)  guestBtn.classList.add('hidden');
      if (authArea) { authArea.classList.remove('hidden'); authArea.style.display = 'block'; }

      const initials  = user.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const firstName = user.name.split(/\s+/)[0];
      const initialsEl  = document.getElementById('header-user-initials');
      const nameEl      = document.getElementById('header-user-first-name');
      if (initialsEl) initialsEl.textContent = initials;
      if (nameEl)     nameEl.textContent = firstName;
    } else {
      if (guestBtn)  guestBtn.classList.remove('hidden');
      if (authArea) { authArea.classList.add('hidden'); authArea.style.display = ''; }
    }
  }

  // Wire header user-area dropdown toggle
  function initHeaderDropdown() {
    const btn      = document.getElementById('header-user-btn');
    const dropdown = document.getElementById('header-user-dropdown');
    const chevron  = document.getElementById('header-user-chevron');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('hidden');
      dropdown.classList.toggle('hidden', isOpen);
      if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      if (chevron) chevron.style.transform = '';
    });
  }

  // Initialize vendor header if vendor is logged in
  function initVendorHeader() {
    const vendor = getStoredVendor();
    if (!vendor || !vendor.isLoggedIn) return;

    const initialsEl = document.getElementById('header-vendor-initials');
    const nameEl = document.getElementById('header-vendor-name');
    if (initialsEl && vendor.businessName) {
      const initials = vendor.businessName.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      initialsEl.textContent = initials;
    }
    if (nameEl && vendor.businessName) {
      nameEl.textContent = vendor.businessName.split(/\s+/)[0];
    }

    // Wire dropdown toggle
    const btn = document.getElementById('header-vendor-btn');
    const dropdown = document.getElementById('header-vendor-dropdown');
    const chevron = document.getElementById('header-vendor-chevron');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('hidden');
      dropdown.classList.toggle('hidden', isOpen);
      if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      if (chevron) chevron.style.transform = '';
    });
  }

  // Run on every page load
  const vendor = getStoredVendor();
  if (vendor && vendor.isLoggedIn) {
    initVendorHeader();
  } else {
    authUpdateHeader();
    initHeaderDropdown();
  }

  /* ──────────────────────────────────────────────────────────
     AUTH MODAL HELPERS (global)
     ────────────────────────────────────────────────────────── */

  const ALL_AUTH_MODALS = ['login','signup','otp','forgot','forgot-otp','forgot-success','new-password'];

  CH.auth.show = function(modal) {
    ALL_AUTH_MODALS.forEach(m => {
      const el = document.getElementById('auth-' + m);
      if (el) el.classList.add('hidden');
    });
    const target = document.getElementById('auth-' + modal);
    if (target) target.classList.remove('hidden');
    // clear errors when switching screens
    document.querySelectorAll('.auth-err').forEach(el => {
      el.textContent = '';
      el.classList.add('hidden');
    });
    document.querySelectorAll('.auth-input').forEach(el => {
      el.classList.remove('border-[#ef4444]');
    });
    if (modal === 'otp') startOtpTimer('otp-timer');
    if (modal === 'forgot-otp') startOtpTimer('fotp-timer');
  };

  CH.auth.close = function() {
    ALL_AUTH_MODALS.forEach(m => {
      const el = document.getElementById('auth-' + m);
      if (el) el.classList.add('hidden');
    });
  };

  CH.auth.signOut = function() {
    localStorage.removeItem('ch_user');
    authUpdateHeader();
    const dd = document.getElementById('header-user-dropdown');
    const chevron = document.getElementById('header-user-chevron');
    if (dd) dd.classList.add('hidden');
    if (chevron) chevron.style.transform = '';
    // If we're on a protected page, redirect home
    const protectedPages = ['dashboard.html','wishlist.html','compare-history.html','account-settings.html'];
    if (protectedPages.some(p => window.location.pathname.endsWith(p))) {
      window.location.href = 'index.html';
    }
  };

  CH.vendor.signOut = function() {
    const vendor = JSON.parse(localStorage.getItem('ch_vendor'));
    if (vendor) {
      vendor.isLoggedIn = false;
      localStorage.setItem('ch_vendor', JSON.stringify(vendor));
    }
    window.location.href = 'index.html';
  };

  CH.auth.togglePwd = function(id, btn) {
    const input = document.getElementById(id);
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    const icon = btn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isText ? 'eye' : 'eye-off');
      if (typeof lucide !== 'undefined') lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }
  };

  CH.auth.googleSignIn = function() {
    // Mock Google sign-in — save a generic user and close
    saveUser('Google User', 'user@gmail.com');
    authUpdateHeader();
    CH.auth.close();
  };

  /* OTP — move focus forward */
  CH.auth.otpNext = function(input, idx) {
    if (input.value.length === 1) {
      const parent = input.closest('.flex');
      const siblings = parent ? Array.from(parent.querySelectorAll('input')) : [];
      if (idx < siblings.length - 1) siblings[idx + 1].focus();
    }
  };

  /* OTP — move focus backward on Backspace */
  CH.auth.otpBack = function(event, input) {
    if (event.key === 'Backspace' && input.value === '') {
      const parent = input.closest('.flex');
      if (!parent) return;
      const siblings = Array.from(parent.querySelectorAll('input'));
      const i = siblings.indexOf(input);
      if (i > 0) { siblings[i - 1].focus(); siblings[i - 1].value = ''; }
    }
  };

  /* ── Validation helpers ── */
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  }
  function markInvalid(inputId) {
    const el = document.getElementById(inputId);
    if (el) el.classList.add('border-[#ef4444]');
  }
  function clearInvalid(inputId) {
    const el = document.getElementById(inputId);
    if (el) el.classList.remove('border-[#ef4444]');
  }
  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  /* ── Sign In ── */
  CH.auth.doSignIn = function() {
    const identifier = (document.getElementById('login-identifier') || {}).value || '';
    const password   = (document.getElementById('login-password')   || {}).value || '';
    clearErr('login-identifier-err');
    clearErr('login-password-err');
    clearInvalid('login-identifier');
    clearInvalid('login-password');

    if (!identifier.trim()) {
      showErr('login-identifier-err', 'Please enter your email or phone number.');
      markInvalid('login-identifier');
      return;
    }
    if (!password) {
      showErr('login-password-err', 'Please enter your password.');
      markInvalid('login-password');
      return;
    }
    if (password.length < 6) {
      showErr('login-password-err', 'Password must be at least 6 characters.');
      markInvalid('login-password');
      return;
    }

    // Derive a display name from the identifier
    let displayName = identifier.trim();
    if (displayName.includes('@')) {
      displayName = displayName.split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }
    saveUser(displayName, identifier);
    authUpdateHeader();
    CH.auth.close();

    // Show a welcome toast if available
    if (typeof CH.ui.showToast === 'function') {
      CH.ui.showToast('👋 Welcome back, ' + displayName.split(' ')[0] + '!');
    }
  };

  /* ── Sign Up ── */
  CH.auth.doSignUp = function() {
    const name  = (document.getElementById('signup-name')     || {}).value || '';
    const email = (document.getElementById('signup-email')    || {}).value || '';
    const phone = (document.getElementById('signup-phone')    || {}).value || '';
    const pwd   = (document.getElementById('signup-password') || {}).value || '';

    clearErr('signup-name-err');
    clearErr('signup-email-err');
    clearErr('signup-phone-err');
    clearErr('signup-password-err');
    ['signup-name','signup-email','signup-phone','signup-password'].forEach(clearInvalid);

    if (!name.trim()) {
      showErr('signup-name-err', 'Please enter your full name.');
      markInvalid('signup-name'); return;
    }
    if (!isEmail(email)) {
      showErr('signup-email-err', 'Please enter a valid email address.');
      markInvalid('signup-email'); return;
    }
    if (!phone.trim()) {
      showErr('signup-phone-err', 'Please enter your phone number.');
      markInvalid('signup-phone'); return;
    }
    if (pwd.length < 6) {
      showErr('signup-password-err', 'Password must be at least 6 characters.');
      markInvalid('signup-password'); return;
    }

    // Store pending signup data for after OTP verification
    sessionStorage.setItem('ch_pending_name',  name.trim());
    sessionStorage.setItem('ch_pending_email', email.trim());
    CH.auth.show('otp');
  };

  /* ── Forgot Password — send code ── */
  CH.auth.doForgot = function() {
    const email = (document.getElementById('forgot-email') || {}).value || '';
    clearErr('forgot-email-err');
    clearInvalid('forgot-email');

    if (!isEmail(email)) {
      showErr('forgot-email-err', 'Please enter a valid email address.');
      markInvalid('forgot-email'); return;
    }
    const emailLabel = document.getElementById('forgot-otp-email');
    if (emailLabel) emailLabel.textContent = email.trim();
    CH.auth.show('forgot-otp');
  };

  /* ── OTP verify (signup OTP → dashboard, forgot-pwd OTP → success screen) ── */
  CH.auth.doOTP = function(groupId, nextTarget) {
    const boxClass = groupId === 'otp-inputs' ? '.otp-box' : '.fotp-box';
    const inputs   = document.querySelectorAll(boxClass);
    const errId    = groupId === 'otp-inputs' ? 'otp-err' : 'fotp-err';
    clearErr(errId);

    let allFilled = true;
    inputs.forEach(inp => { if (!inp.value.trim()) allFilled = false; });
    if (!allFilled || inputs.length < 5) {
      showErr(errId, 'Please enter all 5 digits of the code.');
      return;
    }

    if (nextTarget && nextTarget.includes('.html')) {
      // Signup flow — save the pending user now
      const pendingName  = sessionStorage.getItem('ch_pending_name')  || 'User';
      const pendingEmail = sessionStorage.getItem('ch_pending_email') || '';
      saveUser(pendingName, pendingEmail);
      sessionStorage.removeItem('ch_pending_name');
      sessionStorage.removeItem('ch_pending_email');
      authUpdateHeader();
      window.location.href = nextTarget;
    } else {
      CH.auth.show(nextTarget);
    }
  };

  /* ── New Password ── */
  CH.auth.doNewPassword = function() {
    const newPwd     = (document.getElementById('newpwd-new')     || {}).value || '';
    const confirmPwd = (document.getElementById('newpwd-confirm') || {}).value || '';
    clearErr('newpwd-new-err');
    clearErr('newpwd-confirm-err');
    ['newpwd-new','newpwd-confirm'].forEach(clearInvalid);

    if (newPwd.length < 6) {
      showErr('newpwd-new-err', 'Password must be at least 6 characters.');
      markInvalid('newpwd-new'); return;
    }
    if (newPwd !== confirmPwd) {
      showErr('newpwd-confirm-err', 'Passwords do not match.');
      markInvalid('newpwd-confirm'); return;
    }
    CH.auth.close();
    if (typeof CH.ui.showToast === 'function') {
      CH.ui.showToast('✅ Password updated! Please sign in.');
    }
    setTimeout(() => CH.auth.show('login'), 400);
  };

  /* ── OTP countdown timer ── */
  const otpIntervals = {};
  function startOtpTimer(timerId) {
    if (otpIntervals[timerId]) clearInterval(otpIntervals[timerId]);
    let secs = 299;
    const timerEl = document.getElementById(timerId);
    if (!timerEl) return;
    timerEl.textContent = '04:59';
    otpIntervals[timerId] = setInterval(() => {
      if (secs <= 0) {
        clearInterval(otpIntervals[timerId]);
        timerEl.textContent = 'Resend';
        return;
      }
      const m = String(Math.floor(secs / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
      secs--;
    }, 1000);
  }

})();













