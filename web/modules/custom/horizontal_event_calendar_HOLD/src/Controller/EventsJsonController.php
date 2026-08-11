<?php
namespace Drupal\horizontal_event_calendar\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Controller returning a simple JSON list of event dates and metadata.
 */
class EventsJsonController extends ControllerBase {

  public function list() {
    $items = [];

    $view = \Drupal\views\Views::getView('events_calendar');
    if ($view) {
      $view->setDisplay('default');
      $view->preExecute();
      $view->execute();
      foreach ($view->result as $row) {
        if (isset($row->_entity) && $row->_entity instanceof \Drupal\Core\Entity\ContentEntityInterface) {
          $node = $row->_entity;
          $date_field = $node->get('field_scheduled_date')->first();
          if ($date_field) {
            $raw = $date_field->getValue();
            $start = isset($raw['value']) ? $raw['value'] : NULL;
            if ($start) {
              try {
                $dt = new DrupalDateTime($start);
                $date = $dt->format('Y-m-d');
              }
              catch (\Exception $e) {
                $date = substr($start, 0, 10);
              }
              $items[] = [
                'nid' => $node->id(),
                'title' => $node->label(),
                'date' => $date,
                'url' => '/node/' . $node->id(),
              ];
            }
          }
        }
      }
    }

    return new JsonResponse(['events' => $items]);
  }

}
