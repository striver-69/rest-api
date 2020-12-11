const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const multer=require('multer')

const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./uploads')
    },
    filename:function(req,file,callback){
        callback(null,new Date().toISOString() + file.originalname)
    }
})

const fileFilter=(req,file,callback)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null,true) //accepet the file
    }
    else{
        callback(null,false) //reject a file
    }
}

const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*5
},fileFilter:fileFilter})

const Product=require('../models/products')

router.get('/',(req,res,next)=>{
    Product.find({}).select('name price _id productImage').then((docs)=>{
        const response={
            count:docs.length,
            products:docs.map((doc)=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:"GET",
                        url:"http://localhost:3000/products/"+doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({error:e})
    })
})

router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file)
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })

    product.save().then((result)=>{
        console.log(result)
        res.status(201).json({
            message:'Craeted a product successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:"GET",
                    url:"http://localhost:3000/products/"+result._id
                }
            }
        })
    }).catch((e)=>{
        console.log(e)
    })

})

router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId
    Product.findById(id).select('name price _id productImage').then((result)=>{
        console.log(result)
        if(result){
            return res.status(200).json({
                product:result,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'
                }
            })
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
        res.status(200).json({
            message:'Product Updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/'+id
            }
        })
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
        res.status(200).json({
            message:"Product deleted",
            request:{
                type:"POST",
                url:'http://localhost:3000/products/',
                body:{name:'String',Price:'Number'}
            }
        })
    }).catch((e)=>{
        console.log(e)
        res.status(500).json({
            error:e
        })
    })
})


module.exports=router