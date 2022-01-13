var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');

router.get('/controlpanel', async function(req, res) {
    if(!isuser(req))
    {
        res.redirect('/login');
        return;
    }
    var House = require('../models/House');
    var user = req.user;
    var House = await House.findOne({ Owner: user });
    var UsersFiles = House.Files
    res.render('controlpanel', {Homeowner: req.user,files: UsersFiles });
});
var Homeowner = require('../models/Homeowner');



//File upload baja
var upload = multer({
    storage: storage
});

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(!req.user)
        {
            return;
        }
        cb(null, './public/Homes/' + req.user.uuid + '/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

router.post('/addfiles', upload.array('file'), async function(req, res) {
    var House = require('../models/House');
    var user = req.user;
    var House = await House.findOne({ Owner: user });
    if(House == null)
    {
        res.redirect('/');
        return;
    }
    for(var i = 0; i < req.files.length; i++)
    {
        House.Files.push(req.files[i].originalname);
    }
    House.save();
    res.redirect('/House/controlpanel');
});

router.get('/deletefile/:file', async function(req, res) {
    if(!isuser(req))
    {
        res.redirect('/login');
        return;
    }
    var filename = req.params.file;
    fs.unlink(`./public/Homes/${req.user.uuid}/${filename}`, function(err) {
        if (err) {
            console.log(err);
        }
    });
    var House = require('../models/House');
    var user = req.user;
    var House = await House.findOne({ Owner: user });
    var FileIndex = House.Files.indexOf(filename);
    if (FileIndex > -1) {
        House.Files.splice(FileIndex, 1);
    }
    House.save();

    res.redirect('/House/controlpanel');
});
router.get('/:Homeowner', async function(req, res) {
    var homeowner = req.params.Homeowner;
    res.redirect('/House/' + homeowner + "/index.html")
});

router.get('/:Homeowner/:file', async function(req, res) {
    var homeowner = req.params.Homeowner;
    var filename = req.params.file;
    var HomeownerObject = await Homeowner.findOne({ username: homeowner });
    if(!HomeownerObject.uuid)
    {
        res.redirect('/');
        return;
    }
    var dir = `./public/Homes/${HomeownerObject.uuid}/`;
    var FileSend = dir + filename;
    await res.sendFile(path.resolve(FileSend));
});

function isuser(req)
{
    if(req.user)
    {
        return true;
    }
    else
    {
        return false;
    }
}
module.exports = router;