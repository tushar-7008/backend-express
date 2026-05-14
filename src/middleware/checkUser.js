const { log } = require("node:console");
const User = require("../models/user.model.js");

const checkIfUserExistInDB = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.find({ emailID: email });
    if (user.length) {
      return res.status(400).json({
        message: "user Already exists",
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = checkIfUserExistInDB;
