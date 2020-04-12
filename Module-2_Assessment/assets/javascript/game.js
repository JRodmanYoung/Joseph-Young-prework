const sp = "\u00A0"  //needed because spaces in HTML must be nbsp's and not " "

const game = {
	
	guessWords: [`DRUMHEAD`,`PARADIDDLE`,`FLOOR${sp}TOM`,`BUDDY${sp}RICH`,
		`SNARE`,`BASS${sp}DRUM`,`ART${sp}BLAKEY`,`HI-HAT`,`CRASH${sp}RIDE`,
		`SPLASH`,`CYMBAL`,`FLAM${sp}ACCENT`, `DOUBLE${sp}STROKE${sp}ROLL`,
		`POLYRHYTHM`, `RATAMACUE`, `THOMAS${sp}LANG`, `DENNIS${sp}CHAMBERS`,
		`BONGOS`, `CONGAS`, `TIMBALES`, `TIMPANI`, `TRIANGLE`, `MARIMBA`,
		`I${sp}GOT${sp}A${sp}FEVER${sp}AND${sp}THE${sp}ONLY${sp}PERSCRIPTION${sp}IS${sp}MORE${sp}COWBELL`],
		
	guessesRemaining: 12,
	
	wins: 0,
	
	gameStatus: "unfinished",
	
	winAudio: new Audio("assets/audio/SoundSilk-rim-shot_01.mp3"),
	
	//used for picking the word; can't be inside of a function otherwise it will
	//change at every key press
	randVal: Math.random(),
	
	get secretWord() {
		return this.guessWords[Math.floor(this.guessWords.length*this.randVal)];
	},
	
	// check if a char is in the English alphabet
	isLetter: function(character) {
		return (character.length == 1 && !!character.match(/[a-z]/i));
	},
	
	// print word to page; if the word is hidden, then only print chars from the 
	// English alphabet.
	printWordToDocument: function(word, hidden = false) {

		let expandedWord = "";
		for (let i = 0; i < word.length; i++) {
			
			let currentChar = word.charAt(i);
			
			if (hidden) {
				if (this.isLetter(currentChar)) {
					expandedWord += "_&nbsp;";
				}
				else if (word.charAt(i) == "&nbsp;") {
					expandedWord += "&nbsp; ";
				}
				else {
					expandedWord += currentChar + " ";
				}
			}
			else {
				//ensure that there is not a line break in the middle of a word
				if (this.isLetter(word.charAt(i)) || word.charAt(i) == "_") {
					expandedWord += word.charAt(i) + "&nbsp;";
				}
				else {
					expandedWord += word.charAt(i) + " ";
				}
			}
		}
		document.getElementById("displayed-word").innerHTML = expandedWord;
	},

	//Get word from page, remove added white space
	getCurrentWord: function() {
		expandedWord = document.getElementById("displayed-word").innerText;
		newWord = "";
		for (let i = 0; i < expandedWord.length; i += 2) {
			newWord += expandedWord.charAt(i);
		}
		return newWord;
	},

	guessLetter: function(event) {
		if (this.isLetter(event.key) && this.gameStatus == "unfinished") {
			uKey = event.key.toUpperCase()
			let guessResult = "";
			for (let i = 0; i < this.secretWord.length; i++) {
				if (this.secretWord.charAt(i) == uKey) {
					guessResult += uKey;
				}
				else {
					guessResult += this.getCurrentWord().charAt(i);
				}
			}
			this.printWordToDocument(guessResult);
			guessedCharP = document.getElementById("guessed-letters");
			if (!this.secretWord.includes(uKey) && 
				!guessedCharP.innerText.includes(uKey)) {
				
				this.guessesRemaining--;
				document.getElementById("remaining-guesses").innerText = 
					this.guessesRemaining;
				guessedCharP.innerHTML  += uKey + "&nbsp;";
				document.getElementById("hangman-graphic").src = 
					`assets/images/hangman-${this.guessesRemaining}.png`
			}
			
			if (this.getCurrentWord() == this.secretWord) {
				document.getElementById("message").innerText = "Congratulations, " +
					"you won!"
				this.gameStatus= "won";
				document.getElementById("refresh-button").style.display = "block";
				this.winAudio.play();
			}
			else if (this.guessesRemaining == 0) {
				document.getElementById("message").innerText = "You didn't guess " +
					"the word. Try again?"
				this.gameStatus = "lost";
				document.getElementById("refresh-button").style.display = "block";
			}
		}
		
	},

	refresh: function() {
		this.randVal = Math.random();
		this.guessesRemaining = 12;
		document.getElementById("remaining-guesses").innerText = "12";
		document.getElementById("guessed-letters").innerText = "";
		
		if (this.gameStatus == "won") {
			this.wins++;
			document.getElementById("wins").innerText = this.wins;
		}
		this.printWordToDocument(this.secretWord, true);
		document.getElementById("refresh-button").style.display = "none";
		document.getElementById("message").innerText = "";
		this.gameStatus = "unfinished";
		document.getElementById("hangman-graphic").src = 
					`assets/images/hangman-${this.guessesRemaining}.png`
	}
}

document.addEventListener("keyup", game.guessLetter.bind(game)); //need to bind 'this' keyword to the game object and not the document
document.getElementById("refresh-button").addEventListener(
	"click", game.refresh.bind(game));

game.printWordToDocument(game.secretWord, true);