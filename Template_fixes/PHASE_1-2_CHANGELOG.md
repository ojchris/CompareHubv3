# CompareHub — Phase 1 & Phase 2 Change Log

Generated: 2026-07-15T15:33:13+01:00

This file summarizes the changes made during Phase 1 (Drupal prep, accessibility, form semantics, Tailwind pinning) and Phase 2 (JavaScript namespacing and cleanup). It lists the files modified and the approximate line ranges or line numbers where the changes were applied. Use this as a hand-off note for the template designer/developer.

---

## Overview

- Phase 1: Prepared the raw HTML template for Drupal consumption (no build process). Focus: accessibility attributes, semantic forms, Tailwind CDN pinning, and replacing pure-JS navigation that should be server-driven.
- Phase 2: Refactored and namespaced JavaScript globals into a single `CompareHub` namespace to avoid leaking globals and reduce the chance of conflicts on Drupal pages. Kept compatibility where necessary.

---

## Phase 1 — key changes (files and brief notes)

- `Phase 1 fixes/index.html`
  - Pinned Tailwind CDN to v3.4.1 for Drupal compatibility (script tag updated to `https://cdn.tailwindcss.com?with=default@3.4.1`).
  - Adjusted header/navigation links to be semantic; converted some JS navigation to `<a href="...">` where appropriate.

- `Phase 1 fixes/admin/login.html`
  - Converted admin login markup to a proper POST form with `method="POST"` and `action="/admin/login"` (CSRF placeholder added) so the flow can be handled server-side in Drupal.

- `Phase 1 fixes/vendor-signup.html`
  - Converted vendor signup markup into a proper form with `method`, `action`, and CSRF placeholder fields.
  - Replaced JS-only navigation calls with server-route `<a href="/user/login">Sign in here</a>` where appropriate.

- Accessibility improvements across pages:
  - Added `aria-hidden="true"` to decorative icons/images where appropriate.
  - Ensured interactive items used accessible markup (labels for inputs, button roles where needed).

- Tailwind pinning and fonts:
  - Ensured pages set `tailwind.config` and load `https://cdn.tailwindcss.com?with=default@3.4.1` to avoid pulling the full, latest utility set at build time.

Files changed (Phase 1):
- `Phase 1 fixes/index.html`
- `Phase 1 fixes/admin/login.html`
- `Phase 1 fixes/vendor-signup.html`
- `Phase 1 fixes/js/components.js` (starter namespacing & auth modal markup adjusted)
- `Phase 1 fixes/js/app.js` (minor auth/form changes and Tailwind pinning verified)
- Various HTML pages (added ARIA and minor markup fixes)

Notes: exact line numbers for Phase 1 edits vary by file; Phase 2 modifications below include explicit line references where changes were performed and verified.

---

## Phase 2 — JavaScript namespacing and cleanup (detailed)

All JS changes centralize runtime behavior under the `CompareHub` namespace (`window.CompareHub`) and the `CH` alias used inside scripts. This reduces global pollution and avoids collisions with other scripts that may be present on Drupal pages.

Top-level namespace initialization (app.js)
- File: `Phase 1 fixes/js/app.js`
  - Lines ~8-9: Added initialization
    - `window.CompareHub = window.CompareHub || { auth: {}, vendor: {}, compare: {}, ui: {} };`
    - `const CH = window.CompareHub;`

Toast helper
- File: `Phase 1 fixes/js/app.js`
  - Lines ~321-328: Converted local `showToast` helper into `CH.ui.showToast`.
  - Line ~556: Added compatibility alias: `window.showToast = CH.ui.showToast;` (to avoid breaking any remaining callers temporarily).
  - Many call sites throughout `js/app.js` now call `CH.ui.showToast(...)` (examples below).

Compare functions (compare drawer)
- File: `Phase 1 fixes/js/app.js`
  - Lines ~548-565: `window.removeFromCompare` → `CH.compare.removeFromCompare`
    - Inline generated button now: `onclick="CompareHub.compare.removeFromCompare(${id})"` (e.g., line ~528 in app.js where the button HTML is assembled).
  - Lines ~1379-1386: `window.deleteCompareHistory` → `CH.compare.deleteHistory`
    - Calls and function definition moved to `CH.compare.deleteHistory`.

State selection
- File: `Phase 1 fixes/js/app.js`
  - Lines ~994-1006: `selectState(...)` → `CH.ui.selectState(...)` and inline handler updated to `onclick="CompareHub.ui.selectState('${state}')"`.

Auth / Modal / OTP namespacing
- File: `Phase 1 fixes/js/components.js`
  - Header/menu clickable elements updated to call namespaced methods:
    - Line ~50, ~70, ~116: header sign-in and sign-out button markup updated to use `CompareHub.auth.show(...)` / `CompareHub.auth.signOut()` / `CompareHub.vendor.signOut()`.
  - OTP input handlers updated (move focus forward/back):
    - Lines ~416-420: `oninput="CompareHub.auth.otpNext(this,0,'otp-inputs')"`, `onkeydown="CompareHub.auth.otpBack(event,this)"` (and similar for indexes 1..4).
    - Lines ~464-468: same for forgot-password OTP inputs: `CompareHub.auth.otpNext(...)/otpBack(...)`.
  - Auth action buttons and handlers were changed to call namespaced methods:
    - Examples: `onclick="CompareHub.auth.doOTP('otp-inputs','dashboard.html')"`, `onclick="CompareHub.auth.doForgot()"`, `onclick="CompareHub.auth.doSignUp()"`, etc. (see lines noted below).
  - Converted global `window.*` auth function definitions into `CH.auth.*`:
    - `CH.auth.show` (approx. line ~643)
    - `CH.auth.close` (approx. line ~662)
    - `CH.auth.signOut` (approx. line ~669)
    - `CH.vendor.signOut` (approx. line ~683)
    - `CH.auth.togglePwd` (approx. line ~692)
    - `CH.auth.googleSignIn` (approx. line ~704)
    - `CH.auth.doSignIn` (approx. line ~755)
    - `CH.auth.doSignUp` (approx. line ~797)
    - `CH.auth.doForgot` (approx. line ~833)
    - `CH.auth.doOTP` (approx. line ~848)
    - `CH.auth.doNewPassword` (approx. line ~876)
  - The OTP helper functions were converted:
    - `CH.auth.otpNext` (defined around line ~712)
    - `CH.auth.otpBack` (defined around line ~721)
  - Calls that previously used `window.showToast(...)` inside components were updated to use `CH.ui.showToast(...)` where applicable (components: ~lines 792 and 893 show toast via CH).

HTML pages — sign-out and inline script updates
- `Phase 1 fixes/dashboard.html` — sign out buttons updated to `CompareHub.auth.signOut()` (lines ~86 and ~238).
- Vendor pages (`Phase 1 fixes/vendor-dashboard.html`, `vendor-teams.html`, `vendor-settings.html`, `vendor-events.html`, `vendor-products.html`, `vendor-reports.html`):
  - Each had inline `vendorSignOut` functions or sign-out button calls; these were converted to `CompareHub.vendor.signOut()` call sites and the pages now ensure `window.CompareHub` is initialized before assigning `CompareHub.vendor.signOut` in inline script blocks (insertion occurred at approx. line ~331 in `vendor-dashboard.html` and similar positions in other vendor pages).

Other UI pages (toast updates)
- `Phase 1 fixes/brand.html` — toast calls updated to `CompareHub.ui.showToast(...)` (approx. lines ~460, ~472).
- `Phase 1 fixes/compare.html` — toast calls updated to `CompareHub.ui.showToast(...)` (approx. lines ~666, ~679).
- `Phase 1 fixes/product.html` — toast calls updated to `CompareHub.ui.showToast(...)` (approx. lines ~549, ~565, ~568, ~570).
- `Phase 1 fixes/category.html` — toast call updated to `CompareHub.ui.showToast(...)` (approx. line ~341).

---

## Phase 3 - Moderate Priority fixes

- **Item 8: Semantic Structure & Corresponding CSS Updates**
  - Converted generic top header `<div>` tags in [`index.html`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/index.html) and [`vendor-dashboard.html`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/vendor-dashboard.html) to semantic `<header>` elements.
  - Wrapped content areas in [`vendor-dashboard.html`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/vendor-dashboard.html) with semantic `<main>` and `<section>` elements.
  - Updated direct descendant CSS selectors in [`css/styles.css`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/css/styles.css#L633) (`.main-container > div, .main-container > section, .main-container > main`) to ensure responsive rules match semantic elements without breaking layout hierarchy.

- **Item 9: Inline Style Extraction & Tailwind Utilities**
  - Extracted inline `style="..."` attributes from the key evidence pages:
    - `Template_fixes/index.html` lines ~204-249, ~396-420, ~481-482
    - `Template_fixes/vendor-dashboard.html` lines ~311-318
    - `Template_fixes/vendor-signup.html` line ~35
    - `Template_fixes/admin/login.html` line ~297
  - Replaced inline styles with equivalent Tailwind utility classes and reusable CSS helper rules in `css/styles.css` (`.card-shadow`, `.activity-icon`, `.activity-product`, `.activity-event`, `.activity-team`, `.modal-backdrop-blur`, `.text-white`).

- **Item 10: Tailwind Config & Token Standardization**
  - Centralized Tailwind configuration to a single shared file: `Template_fixes/js/tailwind-config.js` and updated HTML pages to include it before the Tailwind CDN script. This prevents drift and duplication across page heads.
  - Mapped `brand` color tokens directly to static hex values (`primary: '#155dfc'`, `hover: '#1447e6'`, `dark: '#181d25'`, `body: '#364153'`, `danger: '#ef4444'`) and radii/text sizing matching `:root` definitions in [`styles.css`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/css/styles.css).
  - Verified no HTML page still embeds `var(--color...)` inside `tailwind.config` blocks across `Template_fixes`.
  - Resolves conflicts between Tailwind JIT evaluation and runtime CSS variable lookups.

- **Item 17: Self-Hosted Lucide Icons**
  - Downloaded and saved the pinned Lucide Icons UMD build (v0.441.0) directly into [`js/lucide.min.js`](file:///z:/home/ojchris/webworks/Comparehub/Template_fixes/js/lucide.min.js).
  - Replaced external CDN URLs (`https://unpkg.com/lucide@0.441.0/dist/umd/lucide.min.js`) with relative local script paths (`js/lucide.min.js` or `../js/lucide.min.js`) across all 25 HTML pages.
  - Eliminates reliance on external third-party CDNs, improving security, resilience, and offline availability.

---

## Verification notes

- After edits a repository-wide search in `Phase 1 fixes` was used to confirm removal of the old globals: `window.auth*`, `window.vendorSignOut`, `window.otpNext`, `window.otpBack`, `removeFromCompare`, `selectState`, and `deleteCompareHistory` (raw global definitions/calls) no longer exist.
- Namespaced calls appear instead (examples: `CompareHub.auth.*`, `CompareHub.vendor.*`, `CompareHub.compare.*`, `CompareHub.ui.*`).
- A compatibility alias `window.showToast = CH.ui.showToast;` was left in place to avoid any temporary breakages while dependent pages are migrated to the namespace.

---

## Suggested next steps for Phase 3 (recommendations)

1. Remove the `window.showToast` compatibility alias once all pages are fully migrated to `CH.ui.showToast`.
2. Move inline `onclick="..."` handlers to event listeners where possible (improves separation of concerns and is easier to test/maintain). For example, change generated HTML snippets in `js/app.js` to emit data attributes and attach listeners via `document.addEventListener('click', ...)` or delegated handlers.
3. Consider grouping CompareHub methods into smaller modules (e.g., split large `app.js` into `compare.js`, `ui.js`, `auth.js`) and load them consistently in Drupal templates.
4. When/if a build step is acceptable in the future, use a minimal Tailwind purge/build so Drupal pages only load the utilities they need (this will drastically reduce CSS payload size).

---

If you want this changelog exported to a different filename or added to your repository root (instead of the Phase 1 folder), tell me where and I will move it.

