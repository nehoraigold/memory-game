//things to implement: number of wrong guesses, timer, high scores

// GAME OBJECT //

Game = {
    images: {
        botwLink: './images/botw-link.png',
        shield: './images/shield.png',
        link: './images/link.png',
        ganondorf: './images/ganondorf.png',
        majorasMask: './images/majoras-mask.png',
        linkSprite: './images/link-sprite.png',
        // boat: './images/windwaker-boat.png',
        // shadowLink: './images/shadow-link.png',
        // zelda: './images/zelda.png',
        // midna: './images/midna-wolf-link.png',
        // botwZelda: './images/botw-zelda.png',
        // navi: './images/navi.png'
    },
    cardsFound: 0,
    difficulty: "easy", //12 easly, 16 medium, 20 hard, 24 expert cards for difficulty levels
    wrongMatches: 0,
    timer: {
        hour: 0,
        minute: 0,
        second: 0
    },
    board: {
        cardElements: [],
        cardOrder: [],
        flippedCard: null
    }
}

// TIMER FUNCTIONALITY //

Game.timer.returnTime = function () {
    return Game.timer.makeDoubleDigit(Game.timer.hour) + ":" + Game.timer.makeDoubleDigit(Game.timer.minute) + ":" + Game.timer.makeDoubleDigit(Game.timer.second);
}

Game.timer.makeDoubleDigit = function (num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

Game.timer.update = function () {
    if (Game.timer.second > 59) {
        Game.timer.second = 0;
        Game.timer.minute++;
        if (Game.timer.minute > 59) {
            Game.timer.minute = 0;
            Game.timer.hour++;
        }
    }
}

Game.timer.startTimer = function () {
    Game.timer.lap = setInterval(() => {
        Game.timer.second++;
        Game.timer.update();
        document.getElementById('time-elapsed').textContent = Game.timer.returnTime();
    }, 1000);
}

// GAME BOARD FUNCTIONS //

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
}

Game.board.generateBoard = function () {
    Game.board.shuffleCards();
    var gameBoard = document.getElementById('game-board');
    if (Game.board.cardOrder.length <= 16) {
        gameBoard.style.width = "650px";
    } else if (Game.board.cardOrder.length < 24) {
        gameBoard.style.width = "750px";
    } else {
        gameBoard.style.width = "900px";
    }
    document.getElementById('game-board').innerHTML = "";
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
    Game.timer.startTimer();
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
            if (Game.cardsFound === Game.board.cardOrder.length) {
                console.log('Congrats! You won!');
                Game.completed();
            }
        } else {
            for (var i = 0; i < Game.board.cardElements.length; i++) {
                Game.board.cardElements[i].style.pointerEvents = "none";
            }
            setTimeout(() => {
                this.classList.toggle('flipped');
                Game.board.flippedCard.classList.toggle('flipped');
                Game.board.flippedCard = null;
            }, 800);
            setTimeout(() => {
                for (var i = 0; i < Game.board.cardElements.length; i++) {
                    Game.board.cardElements[i].style.pointerEvents = "auto";
                }
            }, 800);
            Game.wrongMatches++;
            Game.updateWrongMatches();
            Game.board.flippedCard.addEventListener('click', Game.board.flipCard);
        }
    } else if (Game.board.flippedCard === null) {
        Game.board.flippedCard = this;
        this.removeEventListener('click', Game.board.flipCard);
    }
}

Game.updateWrongMatches = function () {
    document.getElementById('wrong-matches-val').textContent = Game.wrongMatches;
}

Game.newGame = function () {
    Game.cardsFound = 0;
    Game.cardsFlipped = 0;
    Game.board.shuffleCards();
}

Game.start = function () {
    Game.board.generateBoard();
    document.getElementById('start-screen').style.display = "none";
    document.getElementById('game').style.display = "block";
}

Game.bindMenuActions = function () {
    document.getElementById('start').addEventListener('click', Game.start);
}

Game.bindMenuActions();