import { Player } from "./interfaces/Player.model";
import { EnemyBase } from "./interfaces/EnemyBase.model";
const io = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  const playerName = "player1";
  socket.emit("join", playerName);
  const playerName2 = "player2";
  socket.emit("join", playerName2);
  const enemyBaseId = "1";
  attackEnemyBase(enemyBaseId);
  const buildingType = "hotel de ville";
  // socket.emit("upgradeBuilding", buildingType);
});

socket.on("joined", (player: Player) => {
  console.log(`${player.name} just joined the game`);
  console.log(`your base: ${JSON.stringify(player.base)}`);
  console.log(`your ressources: ${player.ressources}`);
});

socket.on("ressourcesCollected", (ressources: number) => {
  console.log(`you have ${ressources} gold`);
  socket.emit("collectRessources");
});

socket.on(
  "upgradeStarted",
  (data: { buildingType: string; upgradeTime: number }) => {
    console.log(
      `Upgrade of ${data.buildingType} started . time remaining: ${data.upgradeTime} ms`
    );
  }
);

socket.on(
  "upgradeFinished",
  (data: { buildingType: string; level: number }) => {
    console.log(`${data.buildingType} upgraded to ${data.level}`);
  }
);

socket.on("upgradeInProgress", () => {
  console.log("Building upgrade already in progress");
});

socket.on("maximumLevelReached", () => {
  console.log("Building has reached the maximum level");
});

socket.on("buildingNotFound", () => {
  console.log("Building not found");
});

socket.on(
  "enemyBaseAttacked",
  (data: {
    stolenGold: number;
    stolenElixir: number;
    enemyBase: EnemyBase;
  }) => {
    console.log(`You attacked an enemy base`);
    console.log(
      `Stolen ressources: Gold - ${data.stolenGold}, Elixir - ${data.stolenElixir}`
    );
    console.log(`Ennemy base after attack: ${data.enemyBase}`);
  }
);

socket.on("attackResult", (data: { enemyPlayerId: string; damage: number }) => {
  console.log(`You attacked an enemy base`);
  console.log(`Damage dealt: ${data.damage}`);
});

socket.on("defendResult", (data: { attackerId: string; damage: number }) => {
  console.log(`Your base was attacked by ${data.attackerId}`);
  console.log(`Damage receive: ${data.damage}`);
});

function attackEnemyBase(enemyBaseId: string) {
  socket.emit("attackEnemyBase", enemyBaseId);
}
