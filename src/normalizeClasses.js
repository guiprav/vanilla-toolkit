let normalizeClasses = x => {
  if (!x) {
    return [];
  }

  if (typeof x === 'string') {
    return x.split(' ');
  }

  return x.map(y => normalizeClasses(y)).flat();
};

module.exports = normalizeClasses;
