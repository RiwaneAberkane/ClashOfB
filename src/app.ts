import express, { Express } from "express";
import http                 from "http";
import { Server, Socket }   from "socket.io";
import { Player }           from "./interfaces/Player.model";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

const players: { [key: string]: Player } = {}
io.on("connection", (socket: Socket) => {
  console.log(`user connected: ${ socket.id }`);

  socket.on("join", (name: string) => {
    const newPlayer: Player = {
      id: socket.id,
      name: name,
      ressources: 0
    }
    players[socket.id] = newPlayer
    console.log(`${ name } has joined the game`)
    socket.emit("joined", newPlayer)
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


