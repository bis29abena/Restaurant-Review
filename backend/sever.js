import express from "express";
import cors from "cors";
import restaurant from "./api/restaurant.route.js";

const app = express();

app.use(cors());

// To actually replace body parser and is included in express nowadays
app.use(express.json());

// api endpoint for restaurants
app.use("/api/v1/restaurants", restaurant)

// If a user goes to a wrong apiendpoint throrw 404 error
app.use("*", (req, res) => res.status(404).json({error: "page not found"}));

export default app;
