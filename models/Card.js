export class Card {
    title;
    value;
    imageLocation;

    constructor(title, value) {
        this.title = title;
        this.value = value;
        this.imageLocation = "assets/imgs/played_cards.png";
    }

    onPlay() {
        console.log("Playing " + this.title);
    }
}