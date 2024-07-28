class Player {
  constructor(name, health, strength, attack) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.attack = attack;
  }

  rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }
}

function updateHealth(player, elementId) {
  document.getElementById(elementId).textContent = player.health;
}

function logMessage(message) {
  document.getElementById('message').textContent = message;
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

const playerA = new Player('Player A', 50, 5, 10);
const playerB = new Player('Player B', 100, 10, 5);

document.getElementById('startMatch').addEventListener('click', () => {
  let attacker = playerA.health <= playerB.health ? playerA : playerB;
  let defender = attacker === playerA ? playerB : playerA;

  const interval = setInterval(() => {
    if (playerA.health > 0 && playerB.health > 0) {
      let attackRoll = attacker.rollDie();
      let defendRoll = defender.rollDie();

      let attackDamage = attacker.attack * attackRoll;
      let defense = defender.strength * defendRoll;
      let damage = attackDamage - defense;

      if (damage > 0) {
        defender.health -= damage;
        if (defender.health < 0) defender.health = 0;
      }

      updateHealth(playerA, 'healthA');
      updateHealth(playerB, 'healthB');

      logMessage(`${attacker.name} attacks ${defender.name}! ${attacker.name} rolls ${attackRoll} and ${defender.name} rolls ${defendRoll}. ${defender.name} takes ${damage} damage.`);

      if (defender.health === 0) {
        logMessage(`${defender.name} has been defeated! ${attacker.name} wins!`);
        clearInterval(interval);
      }

      [attacker, defender] = [defender, attacker];
    }
  }, 1000);
});

document.getElementById('updateStats').addEventListener('click', updateStats);
