import {
  fixture,
  assert,
  nextFrame,
  html,
  aTimeout
} from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../api-url-params-editor.js';

describe('<api-url-params-editor>', function() {
  async function basicFixture() {
    return await fixture(html `
      <api-url-params-editor></api-url-params-editor>
    `);
  }

  describe('queryModel setter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets _queryModel', () => {
      const model = [{ name: 'x', schema: {} }];
      element.queryModel = model;
      assert.deepEqual(element._queryModel, model);
    });

    it('computes _hasQueryParameters', () => {
      const model = [{ name: 'x', schema: {} }];
      element.queryModel = model;
      assert.isTrue(element._hasQueryParameters);
    });

    it('computes _hasParameters', () => {
      const model = [{ name: 'x', schema: {} }];
      element.queryModel = model;
      assert.isTrue(element._hasParameters);
    });

    it('calls _updateModelValue()', () => {
      const spy = sinon.spy(element, '_updateModelValue');
      const model = [{ name: 'x', schema: {} }];
      element.queryModel = model;
      assert.deepEqual(spy.args[0][0], 'query');
      assert.deepEqual(spy.args[0][1], model);
    });

    it('dispatches querymodel-changed', () => {
      const spy = sinon.spy();
      element.addEventListener('querymodel-changed', spy);
      const model = [{ name: 'x', schema: {} }];
      element.queryModel = model;
      assert.deepEqual(spy.args[0][0].detail.value, model);
    });
  });

  describe('uriModel setter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets _uriModel', () => {
      const model = [{ name: 'x', schema: {} }];
      element.uriModel = model;
      assert.deepEqual(element._uriModel, model);
    });

    it('computes _hasUriParameters', () => {
      const model = [{ name: 'x', schema: {} }];
      element.uriModel = model;
      assert.isTrue(element._hasUriParameters);
    });

    it('computes _hasParameters', () => {
      const model = [{ name: 'x', schema: {} }];
      element.uriModel = model;
      assert.isTrue(element._hasParameters);
    });

    it('calls _updateModelValue()', () => {
      const spy = sinon.spy(element, '_updateModelValue');
      const model = [{ name: 'x', schema: {} }];
      element.uriModel = model;
      assert.deepEqual(spy.args[0][0], 'uri');
      assert.deepEqual(spy.args[0][1], model);
    });

    it('dispatches urimodel-changed', () => {
      const spy = sinon.spy();
      element.addEventListener('urimodel-changed', spy);
      const model = [{ name: 'x', schema: {} }];
      element.uriModel = model;
      assert.deepEqual(spy.args[0][0].detail.value, model);
    });
  });

  describe('uriValue setter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets _uriValue', () => {
      const model = { test: 'value' };
      element.uriValue = model;
      assert.deepEqual(element._uriValue, model);
    });

    it('dispatches urivalue-changed', () => {
      const spy = sinon.spy();
      element.addEventListener('urivalue-changed', spy);
      const model = { test: 'value' };
      element.uriValue = model;
      assert.deepEqual(spy.args[0][0].detail.value, model);
    });
  });

  describe('queryValue setter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets _queryValue', () => {
      const model = { test: 'value' };
      element.queryValue = model;
      assert.deepEqual(element._queryValue, model);
    });

    it('dispatches queryvalue-changed', () => {
      const spy = sinon.spy();
      element.addEventListener('queryvalue-changed', spy);
      const model = { test: 'value' };
      element.queryValue = model;
      assert.deepEqual(spy.args[0][0].detail.value, model);
    });
  });

  describe('allowCustom setter', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('query parameeters form is not rendered by default', () => {
      const node = element.shadowRoot.querySelector('#queryParametersForm');
      assert.notOk(node);
    });

    it('query parameeters form is rendered when allowCustom', async () => {
      element.allowCustom = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('#queryParametersForm');
      assert.ok(node);
    });

    it('hides back the form', async () => {
      element.allowCustom = true;
      await nextFrame();
      element.allowCustom = false;
      await nextFrame();
      const node = element.shadowRoot.querySelector('#queryParametersForm');
      assert.notOk(node);
    });
  });

  describe('_updateModelValue()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('computes values from uriModel', () => {
      const model = [{ name: 'x', value: 'test', schema: {} }];
      element.uriModel = model;
      assert.deepEqual(element.uriValue, {
        x: 'test'
      });
    });

    it('computes values from queryModel', () => {
      const model = [{ name: 'x', value: 'test', schema: {} }];
      element.queryModel = model;
      assert.deepEqual(element.queryValue, {
        x: 'test'
      });
    });

    it('ignores disabled items', () => {
      const model = [{
        name: 'x', value: 'test', schema: {}
      }, {
        name: 'y', value: 'other', schema: { enabled: false }
      }];
      element.queryModel = model;
      assert.deepEqual(element.queryValue, {
        x: 'test'
      });
    });

    it('sets value undefined when model cleared', async () => {
      element.queryModel = [{
        name: 'x', value: 'test', schema: {}
      }];
      await nextFrame();
      element.queryModel = undefined;
      assert.isUndefined(element.queryValue);
    });
  });

  describe('Form value change', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.queryModel = [{
        name: 'x', value: 'test', schema: { enabled: true }
      }];
      element.uriModel = [{
        name: 'y', value: 'other', schema: { enabled: true }
      }, {
        name: 'z', value: 'test', schema: { enabled: false }
      }];
      await nextFrame();
    });

    it('changes value property', () => {
      const form = element.shadowRoot.querySelector('#queryParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'value',
          value: 'new-value',
          oldValue: 'test'
        }
      }));
      assert.deepEqual(element.queryValue, {
        x: 'new-value'
      });
    });

    it('changes name property', () => {
      const form = element.shadowRoot.querySelector('#uriParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'name',
          value: 'a',
          oldValue: 'y'
        }
      }));
      assert.deepEqual(element.uriValue, {
        a: 'other'
      });
    });

    it('changes enabled property', () => {
      const form = element.shadowRoot.querySelector('#uriParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 1,
          property: 'enabled',
          value: true,
          oldValue: false
        }
      }));
      assert.deepEqual(element.uriValue, {
        y: 'other',
        z: 'test'
      });
    });

    it('removes property when not enabled', () => {
      const form = element.shadowRoot.querySelector('#uriParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'enabled',
          value: false,
          oldValue: true
        }
      }));
      assert.deepEqual(element.uriValue, {});
    });
  });

  describe('Validation', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('does not passes validation when required without value: uri paramaeters', async () => {
      element.uriModel = [{
        name: 'z',
        value: '',
        required: true,
        schema: { enabled: true }
      }];
      await nextFrame();

      const result = element.validate();
      assert.isFalse(result);
    });

    it('passes validation when required with value: uri paramaeters', async () => {
      element.uriModel = [{
        name: 'test-name',
        value: 'test-value',
        required: true,
        schema: {
          enabled: true
        }
      }];
      await nextFrame();

      const result = element.validate();
      assert.isTrue(result);
    });

    it('does not passes validation when required without value: query paramaeters', async () => {
      element.queryModel = [{
        name: 'z',
        value: '',
        required: true,
        schema: { enabled: true }
      }];
      await nextFrame();

      const result = element.validate();
      assert.isFalse(result);
    });

    it('passes validation when required with value: query paramaeters', async () => {
      element.queryModel = [{
        name: 'test-name',
        value: 'test-value',
        required: true,
        schema: {
          enabled: true
        }
      }];
      await nextFrame();

      const result = element.validate();
      assert.isTrue(result);
    });

    it('does not passes validation when required query paramaeters', async () => {
      element.queryModel = [{
        name: 'z',
        value: '',
        required: true,
        schema: { enabled: true }
      }];
      await nextFrame();
      await aTimeout();

      const result = element.validate();
      assert.isFalse(result);
    });
  });

  describe('events API', () => {
    async function basicFixture() {
      const queryModel = [{
        name: 'a',
        value: 'b',
        required: true,
        schema: { enabled: true }
      }];
      const uriModel = [{
        name: 'c',
        value: 'd',
        required: true,
        schema: { enabled: true }
      }];
      return await fixture(html `
        <api-url-params-editor
        .queryModel="${queryModel}"
        .uriModel="${uriModel}"></api-url-params-editor>
      `);
    }

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('updates uri model value from uri-parameter-changed event', () => {
      document.body.dispatchEvent( new CustomEvent('uri-parameter-changed', {
        detail: { name: 'c', value: 'updated' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.equal(element.uriModel[0].value, 'updated');
    });

    it('ignores unknown uri parameters', () => {
      document.body.dispatchEvent( new CustomEvent('uri-parameter-changed', {
        detail: { name: 'e', value: 'new' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.equal(element.uriModel[0].value, 'd');
      assert.lengthOf(element.uriModel, 1);
    });

    it('does not dispatch uri-parameter-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('uri-parameter-changed', spy);
      document.body.dispatchEvent( new CustomEvent('uri-parameter-changed', {
        detail: { name: 'c', value: 'updated' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.isFalse(spy.called);
    });

    it('updates query model value from query-parameter-changed event', () => {
      document.body.dispatchEvent( new CustomEvent('query-parameter-changed', {
        detail: { name: 'a', value: 'updated' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.equal(element.queryModel[0].value, 'updated');
    });

    it('ignores unknown query parameters', () => {
      document.body.dispatchEvent( new CustomEvent('query-parameter-changed', {
        detail: { name: 'e', value: 'new' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.equal(element.queryModel[0].value, 'b');
      assert.lengthOf(element.queryModel, 1);
    });

    it('does not dispatch query-parameter-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('query-parameter-changed', spy);
      document.body.dispatchEvent( new CustomEvent('query-parameter-changed', {
        detail: { name: 'a', value: 'updated' },
        cancelable: true,
        bubbles: true,
        composed: true
      }));
      assert.isFalse(spy.called);
    });

    it('dispatches query-parameter-changed event after enabled property change', () => {
      const spy = sinon.spy();
      element.addEventListener('query-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#queryParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'enabled',
          value: true,
          oldValue: false
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'a',
        value: 'b',
        enabled: true,
        isCustom: false
      }, 'detail.has data');
    });

    it('dispatches query-parameter-changed event after value property change', () => {
      const spy = sinon.spy();
      element.addEventListener('query-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#queryParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'value',
          value: 'updated',
          oldValue: 'a'
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'a',
        value: 'b',
        enabled: true,
        isCustom: false
      }, 'detail.has data');
    });

    it('dispatches query-parameter-changed event after name property change', () => {
      const spy = sinon.spy();
      element.addEventListener('query-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#queryParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'name',
          value: 'updated',
          oldValue: 'a'
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'a',
        value: 'b',
        enabled: true,
        isCustom: false
      }, 'detail.has data');
    });

    it('dispatches query-parameter-changed event item has been deleted', () => {
      const spy = sinon.spy();
      element.addEventListener('query-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#queryParametersForm');
      form.dispatchEvent(new CustomEvent('delete', {
        detail: {
          name: 'a'
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'a',
        removed: true,
        isCustom: false
      }, 'detail.has data');
    });

    it('dispatches uri-parameter-changed event after value property change', () => {
      const spy = sinon.spy();
      element.addEventListener('uri-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#uriParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'value',
          value: 'updated',
          oldValue: 'a'
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'c',
        value: 'd',
        enabled: true,
        isCustom: false
      }, 'detail.has data');
    });

    it('dispatches uri-parameter-changed event after name property change', () => {
      const spy = sinon.spy();
      element.addEventListener('uri-parameter-changed', spy);
      const form = element.shadowRoot.querySelector('#uriParametersForm');
      form.dispatchEvent(new CustomEvent('change', {
        detail: {
          index: 0,
          property: 'name',
          value: 'updated',
          oldValue: 'a'
        }
      }));
      assert.isTrue(spy.called, 'event disaptched');
      assert.deepEqual(spy.args[0][0].detail, {
        name: 'c',
        value: 'd',
        enabled: true,
        isCustom: false
      }, 'detail.has data');
    });
  });

  describe('onurivalue', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onurivalue);
      const f = () => {};
      element.onurivalue = f;
      assert.isTrue(element.onurivalue === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onurivalue = f;
      element.uriValue = {};
      element.onurivalue = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onurivalue = f1;
      element.onurivalue = f2;
      element.uriValue = {};
      element.onurivalue = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onqueryvalue', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onqueryvalue);
      const f = () => {};
      element.onqueryvalue = f;
      assert.isTrue(element.onqueryvalue === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onqueryvalue = f;
      element.queryValue = {};
      element.onqueryvalue = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onqueryvalue = f1;
      element.onqueryvalue = f2;
      element.queryValue = {};
      element.onqueryvalue = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onurimodel', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onurimodel);
      const f = () => {};
      element.onurimodel = f;
      assert.isTrue(element.onurimodel === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onurimodel = f;
      element.uriModel = [];
      element.onurimodel = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onurimodel = f1;
      element.onurimodel = f2;
      element.uriModel = [];
      element.onurimodel = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onquerymodel', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onquerymodel);
      const f = () => {};
      element.onquerymodel = f;
      assert.isTrue(element.onquerymodel === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onquerymodel = f;
      element.queryModel = [];
      element.onquerymodel = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onquerymodel = f1;
      element.onquerymodel = f2;
      element.queryModel = [];
      element.onquerymodel = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('is accessible for uri parameters form', async () => {
      const element = await basicFixture();
      element.uriModel = [{
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

    it('is accessible for query parameters form', async () => {
      const element = await basicFixture();
      element.queryModel = [{
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

    it('is accessible for custom parameters', async () => {
      const element = await basicFixture();
      element.allowCustom = true;
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});
