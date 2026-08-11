/**
 * @file
 * events_page_calendar.js
 *
 * Horizontal date-strip calendar for the Drupal /events page.
 * Uses native JavaScript Date objects.
 */
(function (Drupal, $, once) {
  'use strict';

  const MONTH_LABELS = ['JAN','FEB','MAR','APR','MAY','JUN',
                        'JUL','AUG','SEP','OCT','NOV','DEC'];
  const DAY_LABELS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const _now       = new Date();
  const TODAY_STR  = [
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

  function buildHeroStrip($body) {
    $body.find('.calendar-wrapper').hide();

    const html = `
      <div id="epc-hero" class="epc-hero" role="navigation" aria-label="Event calendar">
        
        <!-- Top bar: Title on left, Search on right -->
        <div class="epc-topbar">
          <div class="epc-topbar-left">
            <h1 class="epc-title">Events Calendar</h1>
          </div>
          
          <div class="epc-search-bar">
            <svg class="epc-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="epc-search-input" placeholder="Search events..." />
          </div>
        </div>

        <!-- Month picker row: Year nav on left, Months on right -->
        <div class="epc-month-row-wrapper">
          <div class="epc-month-row" role="tablist" aria-label="Month selector">
            <div class="epc-year-nav" aria-label="Year navigation">
              <button class="epc-year-btn" id="epc-prev-year" aria-label="Previous year">&#8249;</button>
              <span class="epc-year-label" id="epc-year-label"></span>
              <button class="epc-year-btn" id="epc-next-year" aria-label="Next year">&#8250;</button>
            </div>
            <div class="epc-months" id="epc-months"></div>
          </div>
        </div>

        <!-- Date scroller row -->
        <div class="epc-dates-row-wrapper">
          <div class="epc-dates-row">
            <button class="epc-scroll-arrow epc-arrow-left" id="epc-arrow-left" aria-label="Scroll dates left">&#8249;</button>
            <div class="epc-dates-track" id="epc-dates" role="listbox" aria-label="Date selector"></div>
            <button class="epc-scroll-arrow epc-arrow-right" id="epc-arrow-right" aria-label="Scroll dates right">&#8250;</button>
          </div>
        </div>

      </div>

      <div class="epc-cards-wrap">
        <div class="epc-cards-header" id="epc-cards-header" style="display:none">
          <span class="epc-cards-date-label" id="epc-cards-date-label"></span>
        </div>
        <div id="epc-event-cards" class="epc-event-cards">
          <div class="epc-loading-msg" id="epc-initial-msg">
            <p>Select a date above to view events.</p>
          </div>
        </div>
      </div>
    `;

    $body.prepend(html);

    return {
      $hero:       $('#epc-hero'),
      $months:     $('#epc-months'),
      $dates:      $('#epc-dates'),
      $yearLabel:  $('#epc-year-label'),
      $searchInput:$('#epc-search-input'),
      $cards:      $('#epc-event-cards'),
      $header:     $('#epc-cards-header'),
      $dateLabel:  $('#epc-cards-date-label'),
    };
  }

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

    const daysInMonth  = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const firstDOW     = new Date(state.currentYear, state.currentMonth, 1).getDay();
    const todayDate    = new Date(TODAY_STR.split('-')[0], TODAY_STR.split('-')[1] - 1, TODAY_STR.split('-')[2]);

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
      if (!hasEvent && !isToday && !isSelected) $pill.addClass('is-dim');

      $pill.on('click', function () { onDateClick(dateKey); });
      $dates.append($pill);
    }

    const todayInMonth = (todayDate.getFullYear() === state.currentYear &&
                          todayDate.getMonth()    === state.currentMonth);
    const targetDay    = todayInMonth ? todayDate.getDate() : 1;
    $dates[0].scrollLeft = Math.max(0, (targetDay - 3) * 62);
  }

  function loadEventCards(dateKey, $cards, $header, $dateLabel, state) {
    state.selectedDate = dateKey;

    $cards.html('<div class="epc-loading-msg"><p>Loading events\u2026</p></div>');
    $header.show();
    $dateLabel.text('Events happening on ' + readableDate(dateKey));

    $.get(`/events-calendar/cards/${dateKey}`)
      .done(function (html) {
        const $doc  = $('<div>').html(html);
        const $view = $doc.find('.view-event-list-date-controlled').first();

        if (!$view.length || $view.text().trim() === '') {
          showEmptyState($cards, dateKey);
          return;
        }

        $cards.html($view);
        Drupal.attachBehaviors($cards[0]);

        setTimeout(function () {
          $cards.find('.slick-initialized').each(function () {
            $(this).slick('setPosition');
          });
        }, 150);

        forceBlazy($cards[0]);
        scrollTo($header);
      })
      .fail(function () {
        showEmptyState($cards, dateKey);
      });
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

  function refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick) {
    refs.$yearLabel.text(state.currentYear);
    buildMonthPicker(refs.$months, state, onMonthClick);
    buildDateScroller(refs.$dates, state, eventDatesMap, onDateClick);
  }

  Drupal.behaviors.eventsPageCalendar = {
    attach: function (context) {
      once('eventsPageCalendar', '.page-body', context).forEach(function (bodyEl) {

        const $body = $(bodyEl);
        const refs  = buildHeroStrip($body);

        const state = {
          currentYear:  _now.getFullYear(),
          currentMonth: _now.getMonth(),
          selectedDate: null,
        };

        let eventDatesMap = {};

        function onMonthClick(monthIndex) {
          state.currentMonth = monthIndex;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        }

        function onDateClick(dateKey) {
          state.selectedDate = dateKey;
          buildDateScroller(refs.$dates, state, eventDatesMap, onDateClick);
          loadEventCards(dateKey, refs.$cards, refs.$header, refs.$dateLabel, state);
        }

        $.getJSON('/events-calendar/events.json')
          .done(function (data) {
            const raw = (data && data.events) ? data.events : [];
            raw.forEach(function (e) {
              eventDatesMap[e.date] = (eventDatesMap[e.date] || 0) + 1;
            });
            refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
            setTimeout(function () {
              if (!state.selectedDate) {
                onDateClick(TODAY_STR);
              }
            }, 100);
          })
          .fail(function () {
            refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
          });

        refs.$hero.on('click', '#epc-prev-year', function () {
          state.currentYear--;
          state.selectedDate = null;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        });

        refs.$hero.on('click', '#epc-next-year', function () {
          state.currentYear++;
          state.selectedDate = null;
          refreshUI(refs, state, eventDatesMap, onMonthClick, onDateClick);
        });

        refs.$hero.on('click', '#epc-arrow-left', function () {
          refs.$dates[0].scrollBy({ left: -260, behavior: 'smooth' });
        });

        refs.$hero.on('click', '#epc-arrow-right', function () {
          refs.$dates[0].scrollBy({ left: 260, behavior: 'smooth' });
        });
        
        refs.$searchInput.on('input', function() {
           const term = $(this).val().toLowerCase();
           refs.$cards.find('.views-row').each(function() {
               const text = $(this).text().toLowerCase();
               if (text.includes(term)) {
                   $(this).show();
               } else {
                   $(this).hide();
               }
           });
        });

      });
    }
  };

})(Drupal, jQuery, once);
