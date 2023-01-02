const express = require("express");
const router = express.Router();

// @route GET api/profile/test
// @desc Tests the profile route
// @access Public
router.get("/test", (req, res) => res.json({ message: "Profile Test API!" }));

module.exports = router;
