<?php

namespace Drupal\events_page_calendar\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Renders the event_list_date_controlled view for a given date and returns
 * the raw HTML fragment so the JS can inject it into #event-cards.
 *
 * Endpoint: GET /events-calendar/cards/{date}
 */
class EventCardsController extends ControllerBase {

  /**
   * Renders and returns the view block for the requested date.
   *
   * @param string $date
   *   Date in YYYY-MM-DD format (enforced by route requirement).
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   Raw HTML response (no page wrapper).
   */
  public function render(string $date): Response {

    // Render the view that accepts a date contextual filter.
    $build = views_embed_view('event_list_date_controlled', 'block_one', $date);

    if (empty($build)) {
      return new Response('', Response::HTTP_NO_CONTENT);
    }

    /** @var \Drupal\Core\Render\RendererInterface $renderer */
    $renderer = \Drupal::service('renderer');
    $html     = $renderer->renderRoot($build);

    return new Response((string) $html, Response::HTTP_OK, [
      'Content-Type' => 'text/html; charset=utf-8',
    ]);
  }

}
