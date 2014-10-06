// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MashupSchema   = new Schema({
	name : String,
    api1 : String,
    api2 : String,
    upvotes : Number
    


});
module.exports = mongoose.model('Mashup', MashupSchema);

