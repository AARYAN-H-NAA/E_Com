const routes = require('express').Router()

const { createBlogcategory,updateBlogcategory, getAllBlogcategory, getaBlogcategory, deleteaBlogcategory } = require('../controller/blogCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')


routes
    .post('/create-blogcategory',authMiddleware,isAdmin,createBlogcategory)
    .put('/update-blogcategory/:id',authMiddleware,isAdmin,updateBlogcategory)
    .get('/get-all-blogcategory',authMiddleware,isAdmin,getAllBlogcategory)
    .get('/get-blogcategory/:id',authMiddleware,isAdmin,getaBlogcategory)
    .delete('/delete-blogcategory/:id',authMiddleware,isAdmin,deleteaBlogcategory)


module.exports = routes