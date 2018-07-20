/*jshint esversion: 6 */

const openCardList = [];
const totalCards = document.getElementsByClassName('card');
const matchedCards = document.getElementsByClassName('card match');
let t = 0;

//************************
/** *******Model
 * Static list that holds all of the cards
 * This list will be used to create cards on deck on page load
 */
//************************
let model = {
    moveCounter: 0,
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
    init: function(){
        deckHeaderView.init();
        cardListView.init();
    },

};
//************************
// *******Views
//************************

/**
 * This view keeps track of move counter and star rating update
 */
let deckHeaderView = {
    init: function(){
        this.move = document.getElementsByClassName('moves')[0];
        this.starList = document.getElementsByClassName('stars')[0];
				this.restartBtn = document.getElementsByClassName('restart')[0];
        this.render();
    },

    render: function(){
        this.starList.textContent='';
        this.move.textContent='';
        const fragment = document.createDocumentFragment();
        for(let i=1 ; i<=model.starCounter ;i++)
        {
            let elem    = document.createElement('li');
            let starIcon = document.createElement('i');
            starIcon.className = 'fa fa-star';
            elem.appendChild(starIcon);
            fragment.appendChild(elem);
        }
		this.starList.appendChild(fragment);//reflow and repaint here -- once!
		this.move.textContent = controller.getMove();

		this.restartBtn.addEventListener('click',restartGame,false);
    }
};

// This view display a message with the final score when all cards match
let modalPopupView = {
    init: function(){
		this.modal = document.getElementById('winning-modal');
		// Get the <span> element that closes the modal
		this.modalSpan = document.getElementsByClassName('close')[0];
		this.modalStar = document.getElementById('playStar');
		this.modalMoves = document.getElementById('playMoves');
		this.modalTime = document.getElementById('playerTime');
		this.gameTime = document.getElementsByClassName('time')[0];
		this.replayBtn = document.getElementById('replay');
        this.render();
    },

    render: function(){
		this.modalStar.textContent = controller.getStar();
		this.modalMoves.textContent = controller.getMove();
		this.modal.style.display = 'block';
		this.modalTime.textContent = this.gameTime.textContent;
		this.replayBtn.addEventListener('click',restartGame,false);

		// When the user clicks on <span> (x), close the modal
		this.modalSpan.addEventListener('click',function() {
			let modal = document.getElementById('winning-modal');
		    modal.style.display = 'none';
		},false);

		// When the user clicks anywhere outside of the modal, close it
		window.addEventListener('click',function(event) {
			let modal = document.getElementById('winning-modal');
		    if (event.target == modal) {
		        modal.style.display = 'none';
		    }
		},false);
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
        this.cardList = document.getElementsByClassName('deck')[0];
        this.cardDeck = document.getElementById('deck-board');
        this.render();
    },

    render: function(){
        this.cardList.textContent='';
        const cards = controller.getAllCards();
        const fragment = document.createDocumentFragment();
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
		this.cardList.addEventListener('click',
			function(event) {
				if(event.target === this) return;
				/**
				 * Check if the target is fa-icon then take the parent
				 * card as current card.
				 */
				const curr_card = (event.target.classList[0] === 'card')
									? event.target
									: event.target.parentElement;

				if(curr_card.classList[0] !== 'card') return;
				/**
				 * increment the timer by 1 sec at each sec of interval
				 * use 't' to clear the time interval event when user wins
				 * start the timer only when user clicks on card first time
				 */
				if(!t){
					t = window.setInterval(function() {
						let x = document.getElementsByClassName('time')[0].textContent;
						document.getElementsByClassName('time')[0].textContent
								= (parseInt(x, 10) + 1);
					}, 1000);
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

					//update moves and start on page
					controller.updateMove();
					controller.updateStar();
					if(prev_card && (prev_card.firstElementChild.classList[1]
						=== curr_card.firstElementChild.classList[1]))
					{
					  // if the cards do match,lock the cards in the open position
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
							return function mismatchCards() {
								for(const card of cards){
									card.classList.remove('open', 'show');
								}
							};
						}(curr_card,prev_card),500);
					}
				}
			},false);
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
	document.location.reload();
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


// Load the game page views once DOM is loaded
window.addEventListener('DOMContentLoaded',controller.init(),false);
