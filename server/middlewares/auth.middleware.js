const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized! Please log in to access this resource.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token! Please log in again.",
    });
  }
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        status: "error",
        message:
          "Forbidden! You do not have permission to perform this action.",
      });
    }
    next();
  };

module.exports = { authorize, requireRole };
