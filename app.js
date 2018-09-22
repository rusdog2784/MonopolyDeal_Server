var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var players = [];
var clients = [];
var deck = [];
numOfPlayersToStart = 2;

app.get("/", function(req, res) {
    res.send("<h1>Welcome to the Monopoly Deal server page.</h1>");
});

io.on('connection', function(socket) {
    socket.on("disconnect", function(player) {
        console.log("Player left.");
        players = [];
    });

    socket.on('player-entered', function(player) {
        console.log("Player has entered: " + player.firstName + " " + player.lastName);
        players.push(player);
        clients.push(socket);
        if (players.length == 1) {
            io.emit('create-deck');
        }
        if (players.length > 1) {
            io.emit('new-player', {players: players});
            io.emit('deck-change', { deck: deck });
        }
        socket.emit('pick-up-cards', {amount: 5, player: player});
    });

    socket.on('new-deck', function(deckObject) {
        console.log("New deck!");
        deck = deckObject;
        io.emit('deck-change', { deck: deck });
    });
});

http.listen(9000, function() {
    console.log("Listening on port 9000");
})