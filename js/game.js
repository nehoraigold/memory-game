Game = {
    cards: ['A','A','B','B','C','C','D','D','E','E','F','F'],
    cardsFlipped: 0,
    difficulty: "easy",
    board: {
        cardElements: Array.from(document.getElementsByClassName('card')),
        cardOrder: []
    }
}

Game.board.shuffleCards = function() {
    Game.board.cardOrder = [];
    for (var i = 0; i < Game.cards.length; i++) {
        var ind = Math.floor(Math.random() * Game.cards.length);
        Game.board.cardOrder.splice(ind, 0, Game.cards[i]);
    }
    Game.board.cardOrder = Game.board.cardOrder.filter((el) => el !== undefined);
}

Game.board.flipCard = function(event) {
     
}