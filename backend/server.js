require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); // ✅ This already connects to MongoDB, so remove mongoose.connect()

// ✅ Serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

// ✅ Import and use routes
const imageRoutes = require("./routes/imageRoutes");
app.use("/api/images", imageRoutes);

const animeRoutes = require("./routes/anime.route");
app.use("/api/anime", animeRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
