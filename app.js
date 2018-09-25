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
            socket.emit('create-deck');
            socket.emit('initial-cards', {amount: 5, player: player});
        } else {
            socket.emit('updated-deck', { deck: deck });
            socket.emit('initial-cards', {amount: 5, player: player});
            console.log("Enough players, " + players[0].firstName + " goes first.");
            clients[0].emit('my-turn');
            io.emit('players', { players: players });
        }
    });

    socket.on('new-deck', function(deckObject) {
        console.log("New deck!");
        deck = deckObject;
        io.emit('updated-deck', { deck: deck });
    });

    socket.on('action-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Card played: " + card.title);
        console.log("By " + player.firstName);
        socket.broadcast.emit('action-card-played', {card: card, player: player});
    });

    socket.on('property-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Card played: " + card.title);
        console.log("By " + player.firstName);
        socket.broadcast.emit('property-card-played', {card: card, player: player});
    });

    socket.on('money-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Card played: " + card.title);
        console.log("By " + player.firstName);
        socket.broadcast.emit('money-card-played', {card: card, player: player});
    });

    socket.on('end-turn', function(data) {
        let player = data['player'];
        var index = 0;
        for (var i = 0; i < players.length; i++) {
            if (players[i].firstName == player.firstName && players[i].lastName == player.lastName) {
                index = i + 1;
                players[i] = player;
            }
        }
        if (index >= players.length) {
            index = 0;
        }
        console.log("Its " + players[index].firstName + "'s turn");
        clients[index].emit('my-turn');
    });
});

http.listen(9000, function() {
    console.log("Listening on port 9000");
});