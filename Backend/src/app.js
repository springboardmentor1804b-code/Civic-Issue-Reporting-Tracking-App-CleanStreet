
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const complaintRoutes = require("./routes/complaint.routes");
const complaintsRoutes = require("./routes/complaints.routes");
const commentRoutes = require("./routes/comment.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const imagesRoutes = require("./routes/images.routes");

const app = express();
connectDB().catch(err => console.error("DB Connection failed:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.options("*", cors());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/images", imagesRoutes);


module.exports = app;
