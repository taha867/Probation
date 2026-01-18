import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import route from "./src/routes/index.js";
import { initDb, closeDb } from "./src/config/dbConfig.js";
import cors from "cors";

const app: Express = express();

const App = async (): Promise<void> => {
  await initDb();

  // Enable CORS for your frontend
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    })
  );

  //extended: true allows nested objects and arrays inside the data.
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json()); //allows Express to accept JSON data and put it inside req.body.

  route(app);

  const port: number = Number(process.env.PORT) || 3000;

  app.listen(port, (): void => {
    console.log("App is now running at port ", port);
  });
};

App().catch((error: unknown): void => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

// Graceful shutdown (event, listener)
process.on("SIGTERM", async () => { // sent by the system to signal that the process should terminate
  await closeDb();
  process.exit(0);
});

process.on("SIGINT", async () => { // Signal interrupt is sent when you press Ctrl+C 
  await closeDb();
  process.exit(0);
});
