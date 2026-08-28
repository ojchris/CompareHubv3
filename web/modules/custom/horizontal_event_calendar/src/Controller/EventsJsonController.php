<?php

namespace Drupal\horizontal_event_calendar\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\node\Entity\Node;

/**
 * Returns a JSON list of all published event dates for the calendar engine.
 *
 * Endpoint: GET /hec/events.json
 * Response: { "events": [ { "nid": 1, "title": "...", "date": "YYYY-MM-DD", "url": "/node/1" }, ... ] }
 */
class EventsJsonController extends ControllerBase {

  /**
   * Returns published event nodes as a JSON array.
   */
  public function list(): JsonResponse {
    $items = [];

    $nids = \Drupal::entityQuery('node')
      ->condition('status', 1)
      ->condition('type', 'event')
      ->accessCheck(TRUE)
      ->execute();

    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);

      foreach ($nodes as $node) {
        // Support common date field names.
        $date_field = NULL;
        foreach (['field_scheduled_date', 'field_date', 'field_event_date'] as $fname) {
          if ($node->hasField($fname) && !$node->get($fname)->isEmpty()) {
            $date_field = $node->get($fname)->first();
            break;
          }
        }

        if ($date_field) {
          $raw   = $date_field->getValue();
          $start = $raw['value'] ?? NULL;

          if ($start) {
            // field_scheduled_date (SmartDate) stores Unix timestamps.
            if (is_numeric($start)) {
              $date = (new \DateTime('@' . $start))->format('Y-m-d');
            }
            else {
              try {
                $dt   = new DrupalDateTime($start);
                $date = $dt->format('Y-m-d');
              }
              catch (\Exception $e) {
                $date = substr($start, 0, 10);
              }
            }

            $items[] = [
              'nid'   => (int) $node->id(),
              'title' => $node->label(),
              'date'  => $date,
              'url'   => '/node/' . $node->id(),
            ];
          }
        }
      }
    }

    usort($items, fn($a, $b) => strcmp($a['date'], $b['date']));

    return new JsonResponse(['events' => $items]);
  }

}
