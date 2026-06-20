const express = require('express');
const userModel = require('../model/user.model');
const authRouter = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

authRouter.post("/register", async (req,res)=>{
    const { name, email, password } = req.body;

    const findUser = await userModel.findOne({email});

    if(findUser) return res.status(409).json({
        message:"User is already exists with  this email"
    })

    const hash = crypto.createHash("md5").update(password).digest("hex")
    const user = await userModel.create({
        name, email, password: hash
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)
    res.cookie("token", token)
    res.status(201).json({
        message: "User created successfully",
        user
    })

})

authRouter.post("/protected", async(req,res)=>{
    console.log(req.cookies);
    res.status(404).json({
        message:"This is a portected route"
    })
})

authRouter.post("/login", async(req,res)=>{
    const { email, password } = req.body

    const existingUser = await userModel.findOne({email})

    if(!existingUser) return res.status(404).json({
        message: "Invalid email or password"
    })
    const hash = crypto.createHash("md5").update(password).digest("hex")

    const isPasswordMatched = existingUser.password === hash
    if(!isPasswordMatched) return res.status(404).json({
        message: "Invalid email or password"
    }) 

    res.status(200).json({
        message: "User logged in successfully"
    })
})

module.exports = authRouter;


