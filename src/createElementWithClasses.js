let normalizeClasses = require('./normalizeClasses');

let createElementWithClasses = (document, tagName, classes) => {
  let el = document.createElement(tagName);

  for (let x of normalizeClasses(classes)) {
    el.classList.add(x);
  }

  return el;
};

module.exports = createElementWithClasses;
