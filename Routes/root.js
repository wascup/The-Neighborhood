var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
const Homeowner = require('../models/Homeowner');
var fs = require('fs');
const {
  v4: uuidv4
} = require('uuid');
var House = require('../models/House');

router.get('/', (req, res) => {
  res.render("home", {
    Homeowner: req.user
  });
})
router.get('/about', (req, res) => {
  res.render("about", {
    Homeowner: req.user
  })
})

router.get('/login', (req, res) => {
  res.render("login", {
    Homeowner: req.user
  })
})

router.get('/register', (req, res) => {
  res.render("register", {
    Homeowner: req.user
  })
})

router.get('/street', async (req, res) => {
  var Homeowners = await Homeowner.find({});
  res.render("street", {
    Homeowners: Homeowners,
    Homeowner: req.user
  })
})




//File upload baja
var upload = multer({
  storage: storage
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/ProfilePictures/');
  },
  filename: function(req, file, cb) {
      cb(null, req.user.uuid);
  }
});

var upload = multer({
  storage: storage
});

router.post('/ChangeProfilePicture',upload.single('ProfileFile'), async (req, res) => {
  if (req.user == null) {
  res.redirect('/login');
  return;
  }

  res.redirect('/House/controlpanel');
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
  var newHomeowner = new Homeowner({
    username: req.body.username,
    password: req.body.password,
    ProfilePicture: "ProfilePictures/default.png",
    uuid: newuuid
  });

  Homeowner.register(newHomeowner, req.body.password, function (err) {
    if (err) {
      console.log('House purchase failed!', err);
      res.redirect('/');
      return;
    }

    console.log('New house bought!');
    //make a new folder for the new house
    fs.mkdirSync(`./public/Homes/${newuuid}/`);
    //make a new house and update the Homeowner
    var newHouse = new House({
      Owner: newHomeowner,
      Location: `/public/Homes/${newHomeowner.uuid}/`,
      Files: [],
    });
    newHouse.save();
    Homeowner.findOneAndUpdate({
      uuid: newuuid
    }, {
      $set: {
        House: newHouse
      }
    }, function (err, homeowner) {
      if (err) {
        console.log(err);
      }
    });

    res.redirect('/');
  });
})
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;