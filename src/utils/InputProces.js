// Trim text
export const trimText = (text) => {
  return text.toString().trim();
};
// Get time difference

export const NormalizeData = (data) => {
  const trimmed = {};
  for (let key in data) {
    trimmed[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
  }
  return trimmed;
};
