
import { createServer } from "http";
import { initSocket } from "./src/socket.js";
import app from "./app.js";

const server = createServer(app);
initSocket(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});