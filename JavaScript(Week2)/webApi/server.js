import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());

// Main router
app.use("/", router);

// Optional test route
app.get("/test", (req, res) => res.send("Server is running!"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
