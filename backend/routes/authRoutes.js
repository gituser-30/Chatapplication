const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Registration
router.post("/register",async (req,res)=>{
    try {
        const {name, email,password} =  req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword =  await bcrypt.hash(password,salt);

        const user =  await User.create({
            name,
            email,
            password: hashedpassword,
        });

        res.status(201).json({
            message:"user registerd succcessfully",
            user:{
                id:user._id,
                name: user.name,
                email:user.email,
            },
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;