const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: String,
  description: String,
});

const noteModel = mongoose.model("notes", noteSchema);
