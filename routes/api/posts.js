// Deals with authentication
const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @desc    Just to test the posts route
// @access  Public
router.get('/test', (req, resp) => {
    resp.json({ msg: "Posts works!!" });
});

module.exports = router;
