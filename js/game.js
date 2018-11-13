Game = {
    images: {
        botwLink: './images/botw-link.png',
        ganondorf: './images/ganondorf.png',
        majorasMask: './images/majoras-mask.png',
        linkSprite: './images/link-sprite.png',
        boat: './images/windwaker-boat.png',
        shadowLink: './images/shadow-link.png',
        zelda: './images/zelda.png',
        midna: './images/midna-wolf-link.png'
    },
    cardsFound: 0,
    difficulty: "easy",
    board: {
        cardElements: [],
        cardOrder: [],
        flippedCard: null
    }
}

Game.board.shuffleCards = function () {
    //converting Game.images files to array with two copies of each image
    Game.board.cardOrder = [];
    for (var property in Game.images) {
        Game.board.cardOrder.push(property);
        Game.board.cardOrder.push(property);
    }
    //shuffling that array
    var m = Game.board.cardOrder.length;
    var t, i;
    while (m !== 0) {
        i = Math.floor(Math.random() * m--);
        t = Game.board.cardOrder[m];
        Game.board.cardOrder[m] = Game.board.cardOrder[i];
        Game.board.cardOrder[i] = t;
    }
    Game.board.generateBoard();
}

Game.board.generateBoard = function() {
    for (var i = 0; i < Game.board.cardOrder.length; i++) {
        var cardElement = document.createElement('div');
        cardElement.className = "card";
        cardElement.dataset.type = Game.board.cardOrder[i];
        var backImage = document.createElement('img');
        backImage.className = "back";
        backImage.src = "./images/triforce.png";
        var frontImage = document.createElement('img');
        frontImage.className = "front";
        frontImage.src = Game.images[Game.board.cardOrder[i]];
        cardElement.addEventListener('click', Game.board.flipCard);
        cardElement.appendChild(frontImage);
        cardElement.appendChild(backImage);
        document.getElementById('game-board').appendChild(cardElement);
        Game.board.cardElements.push(cardElement);
    }
}

Game.board.flipCard = function (event) {
    if (this === Game.board.flippedCard) {
        return null;
    }
    this.classList.toggle("flipped");
    var type = this.dataset.type;
    if (Game.board.flippedCard !== null) {
        if (type === Game.board.flippedCard.dataset.type) {
            this.removeEventListener('click', Game.board.flipCard);
            Game.cardsFound += 2;
            Game.board.flippedCard = null;
            //conditional if game won!
        } else {
            for (var i = 0; i < Game.board.cardElements.length; i++) {
                Game.board.cardElements[i].style.pointerEvents = "none";
            }
            setTimeout(() => {
                this.classList.toggle('flipped');
                Game.board.flippedCard.classList.toggle('flipped');
                Game.board.flippedCard = null;
            }, 700);
            setTimeout(() => {
                for (var i = 0; i < Game.board.cardElements.length; i++) {
                    Game.board.cardElements[i].style.pointerEvents = "auto";
                }
            }, 700);
        }
    } else if (Game.board.flippedCard === null) {
        Game.board.flippedCard = this;
        this.removeEventListener('click',Game.board.flipcard);
    }
}

Game.newGame = function () {
    Game.cardsFound = 0;
    Game.cardsFlipped = 0;
    Game.board.shuffleCards();
}

Game.start = function () {
    Game.board.shuffleCards();
}

Game.start();