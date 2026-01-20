const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const issueRoutes = require("./routes/issueRoutes");
const imagekitRoutes = require("./routes/imagekitRoutes"); 
const adminRoutes = require("./routes/adminRoutes");
const adminComplaintRoutes = require("./routes/adminComplaintRoutes");
const adminActivityRoutes = require("./routes/adminActivityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log("DB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/imagekit", imagekitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminComplaintRoutes);
app.use("/api/admin", adminActivityRoutes);



app.get("/", (req, res) => {
  res.send("Server Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
