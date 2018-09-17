const Card = require("./Card.js");

export class MoneyCard extends Card {
    imageLocation;

    constructor(title, value) {
        super(title, value);
        this.imageLocation = "assets/imgs/money_cards/" + title + ".png";
    }
}