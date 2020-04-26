// Contain profile data like name, social links
// Deals with authentication
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Loading Profile Input Validation Login
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Loading Profile & User Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Just to test the profile route
// @access  Public
router.get('/test', (req, resp) => {
	resp.json({ msg: 'Profile works!!' });
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, resp) => {
	errors = {};
	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then((profiles) => {
			if (!profiles) {
				errors.noProfiles = 'No Profiles Created yet';
				return resp.status(404).json(errors);
			}
			resp.json(profiles);
		})
		.catch((err) => {
			errors.noProfiles = 'No Profiles Created yet';
			return resp.status(404).json(errors);
		});
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, resp) => {
	errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar'])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile found for that handle';
				resp.status(400).json(errors);
			}

			resp.json(profile);
		})
		.catch((err) => {
			resp.status(404).json(err);
		});
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public
router.get('/user/:user_id', (req, resp) => {
	errors = {};
	Profile.findOne({ _id: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then((profile) => {
			if (!profile) {
				errors.noProfile = 'There is no profile found for that handle';
				resp.status(400).json(errors);
			}
			resp.json(profile);
		})
		.catch((err) => {
			errors.noProfile = 'There is no profile found for that handle';
			resp.status(404).json(errors);
		});
});

// @route   GET api/profile
// @desc    Displays the current user's profile
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			.populate('user', ['name', 'avatar'])
			.then((profile) => {
				if (!profile) {
					errors.noProfile = 'No profile for this user';
					return resp.status(404).json(errors);
				}

				resp.json(profile);
			})
			.catch((err) => {
				resp.status(404).json(err);
			});
	}
);

// @route   POST api/profile
// @desc    Used to create/edit the user profile
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Validating form details
		if (!isValid) {
			// Return any errors with a 400 status
			return resp.status(400).json(errors);
		}

		// Getting all the fields
		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername)
			profileFields.githubusername = req.body.githubusername;

		// Skills - Split into array
		if (typeof (req.body.skills != undefined)) {
			profileFields.skills = req.body.skills.split(',');
		}

		// Social media links
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.linkedin)
			profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram)
			profileFields.social.instagram = req.body.instagram;
		if (req.body.facebook)
			profileFields.social.facebook = req.body.facebook;

		Profile.findOne({ user: req.user.id }).then((profile) => {
			if (profile) {
				// Goes in when the profile is already existing
				// This is for updating the existing profile details
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then((profile) => {
					console.log('hi');
					resp.json(profile);
				});
			} else {
				// This is for creating the profile page for the first time

				// Checking if handle already exists since we don't want to change that
				Profile.findOne({ handle: profileFields.handle }).then(
					(profile) => {
						if (profile) {
							errors.handle = 'The handle already exists';
							resp.status(400).json(errors);
						}

						// No error so create profile
						new Profile(profileFields)
							.save()
							.then((profile) => resp.json(profile));
					}
				);
			}
		});
	}
);

// @route   POST api/profile
// @desc    Used to create/edit the user profile
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Validating form details
		if (!isValid) {
			// Return any errors with a 400 status
			return resp.status(400).json(errors);
		}
	}
);

// @route   POST api/profile/experience
// @desc    Add experience to the profile
// @access  Private
router.post(
	'/experience',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		// Validating form details
		if (!isValid) {
			// Return any errors with a 400 status
			return resp.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then((profile) => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description,
			};

			// Adding to the experience array in profile
			profile.experience.unshift(newExp);

			profile.save().then((profile) => resp.json(profile));
		});
	}
);

// @route   POST api/profile/education
// @desc    Add education to the profile
// @access  Private
router.post(
	'/education',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		const { errors, isValid } = validateEducationInput(req.body);

		// Validating form details
		if (!isValid) {
			// Return any errors with a 400 status
			return resp.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then((profile) => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldOfStudy: req.body.fieldOfStudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description,
			};

			// Adding to the experience array in profile
			profile.education.unshift(newEdu);

			profile.save().then((profile) => resp.json(profile));
		});
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete an experience from the profile
// @access  Private
router.delete(
	'/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOne({ user: req.user.id })
			.then((profile) => {
				// Get the index to remove the experience
				const removeIndex = profile.experience
					.map((item) => item.id)
					.indexOf(req.params.exp_id);

				// Splice out of array
				if (!(removeIndex == -1)) {
					profile.experience.splice(removeIndex, 1);
				}

				// Saving changes
				profile.save().then((profile) => resp.json(profile));
			})
			.catch((err) => resp.status(404).json(err));
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete an education from the profile
// @access  Private
router.delete(
	'/education/:edu_id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOne({ user: req.user.id })
			.then((profile) => {
				// Get the index to remove the experience
				const removeIndex = profile.education
					.map((item) => item.id)
					.indexOf(req.params.edu_id);

				// Splice out of array
				if (!(removeIndex == -1)) {
					profile.education.splice(removeIndex, 1);
				}

				// Saving changes
				profile.save().then((profile) => resp.json(profile));
			})
			.catch((err) => resp.status(404).json(err));
	}
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			User.findOneAndRemove({ _id: req.user.id }).then(() =>
				resp.json({ success: true })
			);
		});
	}
);

module.exports = router;
