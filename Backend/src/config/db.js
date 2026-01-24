
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect("mongodb+srv://adityakedar54_db_user:PAIQAzP8U8NxxaaT@cluster0.chms3za.mongodb.net/cleanstreet");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
