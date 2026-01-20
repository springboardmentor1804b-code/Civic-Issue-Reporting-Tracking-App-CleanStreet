const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { reverseGeocode, forwardGeocode } = require("../utils/geocode");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      role,
      gender,
      location,
      city,
    } = req.body;

    /* 1️⃣ Validate required fields */
    if (!username || !email || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (role === "volunteer" && !location) {
      return res.status(400).json({ message: "City is required for volunteers" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    /* 2️⃣ Check duplicate user */
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    /* 3️⃣ Hash password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* 4️⃣ Handle volunteer location */
    let userData = {
      username,
      email,
      password: hashedPassword,
      gender,
      role,
      location,
    };

    if (role === "volunteer") {
      try {
        // Use geocoding to derive latitude, longitude, and state from location
        const { latitude, longitude, state } = await forwardGeocode(location);
        if (!latitude || !longitude || !state) {
          return res.status(400).json({ message: "Invalid city provided. Please enter a valid city name." });
        }
        userData.city = location;
        userData.state = state;
        userData.locationGeo = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
        return res.status(400).json({ message: "Unable to geocode the provided city. Please try again." });
      }
    } else {
      userData.locationGeo = null;
    }

    /* 5️⃣ Create user */
    const newUser = await User.create(userData);

    /* 4️⃣ Send response */
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      location: newUser.location,
      avatar: newUser.avatar || null,
    };

    if (newUser.role === "volunteer") {
      userResponse.city = newUser.city;
      userResponse.state = newUser.state;
    }

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: generateToken(newUser),
      user: userResponse,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* 1️⃣ Validate */
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    /* 2️⃣ Find user */
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    /* 3️⃣ Compare password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    /* 4️⃣ Success */
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= UPDATE VOLUNTEER LOCATION ================= */
exports.updateVolunteerLocation = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // Use geocoding to derive latitude, longitude, and state from city
    const { latitude, longitude, state } = await forwardGeocode(city);

    // Update user with city, state, and locationGeo
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        city: city,
        state: state,
        locationGeo: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Location updated successfully",
      user: {
        id: user._id,
        city: user.city,
        state: user.state,
        locationGeo: user.locationGeo,
      },
    });
  } catch (error) {
    console.error("UPDATE VOLUNTEER LOCATION ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
