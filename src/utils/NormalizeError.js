export const NormalizeServerErrors = (serverErrors) => {
  const normalized = {};
  for (const key in serverErrors) {
    const snakeKey = camelToSnake(key);
    normalized[snakeKey] = serverErrors[key];
  }
  return normalized;
};

const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
