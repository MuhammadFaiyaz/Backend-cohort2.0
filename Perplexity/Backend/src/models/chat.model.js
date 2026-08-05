import mongoose from "mongoose";

// Perplexity-like application Chat model
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
