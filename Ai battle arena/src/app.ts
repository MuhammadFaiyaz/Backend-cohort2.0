import express from "express";
import graph from "./ai/graph.ai.js";

const app = express();

app.get("/", async (req, res) => {
  const result = await graph("write a factorial function in js")
  res.json(result)
});

export default app;