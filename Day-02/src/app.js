const express = require("express");
const app = express();
app.use(express.json());

const notes = [];
app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);

  res.status(201).json({
    message: "Faiyaz Khan created a note properly",
  });
});

app.get("/notes", (req, res) => {
  res.status(200).json({
    notes,
  });
});

app.delete("/notes/:index", (req, res) => {
  delete notes[req.params.index];

  res.status(204).json({
    message: "Faiyaz Khan deleted a note",
  });
});

app.patch("/notes/:index", (req, res) => {
  notes[req.params.index].description = req.body.description;
  res.status(200).json({
    message: "Faiyaz Khan updated a note",
  });
});
module.exports = app;
