const routes = require('express').Router()

const { createBlogcategory,updateBlogcategory, getAllBlogcategory, getaBlogcategory, deleteaBlogcategory } = require('../controller/blogCategoryCtrl')



routes
    .post('/create-blogcategory',createBlogcategory)
    .put('/update-blogcategory/:id',updateBlogcategory)
    .get('/get-all-blogcategory',getAllBlogcategory)
    .get('/get-blogcategory/:id',getaBlogcategory)
    .delete('/delete-blogcategory/:id',deleteaBlogcategory)


module.exports = routes