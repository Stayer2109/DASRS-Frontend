/** @format */

const PWD_REGEX = new RegExp(import.meta.env.VITE_PWD_REGEX);
const PHONE_REGEX = new RegExp(import.meta.env.PHONE_REGEX);

// List of errors object
var errors = {};
var error = "";

export const LoginValidation = (data) => {
  // Set Errors object to empty
  errors = {};

  if (data.email === "") {
    errors.email = "Email is required";
  }

  if (data.password === "") {
    errors.password = "Password is required";
  }

  return errors;
};

export const ForgetPasswordValidation = (data) => {
  // Set Errors object to empty
  error = "";

  if (data === "") {
    error = "Email is required";
  }

  return error;
};

export const UpdateProfileValidation = (data) => {
  errors = {};

  if (data.address === "") {
    errors.address = "Address is required";
  }

  if (data.gender === "") {
    errors.gender = "Gender is reauired";
  }

  if (data.dob === "") {
    errors.dob = "Date of Birth is required";
  }

  if (data.phone === "") {
    errors.phone = "Phone number is required";
  }

  if (data.first_name === "") {
    errors.first_name = "First name is required";
  }

  if (data.last_name === "") {
    errors.last_name = "Last name is required";
  }

  return errors;
};
