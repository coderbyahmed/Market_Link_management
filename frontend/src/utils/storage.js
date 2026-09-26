const readStorage = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);

    if (raw !== null && raw !== undefined) {
      return JSON.parse(raw);
    }
  } catch {
    // corrupted storage falls back to the seed value
  }

  if (seed !== undefined) {
    writeStorage(key, seed);
  }

  return seed;
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const removeStorage = (key) => {
  localStorage.removeItem(key);
};

export { readStorage, writeStorage, removeStorage };