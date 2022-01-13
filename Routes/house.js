var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
const Homeowner = require('../models/homeowner');

router.get('/controlpanel', function(req, res) {
    //read all files from the users home folder using fs and give them as a json
    var dir = `./public/Homes/${req.user.uuid}/`;
    var files = fs.readdirSync(dir);
    var UsersFiles = [];
    files.forEach(function(file) {
        UsersFiles.push(file);
    });
    res.render('controlpanel', {Homeowner: req.user,files: UsersFiles });
});
router.get('/:Homeowner', async function(req, res) {
    var homeowner = req.params.Homeowner;
    var HomeownerObject = await Homeowner.findOne({ username: homeowner });
    var dir = `./public/Homes/${HomeownerObject.uuid}/`;
});


//File upload baja
var upload = multer({
    storage: storage
});

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/Homes/' + req.user.uuid + '/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

router.post('/addfiles', upload.array('file'), function(req, res) {
    console.log(req.files);
    res.redirect('/House/controlpanel');
});

router.get('/deletefile/:file', function(req, res) {
    var filename = req.params.file;
    fs.unlink(`./public/Homes/${req.user.uuid}/${filename}`, function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/House/controlpanel');
});

module.exports = router;