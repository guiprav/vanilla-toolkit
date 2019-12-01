let el = require('./createElementWithClasses');

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

  root.model = {
    inputWrapper,
    selectedOptionsWrapper,
    input,
    optionsWrapper,
  };

  return root;
};

module.exports = vtkSelect;
