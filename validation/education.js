const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
	let errors = {};

	data.school = !isEmpty(data.school) ? data.school : '';
	data.degree = !isEmpty(data.degree) ? data.degree : '';
	data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
	data.from = !isEmpty(data.from) ? data.from : '';

	/*---------------   Input validation Starts ---------------*/

	// Check to see if nothing is entered in the email field
	if (Validator.isEmpty(data.school)) {
		errors.school = 'School Name is required';
    }

	if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree needs to be specified';
	}

	if (Validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = 'Field of Study needs to be specified';
	}

	if (Validator.isEmpty(data.from)) {
        errors.from = 'From Date is required';
    }

	/*---------------   Input validation Ends ---------------*/

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
