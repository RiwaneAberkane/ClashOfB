import { Player } from "./interfaces/Player.model";
import { EnemyBase } from "./interfaces/EnemyBase.model";
const io = require("socket.io-client");

const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   const playerName = "player1";
//   socket.emit("join", playerName);
//   // const buildingType = "hotel de ville";
//   // socket.emit("upgradeBuilding", buildingType);
// });

// socket.on("joined", (player: Player) => {
//   console.log(`${player.name} just joined the game`);
//   console.log(`your base: ${JSON.stringify(player.base)}`);
//   console.log(`your ressources: ${player.ressources}`);

// });

// socket.on("playerJoined", (newPlayer: Player) => {
//   console.log(`${newPlayer.name} has joined the game.`);
// });

// socket.on("playerLeft", (playerId: string) => {
//   console.log(`Player with ID ${playerId} has left the game.`);
// });
// socket.on("ressourcesCollected", (ressources: number) => {
//   console.log(`you have ${ressources} gold`);
//   socket.emit("collectRessources");
// });

// socket.on(
//   "upgradeStarted",
//   (data: { buildingType: string; upgradeTime: number }) => {
//     console.log(
//       `Upgrade of ${data.buildingType} started . time remaining: ${data.upgradeTime} ms`
//     );
//   }
// );

// socket.on(
//   "upgradeFinished",
//   (data: { buildingType: string; level: number }) => {
//     console.log(`${data.buildingType} upgraded to ${data.level}`);
//   }
// );

// socket.on("upgradeInProgress", () => {
//   console.log("Building upgrade already in progress");
// });

// socket.on("maximumLevelReached", () => {
//   console.log("Building has reached the maximum level");
// });

// socket.on("buildingNotFound", () => {
//   console.log("Building not found");
// });

// socket.on("attackResult", (data: { enemyPlayerId: string; damage: number }) => {
//   console.log(`You attacked an enemy base.`);
//   console.log(`Damage dealt: ${data.damage}`);
// });

// socket.on("defendResult", (data: { attackerId: string; damage: number }) => {
//   console.log(`Your base was attacked by ${data.attackerId}.`);
//   console.log(`Damage received: ${data.damage}`);
// });

// socket.on("enemyBaseNotFound", () => {
//   console.log("Enemy base not found.");
// });

// function attackEnemyBase(enemyBaseId: string) {
//   socket.emit("attackEnemyBase", enemyBaseId);
// }
// const enemyBaseId = "enemyBase1"; // Replace with the ID of the enemy base you want to attack
// attackEnemyBase(enemyBaseId);
socket.on("connect", () => {
  const playerName = "Player1"; // Replace with the actual player name
  socket.emit("join", playerName);
});

socket.on("joined", (player: Player) => {
  console.log(`You joined the game as ${player.name}.`);
  console.log(`Your base:`, player.base);
  console.log(`Your resources: ${player.resources}`);
  getAvailableEnemies();
});

socket.on("playerJoined", (newPlayer: Player) => {
  console.log(`${newPlayer.name} has joined the game.`);
});

socket.on("playerLeft", (playerId: string) => {
  console.log(`Player with ID ${playerId} has left the game.`);
});

socket.on("attackResult", (data: { enemyPlayerId: string; damage: number }) => {
  console.log(`You attacked an enemy base.`);
  console.log(`Damage dealt: ${data.damage}`);
});

socket.on("defendResult", (data: { attackerId: string; damage: number }) => {
  console.log(`Your base was attacked by ${data.attackerId}.`);
  console.log(`Damage received: ${data.damage}`);
});

socket.on("enemyBaseNotFound", () => {
  console.log("Enemy base not found.");
});

socket.on("availableEnemies", (enemies: Player[]) => {
  console.log("Available enemies:");
  enemies.forEach((enemy) => {
    console.log(`ID: ${enemy.id}, Name: ${enemy.name}`);
  });
});

function getAvailableEnemies() {
  socket.emit("getAvailableEnemies");
}
function attackEnemyBase(enemyBaseId: string) {
  socket.emit("attackEnemyBase", enemyBaseId);
}

const enemyBaseId = "enemyBase1"; 
attackEnemyBase(enemyBaseId);
