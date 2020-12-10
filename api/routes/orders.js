const express=require('express')
const router=express.Router()

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'Orders were fetched'
    })
})

router.post('/',(req,res,next)=>{
    res.status(201).json({
        message:'Orders was Created'
    })
})

router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'Orders was Created',
        orderId:req.params.orderId
    })
})

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'Order Deleted',
        orderId:req.params.orderId
    })
})



module.exports=router