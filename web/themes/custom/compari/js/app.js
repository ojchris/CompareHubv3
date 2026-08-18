/* ============================================================
   CompareHub — app.js
   Vanilla JavaScript — no dependencies
   ============================================================
   NOTE: This is the cleaned version for Drupal theme integration.
   Mock data and JS DOM-rendering functions have been removed.
   See app.legacy.js for the original full file.

   WHAT'S HERE (active UI interactions):
   - Icon rendering (Lucide)
   - Compare list state & drawer
   - Wishlist button state
   - Hero slider
   - Category tab switching
   - Header scroll effect
   - Mobile menu & bottom nav
   - Auth UI state
   - Search bar wiring (NOTE: searchProducts() now needs a
     Drupal-backed endpoint — see TODO below)
   - Newsletter form
   - Location modal
   - Toast notifications
   ============================================================ */

'use strict';

window.CompareHub = window.CompareHub || {};
window.CompareHub.auth = window.CompareHub.auth || {};
window.CompareHub.vendor = window.CompareHub.vendor || {};
window.CompareHub.compare = window.CompareHub.compare || {};
window.CompareHub.ui = window.CompareHub.ui || {};
const CH = window.CompareHub;


// ── Lucide helper — call after any DOM change ────────────────
function renderIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }
}

// ============================================================
// STATE
// ============================================================

let isAuthenticated = false;
let compareList = [];       // array of product ids
let currentSlide = 0;
let sliderTimer = null;

// ============================================================
// UTILS
// ============================================================

CH.ui.showToast = function(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    if (toast && toast.classList) {
      toast.classList.remove('show');
    }
  }, duration);
};

function $(selector, root = document) {
  return root.querySelector(selector);
}
function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

window.showToast = CH.ui.showToast;

// ============================================================
// PRODUCT CARDS — Compare & Wishlist button state
// ============================================================

function refreshCompareButtons() {
  $$('.compare-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id, 10);
    const inList = compareList.includes(id);
    btn.textContent = inList ? '✓ Added' : '+ Compare';
    btn.classList.toggle('in-compare', inList);
  });
}

function refreshWishlistButtons() {
  // TODO (Drupal): Replace localStorage read with Drupal session/user data
  const savedIds = getSavedWishlistIds();
  $$('.wishlist-btn').forEach(btn => {
    // Skip icon-only wishlist buttons (e.g. product page mobile/desktop header).
    // Those have no data-id and manage their own SVG state independently.
    if (!btn.dataset.id) return;
    const id = parseInt(btn.dataset.id, 10);
    const inList = savedIds.includes(id);
    btn.textContent = inList ? '❤️ Saved' : '♡ Save';
    btn.classList.toggle('in-wishlist', inList);
  });
}

// Minimal localStorage helper — replace with Drupal AJAX in theme
function getSavedWishlistIds() {
  try {
    return JSON.parse(localStorage.getItem('ch_wishlist') || '[]');
  } catch (e) {
    return [];
  }
}

function toggleWishlistId(id) {
  const ids = getSavedWishlistIds();
  const idx = ids.indexOf(id);
  if (idx > -1) {
    ids.splice(idx, 1);
  } else {
    ids.push(id);
  }
  localStorage.setItem('ch_wishlist', JSON.stringify(ids));
  return idx === -1; // true = was added
}

function initProductCards() {
  document.addEventListener('click', e => {
    // Handle compare button
    const compareBtn = e.target.closest('.compare-btn');
    if (compareBtn) {
      e.preventDefault();

      const id = parseInt(compareBtn.dataset.id, 10);
      const idx = compareList.indexOf(id);
      const productName = compareBtn.closest('.product-card, [data-id]')
        ?.querySelector('.product-name, [class*="product-name"]')?.textContent?.trim() || `Product #${id}`;

      if (idx > -1) {
        compareList.splice(idx, 1);
        CH.ui.showToast(`"${productName}" removed from compare`);
      } else {
        if (compareList.length >= 4) {
          CH.ui.showToast('⚠️ You can compare up to 4 products at a time');
          return;
        }
        compareList.push(id);
        CH.ui.showToast(`"${productName}" added to compare`);
      }

      refreshCompareButtons();
      updateCompareBadge();
      renderCompareDrawer();
      return;
    }

    // Handle wishlist button
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      e.preventDefault();

      // Icon-only wishlist buttons (e.g. product page header) have no data-id
      // and handle their own toggle — let them through without this handler.
      if (!wishlistBtn.dataset.id) return;

      const id = parseInt(wishlistBtn.dataset.id, 10);
      const productName = wishlistBtn.closest('.product-card, [data-id]')
        ?.querySelector('.product-name, [class*="product-name"]')?.textContent?.trim() || 'product';

      const wasAdded = toggleWishlistId(id);
      CH.ui.showToast(wasAdded
        ? `Added to wishlist`
        : `Removed from wishlist`
      );

      // TODO (Drupal): Fire AJAX request to Drupal flag module here
      // e.g. fetch(`/flag/flag/wishlist/${id}`, { method: 'POST' })

      refreshWishlistButtons();
      return;
    }
  });
}

// ============================================================
// COMPARE BADGE
// ============================================================

function updateCompareBadge() {
  const count = compareList.length;

  // Desktop header badge
  const badge = document.getElementById('compare-badge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  // Mobile header badge
  const mobileBadge = document.getElementById('mobile-compare-badge');
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.classList.toggle('hidden', count === 0);
    mobileBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Mobile bottom nav badge
  const navBadge = document.getElementById('mobile-nav-badge');
  if (navBadge) {
    navBadge.textContent = count;
    navBadge.classList.toggle('hidden', count === 0);
    navBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ============================================================
// COMPARE DRAWER
// ============================================================

function renderCompareDrawer() {
  const row = document.getElementById('compare-items-row');
  if (!row) return;

  const slots = 4;
  let html = '';

  for (let i = 0; i < slots; i++) {
    const id = compareList[i];
    if (id) {
      // Try to read product info from the static card in the DOM
      const card = document.querySelector(`.product-card[data-id="${id}"], [data-id="${id}"]`);
      const name  = card?.querySelector('.product-name, [class*="product-name"]')?.textContent?.trim() || `Product #${id}`;
      const price = card?.querySelector('.product-price, [class*="product-price"]')?.textContent?.trim() || '';
      const imgSrc = card?.querySelector('img')?.src || '';
      const vendor = card?.querySelector('.vendor-name, [class*="vendor"]')?.textContent?.trim() || '';

      html += `
        <div style="flex:1;background:#f9fafb;border-radius:12px;padding:12px;min-width:0">
          <img src="${imgSrc}" alt="${name}" style="width:100%;height:80px;object-fit:cover;border-radius:8px" onerror="this.style.display='none'">
          <p style="font-family:'Inter',sans-serif;font-size:10px;color:#0f42b3;font-weight:500;margin-top:8px">${vendor}</p>
          <p style="font-family:'Inter',sans-serif;font-size:12px;color:#364153;font-weight:600;line-height:1.3;margin-top:2px">${name}</p>
          <p style="font-family:'Inter',sans-serif;font-size:13px;color:#364153;font-weight:700;margin-top:6px">${price}</p>
          <button onclick="CompareHub.compare.removeFromCompare(${id})" style="margin-top:8px;width:100%;border:none;background:#fee2e2;color:#ef4444;font-family:'Work Sans',sans-serif;font-size:11px;font-weight:600;padding:5px;border-radius:8px;cursor:pointer">Remove</button>
        </div>`;
    } else {
      html += `
        <div style="flex:1;background:#f9fafb;border-radius:12px;padding:12px;min-height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed #e5e7eb;min-width:0">
          <i data-lucide="plus" style="width:24px;height:24px;opacity:0.3;color:#364153"></i>
          <p style="font-family:'Work Sans',sans-serif;font-size:12px;color:#9ca3af;margin-top:6px">Add product</p>
        </div>`;
    }
  }

  row.innerHTML = html;
  renderIcons();

  const compareNowBtn = document.getElementById('compare-now-btn');
  if (compareNowBtn) {
    compareNowBtn.disabled = compareList.length < 2;
  }
}

CH.compare.removeFromCompare = function(id) {
  const idx = compareList.indexOf(id);
  if (idx > -1) compareList.splice(idx, 1);
  refreshCompareButtons();
  updateCompareBadge();
  renderCompareDrawer();
  if (compareList.length === 0) closeCompareDrawer();
};

function navigateToCompare() {
  if (!compareList.length) {
    CH.ui.showToast('Add products to compare first');
    return;
  }
  window.location.href = `compare.html#ids=${compareList.join(',')}`;
}

function openCompareDrawer() {
  renderCompareDrawer();
  document.getElementById('compare-drawer').classList.add('open');
}

function closeCompareDrawer() {
  document.getElementById('compare-drawer').classList.remove('open');
}

function initCompareDrawer() {
  const openDrawer  = document.getElementById('open-compare-drawer');
  const closeDrawer = document.getElementById('close-compare-drawer');
  const clearBtn    = document.getElementById('compare-clear-btn');
  const compareBtn  = document.getElementById('compare-now-btn');
  const drawer      = document.getElementById('compare-drawer');

  if (!openDrawer || !closeDrawer || !clearBtn || !compareBtn || !drawer) return;

  openDrawer.addEventListener('click', e => {
    e.preventDefault();
    if (compareList.length === 0) {
      CH.ui.showToast('Add products to compare first');
      return;
    }
    openCompareDrawer();
  });

  closeDrawer.addEventListener('click', closeCompareDrawer);

  clearBtn.addEventListener('click', () => {
    compareList = [];
    refreshCompareButtons();
    updateCompareBadge();
    renderCompareDrawer();
    closeCompareDrawer();
    CH.ui.showToast('Compare list cleared');
  });

  compareBtn.addEventListener('click', () => {
    if (compareList.length < 2) {
      CH.ui.showToast('Add at least 2 products to compare');
      return;
    }
    window.location.href = `compare.html#ids=${compareList.join(',')}`;
  });

  // Close on backdrop click
  document.addEventListener('click', e => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !e.target.closest('#open-compare-drawer')) {
      closeCompareDrawer();
    }
  });
}

// ============================================================
// HERO SLIDER
// ============================================================

const SLIDE_COUNT    = 2;
const SLIDE_INTERVAL = 5000;

function goToSlide(index) {
  currentSlide = (index + SLIDE_COUNT) % SLIDE_COUNT;
  const track = document.getElementById('slider-track');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  $$('.slider-dot').forEach((dot, i) => {
    const isActive = i === currentSlide;
    dot.classList.toggle('active', isActive);
    dot.style.width      = isActive ? '24px' : '6px';
    dot.style.height     = '6px';
    dot.style.background = isActive ? '#ffffff' : 'rgba(255,255,255,0.4)';
    dot.style.opacity    = '1';
  });
}

function startSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_INTERVAL);
}

function initSlider() {
  goToSlide(0);
  startSliderTimer();

  if (!document.getElementById('hero')) return;
  $$('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide, 10));
      startSliderTimer();
    });
  });

  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  hero.addEventListener('mouseleave', startSliderTimer);

  // Touch / swipe support
  let touchStartX = 0;
  hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      startSliderTimer();
    }
  });
}

// ============================================================
// CATEGORY TABS (index.html)
// ============================================================

const SECTION_MAP = {
  all:         null,
  electronics: 'section-electronics',
  laptops:     'section-electronics',
  food:        'section-food',
  home:        'section-home',
  fashion:     null,
  gaming:      'section-home',
};

function initCategoryTabs() {
  $$('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.category-tab').forEach(t => t.classList.remove('active-tab'));
      tab.classList.add('active-tab');

      const cat       = tab.dataset.category;
      const sectionId = SECTION_MAP[cat];

      if (cat === 'all') {
        $$('.product-section').forEach(s => s.style.display = '');
      } else if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        CH.ui.showToast(`More categories coming soon!`);
      }
    });
  });
}

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const logo   = document.getElementById('site-logo');
  if (!header) return;

  function onScroll() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);
    if (logo) {
      logo.src = scrolled ? 'images/logos/logo-dark.svg' : 'images/logos/logo-white.svg';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ============================================================
// MOBILE MENU
// ============================================================

function initMobileMenu() {
  const btn       = document.getElementById('mobile-menu-btn');
  const menu      = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!btn || !menu || !hamburger || !closeIcon) return;

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    hamburger.classList.toggle('hidden', !isOpen);
    closeIcon.classList.toggle('hidden', isOpen);
  });

  const mobileSignin = document.getElementById('mobile-signin');
  if (mobileSignin) {
    mobileSignin.addEventListener('click', e => {
      e.preventDefault();
      setAuth(true);
      menu.classList.add('hidden');
      hamburger.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  }
}

// ============================================================
// AUTH STATE MANAGEMENT
// ============================================================

function setAuth(authenticated) {
  isAuthenticated = authenticated;

  const guestActions = document.getElementById('guest-actions');
  const authActions  = document.getElementById('auth-actions');
  const mobileSignin = document.getElementById('mobile-signin');

  if (guestActions) guestActions.classList.toggle('hidden', authenticated);
  if (authActions)  authActions.classList.toggle('hidden', !authenticated);
  if (mobileSignin) mobileSignin.textContent = authenticated ? 'Adaeze ▾' : 'Sign in';

  if (authenticated) {
    CH.ui.showToast('👋 Welcome back, Adaeze!');
  } else {
    CH.ui.showToast('Signed out successfully');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }
}

function initAuthToggle() {
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) signInBtn.addEventListener('click', e => {
    e.preventDefault();
    if (window.CompareHub?.auth?.show) window.CompareHub.auth.show('login');
  });

  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) signOutBtn.addEventListener('click', () => setAuth(false));
}

// ============================================================
// USER DROPDOWN
// ============================================================

function initUserDropdown() {
  const btn      = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  const chevron  = document.getElementById('user-chevron');

  if (!btn || !dropdown || !chevron) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', isOpen);
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#auth-actions')) {
      dropdown.classList.add('hidden');
      chevron.style.transform = '';
    }
  });
}

// ============================================================
// SEARCH BAR
// TODO (Drupal): Replace searchProducts() with a fetch() call
// to a Drupal JSON:API or Views REST endpoint, e.g.:
//   GET /api/products/search?q={query}
// ============================================================

function navigateToSearch(query) {
  if (!query.trim()) return;
  window.location.href = `category.html#q=${encodeURIComponent(query.trim())}`;
}

function buildDropdownHTML(results, query) {
  if (!results.length) {
    return `<div class="px-4 py-5 text-center">
      <p class="font-work text-[13px] text-[#808793]">No results for "<strong>${query}</strong>"</p>
    </div>`;
  }

  const items = results.slice(0, 5).map(p => `
    <a href="product.html#id=${p.id}" class="flex items-center gap-3 px-4 py-3 hover:bg-[#f9fafb] transition-colors">
      <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-[8px] object-cover shrink-0" onerror="this.src='images/placeholder.jpg'">
      <div class="flex-1 min-w-0">
        <p class="font-work font-semibold text-[13px] text-[#181d25] truncate">${p.name}</p>
        <p class="font-work text-[11px] text-[#808793]">${p.vendor}</p>
      </div>
      <span class="font-work font-semibold text-[12px] text-[#155dfc] shrink-0">${p.price}</span>
    </a>
  `).join('');

  const seeAll = `
    <a href="category.html#q=${encodeURIComponent(query)}" class="flex items-center justify-between px-4 py-3 border-t border-[#f3f4f6] bg-[#f9fafb] hover:bg-[#f3f4f6] transition-colors">
      <span class="font-work font-medium text-[13px] text-[#155dfc]">See all results for "<strong>${query}</strong>"</span>
      <i data-lucide="arrow-right" class="w-4 h-4 text-[#155dfc]"></i>
    </a>`;

  return items + seeAll;
}

function bindSearchBar(inputId, dropdownId) {
  const input    = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { dropdown.classList.add('hidden'); return; }

    debounceTimer = setTimeout(() => {
      // TODO (Drupal): Replace this fetch with a Drupal REST/JSON:API search call
      // fetch(`/api/search?q=${encodeURIComponent(q)}`)
      //   .then(r => r.json())
      //   .then(results => { dropdown.innerHTML = buildDropdownHTML(results, q); ... });
      dropdown.innerHTML = buildDropdownHTML([], q); // empty until Drupal backend wired
      dropdown.classList.remove('hidden');
      renderIcons();
    }, 180);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { dropdown.classList.add('hidden'); navigateToSearch(input.value); }
    if (e.key === 'Escape') { dropdown.classList.add('hidden'); }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function initHeroSearch() {
  bindSearchBar('hero-search', 'desktop-search-dropdown');
  bindSearchBar('mobile-search-input', 'mobile-search-dropdown');

  const btn = document.getElementById('hero-search-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const q = document.getElementById('hero-search').value.trim();
      document.getElementById('desktop-search-dropdown').classList.add('hidden');
      navigateToSearch(q || '');
    });
  }
}

// ============================================================
// NEWSLETTER
// ============================================================

function initNewsletter() {
  const btn = document.getElementById('newsletter-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const email      = document.getElementById('newsletter-email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email)                  { CH.ui.showToast('Please enter your email address'); return; }
    if (!emailRegex.test(email)) { CH.ui.showToast('Please enter a valid email address'); return; }
    // TODO (Drupal): POST to a Drupal webform or simplenews endpoint
    CH.ui.showToast('🎉 Subscribed! Check your inbox for confirmation.');
    document.getElementById('newsletter-email').value = '';
  });
}

// ============================================================
// LOCATION MODAL
// ============================================================

const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara'
];

let selectedState = 'Lagos';

function renderStatesList(filter = '') {
  const list = document.getElementById('states-list');
  if (!list) return;
  const filtered = NIGERIA_STATES.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
  list.innerHTML = filtered.map(state => `
    <button onclick="CompareHub.ui.selectState('${state}')"
      class="w-full flex items-center justify-between px-3 py-3.5 rounded-[12px] text-left transition-colors ${state === selectedState ? 'bg-[#e5edff]' : 'hover:bg-[#f3f4f6]'}">
      <div class="flex items-center gap-3">
        <i data-lucide="map-pin" class="w-4 h-4 ${state === selectedState ? 'text-[#155dfc]' : 'text-[#808793]'}"></i>
        <span class="font-work font-medium text-[14px] ${state === selectedState ? 'text-[#155dfc]' : 'text-[#364153]'}">${state}</span>
      </div>
      ${state === selectedState ? '<i data-lucide="check" class="w-4 h-4 text-[#155dfc]"></i>' : ''}
    </button>
  `).join('');
  renderIcons();
}

CH.ui.selectState = function(state) {
  selectedState = state;
  const locationEl = document.getElementById('mobile-location-name');
  if (locationEl) locationEl.textContent = state;
  renderStatesList();
  setTimeout(closeLocationModal, 200);
  CH.ui.showToast(`📍 Delivering to ${state}`);
};

function openLocationModal() {
  const modal    = document.getElementById('location-modal');
  const backdrop = document.getElementById('location-modal-backdrop');
  if (!modal) return;
  renderStatesList();
  backdrop.classList.remove('hidden');
  requestAnimationFrame(() => { modal.style.transform = 'translateY(0)'; });
  document.body.style.overflow = 'hidden';
}

function closeLocationModal() {
  const modal    = document.getElementById('location-modal');
  const backdrop = document.getElementById('location-modal-backdrop');
  if (!modal) return;
  modal.style.transform = 'translateY(100%)';
  setTimeout(() => backdrop.classList.add('hidden'), 350);
  document.body.style.overflow = '';
}

function initLocationModal() {
  const changeBtn = document.getElementById('mobile-location-change');
  if (changeBtn) changeBtn.addEventListener('click', openLocationModal);

  const closeBtn = document.getElementById('location-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLocationModal);

  const backdrop = document.getElementById('location-modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeLocationModal);

  const searchInput = document.getElementById('location-search');
  if (searchInput) searchInput.addEventListener('input', e => renderStatesList(e.target.value));
}

// ============================================================
// MOBILE CATEGORY PILLS
// ============================================================

function initMobileCategoryTabs() {
  const tabs = document.querySelectorAll('.mobile-cat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background  = '';
        t.style.color       = '';
        t.style.borderColor = '';
      });
      tab.classList.add('active');
    });
  });
}

// ============================================================
// MOBILE BOTTOM NAV
// ============================================================

function initMobileBottomNav() {
  const tabs = document.querySelectorAll('.mobile-nav-tab');

  const compareNavBtn = document.getElementById('mobile-nav-compare');
  if (compareNavBtn) {
    compareNavBtn.addEventListener('click', () => {
      if (compareList.length === 0) {
        CH.ui.showToast('Add products to compare first');
        return;
      }
      window.location.href = `compare.html#ids=${compareList.join(',')}`;
    });
  }

  const mobileCompareBtn = document.getElementById('mobile-compare-btn');
  if (mobileCompareBtn) {
    mobileCompareBtn.addEventListener('click', () => {
      if (compareList.length === 0) {
        CH.ui.showToast('Add products to compare first');
        return;
      }
      openCompareDrawer();
    });
  }

  tabs.forEach(tab => {
    if (tab.id === 'mobile-nav-compare') return;
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        const icon  = t.querySelector('svg');
        const label = t.querySelector('.nav-label');
        if (icon)  icon.style.stroke  = 'var(--color-muted)';
        if (label) label.style.color  = 'var(--color-muted)';
      });
      tab.classList.add('active');
      const icon  = tab.querySelector('svg');
      const label = tab.querySelector('.nav-label');
      if (icon)  icon.style.stroke  = 'var(--color-primary)';
      if (label) label.style.color  = 'var(--color-primary)';

      const tabName = tab.dataset.tab;
      if (tabName === 'events')  { window.location.href = 'events.html'; return; }
      if (tabName === 'account') CH.ui.showToast('Sign in to view your account');
    });
  });
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initCategoryTabs();
  initProductCards();
  initCompareDrawer();
  initHeaderScroll();
  initMobileMenu();
  initAuthToggle();
  initUserDropdown();
  initHeroSearch();
  initNewsletter();
  initMobileCategoryTabs();
  initMobileBottomNav();
  initLocationModal();
  refreshCompareButtons();
  refreshWishlistButtons();
  renderIcons();
});
