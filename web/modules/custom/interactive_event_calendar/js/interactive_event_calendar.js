(function (Drupal, $, once) {

  /**
   * Force-load Blazy images inside dynamically injected content.
   * This is required because Blazy does not re-register images
   * added outside Views AJAX / BigPipe.
   */
  function forceLoadBlazyImages(context) {
    $(context)
      .find('img.b-lazy[data-src]')
      .each(function () {
        if (!this.src || this.src.startsWith('data:image')) {
          this.src = this.dataset.src;
          //this.classList.remove('b-lazy');
        }
      });
  }

  /** 
   * Convert date string to human-readable format, e.g. "Monday 1 January 2024".
   * @param {string} dateStr - The date string in ISO format (YYYY-MM-DD).
   * @returns {string} - The formatted date string.
  */
  function readableDateFormat(dateStr) {
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


  /**
   * automatic scroll to the carousel after loading new content.
   * @param {jQuery} $target - The target element to scroll to.
   */
  function scrollToCarousel($target) {
    if (!$target.length) {
      return;
    }

    const offset = 100;
    const top = $target.offset().top - offset;

    $('html, body').animate({ scrollTop: top }, 500);
  }

  /**
   * Attach click handler once at the document level.
   * FullCalendar dynamically rebuilds day cells.
   */
  Drupal.behaviors.interactiveEventCalendar = {
    attach: function (context, settings) {

      once('interactiveEventCalendar', '.js-drupal-fullcalendar', context)
        .forEach(function (calendarEl) {

          const $calendar = $(calendarEl);
          const $target = $('#event-cards');

          /* Event loader function, loads events for a given date and
          * injects them into the page, and handles UI updates and error handling.
          * @param {string} dateClicked - The date for which to load events, in ISO format (YYYY-MM-DD). 
          */
          function loadDateEvent(dateClicked) {

            if (!dateClicked) {
              return;
            }

            $target.html('<p>Loading…</p>');

            $.get(`/event-cards/${dateClicked}`)
              .done(function (html) {

                const $doc = $('<div>').html(html);
                const $view = $doc
                  .find('.view-event-list-date-controlled')
                  .first();

                if (!$view.length) {
                  $target.html('<p>No events found for this date.</p>');
                  scrollToCarousel($target);
                  return;
                }

                // Inject view
                $target.html($view);

                // Reattach Drupal behaviors (Slick etc)
                Drupal.attachBehaviors($target[0]);

                // Fix Slick position
                setTimeout(function () {
                  jQuery('.slick-initialized', $target).each(function () {
                    jQuery(this).slick('setPosition');
                  });
                }, 150);

                // Force Blazy images
                forceLoadBlazyImages($target);

                // Update human-readable date
                const formattedDate = readableDateFormat(dateClicked);
                jQuery('.selected-date').text(formattedDate);

                // Scroll after everything is ready
                scrollToCarousel($target);

              })
              .fail(function () {
                $target.html('<p>No events found for this date.</p>');
              });
          }

          // Load events happening on TODAY's date on page load
          const today = new Date();
          const todayFormatted =
            today.getFullYear() + '-' +
            String(today.getMonth() + 1).padStart(2, '0') + '-' +
            String(today.getDate()).padStart(2, '0');

          loadDateEvent(todayFormatted);

          // click date to load available events for that date
          $calendar.on('click', '.fc-day-top', function () {
            const dateClicked = $(this).data('date');
            loadDateEvent(dateClicked);
          });

        });
    }
  };

})(Drupal, jQuery, once);
