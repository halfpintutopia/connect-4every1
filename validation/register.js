const Validator = require("validator");
// import isEmpty from './is-empty'; // ES6
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Checks if the string is empty using isEmpty
  data.name = !isEmpty(data.name) ? data.name : ""; // checked server side
  data.email = !isEmpty(data.email) ? data.email : ""; // checked server side
  data.password = !isEmpty(data.password) ? data.password : ""; // checked server side
  data.password2 = !isEmpty(data.password2) ? data.password2 : ""; // checked client to server side ?

  // ? How would I make this DRY? Order of checks matter!
  // Check length
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  // Check empty
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required.";
  }

  // Check valid email address
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  // Check empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  // Check length
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters.";
  }

  // Check empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  }

  // Compare password and password2
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match.";
  }

  // Check empty
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
