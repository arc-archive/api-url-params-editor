import { html, render } from 'lit-html';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/api-navigation/api-navigation.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@api-components/api-url-data-model/api-url-data-model.js';
import '@api-components/raml-aware/raml-aware.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@api-components/api-url-editor/api-url-editor.js';
import '../api-url-params-editor.js';

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();

    this.initObservableProperties([
      'mainReadOnly', 'mainDisabled', 'demoOutlined', 'demoLegacy',
      'baseUri', 'endpointPath', 'queryModel', 'pathModel', 'selectedShape',
      'mainNoLabelFloat', 'selectedOverrideBase', 'narrow', 'allowCustom',
      'noDocs', 'queryModelResult', 'uriModelResult', 'urlResult'
    ]);

    this.componentName = 'api-url-params-editor';
    this.demoStates = ['Filled', 'Outlined', 'Legacy'];
    this._mainDemoStateHandler = this._mainDemoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._baseUrlChangeHandler = this._baseUrlChangeHandler.bind(this);
    this._endpointPathChangeHandler = this._endpointPathChangeHandler.bind(this);
    this._queryModelChangeHandler = this._queryModelChangeHandler.bind(this);
    this._pathModelChangeHandler = this._pathModelChangeHandler.bind(this);
    this._queryValueChanged = this._queryValueChanged.bind(this);
    this._uriValueChanged = this._uriValueChanged.bind(this);
    this._mainValueChanged = this._mainValueChanged.bind(this);
    this._baseUriSelectorHandler = this._baseUriSelectorHandler.bind(this);
  }

  get helper() {
    if (!this.__helper) {
      this.__helper = document.getElementById('helper');
    }
    return this.__helper;
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'method') {
      this.selectedShape = selected;
    } else {
      this.selectedShape = undefined;
    }
  }

  _mainDemoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.demoOutlined = false;
        this.demoLegacy = false;
        break;
      case 1:
        this.demoOutlined = true;
        this.demoLegacy = false;
        break;
      case 2:
        this.demoOutlined = false;
        this.demoLegacy = true;
        break;
    }
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _baseUrlChangeHandler(e) {
    this.baseUri = e.detail.value;
  }

  _endpointPathChangeHandler(e) {
    this.endpointPath = e.detail.value;
  }

  _queryModelChangeHandler(e) {
    const { value } = e.detail;
    if (this.queryModel !== value) {
      this.queryModel = value;
    }
  }

  _pathModelChangeHandler(e) {
    const { value } = e.detail;
    if (this.pathModel !== value) {
      this.pathModel = value;
    }
  }

  _queryValueChanged(e) {
    this.queryModelResult = e.detail.value;
  }

  _uriValueChanged(e) {
    this.uriModelResult = e.detail.value;
  }

  _mainValueChanged(e) {
    this.urlResult = e.detail.value;
  }

  _baseUriSelectorHandler(e) {
    this.selectedOverrideBase = e.detail.value;
  }

  _demoTemplate() {
    const {
      mainReadOnly,
      mainDisabled,
      demoStates,
      darkThemeActive,
      demoOutlined,
      demoLegacy,
      baseUri,
      selectedOverrideBase,
      endpointPath,
      queryModel,
      pathModel,
      mainNoLabelFloat,
      narrow,
      allowCustom,
      noDocs,
      queryModelResult,
      uriModelResult,
      urlResult
    } = this;
    const finalBaseUri = selectedOverrideBase ? selectedOverrideBase : baseUri;
    return html`<section role="main" class="documentation-section">
      <h2>API model demo</h2>
      <p>
        This demo lets you preview the API URL parameters editor element with various
        configuration options.
      </p>

      <section class="horizontal-section-container centered main">
        ${this._apiNavigationTemplate()}
        <div class="demo-container">
          <arc-interactive-demo
            .states="${demoStates}"
            @state-chanegd="${this._mainDemoStateHandler}"
            ?dark="${darkThemeActive}"
          >
            <api-url-params-editor
              slot="content"
              ?readonly="${mainReadOnly}"
              ?disabled="${mainDisabled}"
              ?outlined="${demoOutlined}"
              ?legacy="${demoLegacy}"
              .queryModel="${queryModel}"
              .uriModel="${pathModel}"
              ?narrow="${narrow}"
              ?allowCustom="${allowCustom}"
              ?nodocs="${noDocs}"
              @queryvalue-changed="${this._queryValueChanged}"
              @urivalue-changed="${this._uriValueChanged}"
              @urimodel-changed="${this._pathModelChangeHandler}"
              @querymodel-changed="${this._queryModelChangeHandler}"></api-url-params-editor>

            <label slot="options" id="mainOptionsLabel">Options</label>

            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="mainReadOnly"
              @change="${this._toggleMainOption}"
              >Read only</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="mainDisabled"
              @change="${this._toggleMainOption}"
              >Disabled</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="narrow"
              @change="${this._toggleMainOption}"
              >Narrow view</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="noDocs"
              @change="${this._toggleMainOption}"
              >No docs</anypoint-checkbox
            >
            <anypoint-checkbox
              aria-describedby="mainOptionsLabel"
              slot="options"
              name="allowCustom"
              @change="${this._toggleMainOption}"
              >Allow custom</anypoint-checkbox
            >
          </arc-interactive-demo>

          <div class="url-section-title">Working with URL editor</div>
          <api-url-editor
            slot="content"
            ?readonly="${mainReadOnly}"
            ?disabled="${mainDisabled}"
            ?outlined="${demoOutlined}"
            ?legacy="${demoLegacy}"
            ?noLabelFloat="${mainNoLabelFloat}"
            .baseUri="${finalBaseUri}"
            .endpointPath="${endpointPath}"
            .queryModel="${queryModel}"
            .pathModel="${pathModel}"
            @value-changed="${this._mainValueChanged}"
            @pathmodel-changed="${this._pathModelChangeHandler}"
            @querymodel-changed="${this._queryModelChangeHandler}"></api-url-editor>

          <anypoint-dropdown-menu class="base-uri-selector">
            <label slot="label">Override API's base uri</label>
            <anypoint-listbox
              slot="dropdown-content"
              attrforselected="data-url"
              @selected-changed="${this._baseUriSelectorHandler}">
              <anypoint-item data-url="">Restore API's base URI</anypoint-item>
              <anypoint-item data-url="https://domain.com/base">https://domain.com/base</anypoint-item>
              <anypoint-item
                data-url="https://{version}.domain.com/base/{path}">
                https://{version}.domain.com/base/{path}
              </anypoint-item>
            </anypoint-listbox>
          </anypoint-dropdown-menu>
        </div>
      </section>

      <section>
        <h3>Generated data</h3>
        <h4>URI parametrs</h4>
        <output>
${uriModelResult ? JSON.stringify(uriModelResult, null, 2) : 'Model nod ready'}
        </output>

        <h4>Query parametrs</h4>
        <output>
${queryModelResult ? JSON.stringify(queryModelResult, null, 2) : 'Model nod ready'}
        </output>

        <h4>Final URL</h4>
        <output>
${urlResult ? urlResult : 'URL not ready'}
        </output>
      </section>
    </section>`;
  }

  _render() {
    const {
      selectedShape
    } = this;
    render(html`
      ${this.headerTemplate()}

      <api-url-data-model
        aware="model"
        @apibaseuri-changed="${this._baseUrlChangeHandler}"
        @endpointpath-changed="${this._endpointPathChangeHandler}"
        .selected="${selectedShape}"
        @pathmodel-changed="${this._pathModelChangeHandler}"
        @querymodel-changed="${this._queryModelChangeHandler}"></api-url-data-model>

      ${this._demoTemplate()}
      `, document.querySelector('#demo'));
  }
}
const instance = new ApiDemo();
instance.render();
window.demoInstance = instance;
