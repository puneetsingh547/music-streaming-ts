import { Router } from "express";
import { requireAdmin, protectRoute } from "../middleware/auth.middleware.js";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  checkAdmin,
} from "../controller/admin.controller.js";
const router = Router();
import path from "path";
import fs from "fs";
const __dirname = path.resolve();
const DOWNLOAD_DIR = path.join(__dirname, "uploads");
// router.use(protectRoute, requireAdmin);
router.get("/getList", (req, res) => {
  try {
    fs.readdir(DOWNLOAD_DIR, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return res.status(500).send("Unable to list files");
      }
      // Send file names with download URLs
      const fileList = files.map((file) => ({
        name: file,
        downloadUrl: `http://localhost:500/download/${encodeURIComponent(
          file
        )}`,
      }));

      res.json(fileList);
    });
  } catch (error) {
    throw error;
  }
});

router.get("/download/:filename", (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send("File not found");
      }

      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).send("Error downloading file");
        }
      });
    });
  } catch (error) {
    throw error;
  }
});

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/album/:id", deleteAlbum);
export default router;
