import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { connectionDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import songRoute from "./routes/song.route.js";
import albumRoute from "./routes/albums.route.js";
import statsRoute from "./routes/stats.route.js";
import path from "path";
import cors from "cors";
dotenv.config();

const __dirname = path.resolve();
let app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 500 * 1024 * 1024, // 10mb
    },
  })
);

// app.use(express.static(path.join(__dirname, "uploads")));
app.use("/", adminRoute);

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/songs", songRoute);
app.use("/api/albums", albumRoute);
app.use("/api/stats", statsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  res.status(500).json({
    message: (process.env.NODE_ENV = "production"
      ? "Internal server Error"
      : err.message),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server runing on port " + PORT);
  connectionDB();
});
