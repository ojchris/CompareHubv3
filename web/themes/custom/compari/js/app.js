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

const COMPARE_STORAGE_KEY = 'comparehub_compare_ids';
const COMPARE_META_KEY = 'comparehub_compare_meta';

function getCompareIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) || '[]');
    return ids.map(id => Number(id)).filter(id => Number.isFinite(id) && id > 0);
  } catch (error) {
    return [];
  }
}

function setCompareIds(ids) {
  const unique = [...new Set(ids.map(id => Number(id)).filter(id => Number.isFinite(id) && id > 0))];
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(unique));
  compareList = unique;
  return unique;
}

function getCompareMeta() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_META_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function setCompareMeta(id, payload) {
  const meta = getCompareMeta();
  meta[id] = payload;
  localStorage.setItem(COMPARE_META_KEY, JSON.stringify(meta));
}

function removeCompareMeta(id) {
  const meta = getCompareMeta();
  delete meta[id];
  localStorage.setItem(COMPARE_META_KEY, JSON.stringify(meta));
}

function getProductSummaryFromNode(node) {
  const card = node?.closest('.product-card') || node?.closest('[data-product-id]');
  const id = Number(node?.dataset?.id || card?.dataset?.productId || card?.dataset?.id || 0);
  const name = card?.querySelector('.product-name, [class*="product-name"]')?.textContent?.trim() || 'Product';
  const price = card?.querySelector('.product-price, [class*="product-price"]')?.textContent?.trim() || '';
  const image = card?.querySelector('img')?.src || '';
  const brand = card?.querySelector('.vendor-name, [class*="vendor"]')?.textContent?.trim() || '';
  const location = card?.querySelector('.vendor-location, .product-location, [class*="location"]')?.textContent?.trim() || 'Online';

  return { id, name, price, image, brand, location, listings: [{ name: brand || 'Vendor', price, location }] };
}

function goToComparePage() {
  const ids = getCompareIds();
  const hash = ids.length ? `#ids=${ids.join(',')}` : '';
  const target = '/compare' + hash;
  window.location.href = target;
}

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
  const activeIds = getCompareIds();
  $$('.compare-btn').forEach(btn => {
    const id = Number(btn.dataset.id || btn.dataset.productId || 0);
    const inList = activeIds.includes(id);
    btn.textContent = inList ? 'Added' : '+ Compare';
    btn.disabled = inList;
    btn.setAttribute('aria-pressed', String(inList));
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
    btn.textContent = inList ? '♡ Saved' : '♡ Save';
    btn.setAttribute('aria-pressed', String(inList));
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
    const compareBtn = e.target.closest('.compare-btn');
    if (compareBtn) {
      e.preventDefault();

      const id = Number(compareBtn.dataset.id || compareBtn.dataset.productId || 0);
      const product = getProductSummaryFromNode(compareBtn);
      const existing = getCompareIds();
      const idx = existing.indexOf(id);

      if (idx > -1) {
        existing.splice(idx, 1);
        removeCompareMeta(id);
        CH.ui.showToast(`"${product.name}" removed from compare`);
      } else {
        if (existing.length >= 4) {
          CH.ui.showToast('⚠️ You can compare up to 4 products at a time');
          return;
        }
        existing.push(id);
        if (id && product.name) {
          setCompareMeta(id, product);
        }
        CH.ui.showToast(`"${product.name}" added to compare`);
      }

      setCompareIds(existing);
      compareList = existing;
      refreshCompareButtons();
      updateCompareBadge();
      renderCompareDrawer();
      return;
    }

    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      e.preventDefault();
      if (!wishlistBtn.dataset.id) return;

      const id = Number(wishlistBtn.dataset.id || 0);
      const wasAdded = toggleWishlistId(id);
      CH.ui.showToast(wasAdded ? 'Added to wishlist' : 'Removed from wishlist');
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
  const ids = getCompareIds();
  const idx = ids.indexOf(Number(id));
  if (idx > -1) ids.splice(idx, 1);
  setCompareIds(ids);
  removeCompareMeta(Number(id));
  refreshCompareButtons();
  updateCompareBadge();
  renderCompareDrawer();
  renderComparePage();
  if (compareList.length === 0) closeCompareDrawer();
};

function navigateToCompare() {
  if (!compareList.length) {
    CH.ui.showToast('Add products to compare first');
    return;
  }
  goToComparePage();
}

function openCompareDrawer() {
  renderCompareDrawer();
  const drawer = document.getElementById('compare-drawer');
  const backdrop = document.getElementById('compare-drawer-backdrop');
  if (!drawer) return;
  drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeCompareDrawer() {
  const drawer = document.getElementById('compare-drawer');
  const backdrop = document.getElementById('compare-drawer-backdrop');
  if (!drawer) return;
  drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

function initCompareDrawer() {
  const openDrawer  = document.getElementById('open-compare-drawer');
  const closeDrawer = document.getElementById('close-compare-drawer');
  const clearBtn    = document.getElementById('compare-clear-btn');
  const compareBtn  = document.getElementById('compare-now-btn');
  const drawer      = document.getElementById('compare-drawer');

  if (!openDrawer || !closeDrawer || !clearBtn || !compareBtn || !drawer) return;

  const backdrop = document.getElementById('compare-drawer-backdrop');

  openDrawer.addEventListener('click', e => {
    e.preventDefault();
    openCompareDrawer();
  });

  closeDrawer.addEventListener('click', closeCompareDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCompareDrawer);

  clearBtn.addEventListener('click', () => {
    setCompareIds([]);
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
    goToComparePage();
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
      goToComparePage();
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

function renderComparePage() {
  const root = document.getElementById('compare-page-root');
  if (!root) return;

  const ids = getCompareIds();
  const meta = getCompareMeta();

  if (!ids.length) {
    root.innerHTML = `
      <section class="mx-auto max-w-3xl rounded-[16px] border border-dashed border-[#d1d5db] bg-white px-6 py-16 text-center shadow-sm">
        <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f4f6] text-[#808793]">
          <i data-lucide="git-compare" class="h-8 w-8"></i>
        </div>
        <h1 class="font-inter text-xl font-bold text-[#181d25]">Your compare cart is empty</h1>
        <p class="mx-auto mt-2 max-w-[280px] text-sm text-[#808793]">Add products from the homepage or category pages to compare prices across vendors.</p>
        <a href="/" class="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#155dfc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1447e6]"><i data-lucide="arrow-left" class="h-4 w-4"></i>Browse products</a>
      </section>
    `;
    renderIcons();
    return;
  }

  const formatPrice = value => {
    const amount = Number(value) || 0;
    return `₦${amount.toLocaleString('en-NG')}`;
  };
  const getListings = item => {
    const listings = Array.isArray(item.listings) ? item.listings : [];
    if (listings.length) return listings.filter(listing => Number.isFinite(Number(listing.price)));
    const amount = Number(String(item.price || '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(amount) && amount > 0 ? [{ name: item.brand || 'Vendor', price: amount, location: item.location || 'Online' }] : [];
  };

  let totalBest = 0;
  let totalHighest = 0;
  const products = ids.map(id => {
    const item = meta[id] || { id, name: `Product #${id}`, price: '', image: '', brand: 'Vendor', location: 'Online' };
    const listings = getListings(item).sort((a, b) => Number(a.price) - Number(b.price));
    if (listings.length) {
      totalBest += Number(listings[0].price);
      totalHighest += Number(listings[listings.length - 1].price);
    }
    return { id, item, listings };
  });
  const totalSavings = totalHighest - totalBest;
  const totalListings = products.reduce((count, product) => count + product.listings.length, 0);

  root.innerHTML = `
    <section class="space-y-6">
      <div class="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
        <i data-lucide="git-compare" class="h-5 w-5 text-[#364153]"></i>
        <div>
          <p class="font-inter text-lg font-medium text-[#101828]">Compare Cart</p>
          <p class="font-inter text-xs text-[#99a1af]">${totalListings} listing${totalListings === 1 ? '' : 's'} across ${ids.length} product${ids.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      <div class="flex flex-col items-start gap-6 lg:flex-row">
        <div class="flex min-w-0 flex-1 flex-col gap-5">
        ${products.map(({ id, item, listings }) => {
          const cheapest = listings[0];
          const highest = listings[listings.length - 1];
          const savings = listings.length > 1 ? Number(highest.price) - Number(cheapest.price) : 0;
          return `
            <article class="overflow-hidden rounded-[16px] border border-[#f3f4f6] bg-white shadow-sm">
              <div class="flex items-center gap-4 border-b border-[#f3f4f6] px-5 py-4">
                <a href="/product/${id}" class="h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-[#f3f4f6]">
                  ${item.image ? `<img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover" />` : '<span class="flex h-full items-center justify-center text-[#9ca3af]"><i data-lucide="image" class="h-6 w-6"></i></span>'}
                </a>
                <div class="min-w-0 flex-1"><h2 class="truncate font-work text-lg font-semibold text-[#181d25]">${item.name}</h2><p class="font-inter text-xs text-[#808793]">${savings ? `Save up to ${formatPrice(savings)}` : 'Best available listing'}</p><p class="font-inter text-xs text-[#99a1af]">${listings.length} vendor${listings.length === 1 ? '' : 's'} carrying this item</p></div>
                <button type="button" class="remove-compare-page-item rounded-[10px] p-2 text-[#99a1af] hover:bg-[#fff1f2] hover:text-[#fb2c36]" data-compare-id="${id}" aria-label="Remove ${item.name}"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
              </div>
              <div class="overflow-x-auto"><table class="w-full min-w-[560px] text-left"><thead class="bg-[#f9fafb]"><tr><th class="px-5 py-3 font-inter text-[11px] font-semibold uppercase tracking-wide text-[#99a1af]">Vendor</th><th class="px-5 py-3 font-inter text-[11px] font-semibold uppercase tracking-wide text-[#99a1af]">Price</th><th class="px-5 py-3 font-inter text-[11px] font-semibold uppercase tracking-wide text-[#99a1af]">Location</th><th class="px-5 py-3 text-right font-inter text-[11px] font-semibold uppercase tracking-wide text-[#99a1af]">Action</th></tr></thead><tbody>${listings.length ? listings.map((listing, index) => `<tr class="border-t border-[#f3f4f6] ${index === 0 ? 'bg-[rgba(239,246,255,0.5)]' : ''}"><td class="px-5 py-4"><span class="font-work text-sm font-medium text-[#364153]">${listing.name || 'Vendor'}</span>${index === 0 ? '<span class="ml-2 rounded-full bg-[#e5edff] px-2 py-1 font-inter text-[10px] font-semibold text-[#155dfc]">Best price</span>' : ''}</td><td class="px-5 py-4 font-inter text-sm font-bold ${index === 0 ? 'text-[#155dfc]' : 'text-[#364153]'}">${formatPrice(listing.price)}</td><td class="px-5 py-4 font-inter text-sm text-[#6a7282]">${listing.location || 'Online'}</td><td class="px-5 py-4 text-right"><div class="inline-flex items-center gap-2"><a href="/product/${id}" class="rounded-[10px] bg-[#155dfc] px-3 py-2 font-inter text-xs font-semibold text-white hover:bg-[#1447e6]">Buy now</a><button type="button" class="remove-compare-page-item rounded-[10px] p-2 text-[#99a1af] hover:bg-[#fff1f2] hover:text-[#fb2c36]" data-compare-id="${id}" aria-label="Remove ${item.name}"><i data-lucide="x" class="h-4 w-4"></i></button></div></td></tr>`).join('') : '<tr><td colspan="4" class="px-5 py-6 text-center font-inter text-sm text-[#808793]">No vendor listings available</td></tr>'}</tbody></table></div>
            </article>
          `;
        }).join('')}
        </div>
        <aside class="w-full shrink-0 overflow-hidden rounded-[16px] bg-[#155dfc] text-white shadow-sm lg:sticky lg:top-[132px] lg:w-[320px]">
          <div class="px-5 py-5"><p class="font-inter text-[11px] font-semibold uppercase tracking-[0.8px] text-[#dbeafe]">You're saving with CompareHub</p><p class="mt-2 font-inter text-3xl font-bold">${formatPrice(totalSavings)}</p><p class="mt-1 font-inter text-sm text-[#bedbff]">vs. the most expensive listings</p><div class="mt-4 flex items-center justify-between border-t border-[#2b7fff] pt-3"><span class="font-inter text-xs text-[#bedbff]">Your cart total</span><span class="font-inter text-sm font-bold">${formatPrice(totalBest)}</span></div></div>
          <div class="border-t border-[#e5e7eb] bg-white px-5 py-5 text-[#181d25]"><p class="font-inter text-sm font-bold">Cart Summary</p><div class="mt-4 flex flex-col gap-3">${products.map(({ id, item, listings }) => { const cheapest = listings[0]; return `<div class="flex items-center gap-3"><div class="h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-[#f3f4f6]">${item.image ? `<img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover">` : ''}</div><div class="min-w-0 flex-1"><p class="truncate font-inter text-xs font-semibold">${item.name}</p><p class="truncate font-inter text-xs text-[#99a1af]">${cheapest?.name || 'Vendor'}</p></div><div class="text-right"><p class="font-inter text-xs font-bold text-[#155dfc]">${cheapest ? formatPrice(cheapest.price) : 'N/A'}</p><p class="font-inter text-[11px] text-[#2b7fff]">Best price</p></div></div>`; }).join('')}</div><div class="mt-4 flex items-center justify-between border-t border-[#f3f4f6] pt-3"><span class="font-inter text-sm text-[#6a7282]">Est. total</span><span class="font-inter text-sm font-bold">${formatPrice(totalBest)}</span></div><a href="/" class="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#e5e7eb] px-4 py-3 font-inter text-sm font-semibold text-[#364153] hover:bg-[#f9fafb]"><i data-lucide="arrow-left" class="h-4 w-4"></i>Continue browsing</a></div>
        </aside>
      </div>
    </section>
  `;

  document.querySelectorAll('.remove-compare-page-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.compareId || 0);
      CH.compare.removeFromCompare(id);
    });
  });

  renderIcons();
}

compareList = getCompareIds();

document.addEventListener('DOMContentLoaded', () => {
  renderComparePage();
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
  updateCompareBadge();
  renderIcons();
});
