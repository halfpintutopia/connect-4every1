// Global method for isEmpty
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) || // check empty object
  (typeof value === "string" && value.trim().length === 0); // check for empty string

module.exports = isEmpty;
