import express from "express";
import runGraph from "./ai/graph.ai.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}))

app.get("/", async (req, res) => {
  const result = await runGraph("capital of bangladesh in one sentence maximum 10 words");
  res.json(result)
});

app.post("/invoke", async (req, res) => {
  const { problem } = req.body;
  const result = await runGraph(problem);

  res.status(200).json({
    message: "Prompt processed successfully",
    data: result,
    success: true,
  });
});

export default app;