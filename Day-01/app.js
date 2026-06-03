const express = require("express");
const app = express();

const notes = [];

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hi, Faiyaz!");
});

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);
  res.send("notes created!");
});

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.delete("/notes/:id", (req, res) => {
  delete notes[req.params.id];
  res.send("note deleted sucessfully");
});

app.patch("/notes/:id", (req, res) => {
  notes[req.params.id].description = req.body.description;
  res.send("notes updated properly");
});

app.listen(3000);
