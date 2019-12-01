let resolve = x => typeof x !== 'function' ? x : x();

let block = (blockName, fn) => {
  let blockEl = document.createElement('div');
  blockEl.classList.add(blockName);

  fn && fn(blockEl, (elName, tagName = 'div') => {
    let el = document.createElement(tagName);
    el.classList.add(`${blockName}-${elName}`);

    return el;
  });

  return blockEl;
};

let mapNodesLastArrays = new WeakMap();

let mapNodes = (parentEl, array, mapFn) => {
  let lastArray = mapNodesLastArrays.get(parentEl) || [];

  if (
    array.length === lastArray.length &&
    array.every(([i, x]) => lastArray[i] === x)
  ) {
    return;
  }

  let lastNodes = [...parentEl.childNodes];

  let updatedNodes = [...array.entries()].map(([i, x]) => {
    let iPrev = lastArray.indexOf(x);

    if (iPrev !== -1) {
      return lastNodes[iPrev];
    }
    else {
      let n = mapFn(x);
      return n instanceof Node ? n : document.createTextNode(n);
    }
  });

  let removedItems = [...lastArray.entries()].filter(
    ([i, x]) => !array.includes(x),
  );

  for (let [i] of removedItems) {
    lastNodes[i].remove();
  }

  let cursor = null;

  for (let [i, n] of updatedNodes.entries()) {
    let nextCursorSibling = cursor
      ? cursor.nextSibling
      : (lastNodes[0] || null);

    if (n === nextCursorSibling) {
      cursor = nextCursorSibling;
    }
    else {
      parentEl.insertBefore(n, nextCursorSibling);
      cursor = n;
    }
  }

  mapNodesLastArrays.set(parentEl, [...array]);
};

let vtkSelect = props => block('vtkSelect', (root, blockElement) => {
  let inputWrapper = blockElement('inputWrapper');
  let selectedOptionsWrapper = blockElement('selectedOptionsWrapper');

  inputWrapper.append(selectedOptionsWrapper);

  let optionsWrapper = blockElement('optionsWrapper');

  root.append(inputWrapper, optionsWrapper);

  let model = root.model = {
    inputWrapper,
    selectedOptionsWrapper,
    optionsWrapper,

    multi: props.multi,

    get value() {
      return resolve(props.value);
    },

    get options() {
      return resolve(props.options);
    },

    selectedOptionWrappersByKey: {},
    optionWrappersByKey: {},

    getSelectedOptionWrapperByKey(k) {
      let { selectedOptionWrappersByKey } = model;

      if (!selectedOptionWrappersByKey[k]) {
        let option = resolve(model.options[k]);

        if (!(option instanceof Node)) {
          option = document.createTextNode(option);
        }

        let wrapper = blockElement('selectedOptionWrapper');

        wrapper.append(option);

        selectedOptionWrappersByKey[k] = wrapper;
      }

      return selectedOptionWrappersByKey[k];
    },

    getOptionWrapperByKey(k) {
      let { optionWrappersByKey } = model;

      if (!optionWrappersByKey[k]) {
        let option = resolve(model.options[k]);

        if (!(option instanceof Node)) {
          option = document.createTextNode(option);
        }

        let wrapper = blockElement('optionWrapper');

        wrapper.append(option);

        optionWrappersByKey[k] = wrapper;
      }

      return optionWrappersByKey[k];
    },

    update() {
      let { value, options } = model;

      if (!model.multi) {
        selectedOptionsWrapper.innerHTML = '';
        selectedOptionsWrapper.append(model.getSelectedOptionWrapperByKey(value));
      }
      else {
        mapNodes(
          selectedOptionsWrapper,
          value,
          k => model.getSelectedOptionWrapperByKey(k),
        );
      }

      mapNodes(
        optionsWrapper,
        Object.keys(options),
        k => model.getOptionWrapperByKey(k),
      );
    },
  };

  model.update();
});

window.testValue = ['br', 'be', 'it'];

document.body.append(
  vtkSelect({
    multi: true,
    value: () => testValue,

    options: {
      br: 'Brazil',
      be: 'Belgium',
      it: 'Italy',
      uk: 'United Kingdom',
    },
  }),
);

let style = document.createElement('style');

style.textContent = `
  .vtkSelect-optionsWrapper {
    margin-top: 16px;
  }
`;

document.body.append(style);
