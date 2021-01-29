const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//Main game loop for computer guessing mode
async function gameLoop(rangeMax){
  //establish range variables and game state
  let rangeMin = 0;
  let gameState = 'start';
  let guesses = 0;
  //get secret number
  let secretNum = await ask("What's your number? ");
  secretNum = secretNum.trim();
  //ensure range is valid
  if(isNaN(+secretNum) || +secretNum <= rangeMin || +secretNum > rangeMax){
    console.log("That's not a valid number.");
    while(isNaN(+secretNum) || +secretNum <= rangeMin || +secretNum > rangeMax){
      secretNum = await ask("What's your number'? ");
      secretNum = secretNum.trim();
    }
  }
  //main loop
  while(gameState !== 'win'){
    //make guess and get response
    guesses++;
    let guessNum = Math.round((rangeMax - rangeMin) / 2) + rangeMin;
    let guessResponse = await ask("Is your number " + guessNum + "? (y/n): ");
    guessResponse = guessResponse.trim()[0].toLowerCase();
    //ensure response is valid
    if(!(guessResponse === 'y' || guessResponse === 'n')){
      console.log("Please enter y or n.");
      while(!(guessResponse === 'y' || guessResponse === 'n')){
        guessResponse = await ask("Is your number " + guessNum + "? (y/n): ");
        guessResponse = guessResponse.trim()[0].toLowerCase();
      }
    }
    //handle response
    switch(guessResponse){
      case 'y':
        if(guessNum !== +secretNum){
          console.log("You lied about your number! Lame!");
          process.exit();
        }
        gameState = 'win';
        break;
      case 'n':
        //determine higher or lower
        guessResponse = await ask("Is your number higher or lower than my guess? (h/l): ");
        guessResponse = guessResponse.trim()[0].toLowerCase();
        //ensure response is valid
        if(!(guessResponse === 'h' || guessResponse === 'l')){
          console.log("Please enter h or l.");
          while(!(guessResponse === 'h' || guessResponse === 'l')){
            guessResponse = await ask("Is your number higher or lower than my guess? (h/l): ");
            guessResponse = guessResponse.trim()[0].toLowerCase();
          }
        }
        //adjust ranges and test for cheating
        switch(guessResponse){
          case 'h':
            if(guessNum + 1 > rangeMax){
              cheater();
            }
            rangeMin = guessNum;
            break;
          case 'l':
            if(guessNum - 1 === rangeMin){
              cheater();
            }
            rangeMax = guessNum -1;
            break;
        }
        break;
    }
  }
  //Get play again decision and ensure it's valid
  let playAgain = await ask("I guessed your number! It took " + guesses + " guesses! Would you like to play again? (y/n): ");
  playAgain = playAgain.trim()[0].toLowerCase();
  if(!(playAgain === 'y' || playAgain === 'n')){
    console.log("Please enter y or n.");
    while(!(playAgain === 'y' || playAgain === 'n')){
      playAgain = await ask("I guessed your number! It took " + guesses + " guesses! Would you like to play again? (y/n): ");
      playAgain = playAgain.trim()[0].toLowerCase();
    }
  }
  //close program or re call start function based on play again response
  switch(playAgain){
    case 'n':
      console.log("Goodbye!");
      process.exit();
    case 'y':
      start();
  }
}

//Main game loop for player guessing mode
async function gameLoopInv(rangeMax){
  //choose a secret number and set up tracking variables
  let secretNum = Math.round(Math.random() * (rangeMax - 1)) + 1;
  let playerGuess = 0;
  let guesses = 0;
  console.log("I've picked a secret number!");
  //guessing loop
  while(playerGuess !== secretNum){
    guesses++;
    //get input and ensure it's valid
    let playerInput = await ask("What do you think my number is? ");
    playerInput = playerInput.trim();
    while(isNaN(+playerInput)){
      playerInput = await ask("That's not a number! Guess seriously please! ");
      playerInput = playerInput.trim();
    }
    playerGuess = +playerInput;
    //compare player guess to secret number
    if(playerGuess < secretNum){
      console.log("Nope! My number is higher than that!");
    }else if(playerGuess > secretNum){
      console.log("Nope! My number is smaller than that!");
    }
  }
  //Get play again decision and ensure it's valid
  let playAgain = await ask("You guessed my number! It took " + guesses + " guesses! Would you like to play again? (y/n): ");
  playAgain = playAgain.trim()[0].toLowerCase();
  if(!(playAgain === 'y' || playAgain === 'n')){
    console.log("Please enter y or n.");
    while(!(playAgain === 'y' || playAgain === 'n')){
      playAgain = await ask("You guessed my number! It took " + guesses + " guesses! Would you like to play again? (y/n): ");
      playAgain = playAgain.trim()[0].toLowerCase();
    }
  }
  //close program or re call start function based on play again response
  switch(playAgain){
    case 'n':
      console.log("Goodbye!");
      process.exit();
    case 'y':
      start();
  }
}

function cheater(){
  console.log("That's not a valid response! I don't want to play with a cheater!");
  process.exit();
}

//Start game function
async function start() {
  //get range for game
  let rangeInput = await ask("What should the largest valid number be? ");
  rangeInput = rangeInput.trim();
  //ensure range is valid
  if(isNaN(+rangeInput) || +rangeInput < 2){
    console.log("That's not a valid number.");
    while(isNaN(+rangeInput) || +rangeInput < 2){
      rangeInput = await ask("What should the largest valid number be? ");
      rangeInput = rangeInput.trim();
    }
  }
  //determine which type of game to play
  let gameType = await ask("Would you like to choose a number? (y/n): ");
  gameType = gameType.trim()[0].toLowerCase();
  //ensure answer is valid
  if(!(gameType === 'y' || gameType === 'n')){
    console.log("Please enter y or n.");
    while(!(gameType === 'y' || gameType === 'n')){
      gameType = await ask("Would you like to choose a number? (y/n): ");
      gameType = gameType.trim()[0].toLowerCase();
    }
  }
  //start appropriate game type
  console.log("Let's begin!");
  switch(gameType){
    case 'y':
      gameLoop(+rangeInput);
      break;
    case 'n':
      gameLoopInv(+rangeInput);
      break;
  }
}

//Begin program here
console.log("Let's play a number guessing game.");
start();