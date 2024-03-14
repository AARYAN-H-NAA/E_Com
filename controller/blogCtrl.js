'use strict';
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const fs = require('fs');

const { Blog , User} = require('../models');
const { cloudinaryUploadImg } = require('../utils/cloudinary');

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        if (!newBlog) throw new Error('New blog not created');
        res.json({
            status: 'Success',
            data: newBlog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updatedBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBlog = await Blog.update(req.body, { where: { id }, returning: true });
        if (!updatedBlog[0]) throw new Error('No Blog Found by this Id, Try Again');
        res.json({
            status: 'Success',
            data: updatedBlog[1][0],
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getaBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) throw new Error('No Blog Found by this Id, Try Again');
        console.log(blog);
        const updatedBlog = await Blog.update({ numViews: sequelize.literal('numViews + 1') }, { where: { id }, returning: true });
        if (!updatedBlog[0]) throw new Error('UPDATE FAILED!!! <No Blog Found by this Id, Try Again>');
        res.json({
            status: 'Success',
            data: updatedBlog[1][0],
            Blog: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        if (!blogs) throw new Error('Nothing to show');
        res.json({
            status: 'Success',
            data: blogs,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.destroy({ where: { id } });
        if (!deletedBlog) throw new Error('DELETE OPRATION FAILED!!!  <No Blog Found by this Id, Try Again>');
        res.json({
            status: 'Success',
            data: deletedBlog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findByPk(blogId);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        const loginUserId = req.user?.id;
        const alreadyDisliked = blog.dislikes?.includes(loginUserId);
        if (alreadyDisliked) {
            blog.dislikes = blog.dislikes.filter((userId) => userId !== loginUserId);
            blog.isDisliked = false;
        }
        const alreadyLiked = blog.likes?.includes(loginUserId);
        if (alreadyLiked) {
            blog.likes = blog.likes.filter((userId) => userId !== loginUserId);
            blog.isLiked = false;
        } else {
            blog.likes.push(loginUserId);
            blog.isLiked = true;
        }
        const updatedBlog = await blog.save();
        res.json({
            status: 'Success',
            data: updatedBlog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findByPk(blogId);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        const loginUserId = req.user?.id;
        const alreadyLiked = blog.likes?.includes(loginUserId);
        if (alreadyLiked) {
            blog.likes = blog.likes.filter((userId) => userId !== loginUserId);
            blog.isLiked = false;
        }
        const alreadyDisliked = blog.dislikes?.includes(loginUserId);
        if (alreadyDisliked) {
            blog.dislikes = blog.dislikes.filter((userId) => userId !== loginUserId);
            blog.isDisliked = false;
        } else {
            blog.dislikes.push(loginUserId);
            blog.isDisliked = true;
        }
        const updatedBlog = await blog.save();
        res.json({
            status: 'Success',
            data: updatedBlog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            await fs.unlinkSync(path);
        }
        const findBlogs = await Blog.update({ images: urls }, { where: { id }, returning: true });
        res.json(findBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBlog,
    updatedBlog,
    getaBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages,
};
