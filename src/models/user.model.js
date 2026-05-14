const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        const isEmail = validator.isEmail(value);
        if (!isEmail) {
          throw new Error("email format is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select : false
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender type is not valid");
        }
      },
    },
    DOB: {
      type: String,
    },
    Skills: {
      type: [String],
      validate(value) {
        if (value.length >= 10) {
          throw new Error("max 10 skills are allowed");
        }
      },
    },
    imageURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("add valid URL");
        }
      },
    },
    about: {
      type: String,
      maxLength: 100,
      default: "Hey there, i am using DevTinder",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
