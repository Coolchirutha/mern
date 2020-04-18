const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegistrationInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	/*---------------   Input validation Starts ---------------*/

	// Check to see if length of name is between 2 and 30 characters (both included)
	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Name must be between 2 and 30 characters';
	}

	// Check to see if nothing is entered in the name field
	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}

	// Check to see if a valid email address is entered
	if (!Validator.isEmail(data.email)) {
		errors.email = 'Invalid Email Id';
	}

	// Check to see if nothing is entered in the email field
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	// Check to see if length of name is between 2 and 30 characters (both included)
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters long';
	}

	// Check to see if password field is empty
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}
	// Check to see if confirm password field is empty
	if (Validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm Password field is required';
	}
	// Check to see if confirm password field matches password
	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = 'Both the passwords must match';
	}

	/*---------------   Input validation Ends ---------------*/

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
