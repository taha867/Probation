import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import route from "./src/routes/index.js";
import { initDb, closeDb } from "./src/config/dbConfig.js";
import cors from "cors";
const app = express();
const App = async () => {
    await initDb();
    // Enable CORS for your frontend
    app.use(cors({
        origin: process.env.FRONTEND_URL,
    }));
    //extended: true allows nested objects and arrays inside the data.
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json()); //allows Express to accept JSON data and put it inside req.body.
    route(app);
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log("App is now running at port ", port);
    });
};
App().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
// Graceful shutdown (event, listener)
process.on("SIGTERM", async () => {
    await closeDb();
    process.exit(0);
});
process.on("SIGINT", async () => {
    await closeDb();
    process.exit(0);
});
//# sourceMappingURL=server.js.map