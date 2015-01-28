var Twit = require('twit');
 var T = new Twit({
    consumer_key:         'e8LpTUe4CHyriL73UTruyYC7X'
  , consumer_secret:      'YIaQHT5mSsjXr9z8OTN2gsW7RGg0gHw6h92efaDijzAKe5HVZQ'
  , access_token:         '2284092768-nszrfU9feD4OUBIlplFlQXSm1VQduS7D8XQkPpu'
  , access_token_secret:  'LP2mMgtjtR6MuPoyyyiCQAZxx0us426seZA26H165hM64'
});

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.get('/:hashtags', function (req, res) {
		var params = req.params.hashtags
		console.log(params);
		var hashtags = params.split("+");
		console.log(hashtags);
    res.sendFile(__dirname + '/index.html');
    io.sockets.on('connection', function (socket) {
  		var stream = T.stream('statuses/filter', { track: hashtags })
  	stream.on('tweet', function (tweet) {
    io.sockets.emit('stream',tweet.text);
  });
});
});



server.listen(4000);