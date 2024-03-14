const asyncHandler = require('express-async-handler')
const validateMangoDbId = require('../utils/validateMangodbid')
const Brand =  require('../model/brandModel')


//Create New Product Category
const createBrand = asyncHandler(async(req,res)=>{
    try {
        const newCategory = await Brand.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Get All Brands
const getAllBrands = asyncHandler(async(req,res)=>{
    try {
        const allBrand = await Brand.find()
        res.json(allBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// Get A Specific Brand

const getaBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const category = await Brand.findById(id)
        if(!category)throw new Error('Something Went Wrong unable to get product category')
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a specific Brand
const deleteaBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id)
        if(!deletedBrand)throw new Error('Something Went Wrong unable to get product category')
        res.json(deletedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// Update Existing Brand Category
const updateBrand = asyncHandler(async(req,res)=>{
    const{id} = req.params
    validateMangoDbId(id)
    try {
        const updatedCategory = await Brand.findByIdAndUpdate(id,req.body,{
            new:true
        })
        if(!updatedCategory)throw new Error("Do not have brand of this id hence not updated")
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports={createBrand,updateBrand,getaBrand,getAllBrands,deleteaBrand}