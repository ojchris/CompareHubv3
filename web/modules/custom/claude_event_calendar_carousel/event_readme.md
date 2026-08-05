# Event Calendar Carousel Module

A Drupal 10 module that adds click functionality to Views-based FullCalendar displays to show event banners in a Slick Carousel when users click on dates.

## Requirements

- Drupal 10
- FullCalendar module: https://www.drupal.org/project/fullcalendar
- Slick Carousel module: https://www.drupal.org/project/slick
- Views module (core)

## Installation

1. Download and install the required dependencies:
   ```bash
   composer require drupal/fullcalendar drupal/slick
   ```

2. Enable the required modules:
   ```bash
   drush en fullcalendar slick views event_calendar_carousel
   ```

3. Clear cache:
   ```bash
   drush cr
   ```

## Configuration

### Content Type Setup

This module works with any content type that has a date field. The default configuration expects:

1. **Content Type**: Event (machine name: `event`)
2. **field_event_date** - Date or Datetime field for the event date
3. **field_banner** - Image field for the event banner image
4. **body** - (Optional) Text field for event description

### Creating the Event Content Type

1. Go to Structure > Content types > Add content type
2. Create a content type called "Event" (machine name: `event`)
3. Add the following fields:
   - **Event Date**: Field type: Date or Datetime, Machine name: `field_event_date`
   - **Banner**: Field type: Image, Machine name: `field_banner`
   - **Body**: Already exists by default

### Creating the Calendar View

1. Go to Structure > Views > Add view
2. Configure the view:
   - **View name**: Event Calendar
   - **Show**: Content of type Event
   - **Create a page**: Yes
   - **Page title**: Events Calendar
   - **Path**: /events/calendar
   - **Display format**: FullCalendar

3. Configure the FullCalendar display:
   - Add the Date field (field_event_date) to Fields
   - Configure FullCalendar settings in Format settings
   - Set the Date Source to your date field
   - Configure color, display options as desired

4. Save the view

### Adjusting Field Names

If your content type uses different field names, edit:
`src/Controller/EventCalendarController.php`

Change these lines:
```php
// Line 49 - Content type machine name
->condition('type', 'event')

// Lines 56-62 - Date field name
->condition('field_event_date', $date, '>=')
->condition('field_event_date', $start_date, '>=')
->condition('field_event_date', $end_date, '<=')
->sort('field_event_date', 'ASC');

// Lines 73-82 - Banner field name
if ($node->hasField('field_banner') && !$node->get('field_banner')->isEmpty()) {
```

## Usage

1. Create several Event nodes with dates and banner images
2. Navigate to your Views calendar page (e.g., `/events/calendar`)
3. Click on any date in the calendar to see events for that day
4. A carousel will appear below the calendar showing event banners
5. Click on carousel items to navigate to full event pages

## How It Works

The module uses `hook_views_post_render()` to:
1. Detect Views displays that use FullCalendar
2. Inject a carousel container below the calendar
3. Attach JavaScript that adds click handlers to calendar dates
4. When a date is clicked, fetch events via AJAX
5. Display event banners in a Slick carousel

## Module Structure

```
event_calendar_carousel/
├── css/
│   └── calendar-carousel.css          # Styles for carousel
├── js/
│   └── calendar-carousel.js           # Date click handling & carousel
├── src/
│   └── Controller/
│       └── EventCalendarController.php # AJAX endpoint for events
├── templates/
│   └── event-carousel-container.html.twig # Carousel container
├── event_calendar_carousel.info.yml    # Module definition
├── event_calendar_carousel.libraries.yml # Asset libraries
├── event_calendar_carousel.module      # Module hooks
├── event_calendar_carousel.routing.yml # Routes
└── README.md
```

## Features

- **Works with ANY Views FullCalendar display** - No custom page needed
- **Automatic Detection**: Finds and enhances all FullCalendar views
- **Interactive Calendar**: Click any date to filter events
- **Event Carousel**: View event banners in responsive Slick carousel
- **Smooth Navigation**: Auto-scroll to carousel when date is clicked
- **Fallback Display**: Shows placeholder for events without banners
- **AJAX Loading**: Events load dynamically without page refresh
- **Event Descriptions**: Shows truncated body text in carousel
- **Accessibility**: Proper alt text, keyboard navigation, focus management
- **Responsive Design**: Mobile-friendly layout
- **XSS Protection**: All user content is properly escaped

## API Endpoint

The module provides an AJAX endpoint:

**GET** `/api/events/by-date/{date}`

Returns:
```json
{
  "date": "2025-11-18",
  "events": [
    {
      "id": 123,
      "title": "Event Title",
      "banner": "https://example.com/banner.jpg",
      "banner_alt": "Banner description",
      "description": "Event description...",
      "url": "/node/123"
    }
  ],
  "count": 1
}
```

## Customization

### Styling

Customize the appearance by editing `css/calendar-carousel.css`:
- Carousel container styling
- Banner image dimensions
- Placeholder design
- Color scheme
- Responsive breakpoints

### Carousel Settings

Modify Slick carousel options in `js/calendar-carousel.js` (around line 124):
```javascript
$carousel.slick({
  dots: true,
  infinite: events.length > 1,
  speed: 300,
  slidesToShow: 1,
  adaptiveHeight: true,
  arrows: events.length > 1,
  autoplay: false,
  lazyLoad: 'ondemand',
  accessibility: true
});
```

### Multiple Calendars

The module supports multiple FullCalendar views on the same site. Each gets its own carousel with a unique ID based on the View ID.

## Troubleshooting

**Calendar not showing:**
- Verify FullCalendar module is enabled and configured
- Check that your View display format is set to FullCalendar
- Clear Drupal cache

**Carousel not appearing:**
- Open browser console and check for JavaScript errors
- Verify Slick module is enabled and libraries are installed
- Check that the carousel container is being added to the page source

**Events not loading:**
- Verify the content type machine name matches in the controller
- Check that field names match your content type
- Ensure events are published and have dates
- Check `/api/events/by-date/2025-11-18` (use any date) to test the endpoint

**Click handlers not working:**
- The module tries to detect FullCalendar instances for up to 10 seconds
- Check browser console for "Event Calendar Carousel: Handlers attached" message
- Verify that jQuery and once library are loaded

**Different content type:**
- Edit `src/Controller/EventCalendarController.php`
- Change the content type condition and field names as needed
- Clear cache after changes

## Performance Considerations

- Events are loaded via AJAX only when needed
- Carousel is initialized only when events exist
- Uses Drupal's once library to prevent duplicate initialization
- Lazy loading for images (if configured in Slick settings)

## Security

- All user input is escaped to prevent XSS attacks
- Proper access checks on content queries
- AJAX endpoint requires 'access content' permission
- Uses Drupal's security best practices

## License

GPL-2.0+

## Support

For issues, feature requests, or contributions, please use the module's issue queue.