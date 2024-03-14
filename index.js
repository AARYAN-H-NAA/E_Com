



const express = require('express')
const app = express()



const PORT = 4000
const blogcategoryRoutes = require('./routes/blogCategoryRoutes');
const blogRoutes = require('./routes/blogRoutes');




app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/api/blogcategory',blogcategoryRoutes)
    .use('/api/blog',blogRoutes)
    .listen(PORT , (req,res)=>{
        console.log("Server is running at :",PORT)
    })