<?php

namespace Drupal\comparehub_compare_history\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the Compare session entity.
 *
 * @ContentEntityType(
 *   id = "compare_session",
 *   label = @Translation("Compare Session"),
 *   handlers = {
 *     "views_data" = "Drupal\views\EntityViewsData",
 *   },
 *   base_table = "compare_session",
 *   entity_keys = {
 *     "id" = "id",
 *     "uid" = "uid",
 *   },
 * )
 */
class CompareSession extends ContentEntityBase {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('User ID'))
      ->setDescription(t('The user ID of the session owner.'))
      ->setSetting('target_type', 'user')
      ->setDefaultValueCallback('Drupal\node\Entity\Node::getCurrentUserId');

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the session was created.'));

    $fields['product_ids'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Products'))
      ->setDescription(t('The products compared in this session.'))
      ->setSetting('target_type', 'commerce_product')
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'entity_reference_label',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
      ]);

    return $fields;
  }

}
