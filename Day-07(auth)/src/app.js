const express = require("express");
const authRouter = require("./routes/auth.route");
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
module.exports = app;