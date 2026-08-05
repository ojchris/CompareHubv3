<?php

namespace Drupal\event_calendar_carousel\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\views\Views;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for Event Calendar Carousel.
 */
class EventCalendarController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * Load and render the carousel view for a specific date.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   JSON response containing the rendered carousel.
   */
  public function loadCarousel(Request $request) {
    $date = $request->query->get('date');
    $view_id = $request->query->get('view_id', 'event_carousel');
    $display_id = $request->query->get('display_id', 'block_1');
    
    if (empty($date)) {
      return new JsonResponse([
        'success' => FALSE,
        'message' => 'Date parameter is required',
      ], 400);
    }
    
    // Load the view
    $view = Views::getView($view_id);
    
    if (!$view) {
      return new JsonResponse([
        'success' => FALSE,
        'message' => 'Carousel view not found: ' . $view_id,
      ], 404);
    }
    
    // Set the display
    $view->setDisplay($display_id);
    
    // Set the contextual filter argument (date)
    $view->setArguments([$date]);
    
    // Execute the view
    $view->preExecute();
    $view->execute();
    
    // Get the rendered output
    $renderer = \Drupal::service('renderer');
    $render_array = $view->buildRenderable($display_id, [$date]);
    
    if ($render_array) {
      $rendered_output = $renderer->renderRoot($render_array);
      $has_results = !empty($view->result);
      
      return new JsonResponse([
        'success' => TRUE,
        'html' => (string) $rendered_output,
        'has_results' => $has_results,
        'result_count' => count($view->result),
        'date' => $date,
      ]);
    }
    
    return new JsonResponse([
      'success' => FALSE,
      'message' => 'Failed to render carousel',
    ], 500);
  }

}