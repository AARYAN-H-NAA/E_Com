const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const models = require('../models');

// Create New Blog Category
const createBlogcategory = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        const newCategory = await models.BlogCategory.create({ title });
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Get All Categories
const getAllBlogcategory = asyncHandler(async (req, res) => {
    try {
        const allBlogcategory = await models.BlogCategory.findAll();
        res.json(allBlogcategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Get A Specific Category
const getaBlogcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const category = await models.BlogCategory.findByPk(id);
        if (!category) throw new Error('Something Went Wrong unable to get blog category');
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a specific category
const deleteaBlogcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedblogcategory = await models.BlogCategory.destroy({ where: { id } });
        if (!deletedblogcategory) throw new Error('Something Went Wrong unable to get blog category');
        res.json(deletedblogcategory);
    } catch (error) {
        throw new Error(error);
    }
});

// Update Existing Blog Category
const updateBlogcategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const [updatedCategoryCount, updatedCategory] = await models.BlogCategory.update(req.body, { where: { id }, returning: true });
        if (!updatedCategoryCount) throw new Error("Do not have blogCategory of this id hence not updated");
        res.json(updatedCategory[0]);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBlogcategory, updateBlogcategory, getaBlogcategory, getAllBlogcategory, deleteaBlogcategory };
