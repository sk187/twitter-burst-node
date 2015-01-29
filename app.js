var Twit = require('twit');
 var T = new Twit({
    consumer_key: process.env.TWITTER_C_KEY
  , consumer_secret: process.env.TWITTER_SECRET
  , access_token: process.env.TWITTER_A_TOKEN
  , access_token_secret: process.env.TWITTER_A_T_SECRET
});

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://twitterburst.herokuapp.com');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  return next();
});

app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    io.sockets.on('connection', function (socket) {
    	var first_hashtag = socket.handshake.query.first_hashtag;
    	// var second_hashtag = socket.handshake.query.second_hashtag;
  		var stream = T.stream('statuses/filter', { track: [first_hashtag] })
  	stream.on('tweet', function (tweet) {
			io.sockets.emit('stream',tweet.text);
  });
});
});

server.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})