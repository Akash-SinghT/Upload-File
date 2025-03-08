import express from "express";
import cors from "cors";
import upload from "./multer.js";
import cloudinary from "./cloudinary.js";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(cors());

// Upload PDF to Cloudinary
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload directly from local storage
    const filePath = req.file.path;
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "uploads",
      use_filename: true,
      unique_filename: false,
      access_mode: "public",
    });

    // Remove the local file after upload
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "File uploaded successfully",
      url: cloudinaryResponse.secure_url, // Directly accessible PDF link
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      message: "Error in upload",
      error: error.message || "Unknown error",
    });
  }
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
