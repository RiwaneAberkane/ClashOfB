import { Player } from "./interfaces/Player.model";
const io = require("socket.io-client")

const socket = io("http://localhost:3000")

socket.on("connect", ()=>{
  const playerName = "player1"
  socket.emit("join", playerName)
})

socket.on("joined", (player: Player)=>{
  console.log(`${player.name} just joined the game`)
})