import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { initSocket } from "./src/socket.js";
import bootstrap from "./src/App.controller.js";

const app = express();

bootstrap(app, express);

const server = createServer(app);

initSocket(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server is running in port", port);
});