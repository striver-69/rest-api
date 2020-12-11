const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const validator = require('validator');

const User=require('../models/user')

router.post('/signup',async(req,res,next)=>{
    if(!validator.isEmail(req.body.email)){
        return res.status(500).json({
            error:'Email address is inavalid'
        })
    }
    const duplicate= await User.find({email:req.body.email})
    if(duplicate.length>=1){
        return res.status(409).json({
            error:'same user already exists in the database'
        })
    }
    const hashedPassword = await bcrypt.hash(req.body.password,8)
    if(!hashedPassword){
        return res.status(500).json({
            error:'Error in saving user'
        })
    }
    const user=new User({
        _id:new mongoose.Types.ObjectId(),
        email:req.body.email,
        password:hashedPassword
    })
    const userSave=await user.save()
    if(!userSave){
        return res.status(500).json({
            error:'Error'
        })
    }
    console.log(userSave)
    res.status(201).json({
        message:'User Created'
    })
})

router.delete('/:userId',async(req,res,next)=>{
    const user=await User.findByIdAndDelete(req.params.userId)
    if(!user){
        return res.status(500).json({
            error:'User not deleted'
        })
    }
    res.status(200).json({
        message:'User deleted'
    })
})

module.exports=router