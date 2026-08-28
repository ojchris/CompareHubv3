/**
 * @file
 * horizontal_event_calendar.js
 *
 * Horizontal date-strip calendar — theme-agnostic.
 *
 * Attaches to any element carrying the [data-hec-mount] attribute.
 * The Block plugin (HorizontalEventCalendarBlock) renders this attribute,
 * so placing the block anywhere is all that is needed — no theme class
 * dependencies (.page-body, .calendar-wrapper, etc.).
 *
 * API endpoints (defined in horizontal_event_calendar.routing.yml):
 *   GET /hec/events.json        — list of all published event dates
 *   GET /hec/cards/{YYYY-MM-DD} — rendered view fragment for a date
 */
(function (Drupal, $, once) {
  'use strict';

  const MONTH_LABELS = ['JAN','FEB','MAR','APR','MAY','JUN',
                        'JUL','AUG','SEP','OCT','NOV','DEC'];
  const DAY_LABELS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const _now      = new Date();
  const TODAY_STR = [
    _now.getFullYear(),
    String(_now.getMonth() + 1).padStart(2, '0'),
    String(_now.getDate()).padStart(2, '0'),
  ].join('-');

  function readableDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  function scrollTo($el) {
    if (!$el || !$el.length) return;
    $('html, body').animate({ scrollTop: $el.offset().top - 80 }, 400);
  }

  function forceBlazy(ctx) {
    $(ctx).find('img.b-lazy[data-src]').each(function () {
      if (!this.src || this.src.startsWith('data:image')) {
        this.src = this.dataset.src;
      }
    });
  }

  function buildStripUI($strip) {
    const html = `
      <div class="epc-month-row-wrapper">
        <div class="epc-month-row" role="tablist" aria-label="Month selector">
          <div class="epc-year-nav" aria-label="Year navigation">
            <button class="epc-year-btn" id="hec-prev-year" aria-label="Previous year">&#8249;</button>
            <span class="epc-year-label" id="hec-year-label"></span>
            <button class="epc-year-btn" id="hec-next-year" aria-label="Next year">&#8250;</button>
          </div>
          <div class="epc-months" id="hec-months"></div>
        </div>
      </div>
      <div class="epc-dates-row-wrapper">
        <div class="epc-dates-row">
          <button class="epc-scroll-arrow epc-arrow-left" id="hec-arrow-left" aria-label="Scroll dates left">&#8249;</button>
          <div class="epc-dates-track" id="hec-dates" role="listbox" aria-label="Date selector"></div>
          <button class="epc-scroll-arrow epc-arrow-right" id="hec-arrow-right" aria-label="Scroll dates right">&#8250;</button>
        </div>
      </div>
    `;
    $strip.html(html);
  }

  function buildCardsUI($cardsWrap) {
    const html = `
      <div class="epc-cards-wrap">
        <div class="epc-cards-header" id="hec-cards-header" style="display:none">
          <span class="epc-cards-date-label" id="hec-cards-date-label"></span>
        </div>
        <div id="hec-event-cards" class="epc-event-cards">
          <div class="epc-loading-msg" id="hec-initial-msg">
            <p>Select a date above to view events.</p>
          </div>
        </div>
      </div>
    `;
    $cardsWrap.html(html);
  }

  // ── Calendar Logic ────────────────────────────────────────────────────────

  function buildMonthPicker($months, state, onMonthClick) {
    $months.empty();
    MONTH_LABELS.forEach(function (label, i) {
      const isActive = i === state.currentMonth;
      const $btn = $('<button>')
        .addClass('epc-month-btn')
        .attr({
          'role': 'tab',
          'aria-selected': isActive ? 'true' : 'false',
          'aria-label': label,
        })
        .text(label);

      if (isActive) {
        $btn.addClass('is-active');
        $btn.append('<span class="epc-month-underline"></span>');
      }

      $btn.on('click', function () {
        state.selectedDate = null;
        onMonthClick(i);
      });

      $months.append($btn);
    });
  }

  function buildDateScroller($dates, state, eventDatesMap, onDateClick) {
    $dates.empty();

    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const firstDOW    = new Date(state.currentYear, state.currentMonth, 1).getDay();
    const todayDate   = new Date(TODAY_STR.split('-')[0], TODAY_STR.split('-')[1] - 1, TODAY_STR.split('-')[2]);

    for (let d = 1; d <= daysInMonth; d++) {
      const m       = String(state.currentMonth + 1).padStart(2, '0');
      const dd      = String(d).padStart(2, '0');
      const dateKey = `${state.currentYear}-${m}-${dd}`;
      const dow     = (firstDOW + d - 1) % 7;
      const thisDay = new Date(state.currentYear, state.currentMonth, d);

      const isToday    = thisDay.toDateString() === todayDate.toDateString();
      const isSelected = dateKey === state.selectedDate;
      const hasEvent   = !!eventDatesMap[dateKey];

      const $pill = $('<button>')
        .addClass('epc-date-pill')
        .attr({
          'data-date': dateKey,
          'role': 'option',
          'aria-selected': isSelected ? 'true' : 'false',
          'aria-label': `${DAY_LABELS[dow]} ${d}${hasEvent ? ', has events' : ''}`,
        })
        .html(`
          <span class="epc-pill-dow">${DAY_LABELS[dow]}</span>
          <span class="epc-pill-num">${d}</span>
          <span class="epc-dot${hasEvent ? ' has-event' : ''}"></span>
        `);

      if (isToday)    $pill.addClass('is-today');
      if (isSelected) $pill.addClass('is-selected');
      if (hasEvent)   $pill.addClass('has-event');
      if (!hasEvent && !isToday && !isSelected) $pill.addClass('is-dim');

      $pill.on('click', function () { onDateClick(dateKey); });
      $dates.append($pill);
    }

    const todayInMonth = (todayDate.getFullYear() === state.currentYear &&
                          todayDate.getMonth()    === state.currentMonth);
    const targetDay    = todayInMonth ? todayDate.getDate() : 1;
    $dates[0].scrollLeft = Math.max(0, (targetDay - 3) * 62);
  }

  function refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick) {
    refs.$yearLabel.text(state.currentYear);
    
    buildMonthPicker(refs.$months, state, onMonthClick);
    buildDateScroller(refs.$dates, state, eventDatesMap, onDateClick);
  }

  function showEmptyState($cards, dateKey) {
    const fmt = readableDate(dateKey);
    $cards.html(`
      <div class="epc-empty-state">
        <div class="epc-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="10" y1="14" x2="14" y2="14"></line>
          </svg>
        </div>
        <p class="epc-empty-title">No events on ${fmt}</p>
        <p class="epc-empty-desc">Try selecting another date or browse other months.</p>
      </div>
    `);
    scrollTo($cards);
  }

  // ── Drupal Behavior ───────────────────────────────────────────────────────

  Drupal.behaviors.horizontalEventCalendar = {
    attach: function (context) {
      // Find the strip and cards wrappers (theme-agnostic, decoupled)
      once('horizontalEventCalendar', '[data-hec-strip]', context).forEach(function (stripEl) {
        
        const $strip = $(stripEl);
        // Look for the cards container anywhere on the page
        const $cardsWrap = $('[data-hec-cards]');
        
        if (!$cardsWrap.length) return;

        const refs = {
          $strip:      $strip,
          $cardsWrap:  $cardsWrap
        };
        
        buildStripUI($strip);
        buildCardsUI($cardsWrap);

        refs.$months     = $strip.find('#hec-months');
        refs.$dates      = $strip.find('#hec-dates');
        refs.$yearLabel  = $strip.find('#hec-year-label');
        refs.$cards      = $cardsWrap.find('#hec-event-cards');
        refs.$header     = $cardsWrap.find('#hec-cards-header');
        refs.$dateLabel  = $cardsWrap.find('#hec-cards-date-label');

        const now = new Date();
        const state = {
          currentYear:  now.getFullYear(),
          currentMonth: now.getMonth(),
          selectedDate: null,
        };

        const eventDatesMap = {};

        // ── Fetch all event dates ─────────────────────────────────────────
        $.getJSON('/hec/events.json')
          .done(function (data) {
            (data.events || []).forEach(function (ev) {
              if (!eventDatesMap[ev.date]) {
                eventDatesMap[ev.date] = 0;
              }
              eventDatesMap[ev.date]++;
            });
            refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
          })
          .fail(function () {
            refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
          });

        // ── Month click ───────────────────────────────────────────────────
        function onMonthClick(monthIndex) {
          state.currentMonth = monthIndex;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        }

        // ── Date click — fetch cards ──────────────────────────────────────
        function onDateClick(dateKey) {
          state.selectedDate = dateKey;
          buildDateScroller(refs.$dates, state, eventDatesMap, onDateClick);

          // Hide our own custom header — the View's header already shows count + date.
          refs.$header.hide();
          refs.$cards.html('<div class="epc-loading-msg"><p>Loading events&hellip;</p></div>');

          $.get('/hec/cards/' + dateKey)
            .done(function (html) {
              if (!html || !html.trim()) {
                showEmptyState(refs.$cards, dateKey);
              } else {
                refs.$cards.html(html);
                // Restructure the View's header into two clean lines.
                var $header = refs.$cards.find('header');
                if ($header.length) {
                  var countText = $header.find('.special-branding-text-highlight').text();
                  $header.html(
                    '<span class="hec-header-sub">' + countText + ' happening on</span>' +
                    '<span class="hec-header-date">' + readableDate(dateKey) + '</span>'
                  );
                }
                // Wrap all .views-row elements in a grid wrapper.
                var $rows = refs.$cards.find('.views-row');
                if ($rows.length && !refs.$cards.find('.hec-grid-wrap').length) {
                  $rows.wrapAll('<div class="hec-grid-wrap"></div>');
                }
                forceBlazy(refs.$cards[0]);
                Drupal.attachBehaviors(refs.$cards[0]);
                setTimeout(function () { forceBlazy(refs.$cards[0]); }, 100);
              }
              scrollTo(refs.$cards);
            })
            .fail(function () {
              showEmptyState(refs.$cards, dateKey);
            });
        }

        // ── Year nav ──────────────────────────────────────────────────────
        refs.$strip.on('click', '#hec-prev-year', function () {
          state.currentYear--;
          state.selectedDate = null;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        });

        refs.$strip.on('click', '#hec-next-year', function () {
          state.currentYear++;
          state.selectedDate = null;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        });

        // ── Date strip scroll arrows ──────────────────────────────────────
        refs.$strip.on('click', '#hec-arrow-left', function () {
          refs.$dates[0].scrollBy({ left: -260, behavior: 'smooth' });
        });

        refs.$strip.on('click', '#hec-arrow-right', function () {
          refs.$dates[0].scrollBy({ left: 260, behavior: 'smooth' });
        });

        // ── Search ────────────────────────────────────────────────────────
        // (If you want search back, you can add [data-hec-search] somewhere and hook it here)
        
      });
    }
  };

})(Drupal, jQuery, once);
