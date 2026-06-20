const express = require("express");
const app = express();
const userModel = require("./model/user.model");
const authRouter = require("./routers/auth.route");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

module.exports = app;
