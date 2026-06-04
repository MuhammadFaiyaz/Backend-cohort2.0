const app = require("./src/app");
const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(
      "mongodb+srv://mk3590653_db_user:SdzoFDUtlx64TwgR@cluster0.yjw1ros.mongodb.net/day-2",
    )
    .then(() => {
      console.log("Connected to Database");
    });
}
connectToDb();
app.listen(3000, () => {
  console.log("server is running on the port 3000");
});
