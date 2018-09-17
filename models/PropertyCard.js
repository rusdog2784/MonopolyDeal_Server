const Card = require("./Card.js");

export class PropertyCard extends Card {
    type;
    imageLocation;

    constructor(title, value, type) {
        super(title, value);
        this.type = type;
        var imageName = title.replace(" ", "");
        imageName = imageName.replace(" ", "");
        imageName = imageName.replace(" ", "");
        this.imageLocation = "assets/imgs/property_cards/" + imageName + ".png";
    }
}