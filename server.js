var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
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
var Song = require('./models/song')


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
router.route('/mashups/upvote/:mashup_id')
	.get(function(req,res) {
		Mashup.findById(req.params.mashup_id, function(err,mashup) {
			if (err)
				res.send(err);
			mashup.upvotes += 1;
            mashup.save(function(err) {
                if (err) {
                    res.send(err);
                };
                res.json(mashup);
	       	})
		})
	})
router.route('/songs')
	.get(function(req,res) {
        request("https://www.kimonolabs.com/api/eewateh0?apikey=deEjldQkPV5fRpfyTC3L9xQpPe2VeBeS", 
        function(err, response, body) {
          console.log(body);
        });
	})

// Default
app.get('/', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
app.use('/api', router);
app.listen(8282);
console.log("App listening on 8181")