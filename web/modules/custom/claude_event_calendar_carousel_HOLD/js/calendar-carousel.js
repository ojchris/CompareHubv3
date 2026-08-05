(function ($, Drupal, drupalSettings, once) {
  'use strict';

  Drupal.behaviors.eventCalendarCarousel = {
    attach: function (context, settings) {
      // Find all FullCalendar instances in the page
      const $calendars = $('.js-view-dom-id, .fullcalendar, [data-drupal-views-fullcalendar]', context);
      
      $calendars.each(function() {
        const $calendar = $(this);
        
        // Use 'once' to ensure we only attach the behavior once per element
        once('event-calendar-carousel', this).forEach(function(element) {
          attachCalendarClickHandlers(element);
        });
      });

      /**
       * Attach click handlers to FullCalendar.
       */
      function attachCalendarClickHandlers(calendarElement) {
        const $calendarElement = $(calendarElement);
        const carouselSettings = drupalSettings.eventCalendarCarousel || {};
        const wrapperId = carouselSettings.carouselWrapperId || 'event-carousel-wrapper';
        const carouselViewId = carouselSettings.carouselViewId || 'event_carousel';
        const carouselDisplayId = carouselSettings.carouselDisplayId || 'block_1';
        
        // Wait for FullCalendar to be initialized
        const checkInterval = setInterval(function() {
          const fcInstance = getFullCalendarInstance(calendarElement);
          
          if (fcInstance) {
            clearInterval(checkInterval);
            
            // Add dateClick handler
            fcInstance.setOption('dateClick', function(info) {
              loadCarouselView(info.dateStr, wrapperId, carouselViewId, carouselDisplayId);
            });
            
            // Add eventClick handler to also trigger carousel
            fcInstance.setOption('eventClick', function(info) {
              info.jsEvent.preventDefault();
              const dateStr = info.event.startStr.split('T')[0];
              loadCarouselView(dateStr, wrapperId, carouselViewId, carouselDisplayId);
            });
            
            console.log('Event Calendar Carousel: Handlers attached');
          }
        }, 100);
        
        // Stop checking after 10 seconds
        setTimeout(function() {
          clearInterval(checkInterval);
        }, 10000);
      }

      /**
       * Get FullCalendar instance from various possible sources.
       */
      function getFullCalendarInstance(element) {
        // Try different methods to get the calendar instance
        if (element.__fullCalendar) {
          return element.__fullCalendar;
        }
        
        // Try jQuery data
        const $el = $(element);
        if ($el.data('fullCalendar')) {
          return $el.data('fullCalendar');
        }
        
        // Try finding the calendar element within
        const fcEl = element.querySelector('.fc');
        if (fcEl && fcEl.__fullCalendar) {
          return fcEl.__fullCalendar;
        }
        
        // Try global FullCalendar if available
        if (typeof FullCalendar !== 'undefined') {
          const calendar = FullCalendar.Calendar;
          if (calendar && typeof calendar.getInstance === 'function') {
            return calendar.getInstance(element);
          }
        }
        
        return null;
      }

      /**
       * Load the carousel view via AJAX for a specific date.
       */
      function loadCarouselView(date, wrapperId, viewId, displayId) {
        const $wrapper = $('#' + wrapperId);
        const $container = $wrapper.find('.carousel-content');
        const $title = $wrapper.find('.carousel-title');
        
        if (!$wrapper.length) {
          console.error('Carousel wrapper not found:', wrapperId);
          return;
        }
        
        // Show wrapper and loading state
        $wrapper.show();
        $title.text('Loading events for ' + formatDate(date) + '...');
        $container.html('<div class="carousel-loading"><div class="loading-spinner"></div><p>Loading...</p></div>');
        
        // Make AJAX request to load the carousel view
        $.ajax({
          url: '/api/calendar/load-carousel',
          method: 'GET',
          data: {
            date: date,
            view_id: viewId,
            display_id: displayId
          },
          dataType: 'json',
          success: function(response) {
            if (response.success && response.html) {
              // Update title
              const formattedDate = formatDate(date);
              if (response.has_results) {
                $title.text('Events on ' + formattedDate + ' (' + response.result_count + ')');
              } else {
                $title.text('No events on ' + formattedDate);
              }
              
              // Insert the rendered view
              $container.html(response.html);
              
              // Re-attach Drupal behaviors to the new content
              Drupal.attachBehaviors($container[0]);
              
              // Scroll to carousel
              scrollToElement($wrapper);
            } else {
              $title.text('Error loading events');
              $container.html('<div class="carousel-error"><p>' + 
                (response.message || 'Unable to load events') + '</p></div>');
            }
          },
          error: function(xhr, status, error) {
            console.error('Error loading carousel:', error);
            $title.text('Error loading events');
            $container.html('<div class="carousel-error"><p>Unable to load events. Please try again.</p></div>');
          }
        });
      }

      /**
       * Scroll to an element smoothly.
       */
      function scrollToElement($element) {
        if ($element.length) {
          $('html, body').animate({
            scrollTop: $element.offset().top - 20
          }, 500);
        }
      }

      /**
       * Format date string to readable format.
       */
      function formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
  };

})(jQuery, Drupal, drupalSettings, once);