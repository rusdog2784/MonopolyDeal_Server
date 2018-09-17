const Card = require("./Card.js");
const PropertyType = require("./PropertyType.js");

export class RentCard extends Card {
    types;
    imageLocation;

    constructor(title, value, types) {
        super(title, value);
        this.types = types;
        var imageName;
        if (this.types.length == 2) {
            imageName = this.types[0] + "&" + this.types[1];
        } else {
            imageName = "All";
        }
        this.imageLocation = "assets/imgs/rent_cards/" + imageName + ".png";
    }
}