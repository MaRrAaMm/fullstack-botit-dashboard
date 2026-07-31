import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootstrap from "./src/App.controller.js";

const app = express();
await bootstrap(app, express);

export default app;