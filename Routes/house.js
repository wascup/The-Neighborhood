var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.render('house', { title: 'House' });
// });
router.get('/controlpanel', function(req, res) {
    res.render('controlpanel', { Homeowner: req.user });
});




module.exports = router;