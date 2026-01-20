const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

async function updateRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cleanstreet");
    await User.updateMany({ role: "user" }, { role: "citizen" });
    console.log("Updated roles");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateRoles();
