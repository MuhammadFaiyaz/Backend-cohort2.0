const express = require("express");
const authRouter = require("./routes/auth.routes");
const app = express();
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post.routes");

app.use(express.json());
app.use(cookieParser() )
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

module.exports = app;