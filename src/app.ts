import express, { Express } from "express";
import http                 from "http";
import { Server, Socket }   from "socket.io";
import { Player }           from "./interfaces/Player.model";
import { Base }             from "./interfaces/Base.model";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

const players: { [key: string]: Player } = {}
const startingGold: number = 1000
const buildingUpgrade = 30000

io.on("connection", (socket: Socket) => {
  console.log(`user connected: ${ socket.id }`);

  socket.on("join", (name: string) => {

    const newBase: Base = {
      buildings: [{
        type:"hotel de ville",
        level:1,
      }],
    }
    const newPlayer: Player = {
      id: socket.id,
      name: name,
      ressources: startingGold,
      base: newBase
    }
    players[socket.id] = newPlayer
    console.log(`${ name } has joined the game`)
    socket.emit("joined", newPlayer)
  })

  socket.on("collectRessources", () =>{
    const player = players[socket.id]
    if (player) {
      const ressourcesAmount = 100
      player.ressources += ressourcesAmount
      console.log(`${ player.name } is ${ ressourcesAmount } richer with ${player.ressources} gold`)
      socket.emit("ressourcesCollected", player.ressources)
    }
  })

  socket.on("upgradeBuilding", (buildingType : string) => {
    const player = players[socket.id];
    console.log(players);
    
    if (player){
      const building = player.base.buildings.find((building) => building.type === buildingType);
      if (building) {
        if(building.level < 3){
          if (!building.upgradeTime){
            building.upgradeTime = buildingUpgrade;
            console.log(`${player.name} started upgrading ${buildingType}`);
            socket.emit('upgradeStarted', {buildingType, upgradeTime: buildingUpgrade})
            setTimeout(() => {
              building.level++
              delete building.upgradeTime
              console.log(`${buildingType} upgrading to level ${building.level}`);
              socket.emit('upgradeFinished', {buildingType, level : building.level})
            }, buildingUpgrade)
          } else {
            socket.emit('upgradeInProgress')
          }
        }else{
          socket.emit('maximumLevelReached')
        }
      }else{
        socket.emit('buildingNotFound')
      }
    }
  })


  socket.on(`disconnect`, () => {
        const player = players[socket.id]
        if ( player ) {
          console.log(`${ player.name } left the game`)
          delete players[socket.id]
        }
      }
  )
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("listening on port " + port)
);


