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

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");



routes
  .post("/create-blog", authMiddleware, isAdmin, createBlog)
  .put("/likes", authMiddleware, isAdmin, likeBlog)
  .put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    blogImgResize,
    uploadImages
  )
  .put("/dislikes", authMiddleware, isAdmin, dislikeBlog)
  .put("/update-blog/:id", authMiddleware, isAdmin, updatedBlog)
  .get("/get-all-blogs", authMiddleware, isAdmin, getAllBlogs)
  .get("/get-blog/:id", authMiddleware, isAdmin, getaBlog)
  .delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = routes;
