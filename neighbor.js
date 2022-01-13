//make express server and connect to mongoose "Neighborhood" database
var express = require('express');
var app = express();
var port = 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session')
const Homeowner = require('./models/Homeowner');



mongoose.connect('mongodb://127.0.0.1/Neighborhood')
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
app.use(session({
    keys: ['Geo', 'Hood'],
    secret: 'GeoHood',
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Homeowner.authenticate()));
passport.serializeUser(Homeowner.serializeUser());
passport.deserializeUser(Homeowner.deserializeUser());


app.listen(port, function () {
    console.log(`listening on port ${port}`);
});
//Routes
var rootRoute = require('./routes/root');
app.use('/', rootRoute);
var houseRoute = require('./routes/house');
app.use('/House', houseRoute);
var editRoute = require('./routes/Editor');
app.use('/edit', editRoute);