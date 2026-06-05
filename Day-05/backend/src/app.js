const express = require("express");
const app = express();
const noteModel = require("./models/notes.model");

app.use(express.json());

app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;
  const notes = await noteModel.create({
    title,
    description,
  });

  res.status(201).json({
    message: "Note is created successfully",
    notes,
  });
});

app.get("/api/notes", async (req, res) => {
  
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Note is fetched successfully",
    notes,
  });
});

module.exports = app;
