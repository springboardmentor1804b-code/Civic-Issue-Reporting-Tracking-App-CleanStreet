// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

//   const authMiddleware = async (req, res, next) => {

//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { userId, email, role}
//     const user = await User.findById(decoded.userId).select("role");
//     req.user.role = user.role;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Step 1: Token check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Step 2: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Step 3: Get fresh user from DB
    const user = await User.findById(decoded.userId).select("role email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Step 4: Attach ONLY required info to req.user
    req.user = {
      userId: decoded.userId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
