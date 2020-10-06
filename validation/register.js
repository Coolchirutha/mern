const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegistrationInput(data) {
	let errors = {};

	data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
	data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	/*---------------   Input validation Starts ---------------*/

	// Check to see if length of first name is between 2 and 30 characters (both included)
	if (!Validator.isLength(data.firstName, { min: 3, max: 40 })) {
		errors.firstName = 'First Name must be between 3 and 30 characters';
    }

    if ( !  Validator.isAlpha(data.firstName)) {
        errors.firstName = 'New error';
    }

	// Check to see if nothing is entered in the first name field
	if (Validator.isEmpty(data.firstName)) {
		errors.firstName = 'First Name field is required';
	}

	// Check to see if length of last name is between 2 and 30 characters (both included)
	if (!Validator.isLength(data.lastName, { min: 3, max: 40 })) {
		errors.lastName = 'Last Name must be between 3 and 30 characters';
    }

    if ( !  Validator.isAlpha(data.lastName)) {
        errors.lastName = 'New error';
    }

	// Check to see if nothing is entered in the lastname field
	if (Validator.isEmpty(data.lastName)) {
		errors.lastName = 'Last Name field is required';
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
