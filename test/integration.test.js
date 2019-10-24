import { fixture, assert, html } from '@open-wc/testing';
import '../api-url-params-form.js';
import '@api-components/api-url-data-model/api-url-data-model.js';
import { AmfLoader } from './amf-loader.js';

describe('Integration tests', function() {
  async function modelGeneratorFixture(amf, selected) {
    return await fixture(html`
      <api-url-data-model
        .amf="${amf}"
        .selected="${selected}"
        ></api-url-data-model>
    `);
  }

  async function basicFixture(model) {
    return await fixture(html`
      <api-url-params-form .model="${model}"></api-url-params-form>
    `);
  }

  [
    ['Full data model', false],
    ['Compact data model', true]
  ].forEach(([label, compact]) => {
    const apiFile = 'APIC-289';

    describe(label, () => {
      let element;
      let amf;
      let methodId;
      let generator;

      before(async () => {
        amf = await AmfLoader.load(compact, apiFile);
      });

      beforeEach(async () => {
        const method = AmfLoader.lookupOperation(amf, '/organization', 'get');
        methodId = method['@id'];
        generator = await modelGeneratorFixture(amf, methodId);
        element = await basicFixture(generator.queryModel);
      });

      it('renders all items', () => {
        const nodes = element.shadowRoot.querySelectorAll('.param-value');
        assert.lengthOf(nodes, 1);
      });

      it('renders OAS name', () => {
        const node = element.shadowRoot.querySelector('api-property-form-item');
        assert.equal(node.name, 'foo');
      });
    });
  });
});
