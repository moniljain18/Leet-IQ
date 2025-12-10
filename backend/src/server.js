import express from "express";
import dotenv from "dotenv";
import { env } from "./lib/env.js"
dotenv.config();

const app = express();
console.log(env.PORT);
console.log(env.DB_URL);


app.get("/health ", (req, res) => {
    res.status(200).json({ msg: "succes chal gyi api" });
});

app.listen(3000, () => {
    console.log("Server is running on port ", env.PORT);
}); 