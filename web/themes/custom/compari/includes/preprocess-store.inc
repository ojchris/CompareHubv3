<?php
/**
 * Implements hook_preprocess_commerce_store().
 *
 * Passes store-filtered products to the store full-view template.
 */
function compari_preprocess_commerce_store(&$variables) {
  /** @var \Drupal\commerce_store\Entity\Store $store */
  $store = $variables['commerce_store'];

  // Only do this on the full view mode (detail page).
  if ($variables['view_mode'] !== 'full') {
    return;
  }

  $store_id = $store->id();

  // Execute the homepage_products view programmatically with the store filter.
  $view = \Drupal\views\Views::getView('homepage_products');
  if (!$view) {
    return;
  }

  $view->setDisplay('default');

  // If the view has a stores_target_id argument (added via config), use it.
  // Otherwise fall back to a filter override.
  $view->setArguments([$store_id]);

  // Override the category filter that's normally on the view to be "all".
  $view->removeHandler('default', 'filter', 'field_category_target_id');

  $view->execute();

  // Pass rendered products to the template.
  $variables['store_products'] = $view->render();
  $variables['store_product_count'] = count($view->result);
}
