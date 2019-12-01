let vtkSelect = require('./select');
let { JSDOM } = require('jsdom');
let { assert } = require('chai');

let window;
let document;

beforeEach(() => {
  window = new JSDOM('<!doctype html>').window;
  document = window.document;
});

describe('vtkSelect', () => {
  describe('root element (return value)', () => {
    it('is an HTMLElement', () => {
      let select = vtkSelect({ document });
      assert.instanceOf(select, window.HTMLElement);
    });

    it('is created with the required CSS classes', () => {
      let select = vtkSelect({
        document,
        classes: { root: 'foo bar' },
      });

      assert.equal(select.className, 'foo bar');
    });

    describe('model prop', () => {
      it('is an object', () => {
        let select = vtkSelect({ document });
        assert(typeof select.model === 'object');
      });

      describe('inputWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ document });
          let { inputWrapper } = select.model;

          assert.instanceOf(inputWrapper, window.HTMLElement);
        });

        it('belongs to the root', () => {
          let select = vtkSelect({ document });
          let { inputWrapper } = select.model;

          assert.equal(inputWrapper.parentElement, select);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            document,
            classes: { inputWrapper: 'foo bar' },
          });

          let { inputWrapper } = select.model;

          assert.equal(inputWrapper.className, 'foo bar');
        });
      });

      describe('selectedOptionsWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ document });
          let { selectedOptionsWrapper } = select.model;

          assert.instanceOf(selectedOptionsWrapper, window.HTMLElement);
        });

        it('belongs to the inputWrapper', () => {
          let select = vtkSelect({ document });
          let { inputWrapper, selectedOptionsWrapper } = select.model;

          assert.equal(selectedOptionsWrapper.parentElement, inputWrapper);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            document,
            classes: { selectedOptionsWrapper: 'foo bar' },
          });

          let { selectedOptionsWrapper } = select.model;

          assert.equal(selectedOptionsWrapper.className, 'foo bar');
        });
      });

      describe('input prop', () => {
        it('is an HTMLInputElement', () => {
          let select = vtkSelect({ document });
          let { input } = select.model;

          assert.instanceOf(input, window.HTMLInputElement);
        });

        it('belongs to the inputWrapper', () => {
          let select = vtkSelect({ document });
          let { input, inputWrapper } = select.model;

          assert.equal(input.parentElement, inputWrapper);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            document,
            classes: { input: 'foo bar' },
          });

          let { input } = select.model;

          assert.equal(input.className, 'foo bar');
        });
      });

      describe('optionsWrapper prop', () => {
        it('is an HTMLElement', () => {
          let select = vtkSelect({ document });
          let { optionsWrapper } = select.model;

          assert.instanceOf(optionsWrapper, window.HTMLElement);
        });

        it('belongs to the root', () => {
          let select = vtkSelect({ document });
          let { optionsWrapper } = select.model;

          assert.equal(optionsWrapper.parentElement, select);
        });

        it('is created with the required CSS classes', () => {
          let select = vtkSelect({
            document,
            classes: { optionsWrapper: 'foo bar' },
          });

          let { optionsWrapper } = select.model;

          assert.equal(optionsWrapper.className, 'foo bar');
        });
      });

      describe('value prop', () => {
        it('is an null by default', () => {
          let select = vtkSelect({ document });
          assert.strictEqual(select.model.value, null);
        });

        it('equals the plain value parameter', () => {
          let select = vtkSelect({ document, value: 123 });
          assert.deepEqual(select.model.value, 123);
        });

        it('equals the resolved value function parameter', () => {
          let select = vtkSelect({ document, value: () => 123 });
          assert.deepEqual(select.model.value, 123);
        });
      });
    });
  });
});
