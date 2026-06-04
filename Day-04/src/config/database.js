const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(
      "mongodb+srv://mk3590653_db_user:SdzoFDUtlx64TwgR@cluster0.yjw1ros.mongodb.net/day-04",
    )
    .then(() => {
      console.log("Coonected to Database");
    });
}
module.exports = connectToDb;
