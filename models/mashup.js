// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MashupSchema   = new Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]




});
module.exports = mongoose.model('Mashup', MashupSchema);

