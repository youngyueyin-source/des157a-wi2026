(function () {
    'use strict';

    console.log('running js');

    //these load sound effects so they can be triggered during the game
    const dealSound = new Audio('sounds/deal-card.wav');
    const brewSound = new Audio('sounds/brewing.wav');
    const victorySound = new Audio('sounds/victory.wav');
    //this plays when the potion shatters (double ones)
const glassBreakSound = new Audio('sounds/broken-glass.wav');

    //main control buttons
    const rollBtn = document.querySelector('#roll-btn');
    const holdBtn = document.querySelector('#hold-btn');
    const playAgainBtn = document.querySelector('#play-again-btn');

    //this lets me change the page color when the player hovers over buttons
    const bodyTag = document.querySelector('body');

    //this selects the player one heading so i can replace it with the user's name from the start screen
    const playerOneNameHeading = document.querySelector('#player-one-name');

    //these grab the score elements so i can update the numbers during the game
    const scoreOne = document.querySelector('#score-one');
    const scoreTwo = document.querySelector('#score-two');

    //these are the 4 leaf clover icons that indicate whose turn it currently is
    const cloverOne = document.querySelector('#clover-one');
    const cloverTwo = document.querySelector('#clover-two');

    //this is the text above the cards that shows whose turn it is
    const turnMessage = document.querySelector('#turn-message');

    //this is the message under the cards that explains what happened each round
    const roundMessage = document.querySelector('#round-message');

    //this selects the header rule text so i can hide it when someone wins
    const headerRule = document.querySelector('#header-rule');

    //these are the two card display areas in the center of the board
    const dieOne = document.querySelector('#die-one');
    const dieTwo = document.querySelector('#die-two');

    //this array stores the symbols that represent values 1–6
    const diceFaces = ['☘︎', '🀣', '🀦', '🀧', '🀨', '🀥'];

    //here i get the player's name from session storage
    //if the player didn't enter a name, it defaults to "Player One"
    const savedName = sessionStorage.getItem('playerOneName') || 'Junior Alchemist';

    //this updates the heading on the page with the player's actual name
    playerOneNameHeading.textContent = savedName;

    //this object stores all the important game data
    const gameData = {

        //these are the names used when displaying turns and win messages
        players: [savedName, 'Rival Alchemist'],

        //stores each player's total score
        scores: [0, 0],

        //keeps track of the points gained during the current turn
        roundScore: 0,

        //this tracks whose turn it currently is
        //0 = player one, 1 = rival alchemist
        currentPlayer: 0,

        //once someone reaches 50 points they win
        gameEnd: 50,

        //stops the game once a winner is declared
        gameOver: false
    };

    //when the player hovers over the reveal button it change the background color
    rollBtn.addEventListener('mouseover', function () {
        bodyTag.className = 'pagecolor2';
    });

    //when the mouse leaves the reveal button, return the page to the normal color
    rollBtn.addEventListener('mouseout', function () {
        bodyTag.className = 'pagecolor1';
    });

    //when hovering the hold button, switches the page to the red background
    holdBtn.addEventListener('mouseover', function () {
        bodyTag.className = 'pagecolor3';
    });

    //when leaving the hold button it switches it back
    holdBtn.addEventListener('mouseout', function () {
        bodyTag.className = 'pagecolor1';
    });

    //if the player clicks play again it reloads the page to restart the game
    playAgainBtn.addEventListener('click', function () {
        location.reload();
    });

    //these listeners connect the buttons to the main game actions
    rollBtn.addEventListener('click', handleRoll);
    holdBtn.addEventListener('click', handleHold);

    //initializes the board so scores, bottles, and turn indicators display correctly
    updateBoard();

    function handleRoll() {

        //if the game is already over, stop the functions from doing anything
        if (gameData.gameOver) {
            return;
        }

        //plays the deal card sound every time the reveal card button is clicked
        dealSound.currentTime = 0;
        dealSound.play();

        //generates two random numbers between 1 and 6
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;

        //this adds the two revealed card values together
        const rollSum = roll1 + roll2;

        //updates the card display so the player can see what was revealed
        dieOne.textContent = diceFaces[roll1 - 1];
        dieTwo.textContent = diceFaces[roll2 - 1];

        //this checks for the worst possible outcome: double ones
        //in my theme this means two clovers which destroys the potion
        if (roll1 === 1 && roll2 === 1) {

            //plays the glass shattering sound when player rolls double ones and the potion breaks
            glassBreakSound.currentTime = 0;
            glassBreakSound.play();

            //the player's total score resets to zero because of rolling double ones
            gameData.scores[gameData.currentPlayer] = 0;
            gameData.roundScore = 0;

            //this updates the visual score and potion bottle
            updateScores();
            updateBottleFill();

            //shows a message explaining what happened
            roundMessage.textContent = 'How unlucky! Your potion shattered and your total score reset to 0.';

            //then switch turns
            switchPlayer();
            return;
        }

        //if only one of the cards is a 1, the turn ends but the total score stays the same
        if (roll1 === 1 || roll2 === 1) {

            //the temporary round score resets
            gameData.roundScore = 0;

            //shows a message explaining the unlucky reveal
            roundMessage.textContent = 'Oh no! You revealed a three-leaf clover, hence your turn ends.';

            //switch to the other player's turn
            switchPlayer();
            return;
        }

        //if neither card is a 1, the game continues
        //the sum of the two cards is added to the current round score
        gameData.roundScore += rollSum;

        //this displays what cards were revealed and the current brew amount
        roundMessage.innerHTML = `You revealed a ${roll1} and ${roll2}.<br>Current brew this turn: ${gameData.roundScore}`;
    }

    function handleHold() {

        //again i prevent actions if the game is already finished
        if (gameData.gameOver) {
            return;
        }

        //this plays a brewing sound when the player holds and banks their points
        brewSound.currentTime = 0;
        brewSound.play();

        //the player banks their round score into their total score
        gameData.scores[gameData.currentPlayer] += gameData.roundScore;

        //reset the temporary score
        gameData.roundScore = 0;

        //this updates the visible scores and potion fill
        updateScores();
        updateBottleFill();

        //this checks if this move created a winner
        if (checkWinner()) {
            return;
        }

        //updates the message and passes the turn
        roundMessage.textContent = 'You held your brew score. Next player\'s turn.';
        switchPlayer();
    }

    function switchPlayer() {

        //this switches between player 0 and player 1
        gameData.currentPlayer = gameData.currentPlayer === 0 ? 1 : 0;

        //reset the round score when the turn changes
        gameData.roundScore = 0;

        //updates the turn message and clover indicator
        updateTurnDisplay();
    }

    function updateScores() {

        //updates the score numbers on screen
        scoreOne.textContent = gameData.scores[0];
        scoreTwo.textContent = gameData.scores[1];
    }

    function updateTurnDisplay() {

        //updates the text showing whose turn it is
        //made the the player's name to uppercase so it stands out more
        turnMessage.textContent = `${gameData.players[gameData.currentPlayer].toUpperCase()}'S TURN`;

        //this moves the clover indicator to the correct player
        if (gameData.currentPlayer === 0) {
            cloverOne.classList.add('active-turn');
            cloverTwo.classList.remove('active-turn');
        } else {
            cloverOne.classList.remove('active-turn');
            cloverTwo.classList.add('active-turn');
        }
    }

    function updateBottleFill() {

        //this selects both potion bottles
        const bottleOne = document.querySelector('#bottle-one');
        const bottleTwo = document.querySelector('#bottle-two');

        //resets their classes before applying the correct fill level
        bottleOne.className = 'bottle';
        bottleTwo.className = 'bottle';

        //this adds the fill class based on each player's score
        bottleOne.classList.add(getFillClass(gameData.scores[0]));
        bottleTwo.classList.add(getFillClass(gameData.scores[1]));
    }

    function getFillClass(score) {

        if (score >= 50) return 'fill-50';
        if (score >= 45) return 'fill-45';
        if (score >= 40) return 'fill-40';
        if (score >= 35) return 'fill-35';
        if (score >= 30) return 'fill-30';
        if (score >= 25) return 'fill-25';
        if (score >= 20) return 'fill-20';
        if (score >= 15) return 'fill-15';
        if (score >= 10) return 'fill-10';
        if (score >= 5) return 'fill-5';

        return 'fill-0';
    }

    function checkWinner() {

        //checks if the current player reached the winning score
        if (gameData.scores[gameData.currentPlayer] >= gameData.gameEnd) {

            //plays the victory fanfare sound when someone wins
            victorySound.currentTime = 0;
            victorySound.play();

            const winningBottle = document.querySelector(
            gameData.currentPlayer === 0 ? '#bottle-one' : '#bottle-two'
        );

winningBottle.classList.add('potion-win');

            //updates the text to show the winner
            turnMessage.innerHTML = `HUZZAH!<br>${gameData.players[gameData.currentPlayer].toUpperCase()} TRIUMPHS!`;
            roundMessage.textContent = `${gameData.players[gameData.currentPlayer]} reached ${gameData.scores[gameData.currentPlayer]} points.`;

            //hides the rule text in the header once the game is over cause it looked too busy
            headerRule.style.visibility = 'hidden';

            //stops further gameplay
            gameData.gameOver = true;

            //disables buttons so the player cannot continue
            rollBtn.disabled = true;
            holdBtn.disabled = true;

            //shows the play again button
            playAgainBtn.style.display = 'inline-block';

            return true;
        }

        return false;
    }

    function updateBoard() {

        //updates all visible game elements when the page first loads
        updateScores();
        updateBottleFill();
        updateTurnDisplay();
    }

})();