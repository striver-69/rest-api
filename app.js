const express=require('express')
const app=express()
const morgan=require('morgan')

const productRoutes=require('./api/routes/product')
const orderRoutes=require('./api/routes/orders')

app.use(morgan('dev'))

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