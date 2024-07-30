class Player {
  constructor(name, health, strength, attack) {
    this.name = name;
    this.originalHealth = health;
    this.originalStrength = strength;
    this.originalAttack = attack;
    this.health = health;
    this.strength = strength;
    this.attack = attack;
    this.attackRoll = 0;
    this.defenseRoll = 0;
  }

  rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  reset() {
    this.health = this.originalHealth;
    this.strength = this.originalStrength;
    this.attack = this.originalAttack;
  }
}

function updateHealth(player, elementId) {
  document.getElementById(elementId).textContent = player.health;
}

function logMessage(message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
}

function updateStats() {
  playerA.health = parseInt(document.getElementById('healthAInput').value);
  playerA.strength = parseInt(document.getElementById('strengthAInput').value);
  playerA.attack = parseInt(document.getElementById('attackAInput').value);

  playerB.health = parseInt(document.getElementById('healthBInput').value);
  playerB.strength = parseInt(document.getElementById('strengthBInput').value);
  playerB.attack = parseInt(document.getElementById('attackBInput').value);

  updateHealth(playerA, 'healthA');
  document.getElementById('strengthA').textContent = playerA.strength;
  document.getElementById('attackA').textContent = playerA.attack;

  updateHealth(playerB, 'healthB');
  document.getElementById('strengthB').textContent = playerB.strength;
  document.getElementById('attackB').textContent = playerB.attack;
}

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  sound.currentTime = 0; // Rewind to the start
  sound.play();
}

const playerA = new Player('Player A', 50, 5, 10);
const playerB = new Player('Player B', 50, 5,10);

let currentTurn = 'attack'; // Tracks the current turn state
let currentAttacker = playerA;
let currentDefender = playerB;

function resetStats() {
  playerA.reset();
  playerB.reset();
  updateHealth(playerA, 'healthA');
  document.getElementById('strengthA').textContent = playerA.strength;
  document.getElementById('attackA').textContent = playerA.attack;
  updateHealth(playerB, 'healthB');
  document.getElementById('strengthB').textContent = playerB.strength;
  document.getElementById('attackB').textContent = playerB.attack;
}

document.getElementById('startMatch').addEventListener('click', () => {
  resetStats(); // Reset stats when starting a new match
  resetDiceImages();
  currentTurn = 'attack';
  currentAttacker = playerA.health <= playerB.health ? playerA : playerB;
  currentDefender = currentAttacker === playerA ? playerB : playerA;

  enableDice(currentAttacker, 'attack');
  disableDice(currentDefender);

  logMessage(`${currentAttacker.name} attacks first!`);
});

document.getElementById('attackDiceA').addEventListener('click', () => {
  if (currentTurn === 'attack' && currentAttacker === playerA) {
    playSound('rollSound'); // Play sound
    playerA.attackRoll = playerA.rollDie();
    logMessage(`Player A rolls attack dice: ${playerA.attackRoll}`);
    displayDiceRoll('attackDiceA', playerA.attackRoll);
    disableDice(playerA);
    enableDice(playerB, 'defense');
    currentTurn = 'defense';
  }
});

document.getElementById('defenseDiceA').addEventListener('click', () => {
  if (currentTurn === 'defense' && currentDefender === playerA) {
    playSound('rollSound'); // Play sound
    playerA.defenseRoll = playerA.rollDie();
    logMessage(`Player A rolls defense dice: ${playerA.defenseRoll}`);
    displayDiceRoll('defenseDiceA', playerA.defenseRoll);
    disableDice(playerA);
    executeTurn();
  }
});

document.getElementById('attackDiceB').addEventListener('click', () => {
  if (currentTurn === 'attack' && currentAttacker === playerB) {
    playSound('rollSound'); // Play sound
    playerB.attackRoll = playerB.rollDie();
    logMessage(`Player B rolls attack dice: ${playerB.attackRoll}`);
    displayDiceRoll('attackDiceB', playerB.attackRoll);
    disableDice(playerB);
    enableDice(playerA, 'defense');
    currentTurn = 'defense';
  }
});

document.getElementById('defenseDiceB').addEventListener('click', () => {
  if (currentTurn === 'defense' && currentDefender === playerB) {
    playSound('rollSound'); // Play sound
    playerB.defenseRoll = playerB.rollDie();
    logMessage(`Player B rolls defense dice: ${playerB.defenseRoll}`);
    displayDiceRoll('defenseDiceB', playerB.defenseRoll);
    disableDice(playerB);
    executeTurn();
  }
});

function displayDiceRoll(diceId, rollResult) {
  const diceImage = document.getElementById(diceId);
  diceImage.src = `images/dice${rollResult}.png`;
}

function showReductionMessage(player, damage) {
  const messageElement = document.getElementById(player === playerA ? 'reductionMessageA' : 'reductionMessageB');
  if (damage > 0) {
    messageElement.textContent = `-${damage} HP`;
  } else {
    messageElement.textContent = "No damage";
  }
  messageElement.style.display = 'block';

  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 2000); // Hide the message after 2 seconds
}

function executeTurn() {
  let attackDamage = currentAttacker.attack * currentAttacker.attackRoll;
  let defenseDamage = currentDefender.strength * currentDefender.defenseRoll;
  let netDamage = attackDamage - defenseDamage;

  if (netDamage > 0) {
    currentDefender.health -= netDamage;
    updateHealth(currentDefender, currentDefender === playerA ? 'healthA' : 'healthB');
  }

  showReductionMessage(currentDefender, netDamage);

  logMessage(`${currentAttacker.name} dealt ${netDamage > 0 ? netDamage : 0} damage to ${currentDefender.name}`);

  if (currentDefender.health <= 0) {
    logMessage(`${currentDefender.name} is defeated! ${currentAttacker.name} wins!`);
    disableDice(currentAttacker);
    disableDice(currentDefender);
    return;
  }

  currentTurn = 'attack';
  [currentAttacker, currentDefender] = [currentDefender, currentAttacker];

  enableDice(currentAttacker, 'attack');
  disableDice(currentDefender);
}

function enableDice(player, type) {
  const diceId = type === 'attack' ? 'attackDice' : 'defenseDice';
  document.getElementById(`${diceId}${player === playerA ? 'A' : 'B'}`).classList.remove('disabled');
}

function disableDice(player) {
  document.getElementById(`attackDice${player === playerA ? 'A' : 'B'}`).classList.add('disabled');
  document.getElementById(`defenseDice${player === playerA ? 'A' : 'B'}`).classList.add('disabled');
}

function resetDiceImages() {
  document.getElementById('attackDiceA').src = 'images/dice1.png';
  document.getElementById('defenseDiceA').src = 'images/dice1.png';
  document.getElementById('attackDiceB').src = 'images/dice1.png';
  document.getElementById('defenseDiceB').src = 'images/dice1.png';
}

document.getElementById('toggleCustomize').addEventListener('click', () => {
  const customizeDiv = document.getElementById('customizeDiv');
  customizeDiv.style.display = customizeDiv.style.display === 'none' ? 'block' : 'none';

  if (customizeDiv.style.display === 'block') {
    customizeDiv.scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('updateStats').addEventListener('click', updateStats);

document.getElementById('toggleInstructions').addEventListener('click', () => {
    const instructionsDiv = document.getElementById('instructionsDiv');
    instructionsDiv.style.display = instructionsDiv.style.display === 'none' ? 'block' : 'none';

    if (instructionsDiv.style.display === 'block') {
        instructionsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
