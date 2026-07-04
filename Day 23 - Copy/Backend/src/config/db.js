const mongoose = require("mongoose");

const connectToDb = async ()=> {
   await mongoose.connect(process.env.MONGO_URI)
   console.log('Connected to DB');
}

module.exports = connectToDb;