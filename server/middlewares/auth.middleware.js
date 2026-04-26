const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    res.status(401).send({
      status: "error",
      message: "Unauthorized! Please log in to access this resource.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({
      status: "error",
      message: "Invalid token! Please log in again.",
    });
  }
};

module.exports = { authorize };
