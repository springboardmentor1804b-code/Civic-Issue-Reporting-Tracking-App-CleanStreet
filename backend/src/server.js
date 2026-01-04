const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));


// Static file serving for uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// Connect Database
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/report", require("./routes/report"));
app.use("/api/comments", require("./routes/comment"));

// Test API
app.get("/", (req, res) => {
  res.send("API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
