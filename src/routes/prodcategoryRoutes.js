const routes = require('express').Router()

const { createProdcategory,updateProdcategory, getAllProdcategory, getaProdcategory, deleteaProdcategory } = require('../controller/prodcategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')


routes
    .post('/create-prodcategory',authMiddleware,isAdmin,createProdcategory)
    .put('/update-prodcategory/:id',authMiddleware,isAdmin,updateProdcategory)
    .get('/get-all-prodcategory',authMiddleware,isAdmin,getAllProdcategory)
    .get('/get-prodcategory/:id',authMiddleware,isAdmin,getaProdcategory)
    .delete('/delete-prodcategory/:id',authMiddleware,isAdmin,deleteaProdcategory)


module.exports = routes