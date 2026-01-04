const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, location, gender, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role)
      return res.status(400).json({ message: "Please fill all required fields" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Username or Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      confirmPassword:hashedPassword,
      location,
      gender,
      role
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: generateToken(newUser._id),
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
         avatar: user.avatar || null
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
