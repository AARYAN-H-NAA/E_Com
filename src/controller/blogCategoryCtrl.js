const asyncHandler = require('express-async-handler')
const validateMangoDbId = require('../utils/validateMangodbid')
const Blogcategory =  require('../model/blogcategoryModel')


//Create New Blog Category
const createBlogcategory = asyncHandler(async(req,res)=>{
    try {
        const newCategory = await Blogcategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Get All Categories
const getAllBlogcategory = asyncHandler(async(req,res)=>{
    try {
        const allBlogcategory = await Blogcategory.find()
        res.json(allBlogcategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Get A Specific Category

const getaBlogcategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const category = await Blogcategory.findById(id)
        if(!category)throw new Error('Something Went Wrong unable to get blog category')
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a specific category 
const deleteaBlogcategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMangoDbId(id)
    try {
        const deletednlogcategory = await Blogcategory.findByIdAndDelete(id)
        if(!deletedblogcategory)throw new Error('Something Went Wrong unable to get blog category')
        res.json(deletedblogcategory)
    } catch (error) {
        throw new Error(error)
    }
})

// Update Existing Blog Category
const updateBlogcategory = asyncHandler(async(req,res)=>{
    const{id} = req.params
    validateMangoDbId(id)
    try {
        const updatedCategory = await Blogcategory.findByIdAndUpdate(id,req.body,{
            new:true
        })
        if(!updatedCategory)throw new Error("Do not have blogCategory of this id hence not updated")
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports={createBlogcategory,updateBlogcategory,getaBlogcategory,getAllBlogcategory,deleteaBlogcategory}