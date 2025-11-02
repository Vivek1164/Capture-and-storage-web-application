import Media from "../models/Media.js";
import fs from "fs";
import path from "path";

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const mime = req.file.mimetype;
    let type = null;
    if (mime.startsWith("image")) type = "image";
    else if (mime.startsWith("video")) type = "video";
    else if (mime === "application/pdf") type = "pdf";
    else return res.status(400).json({ message: "Unsupported file type" });

    const url = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

    const media = await Media.create({
      user: req.user._id,
      filename: req.file.originalname,
      url,
      mimeType: mime,
      size: req.file.size,
      type,
    });
    res.status(201).json({ message: "File uploaded successfully", media });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
};

export const getMedia = async (req, res) => {
  try {
    const { type, page = 1, limit = 12 } = req.query;
    const q = { user: req.user._id };
    if (type) q.type = type;

    const skip = (page - 1) * limit;
    const total = await Media.countDocuments(q);
    const items = await Media.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: "success",
      message: "Fetched media successfully",
      data: { total, items },
    });
  } catch (err) {
    console.error("Get Media Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Not found" });
    if (media.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    const filepath = path.join(
      process.cwd(),
      "uploads",
      path.basename(media.url)
    );
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    await media.deleteOne();

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
};
