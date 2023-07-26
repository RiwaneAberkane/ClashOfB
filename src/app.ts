import express, { Express } from "express";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socketManager";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
initializeSocket(io, server);
server.listen(port, () => console.log("listening on port " + port));
