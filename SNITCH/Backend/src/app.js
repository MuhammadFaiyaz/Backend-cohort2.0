import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import authRouter from './routes/auth.routes.js';
import productsRouter from './routes/product.routes.js';
import {config} from './config/config.js';
import cartRouter from './routes/cart.routes.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
// 	origin: "http://localhost:5173",
// 	credentials: true
// }));
app.use(cookieParser());
app.use(morgan('dev'));



app.use(passport.initialize())

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
))

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

app.use((err, _req, res, _next) => {
  console.error("💥", err);
  res.status(500).json({ message: err.message, stack: err.stack });
});

export default app;
