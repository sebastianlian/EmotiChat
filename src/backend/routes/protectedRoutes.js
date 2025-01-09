const express = require('express');
const passport = require('passport');
const router = express.Router();

// Example of a protected route
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to your dashboard!`);
});

module.exports = router;
