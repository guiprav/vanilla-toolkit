let el = require('./createElementWithClasses');
let mapNodes = require('./mapNodes');
let resolve = require('./resolve');

let vtkSelect = ({ window, classes = {}, ...more }) => {
  let doc = window.document;

  let root = el(doc, 'div', classes.root);

  let inputWrapper = el(doc, 'div', classes.inputWrapper);
  let selectedOptionsWrapper = el(doc, 'div', classes.selectedOptionsWrapper);
  let input = el(doc, 'input', classes.input);

  let optionsWrapper = el(doc, 'div', classes.optionsWrapper);

  inputWrapper.append(selectedOptionsWrapper, input);
  root.append(inputWrapper, optionsWrapper);

  let model = root.model = {
    inputWrapper,
    selectedOptionsWrapper,
    input,
    optionsWrapper,

    get value() {
      return resolve(more.value) || null;
    },

    async loadOptions(searchTerms) {
      model.isLoading = true;
      model.update();

      try {
        model.options = (await resolve(more.options, searchTerms)) || {};
      }
      finally {
        model.isLoading = false;
        model.update();
      }
    },

    isLoading: false,
    options: {},

    selectedOptionWrappersByKey: {},

    getSelectedOptionWrapperByKey(k) {
      let { selectedOptionWrappersByKey, options } = model;

      if (!selectedOptionWrappersByKey[k]) {
        let option = resolve(options[k]);

        if (!(option instanceof window.Node)) {
          option = doc.createTextNode(option);
        }

        let wrapper = el(doc, 'div', classes.optionWrapper);

        wrapper.append(option);

        selectedOptionWrappersByKey[k] = wrapper;
      }

      return selectedOptionWrappersByKey[k];
    },

    update() {
      let { value, options } = model;

      value = value || [];

      if (!Array.isArray(value)) {
        // TODO
      }
      else {
        mapNodes(
          window,
          selectedOptionsWrapper,
          value,
          model.getSelectedOptionWrapperByKey,
        );
      }
    },
  };

  model.loadOptions();
  input.addEventListener('change', ev => model.loadOptions(ev.target.value));

  return root;
};

module.exports = vtkSelect;
