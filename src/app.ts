import express, {Express} from "express";
import http from "http";
import {Server} from "socket.io";
import { Socket } from "socket.io";

const app : Express = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    console.log(`user connected: ${socket.id}`);
socket.on(`disconnect`, () => console.log(`user disconnected: ${socket.id}`)
)});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("listening on port " + port)
);


