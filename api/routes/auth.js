import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import bcrypt from 'bcrypt'

const router = express.Router()

// REGISTER
router.post("/register", async (req, res)=>{
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
             email: req.body.email,
             password: hashPassword,
         });
        const user = await newUser.save() 
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

// LOGIN
router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) res.status(400).json("wrong credentials")

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)
    }
})

export default router