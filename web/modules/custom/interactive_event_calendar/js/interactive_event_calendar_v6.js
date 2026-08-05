/* global Drupal */
/* global jQuery */
/* global once */
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

  function formatDateHuman(dateStr) {
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
      once('interactiveEventCalendar', '.js-drupal-fullcalendar', context).forEach(function () {
        //$('.fullcalendar').on('click', '.fc-daygrid-day', function () {
        //$('.fullcalendar').on('click', '.fc-day-grid', function () {
        //$('.fullcalendar').on('click', '.fc-day', function () {
        $('.js-drupal-fullcalendar').on('click', '.fc-day-top', function () {
          const dateClicked = $(this).data('date');

          if (!dateClicked) {
            return;
          }

          const $target = $('#event-cards');
          $target.html('<p>Loading…</p>');

          $.get(`/event-cards/${dateClicked}`)
            .done(function (html) {

              const $doc = $('<div>').html(html);
              const $view = $doc
                .find('.view-event-list-date-controlled')
                .first();

              if (!$view.length) {
                $target.html('<p>No events found for this datebjhkh.</p>');
                scrollToCarousel($target);
                return;
              }

              // Inject the carousel
              $target.html($view);
              // 🔑 Reattach Drupal behaviors (Slick, etc.)
              Drupal.attachBehaviors($target[0]);

              // Fix Slick after AJAX + Blazy images.
              setTimeout(function () {
                jQuery('.slick-initialized', $target).each(function () {
                  jQuery(this).slick('setPosition');
                });
              }, 150);

              // 🚀 Scroll AFTER everything is ready
              scrollToCarousel($target);

              // 🔥 Force Blazy images to load
              forceLoadBlazyImages($target);

              const formattedDate = formatDateHuman(dateClicked);
              jQuery('.selected-date').text(formattedDate);
 

            })
            .fail(function () {
              $target.html('<p>No events found for this datebmmmmbmn.</p>');
            });

        });
      });
    }
  };
})(Drupal, jQuery, once);
