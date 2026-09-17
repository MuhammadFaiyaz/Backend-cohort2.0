import express from "express";
import graph from "./ai/graph.ai.js";

const app = express();

app.get("/", async (req, res) => {
  const result = await graph("Alexandar vs king sultan Suleman, mark them 10 according to their achievements and influances")
  res.json(result)
});

export default app;