var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');

router.post('/savefile', async function(req, res) {
    var filecontent = req.body.filecontent;
    var filelocation = req.body.filelocation;
    fs.writeFileSync(filelocation, filecontent);
    //refreshes the page
    res.redirect(req.get('referer'));
});


router.get('/:file', async function(req, res) {
    var file = req.params.file;
    var filelocation = './public/Homes/' + req.user.uuid + '/' + file;
    var filetype = file.split('.').pop();
    var filetype = filetype.toLowerCase();
    var filedata = fs.readFileSync(filelocation);
    if(filetype == 'html' || filetype == 'css')
    {
    res.render('edit', {Homeowner: req.user,file: filedata, filename: file,filelocation: filelocation});
    }
});

module.exports = router;