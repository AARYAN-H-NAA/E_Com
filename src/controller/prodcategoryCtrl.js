const asyncHandler = require('express-async-handler')
const validateMangoDbId = require('../utils/validateMangodbid')
const Prodcategory =  require('../model/prodcategoryModel')


//Create New Product Category
const createProdcategory = asyncHandler(async(req,res)=>{
    try {
        const newCategory = await Prodcategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Get All Categories
const getAllProdcategory = asyncHandler(async(req,res)=>{
    try {
        const allProdcategory = await Prodcategory.find()
        res.json(allProdcategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Get A Specific Category

const getaProdcategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const category = await Prodcategory.findById(id)
        if(!category)throw new Error('Something Went Wrong unable to get product category')
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a specific category 
const deleteaProdcategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const deletedprodcategory = await Prodcategory.findByIdAndDelete(id)
        if(!deletedprodcategory)throw new Error('Something Went Wrong unable to get product category')
        res.json(deletedprodcategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Update Existing Product Category
const updateProdcategory = asyncHandler(async(req,res)=>{
    const{id} = req.params
    validateMangoDbId(id)
    try {
        const updatedCategory = await Prodcategory.findByIdAndUpdate(id,req.body,{
            new:true
        })
        if(!updatedCategory)throw new Error("Do not have prodCategory of this id hence not updated")
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports={createProdcategory,updateProdcategory,getaProdcategory,getAllProdcategory,deleteaProdcategory}