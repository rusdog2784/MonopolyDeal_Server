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
        clients = [];
        //socket.disconnect(1);
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
            io.emit('players', { players: players });
            setTimeout(function() {
                clients[0].emit('my-turn', { updatedPlayer: undefined });
            }, 2000);
        }
    });

    socket.on('new-deck', function(deckObject) {
        console.log("New deck!");
        deck = deckObject;
        io.emit('updated-deck', { deck: deck });
    });

    socket.on('action-card-against', function(data) {
        var player = data['player_id']
        var recipients = data['recipients'];  //List of player id's. Can just be one player id.
        var card = data['card'];
        for (var i = 0; i < players.length; i++) {
            if (players[i].id in recipients) {
                if (card.title == "Debt Collector") {
                    clients[i].emit('debt-collector', { from: player, amount: 5 })
                } else {
                    console.log("Not doing anything, but still got here.");
                }
            }
        }
    });

    socket.on('action-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Action Card Played: " + card.title);
        console.log("Description: " + card.description);
        console.log("Played By: " + player.firstName + " (" + player.id + ")");
        socket.broadcast.emit('action-card-played', {card: card, player: player});
    });

    socket.on('rent-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Rent Card Played: " + card.title);
        console.log("Played By: " + player.firstName + " (" + player.id + ")");
        socket.broadcast.emit('rent-card-played', {card: card, player: player});
    });

    socket.on('property-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Property Card Played: " + card.title);
        console.log("Property: :" + card.propertyTypes[0]);
        console.log("Played By: " + player.firstName + " (" + player.id + ")");
        socket.broadcast.emit('property-card-played', {card: card, player: player});
    });

    socket.on('wildcard-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        var propertyChosen = data['propertyChosen'];
        console.log("Property Card Played: " + card.title);
        console.log("Property Chosen: :" + propertyChosen);
        console.log("Played By: " + player.firstName + " (" + player.id + ")");
        socket.broadcast.emit('property-card-played', {card: card, player: player});
    });

    socket.on('money-card', function(data) {
        var card = data['card'];
        var player = data['player'];
        console.log("Money Card Played: " + card.title);
        console.log("Value: " + card.value);
        console.log("Played By: " + player.firstName + " (" + player.id + ")");
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
        clients[index].emit('my-turn', { updatedPlayer: player });
    });
});

http.listen(9000, function() {
    console.log("Listening on port 9000");
});