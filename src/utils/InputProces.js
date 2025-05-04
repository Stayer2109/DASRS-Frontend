// Trim text
export const trimText = (text) => {
  if (typeof text !== "string") return "";
  return text.trim();
};

export const NormalizeData = (data) => {
  const trimmed = {};
  for (let key in data) {
    trimmed[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
  }
  return trimmed;
};
