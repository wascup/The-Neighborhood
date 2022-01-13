//make express server and connect to mongoose "Neighborhood" database
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');



mongoose.connect('mongodb://localhost/Neighborhood')
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['geo', 'hood']
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, function () {
    console.log('listening on port 3000');
});
//Routes
var rootRoute = require('./routes/root');
app.use('/', rootRoute);
