/** @format */

const PWD_REGEX = new RegExp(import.meta.env.VITE_PWD_REGEX);
const PHONE_REGEX = new RegExp(import.meta.env.PHONE_REGEX);

// List of errors object
var errors = {};

export const LoginValidation = (data) => {
	// Set Errors object to empty
	errors = {};

	if (data.email === "") {
		errors.email = "Email is required";
	}

	if (data.password === "") {
		errors.password = "Password is required";
	}

	if (!PWD_REGEX.test(data.password)) {
		errors.password =
			"Password must contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase";
	}

	console.log(data.password);
	
	console.log("LoginValidation errors: ", errors);
	
	return errors;
};

