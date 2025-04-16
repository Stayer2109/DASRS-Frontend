export const ConvertDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const FormatToISODate = (input) => {
  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  date.setHours(7, 0, 0, 0); // set to 07:00:00 local time

  // Get local timezone offset in milliseconds
  const tzOffsetMs = date.getTimezoneOffset() * 60000;

  // Convert to UTC time by subtracting offset
  const localTime = new Date(date.getTime() - tzOffsetMs);

  return localTime.toISOString().split(".")[0]; // returns: "YYYY-MM-DDT07:00:00"
};

export const FormatDateInput = (input) => {
  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // for <input type="date" />
};

export const GetTimeFromDate = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Format date to "DD-MM-YYYY"
export const GetDateFromDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
