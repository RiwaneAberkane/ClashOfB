// src/client2.ts
import { Player } from "./interfaces/Player.model";
const io = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  const playerName = "Player2"; // Replace with the actual player name
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

  // Attack a random enemy base (for testing purposes)
  if (enemies.length > 0) {
    const randomIndex = Math.floor(Math.random() * enemies.length);
    attackEnemyBase(enemies[randomIndex].id);
  }
});

// Function to get available enemy bases
function getAvailableEnemies() {
  socket.emit("getAvailableEnemies");
}

// Function to attack an enemy base
function attackEnemyBase(enemyBaseId: string) {
  socket.emit("attackEnemyBase", enemyBaseId);
}
