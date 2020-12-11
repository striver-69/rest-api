const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')

const Order=require('../models/order')
const Product=require('../models/products')

router.get('/',(req,res,next)=>{
    Order.find({}).select('product quantity _id').then((docs)=>{
        res.status(200).json({
            count:docs.length,
            orders:docs.map((doc)=>{
                return {
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/'+doc._id
                    }
                }
            })
        })
    }).catch((e)=>{
        res.status(500).json({
            error:e
        })
    })
})

router.post('/',async(req,res,next)=>{
    const prod=await Product.findById(req.body.productId)
    if(!prod){
        return res.status(404).json({message:'product not found'})
    }
    const order=new Order({
        _id:mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId

    })
    const result= await order.save()
    if(result){
        return res.status(201).json({
            message:'Order stored',
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'+result._id
            }
        })
    }
    res.status(500).json({message:'invalid'})

})

router.get('/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId).then((order)=>{
        if(!order){
            return res.status(404).json({
                message:'order not found'
            })
        }
        res.status(200).json({
            order:order,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders'
            }
        })
    }).catch((e)=>{
        res.status(500).json({error:e})
    })
})

router.delete('/:orderId',async(req,res,next)=>{
    try{
        const order=await Order.findByIdAndDelete(req.params.orderId)
    if(order){
        return res.status(200).json({
            message:'order deleted',
            request:{
                type:'GET',
                url:'http://localhost:3000/orders'
            }
        })
    }
    }catch(e){
        res.status(500).json({error:e})
    }
})



module.exports=router