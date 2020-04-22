const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';

	/*---------------   Input validation Starts ---------------*/

	// Check to see if a valid email address is entered
	if ((!Validator.isLength(data.handle, { min: 2, max: 40 }) )) {
		errors.handle = 'Handle needs to be between 2 and 40 characters';
    }

    if ((Validator.isEmpty(data.handle))) {
		errors.handle = 'Profile Handle is required';
	}

    if ((Validator.isEmpty(data.status))) {
		errors.status = 'Status Field is required';
	}

    if ((Validator.isEmpty(data.skills))) {
		errors.skills = 'Skills Field is required';
    }

    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)) {
            errors.website = 'Invalid URL';
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)) {
            errors.youtube = 'Invalid URL';
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)) {
            errors.twitter = 'Invalid URL';
        }
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)) {
            errors.facebook = 'Invalid URL';
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)) {
            errors.linkedin = 'Invalid URL';
        }
    }

    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)) {
            errors.instagram = 'Invalid URL';
        }
    }

	/*---------------   Input validation Ends ---------------*/

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
