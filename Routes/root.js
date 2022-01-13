var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render("home")
})
router.get('/about', (req, res) => {
  res.render("about")
})

router.get('/login', (req, res) => {
  res.render("login")
})

router.get('/register', (req, res) => {
  res.render("register")
})



router.post('/login', (req, res) => {
  res.render("login")
})

router.post('/register', (req, res) => {
  res.render("register")
})


module.exports = router;