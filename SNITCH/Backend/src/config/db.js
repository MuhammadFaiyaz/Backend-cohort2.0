import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
  const mongoUri = config.MONGO_URI;

  

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};