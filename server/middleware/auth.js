import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Log token for debugging (remove in production)
      // console.log("Token received:", token);

      if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({
          success: false,
          message: "Not authorized, invalid token format",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }
  } catch (error) {
    console.error("Auth error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as admin" });
  }
};
