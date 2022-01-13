var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Homeowner = new Schema({
    username: String,
    password: String,
    ProfilePicture: String,
    uuid: String,
    House: { type: Schema.Types.ObjectId, ref: 'House'},

});

Homeowner.plugin(passportLocalMongoose);

module.exports = mongoose.model('Homeowner', Homeowner);