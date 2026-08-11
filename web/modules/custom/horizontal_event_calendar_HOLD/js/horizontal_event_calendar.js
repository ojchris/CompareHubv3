(function (Drupal, $, drupalSettings, once) {
  'use strict';

  const MONTH_LABELS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const DAY_LABELS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const BASE_URL = (drupalSettings.path && drupalSettings.path.baseUrl) ? drupalSettings.path.baseUrl : '/';
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectedDate = null;
  let eventsMap = {};

  function getPath(path) {
    const trimmedPath = path.replace(/^\/+/, '');
    const normalizedBase = BASE_URL.replace(/\/$/, '');
    return `${normalizedBase}/${trimmedPath}`;
  }

  function setCurrentYearMonth(dateKey) {
    if (!dateKey) {
      return;
    }
    const parts = dateKey.split('-');
    if (parts.length < 3) {
      return;
    }
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      currentYear = year;
      currentMonth = month;
    }
  }

  function buildCalendarArea($container, $insertBefore) {
    const html = `
      <section class="hfc-calendar-area" id="hfc-calendar-area">
        <div class="hfc-calendar-panel">
          <div class="hfc-calendar-header">
            <div class="hfc-year-nav">
              <button type="button" class="hfc-nav-btn" id="hfc-prev-year" aria-label="Previous year">&lt;</button>
              <span id="hfc-year" class="hfc-year-label">${currentYear}</span>
              <button type="button" class="hfc-nav-btn" id="hfc-next-year" aria-label="Next year">&gt;</button>
            </div>
            <div class="hfc-months" id="hfc-months-container"></div>
          </div>
          <div class="hfc-date-scroller-wrapper">
            <button type="button" class="hfc-date-scroll-btn hfc-scroll-prev" id="hfc-scroll-prev" aria-label="Scroll dates left">&lt;</button>
            <div class="hfc-date-scroller" id="hfc-date-scroller"></div>
            <button type="button" class="hfc-date-scroll-btn hfc-scroll-next" id="hfc-scroll-next" aria-label="Scroll dates right">&gt;</button>
          </div>
        </div>
      </section>
    `;
    if ($insertBefore && $insertBefore.length) {
      $insertBefore.before(html);
    }
    else {
      $container.prepend(html);
    }
  }

  function fetchEventsJson() {
    return $.getJSON(getPath('horizontal-calendar/events.json')).then(function (data) {
      const items = (data && data.events) ? data.events.map(function (event) {
        return {
          title: event.title,
          date: event.date,
          nid: event.nid,
          url: event.url
        };
      }) : [];
      items.sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });
      return items;
    }, function () {
      return [];
    });
  }

  function populateEventsMap(events) {
    eventsMap = {};
    events.forEach(function (event) {
      eventsMap[event.date] = eventsMap[event.date] || [];
      eventsMap[event.date].push(event);
    });
  }

  function buildMonthButtons() {
    const container = $('#hfc-months-container');
    container.empty();
    MONTH_LABELS.forEach(function (label, index) {
      const button = $('<button type="button" class="hfc-month-btn"></button>').text(label);
      if (index === currentMonth) {
        button.addClass('active');
      }
      button.on('click', function () {
        currentMonth = index;
        selectedDate = null;
        refreshCustomUI();
      });
      container.append(button);
    });
    $('#hfc-year').text(currentYear);
  }

  function buildDateScroller() {
    const scroller = $('#hfc-date-scroller');
    scroller.empty();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDOW = new Date(currentYear, currentMonth, 1).getDay();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dow = (firstDOW + day - 1) % 7;
      const button = $('<button type="button" class="hfc-date-btn"></button>');
      button.attr('data-date', dateKey);
      button.append(`<span class="hfc-date-day">${DAY_LABELS[dow]}</span>`);
      button.append(`<span class="hfc-date-number">${day}</span>`);
      if (eventsMap[dateKey]) {
        button.append('<span class="hfc-date-dot"></span>');
      }
      if (selectedDate === dateKey) {
        button.addClass('selected');
      }
      if (dateKey === new Date().toISOString().slice(0, 10)) {
        button.addClass('today');
      }
      button.on('click', function () {
        selectDate(dateKey);
      });
      scroller.append(button);
    }
  }

  function refreshCustomUI() {
    buildMonthButtons();
    buildDateScroller();
  }

  function selectDate(dateKey) {
    selectedDate = dateKey;
    buildDateScroller();
    loadDateEvents(dateKey);
  }

  function loadDateEvents(dateKey) {
    const $target = $('#event-cards');
    if (!$target.length || !dateKey) {
      return;
    }
    $target.html('<p>Loading…</p>');
    $.get(getPath(`event-cards/${dateKey}`))
      .done(function (html) {
        const $doc = $('<div>').html(html);
        const $view = $doc.find('.view-event-list-date-controlled').first();
        if (!$view.length) {
          $target.html('<p>No events found for this date.</p>');
          return;
        }
        $target.html($view);
        Drupal.attachBehaviors($target[0]);
        setTimeout(function () {
          jQuery('.slick-initialized', $target).each(function () {
            jQuery(this).slick('setPosition');
          });
        }, 150);
      })
      .fail(function () {
        $target.html('<p>No events found for this date.</p>');
      });
  }

  function setupHeaderControls() {
    $('#hfc-prev-year').off('click').on('click', function () {
      currentYear -= 1;
      refreshCustomUI();
    });
    $('#hfc-next-year').off('click').on('click', function () {
      currentYear += 1;
      refreshCustomUI();
    });

    $('#hfc-scroll-prev').off('click').on('click', function () {
      const scroller = document.getElementById('hfc-date-scroller');
      if (scroller) {
        scroller.scrollBy({ left: -240, behavior: 'smooth' });
      }
    });

    $('#hfc-scroll-next').off('click').on('click', function () {
      const scroller = document.getElementById('hfc-date-scroller');
      if (scroller) {
        scroller.scrollBy({ left: 240, behavior: 'smooth' });
      }
    });
  }

  function hideDefaultWrapper() {
    $('.business-partnership-section .calendar-wrapper').hide();
  }

  Drupal.behaviors.horizontalEventCalendar = {
    attach: function (context) {
      once('horizontalEventCalendar', '.page-body', context).forEach(function (el) {
        const $pageBody = $(el);
        const $eventCards = $pageBody.find('#event-cards');
        if (!$pageBody.length || !$eventCards.length) {
          return;
        }
        hideDefaultWrapper();
        buildCalendarArea($pageBody, $eventCards);
        setupHeaderControls();
        fetchEventsJson().then(function (events) {
          populateEventsMap(events);
          if (!selectedDate) {
            const firstDate = events.length ? events[0].date : null;
            selectedDate = firstDate || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
          }
          setCurrentYearMonth(selectedDate);
          refreshCustomUI();
          selectDate(selectedDate);
        });
      });
    }
  };

})(Drupal, jQuery, drupalSettings, once);
