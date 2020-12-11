const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const validator = require('validator');
const jwt=require('jsonwebtoken')

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


router.post('/login',async(req,res,next)=>{
    if(!validator.isEmail(req.body.email)){
        return res.status(401).json({
            error:'Auth failed'
        })
    }
    const user=await User.find({email:req.body.email})
    if(!user){
        return res.status(401).json({
            error:'Auth failed'
        })
    }
    if(user.length<1){
        return res.status(401).json({error:'Auth failed'})
    }
    const response=await bcrypt.compare(req.body.password,user[0].password)
    if(!response){
        return res.status(401).json({error:'Auth failed'})
    }
    const token=jwt.sign({
        email:user[0].email,
        userId:user[0]._id
    },process.env.JWT,{
       expiresIn:"1h" 
    })
    res.status(200).json({
        message:'Auth successful',
        token:token
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