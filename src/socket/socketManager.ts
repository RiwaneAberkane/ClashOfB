import socketio from "socket.io";
import { Server } from "http";
import { Player } from "../interfaces/Player.model";
import { Base } from "../interfaces/Base.model";

const players: { [key: string]: Player } = {};
const startingGold: number = 1000;
const buildingUpgrade = 30000;

export function initializeSocket(io: socketio.Server, server: Server) {
  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on("join", (name: string) => {
      const newBase: Base = {
        buildings: [
          {
            type: "hotel de ville",
            level: 1,
          },
        ],
      };
      const newPlayer: Player = {
        id: name === "player1" ? "1" : socket.id,
        name: name,
        ressources: startingGold,
        base: newBase,
      };
      players[socket.id] = newPlayer;
      console.log(`${name} has joined the game`);
      socket.emit("joined", newPlayer);
    });
    socket.on("collectRessources", () => {
      const player = players[socket.id];
      if (player) {
        const ressourcesAmount = 100;
        player.ressources += ressourcesAmount;
        console.log(
          `${player.name} is ${ressourcesAmount} richer with ${player.ressources} gold`
        );
        socket.emit("ressourcesCollected", player.ressources);
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
      console.log(players);

      if (player && enemyPlayer) {
        // Calculer la puissance d'attaque en fonction du niveau des buildings, troupes etc..
        const attackingPower = 500;
        const defensePower = 300;
        const damage = Math.max(0, attackingPower - defensePower);
        enemyPlayer.base.buildings.forEach((building) => {
          building.level = Math.max(0, building.level - damage);
        });
        socket.emit("enemyBaseAttacked", {
          enemyBase: enemyPlayer.base,
          stolenGold: 0,
          stolenElixir: 0,
        });
        io.to(enemyBaseId).emit("enemyBaseAttacked", {
          enemyBase: enemyPlayer.base,
          stolenGold: 0,
          stolenElixir: 0,
        });
        console.log(
          `${players[socket.id].name} attacked ${enemyPlayer.name} base`
        );
        console.log(`damage: ${damage}`);
      } else {
        socket.emit("enemyBaseNotFound");
      }
    });

    socket.on(`disconnect`, () => {
      const player = players[socket.id];
      if (player) {
        console.log(`${player.name} left the game`);
        delete players[socket.id];
      }
    });
  });
}
