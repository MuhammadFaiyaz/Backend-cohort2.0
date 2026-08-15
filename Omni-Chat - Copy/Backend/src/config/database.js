import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected`);
}

export default connectDB; 