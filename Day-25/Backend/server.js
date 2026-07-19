require('dotenv').config()
const { config } = require("dotenv");
const app = require("./src/app");
const connectToDb = require("./src/config/db");
connectToDb();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
