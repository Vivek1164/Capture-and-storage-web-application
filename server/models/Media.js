import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    type: { type: String, enum: ["image", "video", "pdf"], required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Media", MediaSchema);
