// Deals with authentication
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//  Importing the Post & Profile model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Importing validation for the post request
const validatePostInput = require('../../validation/post');

// @route   GET api/post
// @desc    Get all posts
// @access  Public
router.get('/', (req, resp) => {
	Post.find()
		.sort({ date: -1 })
		.then((posts) => resp.json(posts))
		.catch((err) =>
			resp.status(404).json({ noPostsFound: 'No Posts found' })
		);
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, resp) => {
	Post.findById(req.params.id)
		.then((post) => resp.json(post))
		.catch((err) =>
			resp.status(404).json({ noPostFound: 'No Post found with that Id' })
		);
});

// @route   POST api/posts
// @desc    Create posts
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		// Getting errors in input (if any)
		const { errors, isValid } = validatePostInput(req.body);

		// Checking for errors
		if (!isValid) {
			// If any errors are found, send a 400 status
			return resp.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id,
		});

		newPost.save().then((post) => resp.json(post));
	}
);

// @route   POST api/post/like/:id
// @desc    Like a post
// @access  Private
router.post(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOne({ user: req.user.id }).then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (
						post.likes.filter(
							(like) => like.user.toString === req.user.id
						).length > 0
					) {
						// If user has already liked the post then return error
						return resp.status(400).json({
							alreadyLiked: 'User already liked this post',
						});
					}

					// Adding user id to likes array of the post
					post.likes.unshift({ user: req.user.id });

					post.save().then((post) => resp.json(post));
				})
				.catch((err) =>
					resp.status(404).json({ postNotFound: 'No post found' })
				);
		});
	}
);

// @route   POST api/post/unlike/:id
// @desc    UnLike a post
// @access  Private
router.post(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOne({ user: req.user.id }).then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (
						// Checking if user is already in array
						post.likes.filter(
							(like) => like.user.toString() === req.user.id
						).length === 0
					) {
						// If user has not liked the post yet
						return resp.status(400).json({
							notLiked: 'You have not yet liked this post',
						});
					}

					// Get index of the like in the likes array to remove
					const indexToRemove = post.likes
						.map((item) => item.user.toString())
						.indexOf(req.user.id);

					// Splice out of array
					post.likes.splice(indexToRemove, 1);

					post.save().then((post) => resp.json(post));
				})
				.catch((err) =>
					resp.status(404).json({ postNotFound: 'No post found' })
				);
		});
	}
);

// @route   POST api/post/comment/:id
// @desc    Comment to post by id
// @access  Private
router.post(
	'/comment/:id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		// Getting errors in input (if any)
		const { errors, isValid } = validatePostInput(req.body);

		// Checking for errors
		if (!isValid) {
            // If any errors are found, send a 400 status
            console.log('Hi, i am error')
			return resp.status(400).json(errors);
        }

		Post.findById(req.params.id)
			.then((post) => {
				const newComment = {
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
					user: req.user.id,
				}

				// Adding to the comments array
				post.comments.unshift(newComment);

				// Saving into database
				post.save().then((post) => resp.json(post)).catch(err => resp.status(404).json(err));
			})
			.catch((err) =>
				resp.status(404).json({ postNotFound: 'No post found' })
			);
	}
);

// @route   DELETE api/post/:id
// @desc    Delete post by id
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, resp) => {
		Profile.findOne({ user: req.user.id }).then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					// Check if user is the owner of post
					if (post.user.toString() !== req.user.id) {
						return resp.status(401).json({
							notAuthorised: 'User not authorized',
						});
					}
					// Deleting the post
					post.remove()
						.then(() => resp.json({ sucess: true }))
						.catch((err) => resp.status(404).json(err));
				})
				.catch((err) =>
					resp.status(404).json({ postNotFound: 'No post found' })
				);
		});
	}
);

module.exports = router;
