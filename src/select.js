let el = require('./createElementWithClasses');
let resolve = require('./resolve');

let vtkSelect = ({
  document,
  classes = {},
  ...more
}) => {
  let doc = document;

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

    async loadOptions() {
      model.isLoading = true;

      try {
        model.options = (await resolve(more.options)) || {};
      }
      finally {
        model.isLoading = false;
      }
    },

    isLoading: false,
    options: {},
  };

  model.loadOptions();

  return root;
};

module.exports = vtkSelect;
