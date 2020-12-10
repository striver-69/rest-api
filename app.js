const express=require('express')
const app=express()

app.use((req,res,next)=>{
    console.log('Time:', Date.now())
    res.status(200).json({
        message:'It works'
    })
})

module.exports=app