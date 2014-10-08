var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var pThres       = 2;
var tThres       = -1;



var SongSchema   = new Schema({
    upvotes: {type: Number, default: 0},
    title: {type: String, default: "Song Name"},
    URL: {type: String, default: "http://www.soundcloud.com"},
    artist: {type: String, default: "Artist"},
    artistURL: {type: String, default: "http://www.soundcloud.com"},
    embed: {type: String,  default: ""},
    threshold: {type: Number, default: 0},
    published: {type: Boolean, default: false},
    trash: {type: Boolean, default: false},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    updated: {type: Date, default:Date.now },

});
SongSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

SongSchema.methods.yay = function(cb) {
    this.threshold += 1;
    if (this.threshold >= pThres) {
        this.published = true;
    }
    this.save(cb);

};
SongSchema.methods.nay = function(cb) {
    this.threshold -= 1;
    if (this.threshold <= tThres) {
        this.trash = true;
    }
    this.save(cb);

};

module.exports = mongoose.model('Song', SongSchema);

