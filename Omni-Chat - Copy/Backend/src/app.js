import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import morgan from "morgan"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(morgan("dev"))
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', "PUT", "DELETE"],
    credentials: true
}))

app.use("/api/auth", authRouter)

export default app;