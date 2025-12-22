import express from "express";
import route from "./src/routes/index.js";
import { initDb } from "./src/config/dbConfig.js";
import cors from "cors";

const app = express();

const App = async () => {
  await initDb();

  // Enable CORS for your frontend
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"] // frontend origins
    }),
  );

  app.use(express.urlencoded({ extended: true })); //It parses URL-encoded data, which is the format used when a form is submitted.
  //After parsing, it puts the data inside req.body
  //extended: true allows nested objects and arrays inside the data.
  app.use(express.json()); //allows Express to accept JSON data and put it inside req.body.

  route(app);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log("App is now running at port ", port);
  });
};

App().catch((error) => {
  res.status(500).json({ error: "Failed to start server" });
  process.exit(1);
});
