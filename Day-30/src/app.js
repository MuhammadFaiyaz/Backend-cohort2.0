import express from 'express';
const app = express();
import authRouter from './routes/auth.routes.js';
import handleError from './middleware/error.middleware.js';

 app.use(express.json());
 app.use("/api/auth", authRouter);


 app.use(handleError)

export default app;

