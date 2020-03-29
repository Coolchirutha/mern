// Contain profile data like name, social links
// Deals with authentication
const express = require('express');
const router = express.Router();

// @route   GET api/profile/test
// @desc    Just to test the profile route
// @access  Public
router.get('/test', (req, resp) => {
    resp.json({ msg: "Profile works!!" });
});

module.exports = router;
