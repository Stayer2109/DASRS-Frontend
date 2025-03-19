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
