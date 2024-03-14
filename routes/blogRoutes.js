const routes = require("express").Router();



const {
  createBlog,
  updatedBlog,
  getaBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controller/blogCtrl");

// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");



routes
  .post("/create-blog", createBlog)
  .put("/likes",  likeBlog)
  .put(
    "/upload/:id",
    uploadPhoto.array("images", 10),
    blogImgResize,
    uploadImages
  )
  .put("/dislikes",  dislikeBlog)
  .put("/update-blog/:id", updatedBlog)
  .get("/get-all-blogs",  getAllBlogs)
  .get("/get-blog/:id",  getaBlog)
  .delete("/delete-blog/:id",  deleteBlog);

module.exports = routes;
