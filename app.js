var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var players = [];
var deck = [];

app.get("/", function(req, res) {
    res.send("<h1>Welcome to the Monopoly Deal server page.</h1>");
});

io.on('connection', function(socket) {
    socket.on("disconnect", function(player) {
        console.log("Player left.");
        //io.emit('player-left', {player: name, event: 'left'});
        players = [];
    });

    socket.on('player-entered', function(player) {
        console.log("Player has entered:");
        console.log(player.firstName + " " + player.lastName);
        players.push(player);
        if (players.length == 1) {
            // First player creates the deck
            console.log("Asking first player to create a deck");
            io.emit('create-deck');
        }
        if (players.length > 1) {
            io.emit('new-player', {players: players});
            console.log("Emitting new deck to all");
            io.emit('deck-change', { deck: deck });
        }
    });

    socket.on('new-deck', function(cards) {
        console.log("New deck!");
        deck = cards;
        console.log("Emitting new deck to all");
        io.emit('deck-change', { deck: deck });
    });
});

http.listen(9000, function() {
    console.log("Listening on port 9000");
})