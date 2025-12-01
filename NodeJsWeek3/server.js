import express from "express";
import route from "./src/routes/index.js";
import { initDb } from "./src/config/dbConfig.js";

const app = express();

const App = async () => {
  await initDb();

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
  console.error("Failed to start server:", error);
  process.exit(1);
});
