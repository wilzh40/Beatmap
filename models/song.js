var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SongSchema   = new Schema({
	name : String,
    url: String,
    upvotes : Number
    


});
module.exports = mongoose.model('Song', SongSchema);

