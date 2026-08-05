import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

export default app;
