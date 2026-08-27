<?php

namespace Drupal\horizontal_event_calendar\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Provides the Horizontal Event Calendar block.
 *
 * Place this block on any page via /admin/structure/block.
 * The block renders a mount point div and attaches the calendar library.
 * The JS initialises itself on the [data-hec-mount] attribute — completely
 * theme-agnostic.
 */
#[Block(
  id: "horizontal_event_calendar_block",
  admin_label: new TranslatableMarkup("Horizontal Event Calendar"),
  category: new TranslatableMarkup("Compare Hub")
)]
class HorizontalEventCalendarBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    return [
      '#markup' => '<div data-hec-mount></div>',
      '#attached' => [
        'library' => ['horizontal_event_calendar/horizontal_event_calendar'],
      ],
      // Don't cache — events change frequently.
      '#cache' => ['max-age' => 0],
    ];
  }

}
