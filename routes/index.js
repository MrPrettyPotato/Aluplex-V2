const express = require('express');
const router = express.Router();
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

console.log("Index routes")
router.get('/', function (req, res, ) {

  res.render('home', {
    req: req,
    user: req.session.user,
    logged_in: req.isAuthenticated()
  });
});

module.exports = router;