var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var players = [];

app.get("/", function(req, res) {
    res.send("<h1>Hello, World</h1>");
});

io.on('connection', function(socket) {
    socket.on("disconnect", function(name) {
        console.log("Player left.");
        io.emit('player-left', {player: name, event: 'left'});
    });

    socket.on('queue', function(name) {
        players.push(name);
        if (players.length == 2) {
            io.emit('start-game', {player1: players[0], player2: players[1], event: 'start'});
        };
    });

    socket.on('card-played', function(card) {
        io.emit('card', {card: card});
    });

    console.log('Player connected.');
});

http.listen(9000, function() {
    console.log("Listening on port 9000");
})