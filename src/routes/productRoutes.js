const router = require("express").Router();

const {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

router
    .post("/create-product", authMiddleware, isAdmin, createProduct)
    .put("/wishlist", authMiddleware, addToWishList)
    .put(
          "/upload/:id",
          authMiddleware,
          isAdmin,
          uploadPhoto.array("images", 10),
          productImgResize,
          uploadImages
        )
    .put("/rating", authMiddleware, rating)
    .put("/:id", authMiddleware, isAdmin, updateProduct)
    .delete("/:id", authMiddleware, isAdmin, deleteProduct)

router.get("/getallProduct", getallProduct);
router.get("/:id", getaProduct);

module.exports = router;
