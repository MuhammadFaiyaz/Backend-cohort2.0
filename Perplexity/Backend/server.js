import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/db/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
