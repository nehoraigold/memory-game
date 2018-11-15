function main() {

    // GAME OBJECT //

    Game = {
        images: {
            botwLink: './images/botw-link.png',
            zelda: './images/zelda.png',
            ganondorf: './images/ganondorf.png',
            majorasMask: './images/majoras-mask.png',
            linkSprite: './images/link-sprite.png',
            boat: './images/windwaker-boat.png',
            shadowLink: './images/shadow-link.png',
            link: './images/link.png',
            midna: './images/midna-wolf-link.png',
            botwZelda: './images/botw-zelda.png',
            shield: './images/shield.png',
            navi: './images/navi.png'
        },
        allCardbacks: {
            triforce: './images/triforce.png',
            n64: './images/n64.png',
            deku: './images/deku-shield.png',
            ocarina: './images/ocarina.png',
            sheikah: './images/eye-symbol.png'
        },
        cardback: 'triforce',
        cardsFound: 0,
        difficulty: "easy",
        wrongMatches: 0,
        timer: {
            minute: 0,
            second: 0
        },
        board: {
            cardElements: [],
            cardOrder: [],
            flippedCard: null
        },
        highScores: {
            easy: {
                name: "",
                time: []
            },
            medium: {
                name: "",
                time: []
            },
            hard: {
                name: "",
                time: []
            },
            expert: {
                name: "",
                time: []
            }
        }
    }

    // HIGH SCORE FUNCTIONALITY

    Game.loadHighScores = function () {
        if (typeof window.localStorage.ZeldaMemoryGameHighScores !== "undefined") {
            Game.highScores = JSON.parse(window.localStorage.ZeldaMemoryGameHighScores);
        }
    }

    Game.checkIfHighScore = function () {
        var highScoreLevel = Game.highScores[Game.difficulty];
        if ((Game.timer.minute <= highScoreLevel.time[0] && Game.timer.second < highScoreLevel.time[1]) || highScoreLevel.time.length === 0) {
            document.getElementById('high-score-notification').style.display = "block";
            return true;
        } else {
            document.getElementById('high-score-notification').style.display = "none";
            return false;
        }
    }

    Game.recordHighScore = function () {
        var highScoreLevel = Game.highScores[Game.difficulty];
        highScoreLevel.name = document.querySelector('#high-score-notification input').value;
        highScoreLevel.time[0] = Game.timer.minute;
        highScoreLevel.time[1] = Game.timer.second;
        document.getElementById('high-score-notification').style.display = "none";
        document.querySelector('#high-score-notification input').value = "";
        Game.saveHighScores();
    }

    Game.saveHighScores = function () {
        window.localStorage.ZeldaMemoryGameHighScores = JSON.stringify(Game.highScores);
    }

    Game.displayHighScores = function () {
        var spans = Array.from(document.querySelectorAll('#high-scores-modal span'));
        for (var i = 0; i < spans.length; i++) {
            var spanDiff = spans[i].id.split("-")[0];
            var spanField = spans[i].id.split("-")[1];
            if (spanField === "name") {
                spans[i].textContent = Game.highScores[spanDiff].name;
            } else {
                if (Game.highScores[spanDiff].time.length !== 0) {
                    spans[i].textContent = Game.timer.makeDoubleDigit(Game.highScores[spanDiff].time[0]) + ":" + Game.timer.makeDoubleDigit(Game.highScores[spanDiff].time[1]);
                }
            }
        }
    }

    // TIMER FUNCTIONALITY //

    Game.timer.returnTime = function () {
        return Game.timer.makeDoubleDigit(Game.timer.minute) + ":" + Game.timer.makeDoubleDigit(Game.timer.second);
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
        }
        document.getElementById('time-elapsed').textContent = Game.timer.returnTime();
    }

    Game.timer.start = function () {
        Game.timer.lap = setInterval(() => {
            Game.timer.second++;
            Game.timer.update();
        }, 1000);
    }

    Game.timer.stop = function () {
        clearInterval(Game.timer.lap);
    }

    Game.timer.reset = function () {
        Game.timer.stop();
        Game.timer.minute = 0;
        Game.timer.second = 0;
        Game.timer.update();
    }

    // GAME BOARD FUNCTIONS //

    Game.setDifficulty = function () {
        Game.difficulty = Array.from(document.getElementsByName('difficulty')).filter((el) => el.checked)[0].value;
    }

    Game.generateCardbackOptions = function () {
        var cardbackOptions = document.getElementById('all-cardback-options');
        var listItemsArray = [];
        for (var property in Game.allCardbacks) {
            var image = document.createElement('img');
            image.src = Game.allCardbacks[property];
            var label = document.createElement('label');
            label.setAttribute('for', property);
            label.appendChild(image);
            var input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('name', 'cardback');
            input.id = property;
            input.value = property;
            var li = document.createElement('li');
            li.className = "cardback-option";
            li.appendChild(input);
            li.appendChild(label);
            listItemsArray.push(li);
        }
        for (var i = 0; i < listItemsArray.length / 2; i++) {
            var newDiv = document.createElement("div");
            newDiv.className = 'foldable';
            newDiv.appendChild(listItemsArray.shift());
            newDiv.appendChild(listItemsArray.shift());
            cardbackOptions.appendChild(newDiv);
        }
    }

    Game.setCardback = function () {
        Game.cardback = Array.from(document.getElementsByName('cardback')).filter((el) => el.checked)[0].value;
    }

    Game.board.shuffleCards = function () {
        //the number of cards chosen depends on difficulty
        Game.board.cardOrder = [];
        var numberOfCards;
        switch (Game.difficulty) {
            case "easy":
                numberOfCards = 12;
                break;
            case "medium":
                numberOfCards = 16;
                break;
            case "hard":
                numberOfCards = 20;
                break;
            case "expert":
                numberOfCards = 24;
                break;
            default:
                Game.difficulty = "medium";
                numberOfCards = 16;
                break;
        }
        //converting Game.images files to array with two copies of each image 
        for (var property in Game.images) {
            Game.board.cardOrder.push(property);
            Game.board.cardOrder.push(property);
            if (Game.board.cardOrder.length === numberOfCards) {
                break;
            }
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
            backImage.src = Game.allCardbacks[Game.cardback];
            var frontImage = document.createElement('img');
            frontImage.className = "front";
            frontImage.src = Game.images[Game.board.cardOrder[i]];
            cardElement.addEventListener('click', Game.board.flipCard);
            cardElement.appendChild(frontImage);
            cardElement.appendChild(backImage);
            document.getElementById('game-board').appendChild(cardElement);
            Game.board.cardElements.push(cardElement);
        }
        Game.timer.start();
    }

    Game.board.flipCard = function () {
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

    Game.completed = function () {
        Game.timer.stop();
        Game.checkIfHighScore();
        setTimeout(() => {
            Game.showModal('finished-modal');
        }, 1000);
    }

    Game.newGame = function () {
        Game.cardsFound = 0;
        Game.cardsFlipped = 0;
        Game.wrongMatches = 0;
        Game.updateWrongMatches();
        Game.timer.reset();
        Game.board.generateBoard();
    }

    // GAME OPERATIONS AND MODALS

    Game.start = function () {
        Game.newGame();
        document.getElementById('start-screen').style.display = "none";
        document.querySelector('.modal-background').style.display = "none";
        document.getElementById('game').style.display = "block";
    }

    Game.quit = function () {
        Game.newGame();
        document.getElementById('game').style.display = "none";
        document.querySelector('.modal-background').style.display = "none";
        document.getElementById('start-screen').style.display = "block";
    }

    Game.cancel = function () {
        document.querySelector('.modal-background').style.display = "none";
        Game.timer.start();
    }

    Game.savePreferences = function () {
        Game.setDifficulty();
        Game.setCardback();
        Game.newGame();
        document.querySelector('.modal-background').style.display = "none";
    }

    Game.showModal = function (modalElementID) {
        document.querySelector('.modal-background').style.display = "block";
        Game.timer.stop();
        var modals = document.querySelectorAll('.modal');
        for (var i = 0; i < modals.length; i++) {
            modals[i].style.display = "none";
        }
        document.getElementById(modalElementID).style.display = "block";
        switch (modalElementID) {
            case "finished-modal":
                document.querySelectorAll('#finished-modal span')[0].textContent = Game.wrongMatches;
                document.querySelectorAll('#finished-modal span')[1].textContent = Game.timer.returnTime();
                break;
            case "options-modal":
                Array.from(document.getElementsByName('difficulty')).filter((el) => el.value === Game.difficulty)[0].checked = true;
                Array.from(document.getElementsByName('cardback')).filter((el) => el.value === Game.cardback)[0].checked = true;
                break;
            case "high-scores-modal":
                Game.displayHighScores();

        };
        document.getElementById(modalElementID).style.display = "block";
    }

    Game.bindMenuActions = function () {
        document.getElementById('start').addEventListener('click', Game.start);
        var newGameButtons = document.getElementsByClassName('new-game-button');
        for (var i = 0; i < newGameButtons.length; i++) {
            newGameButtons[i].addEventListener('click', Game.start);
        }
        var quitButtons = document.getElementsByClassName('quit-button');
        for (var i = 0; i < quitButtons.length; i++) {
            quitButtons[i].addEventListener('click', Game.quit);
        }
        var cancelButtons = document.getElementsByClassName('cancel-button');
        for (var i = 0; i < cancelButtons.length; i++) {
            cancelButtons[i].addEventListener('click', Game.cancel);
        }
        var optionsButtons = document.getElementsByClassName('options-button');
        for (var i = 0; i < optionsButtons.length; i++) {
            optionsButtons[i].addEventListener('click', () => {
                Game.showModal('options-modal');
            })
        }
        var highScoreButton = document.getElementsByClassName('high-score-button')[0];
        highScoreButton.addEventListener('click', Game.recordHighScore);
        document.getElementsByClassName('save-button')[0].addEventListener('click', Game.savePreferences);
        document.getElementById('scores').addEventListener('click', () => {
            Game.showModal('high-scores-modal');
        });
    }

    Game.load = function () {
        Game.bindMenuActions();
        Game.generateCardbackOptions();
        Game.loadHighScores();
    }

    Game.load();
}

window.addEventListener('DOMContentLoaded', main);