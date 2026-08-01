const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./features/routes/auth.routes");
const songRouter = require("./features/routes/song.routes");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/songs", songRouter)

module.exports = app;