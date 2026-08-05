(function ($, Drupal, drupalSettings, once) {
  'use strict';

  Drupal.behaviors.eventCalendarCarousel = {
    attach: function (context, settings) {
      // Find all FullCalendar instances in the page
      const $calendars = $('.js-view-dom-id, .fullcalendar, [data-drupal-views-fullcalendar]', context);
      
      $calendars.each(function() {
        once('event-calendar-carousel', this).forEach(function(element) {
          attachCalendarClickHandlers(element);
        });
      });

      /**
       * Attach click handlers to FullCalendar.
       */
      function attachCalendarClickHandlers(calendarElement) {
        const carouselSettings = drupalSettings.eventCalendarCarousel || {};
        const carouselViewId = carouselSettings.carouselViewId;
        const carouselDisplayId = carouselSettings.carouselDisplayId;
        
        if (!carouselViewId) {
          console.log('Event Calendar Carousel: No carousel view configured');
          return;
        }
        
        // Wait for FullCalendar to be initialized
        const checkInterval = setInterval(function() {
          const fcInstance = getFullCalendarInstance(calendarElement);
          
          if (fcInstance) {
            clearInterval(checkInterval);
            
            // Add dateClick handler
            fcInstance.setOption('dateClick', function(info) {
              updateCarouselFilter(info.dateStr, carouselViewId, carouselDisplayId);
            });
            
            // Add eventClick handler
            fcInstance.setOption('eventClick', function(info) {
              info.jsEvent.preventDefault();
              const dateStr = info.event.startStr.split('T')[0];
              updateCarouselFilter(dateStr, carouselViewId, carouselDisplayId);
            });
            
            console.log('Event Calendar Carousel: Handlers attached to calendar');
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
        if (element.__fullCalendar) {
          return element.__fullCalendar;
        }
        
        const $el = $(element);
        if ($el.data('fullCalendar')) {
          return $el.data('fullCalendar');
        }
        
        const fcEl = element.querySelector('.fc');
        if (fcEl && fcEl.__fullCalendar) {
          return fcEl.__fullCalendar;
        }
        
        if (typeof FullCalendar !== 'undefined') {
          const calendar = FullCalendar.Calendar;
          if (calendar && typeof calendar.getInstance === 'function') {
            return calendar.getInstance(element);
          }
        }
        
        return null;
      }

      /**
       * Update the carousel by finding and reloading the Views block with new date filter.
       * 
       * This approach assumes the carousel view block is already placed on the page.
       * We update its contextual filter by triggering a Views AJAX refresh.
       */
      function updateCarouselFilter(date, viewId, displayId) {
        // Find the carousel view on the page
        // Views blocks typically have: view-id-VIEWID and view-display-id-DISPLAYID classes
        const $carouselView = $('.view-id-' + viewId.replace(/_/g, '-') + 
                                  '.view-display-id-' + displayId.replace(/_/g, '-'), context);
        
        if (!$carouselView.length) {
          console.warn('Carousel view not found on page. Please add the carousel block to your layout.');
          console.log('Looking for view: ' + viewId + ', display: ' + displayId);
          return;
        }
        
        // Find the Views AJAX object associated with this view
        // and trigger it with the new date argument
        const viewData = $carouselView.data('drupal-views-infinite-scroll-content-wrapper');
        
        // For Views with exposed filters or AJAX, we can trigger updates
        // Since we're using contextual filters, we need to update the view's base path
        
        // Method 1: If the view has AJAX pager or exposed filters
        const $ajaxElement = $carouselView.find('.views-element-container, .view-content').first();
        
        if (Drupal.views && Drupal.views.instances) {
          // Find the view instance
          Object.keys(Drupal.views.instances).forEach(function(key) {
            const viewInstance = Drupal.views.instances[key];
            if (viewInstance.$view && viewInstance.$view.hasClass('view-id-' + viewId.replace(/_/g, '-'))) {
              // Update the view's settings with new argument
              if (viewInstance.settings && viewInstance.settings.view_args) {
                viewInstance.settings.view_args = date;
              }
              // Trigger AJAX refresh if available
              if (viewInstance.refreshViewAjax) {
                viewInstance.refreshViewAjax();
              }
            }
          });
        }
        
        // Method 2: Use Views exposed form AJAX if available
        const $exposedForm = $carouselView.closest('.view').find('form.views-exposed-form');
        if ($exposedForm.length) {
          // If there's an exposed date filter, update it
          $exposedForm.find('input[name*="date"]').val(date).trigger('change');
        }
        
        // Method 3: Simple message approach - let site builder handle display
        // Show which date was clicked
        const formattedDate = formatDate(date);
        const $message = $('<div class="calendar-date-selected">')
          .text('Showing events for: ' + formattedDate)
          .hide()
          .prependTo($carouselView)
          .fadeIn();
        
        // Remove previous messages
        $carouselView.find('.calendar-date-selected').not($message).remove();
        
        // Scroll to carousel
        $('html, body').animate({
          scrollTop: $carouselView.offset().top - 20
        }, 500);
        
        console.log('Calendar date clicked: ' + date);
        console.log('Note: For full dynamic filtering, use Views AJAX or exposed filters');
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