import {
  fixture,
  assert,
  nextFrame,
  html
} from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../api-url-params-form.js';

describe('<api-url-params-form>', function() {
  async function basicFixture() {
    return await fixture(html `
      <api-url-params-form></api-url-params-form>
    `);
  }

  async function allowCustomFixture() {
    return await fixture(html `
      <api-url-params-form allowcustom>
        <div slot="title">Test title</div>
      </api-url-params-form>
    `);
  }

  async function allowHideOptionalFixture() {
    return await fixture(html `
      <api-url-params-form allowhideoptional>
        <div slot="title">Test title</div>
      </api-url-params-form>
    `);
  }

  async function allowDisableParamsFixture() {
    return await fixture(html `
      <api-url-params-form allowdisableparams>
        <div slot="title">Test title</div>
      </api-url-params-form>
    `);
  }

  describe('allowCustom property', () => {
    let element;
    beforeEach(async () => {
      element = await allowCustomFixture();
    });

    it('renders add item button', () => {
      const node = element.shadowRoot.querySelector('.action-button');
      assert.ok(node);
    });

    it('pressing the button adds new item', () => {
      const node = element.shadowRoot.querySelector('.action-button');
      MockInteractions.tap(node);
      assert.lengthOf(element.model, 1);
    });

    it('processes add event when target is the icon', () => {
      const node = element.shadowRoot.querySelector('.action-icon');
      MockInteractions.tap(node);
      assert.lengthOf(element.model, 1);
    });

    it('does not render the button when property not set', async () => {
      element.allowCustom = false;
      await nextFrame();
      const node = element.shadowRoot.querySelector('.action-button');
      assert.notOk(node);
    });
  });

  describe('optional items', () => {
    let element;
    beforeEach(async () => {
      element = await allowHideOptionalFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        required: false,
        schema: {}
      }, {
        binding: 'query',
        name: 'i2',
        required: true,
        schema: {}
      }];
      await nextFrame();
    });

    it('hiddes optional item', () => {
      const node = element.shadowRoot.querySelector('.param-value');
      const dispaly = getComputedStyle(node).display;
      assert.equal(dispaly, 'none');
    });

    it('always renders required items', () => {
      const node = element.shadowRoot.querySelectorAll('.param-value')[1];
      const dispaly = getComputedStyle(node).display;
      assert.notEqual(dispaly, 'none');
    });

    it('renders optional toggle checkbox', () => {
      const node = element.shadowRoot.querySelector('.toggle-checkbox');
      assert.ok(node);
    });

    it('renders hidden items when checkbox is clicked', async () => {
      const node = element.shadowRoot.querySelector('.toggle-checkbox');
      MockInteractions.tap(node);
      await nextFrame();
      const item = element.shadowRoot.querySelector('.param-value');
      const dispaly = getComputedStyle(item).display;
      assert.notEqual(dispaly, 'none');
    });
  });

  describe('form rendering', () => {
    let element;
    beforeEach(async () => {
      element = await allowCustomFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        required: true,
        schema: {
          isCustom: true
        }
      }, {
        binding: 'query',
        name: 'i2',
        required: true,
        hasDescription: true,
        description: 'test',
        schema: {}
      }];
      await nextFrame();
    });

    it('renders all items from the model', () => {
      const nodes = element.shadowRoot.querySelectorAll('.param-value');
      assert.lengthOf(nodes, 2);
    });

    it('renders custom item', () => {
      const nodes = element.shadowRoot.querySelectorAll('.custom-row');
      assert.lengthOf(nodes, 1);
    });

    it('renders documentation toggle button', () => {
      const node = element.shadowRoot.querySelectorAll('.param-value')[1].querySelector('.hint-icon');
      assert.ok(node);
    });

    it('renders documentation when button press', async () => {
      const node = element.shadowRoot.querySelector('.param-value:nth-child(2) .hint-icon');
      MockInteractions.tap(node);
      await nextFrame();
      const docs = element.shadowRoot.querySelector('arc-marked');
      assert.ok(docs);
    });
  });

  describe('_computeDocumentation()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns empty string when no properties', () => {
      const result = element._computeDocumentation({});
      assert.equal(result, '');
    });

    it('returns description part', () => {
      const result = element._computeDocumentation({
        description: 'test'
      });
      assert.equal(result, 'test');
    });

    it('returns pattern part', () => {
      const result = element._computeDocumentation({
        schema: {
          pattern: 'test'
        }
      });
      assert.equal(result, '- Pattern: `test`\n');
    });

    it('adds new lines after description', () => {
      const result = element._computeDocumentation({
        description: 'test',
        schema: {
          pattern: 'test'
        }
      });
      assert.equal(result, 'test\n\n\n- Pattern: `test`\n');
    });

    it('adds examples', () => {
      const result = element._computeDocumentation({
        schema: {
          examples: [{
            value: 'test'
          }]
        }
      });
      assert.equal(result, '- Example: `test`\n');
    });

    it('adds title for example', () => {
      const result = element._computeDocumentation({
        schema: {
          examples: [{
            value: 'test',
            name: 'title',
            hasName: true
          }]
        }
      });
      assert.equal(result, '- Example title: `test`\n');
    });

    it('ignores examples without a value', () => {
      const result = element._computeDocumentation({
        schema: {
          examples: [{
            name: 'title',
            hasName: true
          }]
        }
      });
      assert.equal(result, '');
    });
  });

  describe('_computeHasDocumentation()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns false when noDocs', () => {
      const result = element._computeHasDocumentation(true, {
        hasDescription: true
      });
      assert.isFalse(result);
    });

    it('returns true when hasDescription', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: true
      });
      assert.isTrue(result);
    });

    it('returns false when no schema', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: false
      });
      assert.isFalse(result);
    });

    it('returns true when has a patter', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: false,
        schema: {
          pattern: true
        }
      });
      assert.isTrue(result);
    });

    it('returns true when has examples', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: false,
        schema: {
          examples: [{
            value: 'test',
            name: 'title',
            hasName: true
          }]
        }
      });
      assert.isTrue(result);
    });

    it('returns false when example has no value', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: false,
        schema: {
          examples: [{
            name: 'title',
            hasName: true
          }]
        }
      });
      assert.isFalse(result);
    });

    it('returns false otherwise', () => {
      const result = element._computeHasDocumentation(false, {
        hasDescription: false,
        schema: {}
      });
      assert.isFalse(result);
    });
  });

  describe('Validation', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns false when required items', async () => {
      element.model = [{
        binding: 'query',
        name: 'i1',
        required: true,
        schema: {
          isCustom: false
        }
      }];
      await nextFrame();
      const result = element.validate();
      assert.isFalse(result);
    });

    it('returns true when valid', async () => {
      element.model = [{
        binding: 'query',
        name: 'i1',
        required: true,
        value: 'test',
        schema: {
          isCustom: false
        }
      }];
      await nextFrame();
      const result = element.validate();
      assert.isTrue(result);
    });
  });

  describe('Disabling parameters', () => {
    let element;
    beforeEach(async () => {
      element = await allowDisableParamsFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        required: true,
        value: 'test',
        schema: {
          enabled: false
        }
      }, {
        binding: 'query',
        name: 'i1',
        required: true,
        value: 'test',
        schema: {
          enabled: true
        }
      }];
      await nextFrame();
    });

    it('renders enable checkboxes', () => {
      const nodes = element.shadowRoot.querySelectorAll('.enable-checkbox');
      assert.lengthOf(nodes, 2);
    });

    it('checkbox is not checked when not enabled in the model', () => {
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[0];
      assert.isFalse(node.checked);
    });

    it('checkbox is checked when enabled in the model', () => {
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[1];
      assert.isTrue(node.checked);
    });

    it('enables item on unchecked click', () => {
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[0];
      MockInteractions.tap(node);
      assert.isTrue(node.checked);
    });

    it('disables item on checked click', () => {
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[1];
      MockInteractions.tap(node);
      assert.isFalse(node.checked);
    });

    it('updates the model', () => {
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[0];
      MockInteractions.tap(node);
      assert.isTrue(element.model[0].schema.enabled);
    });

    it('disaptches change event with the detail', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const node = element.shadowRoot.querySelectorAll('.enable-checkbox')[1];
      MockInteractions.tap(node);
      const detail = spy.args[0][0].detail;
      assert.equal(detail.index, 1, 'index is set');
      assert.equal(detail.property, 'enabled', 'property is set');
      assert.equal(detail.value, false, 'new value is set');
      assert.equal(detail.oldValue, true, 'old value is set');
    });
  });

  describe('Changing name', () => {
    let element;
    beforeEach(async () => {
      element = await allowCustomFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        value: 'test',
        required: true,
        schema: {
          isCustom: true,
          enabled: false
        }
      }];
      await nextFrame();
    });

    it('updates model value', () => {
      const node = element.shadowRoot.querySelector('.param-name');
      node.value = 'new-name';
      assert.equal(element.model[0].name, 'new-name');
    });

    it('disaptches change event with the detail', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const node = element.shadowRoot.querySelector('.param-name');
      node.value = 'new-name';
      const detail = spy.args[0][0].detail;
      assert.equal(detail.index, 0, 'index is set');
      assert.equal(detail.property, 'name', 'property is set');
      assert.equal(detail.value, 'new-name', 'new value is set');
      assert.equal(detail.oldValue, 'i1', 'old value is set');
    });

    it('does nothing when form does not allow custom items', () => {
      element.allowCustom = false;
      const node = element.shadowRoot.querySelector('.param-name');
      node.value = 'new-name';
      assert.equal(element.model[0].name, 'i1');
    });

    it('does nothing when item is not custom', () => {
      element.model[0].schema.isCustom = false;
      const node = element.shadowRoot.querySelector('.param-name');
      node.value = 'new-name';
      assert.equal(element.model[0].name, 'i1');
    });
  });

  describe('Changing value', () => {
    let element;
    beforeEach(async () => {
      element = await allowCustomFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        value: 'test',
        required: true,
        schema: {
          enabled: false
        }
      }];
      await nextFrame();
    });

    it('updates model value', () => {
      const node = element.shadowRoot.querySelector('api-property-form-item');
      node.value = 'new-value';
      assert.equal(element.model[0].value, 'new-value');
    });

    it('disaptches change event with the detail', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const node = element.shadowRoot.querySelector('api-property-form-item');
      node.value = 'new-value';
      const detail = spy.args[0][0].detail;
      assert.equal(detail.index, 0, 'index is set');
      assert.equal(detail.property, 'value', 'property is set');
      assert.equal(detail.value, 'new-value', 'new value is set');
      assert.equal(detail.oldValue, 'test', 'old value is set');
    });
  });

  describe('a11y', () => {
    it('is accessible with form values', async () => {
      const element = await allowCustomFixture();
      element.model = [{
        binding: 'query',
        name: 'i1',
        value: 'test',
        required: true,
        schema: {
          enabled: false,
          inputLabel: 'test'
        }
      }];
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible with custom form values', async () => {
      const element = await allowCustomFixture();
      element.model = [{
        binding: 'query',
        name: 'i2',
        value: '',
        required: true,
        schema: {
          isCustom: true,
          enabled: false,
          inputLabel: 'test2'
        }
      }];
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});
