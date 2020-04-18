// Contain profile data like name, social links
// Deals with authentication
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Loading Profile & User Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Just to test the profile route
// @access  Public
router.get('/test', (req, resp) => {
	resp.json({ msg: 'Profile works!!' });
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
        // Getting all the fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.handle) profileFields.handle = req.body.handle;
	}
);

module.exports = router;
