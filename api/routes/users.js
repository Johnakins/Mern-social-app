import express from "express"
import User from "../models/User.js"
import bcrypt from 'bcrypt'

const router = express.Router()

//update user
router.put("/:id", async (req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin){
        //update password
        if (req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt) 
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        //update user
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Account has been updated")
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("You can update only your account")
    }
})

//delete user
router.delete("/:id", async (req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been delete")
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("You can delete only your account")
    }
})

//get a user
router.get("/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

//follow a user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {followings: req.params.id}})
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("You're already following")
            }
        } catch (error) {
            res.status(500).json(err)
        }

    }else{
        res.status(403).json("You can't follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {followings: req.params.id}})
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("You've already unfollowed")
            }
        } catch (error) {
            res.status(500).json(err)
        }

    }else{
        res.status(403).json("You can't unfollow yourself")
    }
})

export default router