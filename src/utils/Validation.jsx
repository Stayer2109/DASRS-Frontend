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
  const errors = {};

  if (data.address.trim() === "") {
    errors.address = "Address is required";
  }

  if (data.gender.trim() === "") {
    errors.gender = "Gender is required";
  }

  if (data.dob.trim() === "") {
    errors.dob = "Date of Birth is required";
  }

  if (data.phone.trim() === "") {
    errors.phone = "Phone number is required";
  }

  if (data.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }

  if (data.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }

  return errors;
};
