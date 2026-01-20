import type { Schema, Struct } from '@strapi/strapi';

export interface ContentBulletItem extends Struct.ComponentSchema {
  collectionName: 'components_content_bullet_items';
  info: {
    displayName: 'ChecklistItem';
    icon: 'plus';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface ContentBulletList extends Struct.ComponentSchema {
  collectionName: 'components_content_bullet_lists';
  info: {
    displayName: 'Checklist';
    icon: 'bulletList';
  };
  attributes: {
    listItem: Schema.Attribute.Component<'content.bullet-item', true>;
  };
}

export interface ContentCardList extends Struct.ComponentSchema {
  collectionName: 'components_content_card_lists';
  info: {
    displayName: 'CardList';
    icon: 'bulletList';
  };
  attributes: {
    column: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    listItem: Schema.Attribute.Component<'content.card-list-item', true>;
  };
}

export interface ContentCardListItem extends Struct.ComponentSchema {
  collectionName: 'components_content_card_list_items';
  info: {
    displayName: 'CardListItem';
    icon: 'book';
  };
  attributes: {
    base: Schema.Attribute.Component<'content.module-base', false>;
    list: Schema.Attribute.Component<'content.bullet-list', true>;
  };
}

export interface ContentModuleBase extends Struct.ComponentSchema {
  collectionName: 'components_content_module_bases';
  info: {
    displayName: 'Base';
    icon: 'house';
  };
  attributes: {
    centeredContent: Schema.Attribute.Boolean;
    context: Schema.Attribute.Text;
    emoji: Schema.Attribute.String;
    icon: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::lucide-icon-picker.lucide-icon'>;
    iconBgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    iconColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    inlineIcon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentSlide extends Struct.ComponentSchema {
  collectionName: 'components_content_slides';
  info: {
    displayName: 'Slide';
    icon: 'discuss';
  };
  attributes: {
    base: Schema.Attribute.Component<'content.module-base', false>;
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    bgImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    useImage: Schema.Attribute.Boolean;
  };
}

export interface ContentSlideshow extends Struct.ComponentSchema {
  collectionName: 'components_content_slideshows';
  info: {
    displayName: 'Slideshow';
    icon: 'slideshow';
  };
  attributes: {
    Slide: Schema.Attribute.Component<'content.slide', true>;
  };
}

export interface FormsFormInfo extends Struct.ComponentSchema {
  collectionName: 'components_forms_form_infos';
  info: {
    displayName: 'FormInfo';
    icon: 'stack';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    formTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Application Form'>;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Submit'>;
    templateId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface FormsTextField extends Struct.ComponentSchema {
  collectionName: 'components_forms_text_fields';
  info: {
    displayName: 'TextField';
  };
  attributes: {
    default: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    textArea: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SettingsService extends Struct.ComponentSchema {
  collectionName: 'components_settings_services';
  info: {
    displayName: 'ServiceBase';
    icon: 'cog';
  };
  attributes: {
    icon: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::lucide-icon-picker.lucide-icon'>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    serviceName: Schema.Attribute.String;
    slug: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.bullet-item': ContentBulletItem;
      'content.bullet-list': ContentBulletList;
      'content.card-list': ContentCardList;
      'content.card-list-item': ContentCardListItem;
      'content.module-base': ContentModuleBase;
      'content.slide': ContentSlide;
      'content.slideshow': ContentSlideshow;
      'forms.form-info': FormsFormInfo;
      'forms.text-field': FormsTextField;
      'settings.service': SettingsService;
    }
  }
}
