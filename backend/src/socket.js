import { Server } from "socket.io";

export let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  });
};

export const emitEvent = (eventName, data) => {
  if (io) {
    io.emit(eventName, data);
  }
};