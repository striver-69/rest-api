const express=require('express')
const app=express()
const morgan=require('morgan')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const productRoutes=require('./api/routes/product')
const orderRoutes=require('./api/routes/orders')
mongoose.connect('mongodb://127.0.0.1:27017/products',{useUnifiedTopology:true,useNewUrlParser:true})



app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//allow CORS (Cross Origin Resourse sharing) security mechanisms
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-requested-With,Content-type,Accept,Authorization"
    )
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE')
        return res.status(200).json({})
    }
    next()
})


//routes which should handle requests
app.use('/products',productRoutes) 
app.use('/orders',orderRoutes)

//error if if above routes donot get requests
app.use((req,res,next)=>{
    const error=new Error('Not found')
    error.status=404
    next(error)
})

//error from all parts of application in two routes(/products,/orders)
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports=app