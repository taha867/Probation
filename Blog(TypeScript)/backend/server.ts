import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import route from "./src/routes/index.js";
import { initDb } from "./src/config/dbConfig.js";
import cors from "cors";

// Type annotations added
const app: Express = express();

const App = async (): Promise<void> => {
  await initDb();

  // Enable CORS for your frontend
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    }),
  );

  app.use(express.urlencoded({ extended: true })); //It parses URL-encoded data, which is the format used when a form is submitted.
  //After parsing, it puts the data inside req.body
  //extended: true allows nested objects and arrays inside the data.
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

