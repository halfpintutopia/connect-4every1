const Validator = require("validator");
// import isEmpty from './is-empty'; // ES6
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Checks if the string is empty using isEmpty
  data.email = !isEmpty(data.email) ? data.email : ""; // checked server side
  data.password = !isEmpty(data.password) ? data.password : ""; // checked server side

  // ? How would I make this DRY? Order of checks matter!
  // Check valid email address
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  // Check empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  // Check empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
