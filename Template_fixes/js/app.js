/* ============================================================
   CompareHub — app.js
   Vanilla JavaScript — no dependencies
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
// DATA
// ============================================================

const PRODUCTS = {
  electronics: [
    {
      id: 1,
      vendor: 'ELECTROMART',
      name: 'iPhone 15 Pro',
      price: '₦1,580,000',
      image: 'images/products/iphone-15-pro.jpg',
      category: 'electronics',
    },
    {
      id: 2,
      vendor: 'GADGETPRO',
      name: 'MacBook Air M3',
      price: '₦1,875,000',
      image: 'images/products/macbook-air-m3.jpg',
      category: 'electronics',
    },
    {
      id: 3,
      vendor: 'SMARTBUY',
      name: 'Sony WH-1000XM5',
      price: '₦495,000',
      image: 'images/products/sony-wh1000xm5.jpg',
      category: 'electronics',
    },
    {
      id: 4,
      vendor: 'TECHSTORE',
      name: 'iPad Pro 12.9"',
      price: '₦1,605,000',
      image: 'images/products/ipad-pro-12.jpg',
      category: 'electronics',
    },
    {
      id: 5,
      vendor: 'ELECTROMART',
      name: 'Canon EOS R50',
      price: '₦975,000',
      image: 'images/products/canon-eos-r50.jpg',
      category: 'electronics',
    },
  ],
  food: [
    {
      id: 6,
      vendor: 'NAIJAFOODS',
      name: 'Long Grain White Rice',
      unit: 'per 50kg bag',
      price: '₦35,000',
      image: 'images/products/white-rice.jpg',
      category: 'food',
    },
    {
      id: 7,
      vendor: 'NAIJAFOODS',
      name: 'Fresh Cow Leg',
      unit: 'per kg',
      price: '₦5,000',
      image: 'images/products/cow-leg.jpg',
      category: 'food',
    },
    {
      id: 8,
      vendor: 'FOODHUB',
      name: 'Live Giant African Snail',
      unit: 'per dozen',
      price: '₦10,500',
      image: 'images/products/african-snail.jpg',
      category: 'food',
    },
    {
      id: 9,
      vendor: 'FOODHUB',
      name: 'Ripe Plantain',
      unit: 'per bunch',
      price: '₦3,800',
      image: 'images/products/ripe-plantain.jpg',
      category: 'food',
    },
    {
      id: 10,
      vendor: 'FOODHUB',
      name: 'Pure Red Palm Oil',
      unit: 'per 25L drum',
      price: '₦28,000',
      image: 'images/products/palm-oil.jpg',
      category: 'food',
    },
  ],
  home: [
    {
      id: 11,
      vendor: 'GADGETPRO',
      name: 'Apple Watch Series 9',
      price: '₦570,000',
      image: 'images/products/apple-watch-9.jpg',
      category: 'home',
    },
    {
      id: 12,
      vendor: 'DIGIZONE',
      name: 'JBL Charge 5',
      price: '₦255,000',
      image: 'images/products/jbl-charge-5.jpg',
      category: 'home',
    },
    {
      id: 13,
      vendor: 'GADGETPRO',
      name: 'PlayStation 5',
      price: '₦735,000',
      image: 'images/products/playstation-5.jpg',
      category: 'home',
    },
    {
      id: 14,
      vendor: 'FOODHUB',
      name: 'Fresh Catfish',
      unit: 'per kg',
      price: '₦7,500',
      image: 'images/products/fresh-catfish.jpg',
      category: 'home',
    },
    {
      id: 15,
      vendor: 'NAIJAFOODS',
      name: 'White Yam (Iyan)',
      unit: 'per tuber',
      price: '₦4,500',
      image: 'images/products/white-yam.jpg',
      category: 'home',
    },
  ],
};

const BRANDS = [
  'Mamacas', 'Chicken Republic', 'The Place', 'Mega Chicken',
  'Beyond Taste', 'Jazzy Burger', 'Apple', 'Samsung', 'Sony',
  'JBL', 'Canon', 'ELECTROMART', 'GADGETPRO', 'TECHSTORE',
  'SMARTBUY', 'DIGIZONE', 'NAIJAFOODS', 'FOODHUB', 'GREENFARM',
];

const VENDOR_LISTINGS = {
  1:  [ { name:'ELECTROMART', location:'Lagos, NG',     price:1580000, fairPrice:true,  bestPrice:true  },
        { name:'GADGETPRO',   location:'Abuja, FCT',    price:1625000, fairPrice:true,  bestPrice:false },
        { name:'TECHSTORE',   location:'Port Harcourt', price:1695000, fairPrice:false, bestPrice:false } ],
  2:  [ { name:'GADGETPRO',   location:'Abuja, FCT',    price:1875000, fairPrice:true,  bestPrice:true  },
        { name:'TECHSTORE',   location:'Lagos, NG',     price:1920000, fairPrice:true,  bestPrice:false },
        { name:'SMARTBUY',    location:'Enugu',         price:1990000, fairPrice:false, bestPrice:false } ],
  3:  [ { name:'SMARTBUY',    location:'Lagos, NG',     price:495000,  fairPrice:true,  bestPrice:true  },
        { name:'ELECTROMART', location:'Abuja, FCT',    price:512000,  fairPrice:true,  bestPrice:false },
        { name:'DIGIZONE',    location:'Ibadan',        price:535000,  fairPrice:false, bestPrice:false } ],
  4:  [ { name:'TECHSTORE',   location:'Lagos, NG',     price:1605000, fairPrice:true,  bestPrice:true  },
        { name:'GADGETPRO',   location:'Kano',          price:1650000, fairPrice:true,  bestPrice:false },
        { name:'ELECTROMART', location:'Port Harcourt', price:1720000, fairPrice:false, bestPrice:false } ],
  5:  [ { name:'ELECTROMART', location:'Lagos, NG',     price:975000,  fairPrice:true,  bestPrice:true  },
        { name:'DIGIZONE',    location:'Abuja, FCT',    price:1010000, fairPrice:true,  bestPrice:false },
        { name:'SMARTBUY',    location:'Enugu',         price:1055000, fairPrice:false, bestPrice:false } ],
  6:  [ { name:'NAIJAFOODS',  location:'Abuja, FCT',    price:35000,   fairPrice:true,  bestPrice:true  },
        { name:'FOODHUB',     location:'Lagos, NG',     price:37500,   fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:40000,   fairPrice:false, bestPrice:false } ],
  7:  [ { name:'NAIJAFOODS',  location:'Lagos, NG',     price:5000,    fairPrice:true,  bestPrice:true  },
        { name:'FOODHUB',     location:'Abuja, FCT',    price:5500,    fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Kano',          price:6000,    fairPrice:false, bestPrice:false } ],
  8:  [ { name:'FOODHUB',     location:'Lagos, NG',     price:10500,   fairPrice:true,  bestPrice:true  },
        { name:'NAIJAFOODS',  location:'Enugu',         price:11200,   fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:12000,   fairPrice:false, bestPrice:false } ],
  9:  [ { name:'FOODHUB',     location:'Lagos, NG',     price:3800,    fairPrice:true,  bestPrice:true  },
        { name:'NAIJAFOODS',  location:'Port Harcourt', price:4200,    fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:4500,    fairPrice:false, bestPrice:false } ],
  10: [ { name:'FOODHUB',     location:'Lagos, NG',     price:28000,   fairPrice:true,  bestPrice:true  },
        { name:'NAIJAFOODS',  location:'Abuja, FCT',    price:30500,   fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:33000,   fairPrice:false, bestPrice:false } ],
  11: [ { name:'GADGETPRO',   location:'Lagos, NG',     price:570000,  fairPrice:true,  bestPrice:true  },
        { name:'TECHSTORE',   location:'Abuja, FCT',    price:595000,  fairPrice:true,  bestPrice:false },
        { name:'SMARTBUY',    location:'Kano',          price:620000,  fairPrice:false, bestPrice:false } ],
  12: [ { name:'DIGIZONE',    location:'Lagos, NG',     price:255000,  fairPrice:true,  bestPrice:true  },
        { name:'GADGETPRO',   location:'Port Harcourt', price:270000,  fairPrice:true,  bestPrice:false },
        { name:'ELECTROMART', location:'Kano',          price:285000,  fairPrice:false, bestPrice:false } ],
  13: [ { name:'GADGETPRO',   location:'Lagos, NG',     price:735000,  fairPrice:true,  bestPrice:true  },
        { name:'DIGIZONE',    location:'Abuja, FCT',    price:760000,  fairPrice:true,  bestPrice:false },
        { name:'TECHSTORE',   location:'Enugu',         price:795000,  fairPrice:false, bestPrice:false } ],
  14: [ { name:'FOODHUB',     location:'Lagos, NG',     price:7500,    fairPrice:true,  bestPrice:true  },
        { name:'NAIJAFOODS',  location:'Port Harcourt', price:8200,    fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:9000,    fairPrice:false, bestPrice:false } ],
  15: [ { name:'NAIJAFOODS',  location:'Lagos, NG',     price:4500,    fairPrice:true,  bestPrice:true  },
        { name:'FOODHUB',     location:'Kano',          price:4900,    fairPrice:true,  bestPrice:false },
        { name:'GREENFARM',   location:'Ibadan',        price:5500,    fairPrice:false, bestPrice:false } ],
};

// ============================================================
// STATE
// ============================================================

let isAuthenticated = false;
let compareList = [];       // array of product ids
let currentSlide = 0;
let sliderTimer = null;

// ============================================================
// DASHBOARD DATA MANAGEMENT
// ============================================================

function getDashboardData() {
  try {
    return JSON.parse(localStorage.getItem('ch_user') || '{}');
  } catch(e) {
    return {};
  }
}

function saveDashboardData(userData) {
  localStorage.setItem('ch_user', JSON.stringify(userData));
}

function initDashboardData() {
  let user = getDashboardData();
  if (!user.wishlist) user.wishlist = [];
  if (!user.compareHistory) user.compareHistory = [];
  if (!user.sessionStats) user.sessionStats = {
    totalSessions: 0,
    productsCompared: 0,
    compareHistoryCount: 0
  };
  if (!user.recentCompares) user.recentCompares = [];
  saveDashboardData(user);
  return user;
}

function addToWishlist(productId) {
  let user = getDashboardData();
  if (!user.wishlist) user.wishlist = [];
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    user.sessionStats = user.sessionStats || {};
    saveDashboardData(user);
    return true;
  }
  return false;
}

function removeFromWishlist(productId) {
  let user = getDashboardData();
  if (!user.wishlist) user.wishlist = [];
  const idx = user.wishlist.indexOf(productId);
  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    saveDashboardData(user);
    return true;
  }
  return false;
}

function recordCompareSession(productIds) {
  let user = getDashboardData();
  if (!user.compareHistory) user.compareHistory = [];
  if (!user.sessionStats) user.sessionStats = { totalSessions: 0, productsCompared: 0, compareHistoryCount: 0 };

  user.compareHistory.push({
    timestamp: new Date().toISOString(),
    productIds: productIds,
    count: productIds.length
  });

  user.sessionStats.totalSessions = (user.sessionStats.totalSessions || 0) + 1;
  user.sessionStats.productsCompared = (user.sessionStats.productsCompared || 0) + productIds.length;
  user.sessionStats.compareHistoryCount = user.compareHistory.length;

  saveDashboardData(user);
}

function getWishlistItems() {
  let user = getDashboardData();
  if (!user.wishlist) return [];
  return user.wishlist.map(id => findProduct(id)).filter(p => p);
}

function updateSidebarBadges() {
  const user = getDashboardData();
  const wishlistCount = user.wishlist?.length || 0;
  const historyCount = user.compareHistory?.length || 0;

  // Update all sidebar badges for wishlist
  document.querySelectorAll('a[href="wishlist.html"] .rounded-full').forEach(badge => {
    badge.textContent = wishlistCount;
  });

  // Update all sidebar badges for compare history
  document.querySelectorAll('a[href="compare-history.html"] .rounded-full').forEach(badge => {
    badge.textContent = historyCount;
  });
}

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
}

function $(selector, root = document) {
  return root.querySelector(selector);
}
function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

// ============================================================
// PRODUCT CARDS
// ============================================================

function buildCardHTML(product) {
  const inCompare = compareList.includes(product.id);
  const compareText  = inCompare ? '✓ Added' : '+ Compare';
  const compareClass = inCompare ? 'compare-btn in-compare' : 'compare-btn';

  const user = getDashboardData();
  const inWishlist = user.wishlist && user.wishlist.includes(product.id);
  const wishlistClass = inWishlist ? 'wishlist-btn in-wishlist' : 'wishlist-btn';
  const wishlistText = inWishlist ? '❤️ Saved' : '♡ Save';

  const imageHTML = `<img src="${product.image}" alt="${product.name}" loading="lazy">`;

  const unitHTML = product.unit
    ? `<p class="product-unit">${product.unit}</p>` : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}" role="article">
      <a href="product.html#id=${product.id}" class="card-image block">${imageHTML}</a>
      <div class="card-body">
        <a href="product.html#id=${product.id}" class="block" style="text-decoration:none">
          <a href="brand.html#brand=${product.vendor}" class="vendor-name" style="text-decoration:none" onclick="event.stopPropagation()">${product.vendor}</a>
          <p class="product-name">${product.name}</p>
          ${unitHTML}
        </a>
        <div>
          <p class="product-price">${product.price}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="${compareClass}" data-id="${product.id}" style="flex:1">
              ${compareText}
            </button>
            <button class="${wishlistClass}" data-id="${product.id}" style="flex:1;border:1px solid #e5e7eb;background:#f9fafb;color:#364153;font-weight:500;border-radius:8px;cursor:pointer">
              ${wishlistText}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderProducts() {
  console.debug('[CH] renderProducts start');
  ['electronics', 'food', 'home'].forEach(cat => {
    try {
      const grid = document.getElementById(`${cat}-grid`);
      if (!grid) { console.debug(`[CH] ${cat}-grid not present`); return; }
      const arr = (PRODUCTS && PRODUCTS[cat]) ? PRODUCTS[cat] : [];
      console.debug(`[CH] populating ${cat}-grid, items=`, arr.length);
      try {
        grid.innerHTML = arr.map(buildCardHTML).join('');
      } catch (err) {
        console.error('[CH] buildCardHTML error for', cat, err);
        grid.innerHTML = '<!-- CH: render error -->';
      }
    } catch (e) {
      console.error('[CH] renderProducts outer error for', cat, e);
    }
  });
  renderIcons();
  console.debug('[CH] renderProducts end');
}function refreshCompareButtons() {
  $$('.compare-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id, 10);
    const inList = compareList.includes(id);
    btn.textContent = inList ? '✓ Added' : '+ Compare';
    btn.classList.toggle('in-compare', inList);
  });
}

function initProductCards() {
  document.addEventListener('click', e => {
    // Handle compare button
    const compareBtn = e.target.closest('.compare-btn');
    if (compareBtn) {
      e.preventDefault();

      const id = parseInt(compareBtn.dataset.id, 10);
      const idx = compareList.indexOf(id);

      if (idx > -1) {
        // Remove
        compareList.splice(idx, 1);
        const product = findProduct(id);
        CH.ui.showToast(`"${product.name}" removed from compare`);
      } else {
        if (compareList.length >= 4) {
          CH.ui.showToast('⚠️ You can compare up to 4 products at a time');
          return;
        }
        compareList.push(id);
        const product = findProduct(id);
        CH.ui.showToast(`"${product.name}" added to compare`);
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

      const id = parseInt(wishlistBtn.dataset.id, 10);
      let user = getDashboardData();
      if (!user.wishlist) user.wishlist = [];

      const idx = user.wishlist.indexOf(id);
      const product = findProduct(id);

      if (idx > -1) {
        // Remove from wishlist
        removeFromWishlist(id);
        CH.ui.showToast(`"${product.name}" removed from wishlist`);
      } else {
        // Add to wishlist
        addToWishlist(id);
        CH.ui.showToast(`"${product.name}" added to wishlist`);
      }

      refreshWishlistButtons();
      updateSidebarBadges();
      renderProducts();
      return;
    }
  });
}

function refreshWishlistButtons() {
  const user = getDashboardData();
  $$('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id, 10);
    const inList = user.wishlist && user.wishlist.includes(id);
    btn.textContent = inList ? '❤️ Saved' : '♡ Save';
    btn.classList.toggle('in-wishlist', inList);
  });
}

function findProduct(id) {
  for (const cat of Object.values(PRODUCTS)) {
    const p = cat.find(p => p.id === id);
    if (p) return p;
  }
  return null;
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
      const p = findProduct(id);
      const imgHTML = `<img src="${p.image}" alt="${p.name}" style="width:100%;height:80px;object-fit:cover;border-radius:8px">`;
      html += `
        <div style="flex:1;background:#f9fafb;border-radius:12px;padding:12px;min-width:0">
          ${imgHTML}
          <p style="font-family:'Inter',sans-serif;font-size:10px;color:#0f42b3;font-weight:500;margin-top:8px">${p.vendor}</p>
          <p style="font-family:'Inter',sans-serif;font-size:12px;color:#364153;font-weight:600;line-height:1.3;margin-top:2px">${p.name}</p>
          <p style="font-family:'Inter',sans-serif;font-size:13px;color:#364153;font-weight:700;margin-top:6px">${p.price}</p>
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
window.showToast = CH.ui.showToast;

function navigateToCompare() {
  if (!compareList.length) {
    CH.ui.showToast('Add products to compare first');
    return;
  }
  recordCompareSession(compareList);
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
  const openDrawer = document.getElementById('open-compare-drawer');
  const closeDrawer = document.getElementById('close-compare-drawer');
  const clearBtn = document.getElementById('compare-clear-btn');
  const compareBtn = document.getElementById('compare-now-btn');
  const drawer = document.getElementById('compare-drawer');
  
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
    recordCompareSession(compareList);
    window.location.href = `compare.html#ids={compareList.join(',')}` ;
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

const SLIDE_COUNT = 2;
const SLIDE_INTERVAL = 5000;

function goToSlide(index) {
  currentSlide = (index + SLIDE_COUNT) % SLIDE_COUNT;
  const track = document.getElementById('slider-track');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  $$('.slider-dot').forEach((dot, i) => {
    const isActive = i === currentSlide;
    dot.classList.toggle('active', isActive);
    dot.style.width = isActive ? '24px' : '6px';
    dot.style.height = '6px';
    dot.style.background = isActive ? '#ffffff' : 'rgba(255,255,255,0.4)';
    dot.style.opacity = '1';
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

  // Pause on hover
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  hero.addEventListener('mouseleave', startSliderTimer);

  // Touch/swipe support
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
// CATEGORY TABS
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

      const cat = tab.dataset.category;
      const sectionId = SECTION_MAP[cat];

      if (cat === 'all') {
        // Show all sections
        $$('.product-section').forEach(s => s.style.display = '');
      } else if (sectionId) {
        // Scroll to the relevant section
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        CH.ui.showToast(`More categories coming soon!`);
      }
    });
  });
}

// ============================================================
// BRANDS LIST
// ============================================================

// Maps display brand name → vendor key used in brand.html#brand=KEY
const BRAND_VENDOR_KEYS = {
  'MAMACAS':         'MAMACAS',
  'CHICKEN REPUBLIC':'CHICKEN_REPUBLIC',
  'THE PLACE':       'THE_PLACE',
  'MEGA CHICKEN':    'MEGA_CHICKEN',
  'BEYOND TASTE':    'BEYOND_TASTE',
  'JAZZY BURGER':    'JAZZY_BURGER',
  'APPLE':           'APPLE',
  'SAMSUNG':         'SAMSUNG',
  'SONY':            'SONY',
  'JBL':             'JBL',
  'CANON':           'CANON',
  'ELECTROMART':     'ELECTROMART',
  'GADGETPRO':       'GADGETPRO',
  'TECHSTORE':       'TECHSTORE',
  'SMARTBUY':        'SMARTBUY',
  'DIGIZONE':        'DIGIZONE',
  'NAIJAFOODS':      'NAIJAFOODS',
  'FOODHUB':         'FOODHUB',
  'GREENFARM':       'GREENFARM',
};

function renderBrands() {
  const container = document.getElementById('brands-list');
  if (!container) return;
  container.innerHTML = BRANDS.map(brand => {
    const key = BRAND_VENDOR_KEYS[brand.toUpperCase()];
    const baseClass = 'shrink-0 bg-white border border-[#f3f4f6] font-work font-medium text-[14px] text-[#364153] px-3 py-1.5 rounded-2xl hover:border-[#155dfc] hover:text-[#155dfc] transition-colors whitespace-nowrap';
    if (key) {
      return `<a href="brand.html#brand=${key}" class="${baseClass}" style="text-decoration:none;display:inline-block">${brand}</a>`;
    }
    return `<button class="${baseClass}">${brand}</button>`;
  }).join('');
  renderIcons();
}

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const logo = document.getElementById('site-logo');
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

  // Wire mobile sign-in to same auth flow
  document.getElementById('mobile-signin').addEventListener('click', e => {
    e.preventDefault();
    setAuth(true);
    menu.classList.add('hidden');
    hamburger.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
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
    // Close dropdown if open
    document.getElementById('user-dropdown').classList.add('hidden');
  }
}

function initAuthToggle() {
  // Header Sign in button (guest)
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) signInBtn.addEventListener('click', e => {
    e.preventDefault();
    if (window.CompareHub && window.CompareHub.auth && typeof window.CompareHub.auth.show === 'function') window.CompareHub.auth.show('login');
  });

  // Sign out (in dropdown)
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

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('#auth-actions')) {
      dropdown.classList.add('hidden');
      chevron.style.transform = '';
    }
  });
}

// ============================================================
// HERO SEARCH
// ============================================================

// ============================================================
// UNIFIED SEARCH ENGINE
// ============================================================

function getAllProducts() {
  return Object.values(PRODUCTS).flat();
}

function searchProducts(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return getAllProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

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
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { dropdown.classList.add('hidden'); return; }
    debounceTimer = setTimeout(() => {
      const results = searchProducts(q);
      dropdown.innerHTML = buildDropdownHTML(results, q);
      dropdown.classList.remove('hidden');
      renderIcons();
    }, 180);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { dropdown.classList.add('hidden'); navigateToSearch(input.value); }
    if (e.key === 'Escape') { dropdown.classList.add('hidden'); }
  });

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function initHeroSearch() {
  bindSearchBar('hero-search', 'desktop-search-dropdown');
  bindSearchBar('mobile-search-input', 'mobile-search-dropdown');

  // Desktop search button
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
    const email = document.getElementById('newsletter-email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { CH.ui.showToast('Please enter your email address'); return; }
    if (!emailRegex.test(email)) { CH.ui.showToast('Please enter a valid email address'); return; }
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
  // Update header location text
  const locationEl = document.getElementById('mobile-location-name');
  if (locationEl) locationEl.textContent = state;
  renderStatesList();
  setTimeout(closeLocationModal, 200);
  CH.ui.showToast(`ðŸ“ Delivering to ${state}`);
};

function openLocationModal() {
  const modal = document.getElementById('location-modal');
  const backdrop = document.getElementById('location-modal-backdrop');
  if (!modal) return;
  renderStatesList();
  backdrop.classList.remove('hidden');
  // Force reflow then animate
  requestAnimationFrame(() => {
    modal.style.transform = 'translateY(0)';
  });
  document.body.style.overflow = 'hidden';
}

function closeLocationModal() {
  const modal = document.getElementById('location-modal');
  const backdrop = document.getElementById('location-modal-backdrop');
  if (!modal) return;
  modal.style.transform = 'translateY(100%)';
  setTimeout(() => backdrop.classList.add('hidden'), 350);
  document.body.style.overflow = '';
}

function initLocationModal() {
  // Change button in mobile header
  const changeBtn = document.getElementById('mobile-location-change');
  if (changeBtn) changeBtn.addEventListener('click', openLocationModal);

  // Close button
  const closeBtn = document.getElementById('location-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLocationModal);

  // Backdrop click
  const backdrop = document.getElementById('location-modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeLocationModal);

  // Search filter
  const searchInput = document.getElementById('location-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => renderStatesList(e.target.value));
  }
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
        t.style.background = '';
        t.style.color = '';
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

  // Compare tab in bottom nav navigates to compare page
  const compareNavBtn = document.getElementById('mobile-nav-compare');
  if (compareNavBtn) {
    compareNavBtn.addEventListener('click', () => {
      if (compareList.length === 0) {
        CH.ui.showToast('Add products to compare first');
        return;
      }
      recordCompareSession(compareList);
      window.location.href = `compare.html#ids=${compareList.join(',')}`;
    });
  }

  // Mobile header compare button also opens drawer
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

  // Tab active state switching (non-compare tabs)
  tabs.forEach(tab => {
    if (tab.id === 'mobile-nav-compare') return;
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        const icon = t.querySelector('svg');
        const label = t.querySelector('.nav-label');
        if (icon) icon.style.stroke = 'var(--color-muted)';
        if (label) label.style.color = 'var(--color-muted)';
      });
      tab.classList.add('active');
      const icon = tab.querySelector('svg');
      const label = tab.querySelector('.nav-label');
      if (icon) icon.style.stroke = 'var(--color-primary)';
      if (label) label.style.color = 'var(--color-primary)';

      const tabName = tab.dataset.tab;
      if (tabName === 'events') { window.location.href = 'events.html'; return; }
      if (tabName === 'account') CH.ui.showToast('Sign in to view your account');
    });
  });
}


// ============================================================
// DASHBOARD RENDERING
// ============================================================

function renderDashboard() {
  const user = getDashboardData();
  if (!user.name) return; // not logged in

  // Update stats cards
  const statsCards = document.querySelectorAll('.grid.grid-cols-3 > div');
  if (statsCards.length >= 3) {
    // Compare History count
    statsCards[0].querySelector('p:nth-of-type(1)').textContent = user.compareHistory?.length || 0;
    // Wishlist count
    statsCards[1].querySelector('p:nth-of-type(1)').textContent = user.wishlist?.length || 0;
    // Sessions count
    statsCards[2].querySelector('p:nth-of-type(1)').textContent = user.sessionStats?.totalSessions || 0;
  }

  // Update Compare Activity stats
  const totalSessionsEl = document.querySelector('[data-stat="total-sessions"]');
  const productsComparedEl = document.querySelector('[data-stat="products-compared"]');
  if (totalSessionsEl) totalSessionsEl.textContent = user.sessionStats?.totalSessions || 0;
  if (productsComparedEl) productsComparedEl.textContent = user.sessionStats?.productsCompared || 0;

  // Render Compare Activity chart dynamically
  const chartSvg = document.getElementById('activity-chart');
  if (chartSvg) {
    const history = user.compareHistory || [];
    if (history.length === 0) {
      chartSvg.innerHTML = '<text x="280" y="90" text-anchor="middle" font-size="14" fill="#99a1af" font-family="Work Sans">No compare activity yet</text>';
    } else {
      // Generate chart based on compare history
      let html = `
        <text x="0" y="16" font-size="10" fill="#99a1af" font-family="Work Sans">80</text>
        <text x="0" y="52" font-size="10" fill="#99a1af" font-family="Work Sans">60</text>
        <text x="0" y="88" font-size="10" fill="#99a1af" font-family="Work Sans">40</text>
        <text x="0" y="124" font-size="10" fill="#99a1af" font-family="Work Sans">20</text>
        <text x="0" y="160" font-size="10" fill="#99a1af" font-family="Work Sans">0</text>
        <line x1="30" y1="10" x2="555" y2="10" stroke="#f3f4f6" stroke-width="1"/>
        <line x1="30" y1="46" x2="555" y2="46" stroke="#f3f4f6" stroke-width="1"/>
        <line x1="30" y1="82" x2="555" y2="82" stroke="#f3f4f6" stroke-width="1"/>
        <line x1="30" y1="118" x2="555" y2="118" stroke="#f3f4f6" stroke-width="1"/>
        <line x1="30" y1="154" x2="555" y2="154" stroke="#f3f4f6" stroke-width="1"/>`;

      const maxSessions = Math.max(...history.map(h => 1), 20);
      let xPos = 50;
      const spacing = 90;

      history.forEach((session, idx) => {
        if (idx >= 5) return; // Limit to 5 bars
        const barHeight = (session.count / maxSessions) * 144;
        const yPos = 154 - barHeight;
        html += `<rect x="${xPos}" y="${yPos}" width="14" height="${barHeight}" rx="4" fill="#155dfc"/>`;
        html += `<text x="${xPos + 7}" y="170" font-size="10" fill="#99a1af" font-family="Work Sans" text-anchor="middle">${idx + 1}</text>`;
        xPos += spacing;
      });

      chartSvg.innerHTML = html;
    }
    renderIcons();
  }

  // Render Saved to Wishlist grid
  const wishlistGrid = document.getElementById('saved-wishlist-grid');
  if (wishlistGrid) {
    const items = getWishlistItems();
    const maxItems = 4;
    let html = '';

    for (let i = 0; i < maxItems; i++) {
      const product = items[i];
      if (product) {
        html += buildCardHTML(product);
      } else {
        html += `
          <a href="category.html" class="group block">
            <div class="aspect-square rounded-[12px] overflow-hidden bg-[#f9fafb] mb-2 flex items-center justify-center border-2 border-dashed border-[#e5e7eb]">
              <i data-lucide="plus" class="w-8 h-8 text-[#d1d5dc]"></i>
            </div>
            <p class="font-work font-medium text-[12px] text-[#99a1af]">Add to wishlist</p>
          </a>`;
      }
    }

    wishlistGrid.innerHTML = html;
    renderIcons();
  }

  // Update sidebar badges
  const sidebarBadges = document.querySelectorAll('a[href="wishlist.html"] .rounded-full, a[href="compare-history.html"] .rounded-full');
  if (sidebarBadges.length >= 2) {
    sidebarBadges[0].textContent = user.wishlist?.length || 0; // wishlist badge
    sidebarBadges[1].textContent = user.compareHistory?.length || 0; // compare history badge
  }

  // Update mobile sidebar badges
  const mobileBadges = document.querySelectorAll('[href="wishlist.html"] .rounded-full, [href="compare-history.html"] .rounded-full');
  mobileBadges.forEach(badge => {
    const parent = badge.closest('a');
    if (parent && parent.href.includes('wishlist')) {
      badge.textContent = user.wishlist?.length || 0;
    } else if (parent && parent.href.includes('compare-history')) {
      badge.textContent = user.compareHistory?.length || 0;
    }
  });
}

function renderWishlist() {
  const user = getDashboardData();
  if (!user.name) return;

  const items = getWishlistItems();
  const mainGrid = document.getElementById('wishlist-grid');

  if (mainGrid) {
    if (items.length === 0) {
      mainGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i data-lucide="heart" class="w-12 h-12 text-[#d1d5dc] mx-auto mb-3"></i>
          <p class="font-work font-medium text-[16px] text-[#364153] mb-2">Your wishlist is empty</p>
          <p class="font-work text-[14px] text-[#99a1af] mb-6">Start adding products to save them for later</p>
          <a href="category.html" class="inline-block bg-[#155dfc] text-white font-work font-medium px-6 py-2 rounded-[12px]">Browse Products</a>
        </div>`;
    } else {
      mainGrid.innerHTML = items.map(buildCardHTML).join('');
      renderIcons();
    }
  }

  // Update count display (all instances)
  const countEls = document.querySelectorAll('[data-wishlist-count]');
  countEls.forEach(el => el.textContent = items.length);
}

function renderCompareHistory() {
  const user = getDashboardData();
  if (!user.name) return;

  const history = user.compareHistory || [];
  const historyList = document.getElementById('compare-history-list');

  // Update stats on compare-history page
  const productsEl = document.querySelector('[data-stat="products-compared"]');
  if (productsEl) productsEl.textContent = user.sessionStats?.productsCompared || 0;

  // Calculate unique categories from compare history
  const categories = new Set();
  history.forEach(session => {
    session.productIds.forEach(id => {
      const product = findProduct(id);
      if (product) categories.add(product.category);
    });
  });

  const categoriesEl = document.querySelector('[data-stat="categories"]');
  if (categoriesEl) categoriesEl.textContent = categories.size;

  // Calculate total vendor listings across all compare sessions
  const vendorListings = new Set();
  history.forEach(session => {
    session.productIds.forEach(id => {
      const vendors = VENDOR_LISTINGS[id] || [];
      vendors.forEach(v => vendorListings.add(v.name));
    });
  });

  const listingsEl = document.querySelector('[data-stat="listings-reviewed"]');
  if (listingsEl) listingsEl.textContent = vendorListings.size * 3; // Rough estimate

  // Calculate potential savings (price differences)
  let totalSavings = 0;
  history.forEach(session => {
    session.productIds.forEach(id => {
      const vendors = VENDOR_LISTINGS[id] || [];
      if (vendors.length > 1) {
        const prices = vendors.map(v => v.price);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        totalSavings += (maxPrice - minPrice);
      }
    });
  });

  const savingsEl = document.querySelector('[data-stat="potential-savings"]');
  if (savingsEl) savingsEl.textContent = '₦' + totalSavings.toLocaleString('en-US');

  if (historyList) {
    if (history.length === 0) {
      historyList.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i data-lucide="history" class="w-12 h-12 text-[#d1d5dc] mx-auto mb-3"></i>
          <p class="font-work font-medium text-[16px] text-[#364153] mb-2">No compare history yet</p>
          <p class="font-work text-[14px] text-[#99a1af] mb-6">Start comparing products to build your history</p>
          <a href="category.html" class="inline-block bg-[#155dfc] text-white font-work font-medium px-6 py-2 rounded-[12px]">Browse & Compare</a>
        </div>`;
    } else {
      const html = history.map((session, idx) => {
        const date = new Date(session.timestamp);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const products = session.productIds
          .map(id => findProduct(id))
          .filter(p => p);

        const vendorCount = new Set(products.flatMap(p => {
          const vendors = VENDOR_LISTINGS[p.id] || [];
          return vendors.map(v => v.name);
        })).size;

        const productNames = products.map(p => p.name).join(', ');

        return `
          <div class="history-card bg-white rounded-[16px] border border-[#f3f4f6] overflow-hidden" style="box-shadow:0 1px 4px rgba(0,0,0,0.05)">
            <div class="relative">
              <div class="h-[160px] overflow-hidden bg-[#f9fafb] flex items-center justify-center">
                <i data-lucide="history" class="w-10 h-10 text-[#d1d5dc]"></i>
              </div>
              <span class="absolute top-2 left-2 bg-[#155dfc] text-white font-work font-semibold text-[10px] px-1.5 py-0.5 rounded-[6px]">${dateStr}</span>
              <span class="absolute top-2 right-2 bg-white text-[#364153] font-work font-medium text-[10px] px-2 py-0.5 rounded-full border border-[#f3f4f6]">${vendorCount} vendors</span>
            </div>
            <div class="p-4">
              <p class="font-work text-[10px] text-[#99a1af] uppercase tracking-wide mb-0.5">COMPARE SESSION</p>
              <p class="font-work font-semibold text-[14px] text-[#101828] mb-1 line-clamp-2">${timeStr}</p>
              <p class="font-work font-bold text-[16px] text-[#155dfc] mb-3">${session.count} products</p>
              <div class="flex gap-2">
                <button onclick="CompareHub.compare.deleteHistory(${idx})" class="flex-1 bg-[#fee2e2] text-[#ef4444] font-work font-semibold text-[12px] py-2 rounded-[10px] hover:bg-[#fecaca] transition-colors">Delete</button>
                <a href="compare.html#ids=${session.productIds.join(',')}" class="flex-1 text-center bg-[#155dfc] text-white font-work font-semibold text-[13px] py-2.5 rounded-[10px] hover:bg-[#1447e6] transition-colors" style="text-decoration:none">View</a>
              </div>
            </div>
          </div>`;
      }).join('');

      historyList.innerHTML = html;
      renderIcons();
    }
  }

  // Update count display (all instances)
  const countEls = document.querySelectorAll('[data-history-count]');
  countEls.forEach(el => el.textContent = history.length);
}

CH.compare.deleteHistory = function(idx) {
  let user = getDashboardData();
  if (user.compareHistory && user.compareHistory[idx]) {
    user.compareHistory.splice(idx, 1);
    user.sessionStats.compareHistoryCount = user.compareHistory.length;
    saveDashboardData(user);
    renderCompareHistory();
    CH.ui.showToast('Compare session deleted');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderBrands();
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
  renderIcons();
});


















