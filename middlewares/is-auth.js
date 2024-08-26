const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const tokenMatched = jwt.verify(token, process.env.JWT_KEY);
    if (!tokenMatched) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    req.userId = tokenMatched.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "User is not authenticated." });
  }
};

module.exports = isAuth;
