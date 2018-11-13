Game = {
    allCards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'],
    cardsFound: 0,
    difficulty: "easy",
    board: {
        cardElements: Array.from(document.getElementsByClassName('card')),
        cardOrder: [],
        flippedCard: null
    }
}

Game.board.shuffleCards = function () {
    Game.board.cardOrder = [];
    for (var i = 0; i < Game.allCards.length; i++) {
        var ind = Math.floor(Math.random() * Game.allCards.length);
        Game.board.cardOrder.splice(ind, 0, Game.allCards[i]);
    }
    Game.board.cardOrder = Game.board.cardOrder.filter((el) => el !== undefined);
}

Game.board.flipCard = function (event) {
    if (event.target === Game.board.flippedCard) {
        return null;
    }
    var cardIndex = Game.board.cardElements.indexOf(event.target);
    event.target.className += " flipped";
    event.target.textContent = Game.board.cardOrder[cardIndex];
    if (Game.board.flippedCard !== null) {
        if (event.target.textContent === Game.board.flippedCard.textContent) {
            Game.cardsFound += 2;
            Game.board.flippedCard = null;
        } else {
            setTimeout(() => {
                event.target.innerHTML = "";
                event.target.className = event.target.className.replace(' flipped', '');
                Game.board.flippedCard.className = Game.board.flippedCard.className.replace(' flipped','');
                Game.board.flippedCard.innerHTML = "";
                Game.board.flippedCard = null;
            }, 700);
        }
    } else if (Game.board.flippedCard === null) {
        Game.board.flippedCard = event.target;
    }
}



Game.newGame = function () {
    Game.cardsFound = 0;
    Game.cardsFlipped = 0;
    Game.board.shuffleCards();
}

Game.board.bindCardActions = function () {
    for (var i = 0; i < Game.board.cardElements.length; i++) {
        Game.board.cardElements[i].addEventListener('click', Game.board.flipCard);
    }
}

Game.start = function () {
    Game.board.bindCardActions();
    Game.board.shuffleCards();
}

Game.start();