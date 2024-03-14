const routes = require('express').Router()

const { createBrand,updateBrand, getAllBrands, getaBrand, deleteaBrand } = require('../controller/brandCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')


routes
    .post('/create-brand',authMiddleware,isAdmin,createBrand)
    .put('/update-brand/:id',authMiddleware,isAdmin,updateBrand)
    .get('/get-all-brand',authMiddleware,isAdmin,getAllBrands)
    .get('/get-brand/:id',authMiddleware,isAdmin,getaBrand)
    .delete('/delete-brands/:id',authMiddleware,isAdmin,deleteaBrand)


module.exports = routes