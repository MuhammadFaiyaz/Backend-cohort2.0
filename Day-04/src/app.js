const express = require("express");
const noteModel = require("./models/notes.model");

const app = express();

app.use(express.json());

app.post("/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({
    title,
    description,
  });

  res.status(201).json({
    message: "Note created perfectly",
    note,
  });
});

app.get("/notes", async (req,res)=>{
  const note = await noteModel.find()

  res.status(200).json({
    message: "Note fetched sucessfully",
    note
  })
})

module.exports = app;
