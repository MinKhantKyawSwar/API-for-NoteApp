const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// database
const User = require("../models/user");

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  const { email, password, username } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashPass) => {
      return User.create({
        email,
        password: hashPass,
        username,
      });
    })
    .then((result) => {
      res.status(201).json({ message: "User Created", userId: result._id });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    });
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errorMessages: errors.array(),
      });
    }

    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(401).json({ message: "Email does not exist." });
    }

    const isMatched = bcrypt.compareSync(password, userDoc.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Wrong user credentials." });
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, userId: userDoc._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.checkStatus = (req, res, next) => {
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
    res.json("ok");
  } catch (err) {
    return res.status(401).json({ message: "User is not authenticated." });
  }
};
