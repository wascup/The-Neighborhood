var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var House = new Schema({
    Owner: { type: Schema.Types.ObjectId, ref: 'Homeowner'},
    Location: String,
    Files: [{ type: String }],
});


module.exports = mongoose.model('House', House);