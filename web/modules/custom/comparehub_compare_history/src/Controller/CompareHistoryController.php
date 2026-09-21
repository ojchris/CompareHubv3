<?php

namespace Drupal\comparehub_compare_history\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for Compare History API endpoints.
 */
class CompareHistoryController extends ControllerBase {

  /**
   * Renders the /compare page (JS-driven, just needs a proper Drupal route).
   */
  public function comparePage() {
    return [
      '#markup' => '',
      '#cache' => ['contexts' => ['user']],
    ];
  }

  /**
   * Saves a new compare session.
   */
  public function save(Request $request) {
    $uid = \Drupal::currentUser()->id();
    
    if (!$uid) {
      return new JsonResponse(['error' => 'User not logged in'], 401);
    }

    $content = $request->getContent();
    $data = json_decode($content, TRUE);

    if (empty($data['product_ids']) || !is_array($data['product_ids'])) {
      return new JsonResponse(['error' => 'Invalid product_ids'], 400);
    }

    $session = \Drupal::entityTypeManager()->getStorage('compare_session')->create([
      'uid' => $uid,
      'product_ids' => $data['product_ids'],
    ]);
    
    $session->save();

    return new JsonResponse([
      'status' => 'success',
      'id' => $session->id(),
    ]);
  }

  /**
   * Clears all compare sessions for the current user.
   */
  public function clear(Request $request) {
    $uid = \Drupal::currentUser()->id();
    
    if (!$uid) {
      return new JsonResponse(['error' => 'User not logged in'], 401);
    }

    $storage = \Drupal::entityTypeManager()->getStorage('compare_session');
    $sessions = $storage->loadByProperties(['uid' => $uid]);
    
    if (!empty($sessions)) {
      $storage->delete($sessions);
    }

    return new JsonResponse([
      'status' => 'success',
      'deleted_count' => count($sessions),
    ]);
  }

}
