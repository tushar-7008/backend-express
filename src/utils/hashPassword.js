const argon2 = require("argon2");

async function hashMyPassword(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw err;
  }
}

async function verifyMyPassword(hashedPassword, enteredPassword) {
  try {
    if (await argon2.verify(hashedPassword, enteredPassword)) {
      return true
    } else {
      // password did not match
      return false
    }
  } catch (err) {
    // internal failure
    throw err;
  }
}

module.exports = { hashMyPassword, verifyMyPassword };
