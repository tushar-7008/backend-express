const validator = require("validator");

function validateSignUpData(req) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || firstName.length < 4) {
    throw new Error("first Name is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("enter valid Emial");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password");
  }
}

module.exports = {
  validateSignUpData,
};
