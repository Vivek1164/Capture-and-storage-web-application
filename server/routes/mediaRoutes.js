import express from "express";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import {
  uploadMedia,
  getMedia,
  deleteMedia,
} from "../controllers/mediaController.js";

const router = express.Router();

router.post("/upload", protect, upload, uploadMedia);
router.get("/", protect, getMedia);
router.delete("/:id", protect, deleteMedia);

export default router;
