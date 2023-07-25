import { Player } from "./interfaces/Player.model";
const io = require("socket.io-client")

const socket = io("http://localhost:3000")

socket.on("connect", ()=>{
  const playerName = "player1"
  socket.emit("join", playerName)
})

socket.on("joined", (player: Player)=>{
  console.log(`${player.name} just joined the game`)
  console.log(`your base: ${JSON.stringify(player.base)}`)
  console.log(`your ressources: ${player.ressources}`)
})

socket.on("ressourcesCollected", (ressources:number)=>{
  console.log(`you have ${ressources} gold`)
  socket.emit("collectRessources")
})

