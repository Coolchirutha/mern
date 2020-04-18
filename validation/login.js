const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	/*---------------   Input validation Starts ---------------*/

	// Check to see if a valid email address is entered
	if (!Validator.isEmail(data.email)) {
		errors.email = 'Invalid Email Id';
	}

	// Check to see if nothing is entered in the email field
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	// Check to see if password field is empty
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	/*---------------   Input validation Ends ---------------*/

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
