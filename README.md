# Memory Game Project
The Memory Game Project is all about demonstrating your mastery of HTML, CSS, and JavaScript. You’ll build a complete browser-based card matching game (also known as Concentration). But this isn’t just any memory game! It’s a shnazzy, well-designed, feature-packed memory game!

## Table of Contents

* [How The Game Works](#how-the-game-works)
* [Working GitHub page](#working-github-page)
* [Learn About Folder Structure](#learn-about-folder-structure)
* [Prerequisites](#prerequisites)
* [How to launch the app locally](#how-to-launch-the-app-locally)
* [Resources](#resources)
* [Authors](#authors)
* [Acknowledgments](#acknowledgments)

## How The Game Works
The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

Each turn:

- The player flips one card over to reveal its underlying symbol.
- The player then turns over a second card, trying to find the corresponding card with the same symbol.
- If the cards match, both cards stay flipped over.
- If the cards do not match, both cards are flipped face down.
- The game ends once all cards have been correctly matched.

Game Displays below stats
- Star Rating: The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it displays at least 3 stars. After 10 number of moves, it changes to a lower star rating(down to 2). After a few more moves(from 17 and above), it changes to a even lower star rating (down to 1).
- Moves: Displays the current number of moves a user has made.
- Time: Displays the time elapsed.
- Restart: User can restart game any time.
- Congratulations Popup: When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It also tell the user how much time it took to win the game, and what the star rating was.

## Working GitHub page
https://gauravsinghaec.github.io/FEND_memory_game/

## Learn About Folder Structure
```
Note : The folder structure may changes i.e we may include/exclude some folders/files
as project progresses but the overall sructure will remain as presented below:
```
* index.html 	-- Project main file
* css
  - app.css   	-- CSS for our project
* img  			-- Images for project
* scss
  - app.scss 	-- CSS preprocessor
* js
  - app.js   	-- CSS for our project
* gulpfile.js  	-- This is a task runner to launch app and monitor for file(html,scss,css,js) changes.
* package.json -- Project dev dependencies (for Grunt and Gulp)

[What is gulp?](https://gulpjs.com/)


## Prerequisites
* HTML5, CSS3, JavaScript, DOM, ES6

## How to launch the app locally?
* Step1 -- Fork the project repo and clone it in your local directory
* Step2 -- Open the index.html in your browser and start playing the game.

### Installation (for running using gulp and browsersync)
* Step1 -- Install the node and npm

* Step2 -- Install the npm modules from the package.json
```
>>> npm install
this command installs all the node related packages required to run the app locally in
/node_modules folder. You can see this folder inside /FEND_portfolio folder after running npm install
```

* Step3 -- Launch the application using below command:
```
Below command will run gulpfile.js and start the static project locally
>>> npm install -g gulp
>>> gulp
The application will be running at http://localhost:3000 URL
```

## Resources
- [Download audio from Freesound](https://freesound.org/browse/)
- [Online audio cutter Audiotrimmer](https://audiotrimmer.com/online-mp3-converter/)
- [HTML5 Audio/Video elements](https://www.w3schools.com/tags/ref_av_dom.asp)
- [Collision Detection bubbles from d3js](https://bl.ocks.org/mbostock/3231298)
- [Game Timer - Start, Pause, Stop](https://stackoverflow.com/questions/9769585/game-timer-start-pause-stop)
- [Event Flow](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
- [Event Order](https://www.quirksmode.org/js/events_order.html#link4)
- [How to create a multiple values for a single key using local storage?](https://stackoverflow.com/questions/24544861/how-to-create-a-multiple-values-for-a-single-key-using-local-storage)

## Authors
* **Gaurav Singh**

## Acknowledgments
* **Special thanks to Udacity Team**

