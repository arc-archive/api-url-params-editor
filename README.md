[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-url-params-editor.svg)](https://www.npmjs.com/package/@api-components/api-url-params-editor)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-url-params-editor.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-url-params-editor)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-url-params-editor)

## &lt;api-url-params-editor&gt;

An element to render query / uri parameters form from AMF schema.
It also allows to create custom query parameters list, outside schema definition.

It works with `advanced-rest-client/api-view-model-transformer` to generate
view model from [AMF](https://github.com/mulesoft/amf) json/ld model.

It cooperates with `advanced-rest-client/api-url-editor` to build
HTTP request final URL.


```html
<api-url-params-editor></api-url-params-editor>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @api-components/api-url-params-editor
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-url-params-editor/api-url-params-editor.js';
    </script>
  </head>
  <body>
    <api-url-params-editor></api-url-params-editor>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-url-params-editor/api-url-params-editor.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-url-params-editor></api-url-params-editor>
    `;
  }

  _authChanged(e) {
    console.log(e.detail);
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/api-url-params-editor
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
