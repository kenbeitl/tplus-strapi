import type { Schema, Struct } from '@strapi/strapi';

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
    formID: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    formTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Application Form'>;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Submit'>;
  };
}

export interface SettingsService extends Struct.ComponentSchema {
  collectionName: 'components_settings_services';
  info: {
    displayName: 'ServiceBase';
    icon: 'cog';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    serviceName: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'forms.form-info': FormsFormInfo;
      'settings.service': SettingsService;
    }
  }
}
