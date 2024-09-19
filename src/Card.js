// class to represent a Card
export class Card {
    
    constructor(suit, value, image, display=false) {
        // suit (SPADES, HEARTS, DIAMONDS, CLUBS)
        this.suit = suit
        // KING, QUEEN, JACK are considered as a value of 10
        if(value === "KING" || value === "QUEEN" || value === "JACK") {
            this.value = 10
        // ACE is considered as either 1 or 11
        } else if(value === "ACE") {
            // in a "tuple" to represent 2 values
            this.value = [1, 11]
        } else {
            this.value = Number(value)
        }
        // whether or not to display the card (face card value image, or back of card)
        this.display = display
        this.CARD_IMAGE_URL = image

        // if display is false, show the back of the card
        if(!display) this.cardImage = "/images/back.png"
        // otherwise show the image as passed in
        else this.cardImage = this.CARD_IMAGE_URL
    }

    revealCard() {
        // this.display = true;
        this.cardImage = this.CARD_IMAGE_URL
    }
    
}

// "enum" object for possible player types
export const PlayerTypes = {
    Player: "Player",
    Dealer: "Dealer"
}