const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
	let errors = {};

	data.text = !isEmpty(data.text) ? data.text : '';

	/*---------------   Input validation Starts ---------------*/

	if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
		errors.text = 'Post must be between 10 and 300 characters';
	}

	// Check to see if nothing is entered in the email field
	if (Validator.isEmpty(data.text)) {
		errors.text = 'Text field is required';

		/*---------------   Input validation Ends ---------------*/

		return {
			errors,
			isValid: isEmpty(errors),
		};
	}
};
