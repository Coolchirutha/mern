// Deals with authentication
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//  Importing the Post model
const Post = require('../../models/Post');

// Importing validation for the post request
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Just to test the posts route
// @access  Public
router.get('/test', (req, resp) => {
	resp.json({ msg: 'Posts works!!' });
});

// @route   POST api/posts
// @desc    Create posts
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
        const errors = {};

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id,
		});

		newPost.save().then((post) => resp.json(post));
	}
);

module.exports = router;
