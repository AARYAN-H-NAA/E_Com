const asyncHandler = require("express-async-handler");
const fs = require('fs')



const Blog = require("../model/blogModel");
const validateMongoDbId = require("../utils/validateMangodbid");
const { cloudinaryUploadImg } = require("../utils/cloudinary");



const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    if (!newBlog) throw new Error("New Blog is Not created");
    res.json({
      status: "Success",
      data: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) throw new Error("No Blog Found by this Id, Try Again");
    res.json({
      status: "Success",
      data: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getaBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    if (!blog) throw new Error("No Blog Found by this Id, Try Again");
    console.log(blog);
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    if (!updatedBlog)
      throw new Error(
        " UPDATE FAILED!!! <No Blog Found by this Id, Try Again>"
      );
    res.json({
      status: "Success",
      data: updatedBlog,
      Blog: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) throw new Error("Nothing to show");
    res.json({
      status: "Success",
      data: blogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog)
      throw new Error(
        "DELETE OPRATION FAILED!!!  <No Blog Found by this Id, Try Again>"
      );

    res.json({
      status: "Success",
      data: deletedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the login user
    const loginUserId = req.user?._id;

    // Find if user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.includes(loginUserId);

    if (alreadyDisliked) {
      // If the user has already disliked the blog, remove the dislike
      blog.dislikes.pull(loginUserId);
      blog.isDisliked = false;
    }

    // Check if the user has already liked the blog
    const alreadyLiked = blog.likes?.includes(loginUserId);

    if (alreadyLiked) {
      // If the user has already liked the blog, remove the like
      blog.likes.pull(loginUserId);
      blog.isLiked = false;
    } else {
      // If the user has not liked the blog, add the like
      blog.likes.push(loginUserId);
      blog.isLiked = true;
    }

    // Save the updated blog
    const updatedBlog = await blog.save();

    // Respond with the updated blog post
    res.json({
      status: "Success",
      data: updatedBlog,
    });
  } catch (error) {
    // Handle the error appropriately
    throw new Error(error);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);

    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the login user
    const loginUserId = req.user?._id;

    // Find if user has liked the blog
    const alreadyLiked = blog?.likes?.includes(loginUserId);

    if (alreadyLiked) {
      // If the user has already liked the blog, remove the like
      blog.likes.pull(loginUserId);
      blog.isLiked = false;
    }

    // Check if the user has already disliked the blog
    const alreadyDisliked = blog.dislikes?.includes(loginUserId);

    if (alreadyDisliked) {
      // If the user has already disliked the blog, remove the dislike
      blog.dislikes.pull(loginUserId);
      blog.isDisliked = false;
    } else {
      // If the user has not disliked the blog, add the dislike
      blog.dislikes.push(loginUserId);
      blog.isDisliked = true;
    }

    // Save the updated blog
    const updatedBlog = await blog.save();

    // Respond with the updated blog post
    res.json({
      status: "Success",
      data: updatedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Upload new blog Image

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      await fs.unlinkSync(path)
    }
    const findBlogs = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((url) => url),
      },
      { new: true }
    );
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
