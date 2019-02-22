import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {IronValidatableBehavior} from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/marked-element/marked-element.js';
import '@api-components/api-property-form-item/api-property-form-item.js';
import '@advanced-rest-client/markdown-styles/markdown-styles.js';
/**
 * Renders custom query parameter property input.
 *
 * Styling
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-url-params-custom-input` | Mixin applied to this element | `{}`
 * `--api-request-parameters-editor-row` | Mixin applied to custom parameter form row | `{}`
 * `--api-request-parameters-editor-row-narrow` | Mixin applied to custom parameter form row when narrow | `{}`
 *
 * You can also style inputs as defined in
 * [api-property-form-item](https://github.com/advanced-rest-client/api-property-form-item)
 * element documentation.
 *
 * @customElement
 * @polymer
 * @demo demo/custom.html Cutom parameters
 * @memberof ApiElements
 * @polymerBehavior Polymer.IronValidatableBehavior
 */
class ApiUrlParamsCustomInput extends mixinBehaviors([IronValidatableBehavior], PolymerElement) {
  static get template() {
    return html`<style include="markdown-styles">
    :host {
      display: block;
      @apply --api-url-params-custom-input;
    }

    .form-row {
      @apply --layout-horizontal;
      @apply --layout-center;
      @apply --api-request-parameters-editor-row;
    }

    .name-field,
    .value-field {
      @apply --layout-flex;
      @apply --layout-horizontal;
      @apply --layout-start;
    }

    .param-name,
    api-property-form-item {
      @apply --layout-flex;
    }

    api-property-form-item[is-array] {
      margin-top: 8px;
    }

    .narrow.form-row {
      display: block;
      @apply --api-request-parameters-editor-row-narrow;
    }

    .name-field {
      margin-right: 12px;
    }

    .narrow .name-field {
      margin-right: 0;
    }
    </style>
    <div class\$="form-row [[_computeNarrowClass(narrow)]]">
      <div class="name-field">
        <paper-input value="{{name}}" label="Parameter name"
          class="param-name" type="text" required="" auto-validate=""></paper-input>
      </div>
      <div class="value-field">
        <api-property-form-item model="[[model]]" name="[[name]]"
          value="{{value}}" required\$="[[required]]"></api-property-form-item>
      </div>
    </div>`;
  }

  static get is() {
    return 'api-url-params-custom-input';
  }
  static get properties() {
    return {
      /**
       * View model to use to render the form.
       * See `api-url-params-editor` element for more information.
       */
      model: Array,
      /**
       * Name of this custom control
       */
      name: {
        type: String,
        notify: true
      },
      /**
       * Value of the control
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The form can display query or URI parameters. When anything change in the form
       * it will send a corresponding custom event (`query-parameter-changed` or
       * `uri-parameter-changed`). To make this happen set the value of this property to
       * either `query` or `uri`.
       */
      required: Boolean,
      /**
       * If set it renders a narrow layout
       */
      narrow: Boolean
    };
  }
  // Overidden from Polymer.IronValidatableBehavior. Will set the `invalid`
  // attribute automatically, which should be used for styling.
  _getValidity() {
    if (!this.required) {
      return true;
    }
    if (!this.name) {
      return false;
    }
    return !!this.value;
  }
  /**
   * Computes css class name for narrow layout
   *
   * @param {Boolean} narrow Value of the `narrow` property.
   * @return {String} Class definition.
   */
  _computeNarrowClass(narrow) {
    return narrow ? 'narrow' : '';
  }
}

window.customElements.define(ApiUrlParamsCustomInput.is, ApiUrlParamsCustomInput);
