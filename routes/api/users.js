// Deals with authentication
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Importing input validation
const validateRegistrationInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Import User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Just to test the users route
// @access  Public
router.get('/test', (req, resp) => {
	resp.json({ msg: 'Users works!!' });
});

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, resp) => {
	const { errors, isValid } = validateRegistrationInput(req.body);

	// Validating the input
	if (!isValid) {
		return resp.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists';
			return resp.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200', // Size of image
				r: 'pg', // Rating of img
				d: 'mm', // Default image
			});

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					newUser.password = hash;
					newUser
						.save()
						.then((user) => resp.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
});

// @route   POST api/users/login
// @desc    Login User ( Returning JSON Web Token or JWT)
// @access  Public
router.post('/login', (req, resp) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// Validating the input
	if (!isValid) {
		return resp.status(400).json(errors);
	}
	email = req.body.email;
	password = req.body.password;

	// Search for user
	User.findOne({ email }).then((user) => {
		// Check if user exists
		if (!user) {
			errors.email = 'User not found';
			return resp.status(404).json(errors);
		} // If user doesn't exist

		//  When user is found, check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				// resp.json({ message: 'Login Successful' });
				//  When credentials are correct
				const payload = {
					//  Creating JWT Payload
					id: user.id,
					name: user.name,
					avatar: user.avatar,
				};
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 3600 },
					(err, token) => {
						resp.json({
							success: true,
							token: 'Bearer ' + token,
						});
					}
				);
			} else {
				errors.password = 'Password Incorrect';
				return resp.status(400).json(errors);
			}
		});
	});
});

// @route   POST api/users/current
// @desc    Return Current User
// @access  Private
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }), //    Checks if user is logged in or not
	(req, resp) => {
		console.log('Hello World');
		resp.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email,
		});
	}
);

module.exports = router;
