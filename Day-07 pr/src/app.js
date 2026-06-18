const express = require('express');
const app = express();
const userModel = require('./model/user.model');
const authRouter = require('./routers/auth.route')

app.use(express.json ());
app.use("/api/auth", authRouter)

module.exports = app;