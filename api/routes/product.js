const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')

const Product=require('../models/products')

router.get('/',(req,res,next)=>{
    Product.find().then((docs)=>{
        console.log(docs)
        res.status(200).json(docs)
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({error:e})
    })
})

router.post('/',(req,res,next)=>{

    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })

    product.save().then((result)=>{
        console.log(result)
        res.status(201).json({
            message:'handling POST requests to /products',
            createdProduct:result
        })
    }).catch((e)=>{
        console.log(e)
    })

})

router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId
    Product.findById(id).then((result)=>{
        console.log(result)
        if(result){
            return res.status(200).json(result)
        }
        res.status(404).json({message:'No valid entry found for provided id'})
        
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({error:e})
    })
})

router.patch('/:productId',(req,res,next)=>{
    const id=req.params.productId
    const updateOps={}
    for (const ops of req.body){
        updateOps[ops.propName]=ops.Value
    }
    Product.update({_id:id},{$set:updateOps}).then((doc)=>{
        console.log(doc)
        res.status(200).json(doc)
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({
            error:e
        })
    })
})

router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId
    Product.remove({_id:id}).then((result)=>{
        res.status(200).json(result)
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({
            error:e
        })
    })
})


module.exports=router