var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML mashup (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var request = require("request");

// configuration =================

mongoose.connect('mongodb://a:b@proximus.modulusmongo.net:27017/ziva7qEx'); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
/*
app.use(bodyParser.urlencoded({'extended': 'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json*/

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(methodOverride());

// listen (start app with node server.js) ======================================
var router = express.Router(); 		



// Models

var Api = mongoose.model('Api', {
    title : String,
    link : String,
    imageURL : String
});
var Mashup = require('./models/mashup');
var Song = require('./models/song');
var Comment = require('./models/Comment');


// Routing
router.use(function(req, res, next) {
    // do logging
    console.log('Routing...');
    next(); // make sure we go to the next routes and don't stop here
});

app.get('/api/apis', function (req, res) {

    Api.find(function (err, apis) {
        if (err) {
            res.send (err)
        }
        res.json(apis); 
    });
});

app.post('/api/apis', function (req, res){
    Api.create({
        title : req.body.text,
        done : false
    }, function(err, Api) {
        if (err)
            res.send(err);
        res.json(Api)
        // get and return all the todos after you create another
        Api.find(function(err, apis) {
            if (err)
                res.send(err)
                res.json(apis);
        });
    });

});


router.route('/mashups')
.post(function(req,res) {
    var mashup = new Mashup();
    mashup.name = req.body.name;
    mashup.upvotes = req.body.upvotes;
    mashup.save(function(err) {
        if (err) {
            res.send(err);
        };
        res.json(mashup);
    });
})
.get(function(req,res) {
    Mashup.find(function(err,mashups) {
        if (err)
            res.send(err);
        res.json(mashups);
    });
});

router.route('/mashups/:mashup_id')
.get(function(req,res) {
    Mashup.findById(req.params.mashup_id, function(err,mashup) {
        if (err)
            res.send(err);
        res.json(mashup);
    })
})
router.put('/mashups/:mashup/upvote', function(req, res, next) {
    req.mashup.upvote(function(err, mashup){
        if (err) { return next(err); }
        res.json(mashup);
    });
});
router.put('/songs/:song/upvote', function(req, res, next) {
    req.song.upvote(function(err, song){
        if (err) { return next(err); }
        res.json(song);
    });
});


// EXTERNAL REQUESTS OVER HERE
router.route('/songs')
.get(function(req,res) {
    request("https://www.kimonolabs.com/api/99j7fzni?apikey=deEjldQkPV5fRpfyTC3L9xQpPe2VeBeS", 
            function(err, response, body) {
        console.log(JSON.parse(body).results.collection1);
        res.json(JSON.parse(body).results.collection1);
    });
})
router.route('/embedSong/')
.get(function(req,res) {
    request('http://soundcloud.com/oembed?format=json&url=' + "http://soundcloud.com/forss/flickermood", 
            function(err, response, body) {
        console.log(body);
        //  req.json(body)   
        res.json(JSON.parse(body).html);
    });

})


//{"version":1.0,"type":"rich","provider_name":"SoundCloud","provider_url":"http://soundcloud.com","height":400,"width":"100%","title":"Flickermood by Forss","description":"From the Soulhack album,\u0026nbsp;recently featured in this ad \u003Ca href=\"https://www.dswshoes.com/tv_commercial.jsp?m=october2007\"\u003Ehttps://www.dswshoes.com/tv_commercial.jsp?m=october2007\u003C/a\u003E ","thumbnail_url":"http://i1.sndcdn.com/artworks-000067273316-smsiqx-t500x500.jpg?86347b7","html":"\u003Ciframe width=\"100%\" height=\"400\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true\u0026url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F293\u0026show_artwork=true\"\u003E\u003C/iframe\u003E","author_name":"Forss","author_url":"http://soundcloud.com/forss"

// Default
app.get('/', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
app.use('/api', router);
app.listen(8282);
console.log("App listening on 8181")