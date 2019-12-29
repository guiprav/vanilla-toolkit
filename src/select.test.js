let vtkSelect = require('./select');
let { JSDOM } = require('jsdom');
let { assert } = require('chai');

let timeout = x => new Promise(r => setTimeout(r, x));

let window;

beforeEach(() => {
  window = new JSDOM('<!doctype html>').window;
});

describe('vtkSelect', () => {
  describe('root element (return value)', () => {
    it('is an HTMLElement', () => {
      let select = vtkSelect({ window });
      assert.instanceOf(select, window.HTMLElement);
    });

    it('is created with the required CSS classes', () => {
      let select = vtkSelect({
        window,
        classes: { root: 'foo bar' },
      });

      assert.equal(select.className, 'foo bar');
    });

    describe('model prop', () => {
      it('is an object', () => {
        let select = vtkSelect({ window });
        assert(typeof select.model === 'object');
      });

      describe('inputWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ window });
          let { inputWrapper } = select.model;

          assert.instanceOf(inputWrapper, window.HTMLElement);
        });

        it('belongs to the root', () => {
          let select = vtkSelect({ window });
          let { inputWrapper } = select.model;

          assert.equal(inputWrapper.parentElement, select);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            window,
            classes: { inputWrapper: 'foo bar' },
          });

          let { inputWrapper } = select.model;

          assert.equal(inputWrapper.className, 'foo bar');
        });
      });

      describe('selectedOptionsWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ window });
          let { selectedOptionsWrapper } = select.model;

          assert.instanceOf(selectedOptionsWrapper, window.HTMLElement);
        });

        it('belongs to the inputWrapper', () => {
          let select = vtkSelect({ window });
          let { inputWrapper, selectedOptionsWrapper } = select.model;

          assert.equal(selectedOptionsWrapper.parentElement, inputWrapper);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            window,
            classes: { selectedOptionsWrapper: 'foo bar' },
          });

          let { selectedOptionsWrapper } = select.model;

          assert.equal(selectedOptionsWrapper.className, 'foo bar');
        });

        it('contains selected option elements bound to the current value', () => {
          let select = vtkSelect({
            window,
            value: ['foo', 'bar'],
            options: { foo: 'Foo', bar: 'Bar', baz: 'Baz' },
          });

          let { selectedOptionsWrapper } = select.model;

          assert.equal(
            selectedOptionsWrapper.innerHTML,
            '<div>Foo</div><div>Bar</div>',
          );
        });
      });

      describe('input prop', () => {
        it('is an HTMLInputElement', () => {
          let select = vtkSelect({ window });
          let { input } = select.model;

          assert.instanceOf(input, window.HTMLInputElement);
        });

        it('belongs to the inputWrapper', () => {
          let select = vtkSelect({ window });
          let { input, inputWrapper } = select.model;

          assert.equal(input.parentElement, inputWrapper);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            window,
            classes: { input: 'foo bar' },
          });

          let { input } = select.model;

          assert.equal(input.className, 'foo bar');
        });
      });

      describe('optionsWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ window });
          let { optionsWrapper } = select.model;

          assert.instanceOf(optionsWrapper, window.HTMLElement);
        });

        it('belongs to the root', () => {
          let select = vtkSelect({ window });
          let { optionsWrapper } = select.model;

          assert.equal(optionsWrapper.parentElement, select);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            window,
            classes: { optionsWrapper: 'foo bar' },
          });

          let { optionsWrapper } = select.model;

          assert.equal(optionsWrapper.className, 'foo bar');
        });
      });

      describe('value prop', () => {
        it('is an null by default', () => {
          let select = vtkSelect({ window });
          assert.strictEqual(select.model.value, null);
        });

        it('equals the plain value parameter', () => {
          let select = vtkSelect({ window, value: 123 });
          assert.deepEqual(select.model.value, 123);
        });

        it('equals the resolved value function parameter', () => {
          let select = vtkSelect({ window, value: () => 123 });
          assert.deepEqual(select.model.value, 123);
        });
      });

      describe('isLoading prop', () => {
        it('is false by default', async () => {
          let select = vtkSelect({ window });

          await timeout(0);
          assert.strictEqual(select.model.isLoading, false);
        });

        it('is true while loading options asynchronously', async () => {
          let select = vtkSelect({
            window,
            options: () => timeout(20),
          });

          assert.strictEqual(select.model.isLoading, true);

          await timeout(20);
          assert.strictEqual(select.model.isLoading, false);
        });
      });

      describe('options prop', () => {
        it('is an empty object by default', async () => {
          let select = vtkSelect({ window });

          await timeout(0);
          assert.deepEqual(select.model.options, {});
        });

        it('is initialized to the plain options parameter (if supplied)', async () => {
          let options = { a: 1, b: 2 };
          let select = vtkSelect({ window, options });

          await timeout(0);
          assert.deepEqual(select.model.options, options);
        });

        it('is initialized to the resolved options function parameter (if supplied)', async () => {
          let options = { a: 1, b: 2 };
          let select = vtkSelect({ window, options: () => options });

          await timeout(0);
          assert.deepEqual(select.model.options, options);
        });

        it('is initialized to the resolved options async function parameter (if supplied)', async () => {
          let options = { a: 1, b: 2 };
          let select = vtkSelect({ window, options: async () => options });

          await timeout(0);
          assert.deepEqual(select.model.options, options);
        });

        it('is updated when the input value changes', async () => {
          let options = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };

          let select = vtkSelect({
            window,

            options: searchTerms => {
              let results = { ...options };

              if (searchTerms) {
                for (let [k, v] of Object.entries(results)) {
                  if (!v.includes(searchTerms)) {
                    delete results[k];
                  }
                }
              }

              return results;
            },
          });

          let { input } = select.model;

          input.value = 'Ba';
          input.dispatchEvent(new window.CustomEvent('change'));

          await timeout(0);
          assert.deepEqual(select.model.options, { bar: 'Bar', baz: 'Baz' });
        });
      });
    });
  });
});
