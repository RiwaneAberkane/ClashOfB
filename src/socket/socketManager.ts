import socketio from "socket.io";
import { Server } from "http";
import { Player } from "../interfaces/Player.model";
import { Base } from "../interfaces/Base.model";

const players: { [key: string]: Player } = {};
const startingGold: number = 1000;
const statingElixir = 1000;
const buildingUpgrade = 30000;

export function initializeSocket(io: socketio.Server, server: Server) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (name: string) => {
      const newBase: Base = {
        buildings: [{ type: "Town Hall", level: 1 }],
      };

      const newPlayer: Player = {
        id: socket.id,
        name: name,
        resources: startingGold,
        base: newBase,
      };

      players[socket.id] = newPlayer;
      console.log(`${name} joined the game.`);

      socket.emit("joined", newPlayer);
      io.emit("playerJoined", newPlayer);
    });

    socket.on("getAvailableEnemies", () => {
      const availableEnemies = Object.values(players).filter(
        (player) => player.id !== socket.id
      );
      socket.emit("availableEnemies", availableEnemies);
    });

    socket.on("collectRessources", () => {
      const player = players[socket.id];
      if (player) {
        const ressourcesAmount = 100;
        player.resources += ressourcesAmount;
        console.log(
          `${player.name} is ${ressourcesAmount} richer with ${player.resources} gold`
        );
        socket.emit("ressourcesCollected", player.resources);
      }
    });

    socket.on("upgradeBuilding", (buildingType: string) => {
      const player = players[socket.id];
      console.log(players);

      if (player) {
        const building = player.base.buildings.find(
          (building) => building.type === buildingType
        );
        if (building) {
          if (building.level < 3) {
            if (!building.upgradeTime) {
              building.upgradeTime = buildingUpgrade;
              console.log(`${player.name} started upgrading ${buildingType}`);
              socket.emit("upgradeStarted", {
                buildingType,
                upgradeTime: buildingUpgrade,
              });
              setTimeout(() => {
                building.level++;
                delete building.upgradeTime;
                console.log(
                  `${buildingType} upgrading to level ${building.level}`
                );
                socket.emit("upgradeFinished", {
                  buildingType,
                  level: building.level,
                });
              }, buildingUpgrade);
            } else {
              socket.emit("upgradeInProgress");
            }
          } else {
            socket.emit("maximumLevelReached");
          }
        } else {
          socket.emit("buildingNotFound");
        }
      }
    });

    socket.on("attackEnemyBase", (enemyBaseId: string) => {
      const player = players[socket.id];
      const enemyPlayer = players[enemyBaseId];

      if (player && enemyPlayer) {
        const attackingPower = 500;
        const defensePower = 300;

        const damage = Math.max(0, attackingPower - defensePower);

        enemyPlayer.base.buildings.forEach((building) => {
          building.level = Math.max(0, building.level - damage);
        });

        socket.emit("attackResult", { enemyPlayerId: enemyBaseId, damage });
        io.to(enemyBaseId).emit("defendResult", {
          attackerId: socket.id,
          damage,
        });

        console.log(
          `${players[socket.id].name} attacked ${enemyPlayer.name}'s base.`
        );
        enemyBaseAttacked(enemyPlayer, player);
        console.log(`Damage: ${damage}`);
      } else {
        socket.emit("enemyBaseNotFound");
      }
    });

    socket.on("disconnect", () => {
      const player = players[socket.id];
      if (player) {
        console.log(`${player.name} left the game.`);
        delete players[socket.id];
        io.emit("playerLeft", socket.id);
      }
    });
  });
}

// Function to handle the enemy base being attacked
function enemyBaseAttacked(enemyPlayer: Player, attacker: Player) {
  // Check if the enemy base has been destroyed
  const baseDestroyed = enemyPlayer.base.buildings.every((building) => building.level === 0);

  if (baseDestroyed) {
    console.log(`${enemyPlayer.name}'s base has been destroyed!`);

    // Reward the attacker for destroying the enemy base
    const rewardAmount = 500;
    attacker.resources += rewardAmount;
    console.log(`${attacker.name} received ${rewardAmount} resources for destroying the enemy base.`);
  } else {
    console.log(`${enemyPlayer.name}'s base has been attacked!`);

    // Consequence for the attacker when the enemy base is not destroyed (optional)
    const consequenceAmount = 200;
    attacker.resources -= consequenceAmount;
    console.log(`${attacker.name} lost ${consequenceAmount} resources for a failed attack.`);
  }
}