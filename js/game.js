Game = {
    cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'],
    cardsFlipped: 0,
    difficulty: "easy",
    board: {
        cardElements: Array.from(document.getElementsByClassName('card')),
        cardOrder: []
    }
}

Game.board.shuffleCards = function () {
    Game.board.cardOrder = [];
    for (var i = 0; i < Game.cards.length; i++) {
        var ind = Math.floor(Math.random() * Game.cards.length);
        Game.board.cardOrder.splice(ind, 0, Game.cards[i]);
    }
    Game.board.cardOrder = Game.board.cardOrder.filter((el) => el !== undefined);
}

Game.board.flipCard = function (event) {
    Game.cardsFlipped++;
    var cardIndex = Game.board.cardElements.indexOf(event.target);
    event.target.style.backgroundColor = "white";
    event.target.style.backgroundImage = "none";
    event.target.innerHTML = Game.board.cardOrder[cardIndex];
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