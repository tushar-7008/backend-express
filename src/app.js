const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.model");
const checkIfUserExistInDB = require("./middleware/checkUser");
const { log } = require("console");
const { validateSignUpData } = require("./utils/validation");
const { hashMyPassword, verifyMyPassword } = require("./utils/hashPassword");
const jwt = require("jsonwebtoken")
const PORT = 3000;
const app = express()



;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("working");
});

// ------------------------------ SIGNUP ENDPOINT --------------------------
app.post("/signup", checkIfUserExistInDB, async (req, res) => {
  try {
    validateSignUpData(req);
    const details = req.body;
    details.password = await hashMyPassword(details.password);
    console.log(details.password);
    const newUser = new User(details);
    const savedUser = await newUser.save();
    const message = `user created successfully with id ${savedUser._id}`;
    res.status(200).json({
      message: "User created",
      userId: savedUser._id, // ✅ Access _id directly
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// --------------------------------- LOGIN ENDPOINT ---------------------------------

app.post("/login", async (req, res)=>{
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email }).select("+password");
    if(!user){
      return res.send("user not exist please signup")
    }
    const password = req.body.password;
    const hashedPassword = user.password
    const isVerified = await verifyMyPassword(hashedPassword, password);
    if(isVerified){
      res.status(200).json({
        message : "successfully logged in",
        userId : user._id
      })
    }
    else{
      res.status(400).json({
        message : "bad request! wrong credentials",
      })
    }   
  } catch (error) {
    console.log(error);
  }
  

})



// ----------------------------------USER UPDATE ENDPOINT ----------------------------
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const Allowed_Updates = [
    "userId",
    "firstName",
    "lastName",
    "imageURL",
    "about",
    "gender",
    "age",
    "Skills",
  ];
  try {
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return Allowed_Updates.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("update failed " + err.message);
  }
});

// --------------------------------DB AND SERVER CONNECTION-------------------------------
connectDB()
  .then(() => {
    console.log("database connect established...");
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("database cannot be connected!!" + err);
  });
