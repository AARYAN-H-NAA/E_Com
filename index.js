const express = require('express')
const app = express()
const dotenv = require('dotenv').config();
const morgan = require("morgan")

const PORT = process.env.PORT || 4000
const {errorHandler,notFound} = require('./middlewares/errorHandler')
const dbConnect = require('./config/dbConnect')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const prodcategoryRoutes = require('./routes/prodcategoryRoutes');
const blogcategoryRoutes = require('./routes/blogcategoryRoutes');
const brandRoutes = require('./routes/brandRoutes')
const couponRoutes = require('./routes/couponRoute')
const cookieParser = require('cookie-parser')

dbConnect()


app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(morgan('dev'))

    .use('/api/user',authRoutes)
    .use('/api/product',productRoutes)
    .use('/api/blog',blogRoutes)
    .use('/api/prodcategory',prodcategoryRoutes)
    .use('/api/blogcategory',blogcategoryRoutes)
    .use('/api/brand',brandRoutes)
    .use('/api/coupon',couponRoutes)

    .use(notFound)
    .use(errorHandler)
    .listen(PORT , (req,res)=>{
        console.log("Server is running at :",PORT)
    })