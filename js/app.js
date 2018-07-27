const openCardList = [];
const totalCards = document.getElementsByClassName('card');
const matchedCards = document.getElementsByClassName('card match');
const modal = document.querySelector('#winning-modal');
const infoModal = document.querySelector('#info-modal');
let players = [];
let t = 0;
let gameStart = false;
const sounds={
		start: "sounds/background96bps.mp3"
		, match: "sounds/match.wav"
		, mismatch: "sounds/mismatch.wav"
		, warning:"sounds/alert.wav"
		, finish:"sounds/finish.wav"
		, confirm:"sounds/confirm.wav"
};

let audioObj = {
  init: function() {
    Object.keys(sounds).forEach(function(key) {
			audioObj[key] = new Sound(sounds[key]);
    });
  }
};

//************************
/** *******Model
 * Static list that holds all of the cards
 * This list will be used to create cards on deck on page load
 */
//************************
let model = {
  moveCounter: 0,
  timeCounter: 0,
  starCounter: 3,
  cards : [
		'fa fa-diamond'
    ,'fa fa-paper-plane-o'
    ,'fa fa-anchor'
    ,'fa fa-bolt'
    ,'fa fa-cube'
    ,'fa fa-leaf'
    ,'fa fa-bicycle'
    ,'fa fa-bomb'    ]
};

model.cards = [...model.cards,...model.cards];

//************************
// *******Controller
//************************
const controller = {
  // Get the shuffled list od cards
  getAllCards: function(){
		return shuffle(model.cards);
  },

  // Get the user's start rating
  getStar: function(){
    return model.starCounter;
  },

  // Get the user's moves data
  getMove: function(){
    return model.moveCounter;
  },

  // Update user's moves data
  updateMove: function(){
    model.moveCounter++;
    deckHeaderView.render();
  },

  // Update user's star data
  updateStar: function(){
		if(model.moveCounter >10 && model.moveCounter <=16){
			model.starCounter = 2;
		}else if(model.moveCounter >16){
			model.starCounter = 1;
		}
    deckHeaderView.render();
  },

	// Reset the timer
	updateTimer: function() {
    model.timeCounter++;
    deckHeaderView.render();
	},

	// Reset the counters
	resetCounters: function() {
		model.timeCounter = 0;
		model.moveCounter = 0;
		model.starCounter = 3;
	},

	// Reset the timer
	getTimer: function() {
		return model.timeCounter;
	},

  init: function(){
		this.resetCounters();
    deckHeaderView.init();
    controlHeaderView.init();
    cardListView.init();
    audioObj.init();
  },

};
/**********************
 * *******Views********
 **********************/

// This view keeps track of move counter and star rating update
let deckHeaderView = {
  init: function(){
    this.move = document.getElementsByClassName('moves')[0];
    this.starList = document.getElementsByClassName('stars')[0];
		this.gameTime = document.getElementsByClassName('time')[0];
		this.restartBtn = document.getElementsByClassName('restart')[0];
    this.render();
  },

  render: function(){
    this.starList.textContent='';
    this.move.textContent='';
    this.gameTime.textContent='';
		this.restartBtn.removeEventListener('click',restartGame);
    const fragment = document.createDocumentFragment();
    for(let i=1 ; i<=model.starCounter ;i++)
    {
      let elem    = document.createElement('li');
      let starIcon = document.createElement('i');
      starIcon.className = 'fa fa-star';
      elem.appendChild(starIcon);
      fragment.appendChild(elem);
    }

		//reflow and repaint here -- once!
		this.starList.appendChild(fragment);
		this.move.textContent = controller.getMove();
		this.gameTime.textContent = controller.getTimer();
		this.restartBtn.addEventListener('click',restartGame,false);
  }
};

// This view keeps track of move counter and star rating update
let controlHeaderView = {
  init: function(){
    this.helpBtn = document.querySelector('.help');
    this.volumeBtn = document.querySelector('.music');
		this.playPauseBtn = document.querySelector('.pause-play');
		this.restartBtn = document.querySelector('.restart');
		this.modalSpan = document.querySelector('#info-modal .close');
    this.render();
  },

  render: function(){
		this.playPauseBtn.firstElementChild.classList.remove('hidden');
		this.playPauseBtn.lastElementChild.classList.add('hidden');
		this.volumeBtn.firstElementChild.classList.remove('hidden');
		this.volumeBtn.lastElementChild.classList.add('hidden');
		this.helpBtn.removeEventListener('click',this.launchInfo);
		this.volumeBtn.removeEventListener('click',this.volumeSetup);
		this.playPauseBtn.removeEventListener('click',this.gameTimer);
		this.restartBtn.removeEventListener('click',restartGame);
		this.modalSpan.removeEventListener('click',this.closePopup);

		// When the user clicks on info icon from control options, trigger this event
		this.launchInfo = (e) => {
			e.stopPropagation();
			infoModal.style.display = 'block';
		}

		// When the user clicks on play/pause icon, trigger this event
		this.gameTimer = (e) => {
			e.stopPropagation();
			updatePlayPauseControl();
			switch (e.target.classList[1]) {
				case "fa-play-circle":
					t ? gameTimer('continue'): gameTimer('start');
					break;
				case "fa-pause-circle":
					gameTimer('pause');
					break;
				default:
					break;
			}
		}

		// When the user clicks on volume icon, trigger this event
		this.volumeSetup = (e) => {
			e.stopPropagation();
			this.volumeBtn.firstElementChild.classList.toggle('hidden');
			this.volumeBtn.lastElementChild.classList.toggle('hidden');
			if(audioObj){
				switch (e.target.classList[1]) {
					case "fa-volume-up":
						audioObj.start.stop();
						break;
					case "fa-volume-off":
						audioObj.start.play();
						break;
					default:
						break;
				}
			}
		}

		// When the user clicks on <span> (x), close the modal
		this.closePopup = (e) => {
			e.stopPropagation();
			document.querySelector('#info-modal').style.display = 'none';
		}

		this.modalSpan.addEventListener('click',this.closePopup);
		this.helpBtn.addEventListener('click',this.launchInfo);
		this.volumeBtn.addEventListener('click',this.volumeSetup);
		this.playPauseBtn.addEventListener('click',this.gameTimer);
		this.restartBtn.addEventListener('click',restartGame);
  }
};

// This view display a message with the final score when all cards match
let modalPopupView = {
  init: function(){
		this.modal = document.getElementById('winning-modal');
		this.modalContent = document.querySelector('.modal-content');
		// Get the <span> element that closes the modal
		this.modalSpan = document.getElementsByClassName('close')[0];
		this.modalStar = document.getElementById('playStar');
		this.modalMoves = document.getElementById('playMoves');
		this.modalTime = document.getElementById('playerTime');
		this.gameTime = document.getElementsByClassName('time')[0];
		this.replayBtn = document.getElementById('replay');
		this.saveBtn = document.querySelector('#save-score');
    this.render();
  },

  render: function(){
		this.replayBtn.removeEventListener('click',restartGame);
		this.modalSpan.removeEventListener('click',modalClickHandler);
		this.modalContent.removeEventListener('click',modalContentClickHandler);
		this.saveBtn.removeEventListener('click',this.launchSaveScoreModal);
		this.modalStar.textContent = controller.getStar();
		this.modalMoves.textContent = controller.getMove();
		this.modal.style.display = 'block';
		this.modalTime.textContent = this.gameTime.textContent;
		this.replayBtn.addEventListener('click',restartGame,false);

		// When the user clicks on <span> (x), close the modal
		this.modalSpan.addEventListener('click',modalClickHandler,false);
		/**
		 * When the user clicks anywhere outside of the modal, close it
		 * See the third parameter passed as true
		 */
		window.addEventListener('click',modalClickHandler,false);
		this.modalContent.addEventListener('click',modalContentClickHandler,false);

		this.launchSaveScoreModal = (e) => {
			e.stopPropagation();
			saveScoreView.init();
		};
		this.saveBtn.addEventListener('click',this.launchSaveScoreModal,false);
  }
};

// This view display a message with the final score when all cards match
let saveScoreView = {
  init: function(){
    this.saveScoreModal = document.querySelector('#save-score-modal');
		this.modalSpan = document.querySelector('#save-score-modal .close');
		this.cancelBtn = document.querySelector('#cancel');
		this.saveBtn = document.querySelector('#save');
    this.render();
  },

  render: function(){
		this.modalSpan.removeEventListener('click',this.closePopup);
		this.saveBtn.removeEventListener('click',saveGame);
		this.saveScoreModal.style.display = 'block';

		// When the user clicks on <span> (x), close the modal
		this.closePopup = (e) => {
			e.stopPropagation();
			document.querySelector('#save-score-modal').style.display = 'none';
		}
		this.modalSpan.addEventListener('click',this.closePopup,false);
		this.saveBtn.addEventListener('click',saveGame,false);
		this.saveScoreModal.addEventListener('click',modalContentClickHandler,false);
  }
};

// This view shows the score board with all players
let leaderBoardView = {
  init: function(){
    this.leaderBoardModal = document.querySelector('#score-modal');
    this.playersList = document.querySelector('#score-modal form tbody');
		this.modalSpan = document.querySelector('#score-modal .close');
    this.render();
  },

  render: function(){
		this.playersList.textContent = '';
		this.leaderBoardModal.style.display = 'block';
		this.modalSpan.removeEventListener('click',this.closePopup);
    const fragment = document.createDocumentFragment();
    if(players){
			for(const player of players) {
				createPlayer(fragment,player);
			}
    }

		//reflow and repaint here -- once!
		this.playersList.appendChild(fragment);
		this.closePopup = (e) => {
			e.stopPropagation();
			document.querySelector('#score-modal').style.display = 'none';
		}
		this.modalSpan.addEventListener('click',this.closePopup);
  }
};

/**
 * This view display the cards on the page
 *   - shuffles the list of cards using the provided 'shuffle' method
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
let cardListView = {
  init: function(){
		this.leaderBoard = document.querySelector('#leader-board');
    this.cardList = document.getElementsByClassName('deck')[0];
    this.cardDeck = document.getElementById('deck-board');
    this.render();
  },

  render: function(){
    this.cardList.textContent='';
    const cards = controller.getAllCards();
    const fragment = document.createDocumentFragment();
		this.cardList.removeEventListener('click',restartGame);
		this.cardList.removeEventListener('click',handleCardClick);
		this.leaderBoard.removeEventListener('click',this.launchLeaderBoard);
    for(const card of cards)
    {
      let elem    = document.createElement('li');
      let cardIcon = document.createElement('i');
      elem.className = 'card';
      cardIcon.className = card;
      elem.appendChild(cardIcon);
      fragment.appendChild(elem);
    }

		// reflow and repaint here -- once!
		this.cardList.appendChild(fragment);

		// set up the event listener for a card. If a card is clicked:
		this.cardList.addEventListener('click',handleCardClick);

		this.launchLeaderBoard = (e) => {
			e.stopPropagation();
			let userConsent = true;
			userConsent =
			t ? (audioObj.confirm.play(),confirm("Your game will be reset. Do you want to continue?"))
				: userConsent ;
			if(userConsent){
				players = loadPlayers()
				audioObj.warning.play();
				leaderBoardView.init();
				restartGame();
			}
		};
		this.leaderBoard.addEventListener('click',this.launchLeaderBoard);
  }
};


//******************************//
//********Global Methods
//******************************//

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param:
 * 		array (data type: array): list of cards
 * @returns:
 * 		array (data type: array): shuffled list of cards
 */
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
 * Reload the page and start new game
 * @param:
 * 		None
 * @returns:
 * 		None
 */
function restartGame() {
  modal.style.display = 'none';

	if(t) gameTimer('stop');

	openCardList.length = 0;
	window.removeEventListener('click',modalClickHandler,false);
	controller.init();
}

/**
 * Chack if all cards match,
 * Stop the timer and
 * display a message with the final score
 * @param:
 * 		None
 * @returns:
 * 		None
 */
function checkGameStatus() {
	if (matchedCards.length == totalCards.length){
		window.clearInterval(t);
		audioObj.finish.play();
		modalPopupView.init();
	}
}

/**
 * Show the card's symbol
 * @param:
 * 		card (data type: array): event target card
 * @returns:
 * 		None
 */
function unhideCard(card) {
    card.classList.add('open', 'show');
}

/**
 * if the cards do match, lock the cards in the open position
 * and add match class for animation effect
 * @param:
 * 		...cards (data type: array): two cards of a given move
 * @returns:
 * 		None
 */
function matchCards(...cards) {
	for(const card of cards){
		card.classList.remove('open', 'show');
		card.classList.add('match');
	}
	checkGameStatus();
}

// Event handler for card click
function handleCardClick(event) {
	event.stopPropagation();
	if(event.target === this) return;
	/**
	 * Check if the target is fa-icon then take the parent
	 * card as current card.
	 */
	const curr_card = (event.target.classList[0] === 'card')
		? event.target: event.target.parentElement;

	if(curr_card.classList[0] !== 'card') return;
	/**
	 * increment the timer by 1 sec at each sec of interval
	 * use 't' to clear the time interval event when user wins
	 * start the timer only when user clicks on card first time
	 */
	if(!t){
		gameTimer('start');
		updatePlayPauseControl();
	}
	if(curr_card.classList[1] === 'match'){
		/**
		 * Check if user clicks the matched card, if so
		 * the don't trigger the default card click event
		 */
		event.preventDefault();
		return;
	}else if(document.querySelector('.mismatch')){
		/**
		 * Remove the mismatch class to avoid conflict with rotate
		 * animation when users flips the card by clicking on one of
		 * the mismatched card.
		 */
		let mismatchCardList
			= document.querySelectorAll('.mismatch');
		for(const card of mismatchCardList){
			card.classList.remove('mismatch');
		}
	}

// display the card's symbol ( using global unhide function)
unhideCard(curr_card);
	if(openCardList.length === 0){
		/**
		 * if the *list* of 'open' cards is empty,
		 * add the card to a *list* of 'open' cards
		 */
		openCardList.push(curr_card);
	}else{
		/**
		 * if the list already has another card, check to see if
		 * the two cards match
		 */
		const prev_card = openCardList.pop();
		if(prev_card === curr_card){
			openCardList.push(curr_card);
			return;
		}

		// update moves and start on page
		controller.updateMove();
		controller.updateStar();
		if(prev_card && (prev_card.firstElementChild.classList[1]
			=== curr_card.firstElementChild.classList[1]))
		{
			// if the cards do match,lock the cards in the open position
			audioObj.match.play();
			matchCards(curr_card,prev_card);
		}else{
		/**
		 * if the cards do not match, remove the cards from the
		 * list and hide the card's symbol
		 * Using setTimeout to delay the mismatch css efect on card
		 * so that animation related to flipping (which will be
		 * applied by unhide function) of the 2nd card
		 * of the move can be observed.
		 */
			setTimeout(function(...cards){
				/**
				 * if the cards do not match the do the following:
				 * 1. Add mismatch class for animation effect before hiding
				 * 2. Hide the card's symbol
				 * and we are using closures to have access to cards
				 */
				for(const card of cards){
					card.classList.add('mismatch');
				}
				audioObj.mismatch.play();
				return function mismatchCards() {
					for(const card of cards){
						card.classList.remove('open', 'show');
					}
				};
			}(curr_card,prev_card),500);
		}
	}
}

/**
 * Event handler to stop event regitered on window to close
 * modal popup when clicked outside modal window
 */
function modalContentClickHandler(e) {
	e.stopPropagation();
}

// Event handler to close modal popup
function modalClickHandler() {
  modal.style.display = 'none';
}

/**
 * This build up the table rows for each player to be
 * shown on the score board
 * @param:
 * 		fragment (data type: DOM Node): temporary DON Node to be inserted
 * 		player (data type: Object): player object with name and score
 * @returns:
 * 		fragment (data type: DOM Node)
 */
function createPlayer(fragment,player){
	let newRow = document.createElement('tr');
  let nameCol    = document.createElement('td');
  let nameInput = document.createElement('input');
  nameInput.type = "text";
  nameInput.name = "name";
  nameInput.disabled = true;
  nameInput.setAttribute('value',player.name);
  nameCol.appendChild(nameInput);
  newRow.appendChild(nameCol);

  let moveCol    = document.createElement('td');
  let moveInput = document.createElement('input');
  moveInput.type = "text";
  moveInput.name = "move";
  moveInput.disabled = true;
  moveInput.setAttribute('value',player.score.move);
  moveCol.appendChild(moveInput);
  newRow.appendChild(moveCol);

  let timeCol    = document.createElement('td');
  let timeInput = document.createElement('input');
  timeInput.type = "text";
  timeInput.name = "time";
  timeInput.disabled = true;
  timeInput.setAttribute('value',player.score.time);
  timeCol.appendChild(timeInput);
  newRow.appendChild(timeCol);

  let starCol    = document.createElement('td');
  let starInput = document.createElement('input');
  starInput.type = "text";
  starInput.name = "star";
  starInput.disabled = true;
  starInput.setAttribute('value',player.score.star);
  starCol.appendChild(starInput);
  newRow.appendChild(starCol);

  fragment.appendChild(newRow);

}

/**
 * Save the player object into browser's localStorage
 * @param:
 * 		None
 * @returns:
 * 		None
 */
function saveGame(e){
	e.stopPropagation();
	let regex = /[a-zA-Z]{3}/;
	let playerName = document.querySelector('#save-score-modal form input').value;
	let validName = regex.test(playerName)? true : false;
	if(validName) {
		let state = {'name': playerName,'score':{'move':controller.getMove()
							,'time':controller.getTimer()
							,'star':controller.getStar()}};
		players.push(state);
		localStorage.setItem("state",JSON.stringify(players));
		alert( "Score saved for " +playerName+ " successfully.");
		document.querySelector('#save-score-modal').style.display = 'none';
		window.setTimeout(function(){
			restartGame();
		},500)
	}else {
		alert("Invalid name " +playerName +"\n Must be alphabatic with minimum three characters");
	}
}

/**
 * Fetch the players from browser's localStorage
 * @param:
 * 		None
 * @returns:
 * 		(data type: array) Array of player object
 */
function loadPlayers(){
	let players;
	players = JSON.parse(localStorage.getItem('state'));

	// Sort the players as per the moves taken by them to finish the game
	if (players) {
		players.sort(function(a,b){
			return a.score.move - b.score.move;
		});
	}else {
		players = [];
	}
	return players;
}

/**
 * Set/update the timer based on input string
 * @param:
 * 		status (data type: String): String literals to start/stop/pause/continue
 * @returns:
 * 		None
 */
function gameTimer (status) {
  switch (status) {
    case "start":
      if (gameStart === false) {
        t = setInterval(callTimer, 1000);
        gameStart = true;
        if(document.querySelector('.fa-volume-up').classList.length === 3)
					audioObj.start.play();
      }
    break;

    case "pause":
      if (gameStart === true && t !== null) {
        clearInterval(t);
        gameStart = false;
      }
    break;

    case "continue":
      if (gameStart === false && t !== undefined && t !== null) {
        t = setInterval(callTimer, 1000);
        gameStart = true;
      }
    break;

    case "stop":
      if (t !== null) {
        clearInterval(t);
        t = null;
        gameStart = false;
      }
    break;
  }
}

/**
 * Invoke controller method to update timer
 * @param:
 * 		None
 * @returns:
 * 		None
 */
function callTimer() {
	controller.updateTimer();
}

function updatePlayPauseControl() {
	let playPauseBtn = document.querySelector('.pause-play')
	playPauseBtn.firstElementChild.classList.toggle('hidden');
	playPauseBtn.lastElementChild.classList.toggle('hidden');
}

class Sound {
	constructor(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
	}
}

// Load the game page views once DOM is loaded
window.addEventListener('DOMContentLoaded',controller.init(),false);

