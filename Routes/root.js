var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const Homeowner = require('../models/Homeowner');
const {
  v4: uuidv4
} = require('uuid');

router.get('/', (req, res) => {
  res.render("home", {Homeowner: req.user});
})
router.get('/about', (req, res) => {
  res.render("about", {Homeowner: req.user})
})

router.get('/login', (req, res) => {
  res.render("login", {Homeowner: req.user})
})

router.get('/register', (req, res) => {
  res.render("register", {Homeowner: req.user})
})



//make login post and make a session
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
  res.redirect('/');
});



router.post('/register', (req, res) => {
  var newuuid = uuidv4();
  Homeowner.register(new Homeowner({
    username: req.body.username,
    password: req.body.password,
    ProfilePicture: "/public/images/defaultProfile.png",
    uuid: newuuid,
    WebsiteLocalLocation: `/public/Homes/${newuuid}/`,
  }), req.body.password, function (err) {
    if (err) {
      console.log('House purchase failed!', err);
      return next(err);
    }

    console.log('New house bought!');

    res.redirect('/');
  });
})
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;