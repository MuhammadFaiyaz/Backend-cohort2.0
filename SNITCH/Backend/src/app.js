import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
// 	origin: "http://localhost:5173",
// 	credentials: true
// }));
app.use(cookieParser());
app.use(morgan('dev'));


app.use('/api/auth', authRouter);

app.use((err, _req, res, _next) => {
  console.error("💥", err);
  res.status(500).json({ message: err.message, stack: err.stack });
});

export default app;
