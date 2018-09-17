const Card = require("./Card.js");

export class ActionCard extends Card {
    description;
    imageLocation;

    constructor(title, description, value) {
        super(title, value);
        this.description = description;
        var imageName = title.replace(" ", "");
        imageName = imageName.replace(" ", "");
        this.imageLocation = "assets/imgs/action_cards/" + imageName + ".png";
    }

}