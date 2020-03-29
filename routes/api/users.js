// Deals with authentication
const express = require('express');
const router = express.Router();

// @route   GET api/users/test
// @desc    Just to test the users route
// @access  Public
router.get('/test', (req, resp) => {
    resp.json({ msg: "Users works!!" });
});

module.exports = router;
