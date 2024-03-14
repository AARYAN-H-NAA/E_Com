const asyncHandler = require("express-async-handler");

const slugify = require("slugify");

const fs = require('fs')
//____________________________________________________

const Product = require("../model/productModel.js");


const User = require("../model/userModel.js");

const { cloudinaryUploadImg } = require("../utils/cloudinary.js");

const validateMongoDbId = require("../utils/validateMangodbid.js");



const createProduct = asyncHandler(async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Product
const updateProduct = asyncHandler(async (req, res, next) => {
  console.log("Updating product");
  const { id } = req.params;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a Product
const deleteProduct = asyncHandler(async (req, res, next) => {
  console.log("deleteing product");
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a Product
const getaProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const getAllProduct = await Product.findById(id);
    res.json(getAllProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const getallProduct = asyncHandler(async (req, res, next) => {
  try {
    // Filtering products
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query = Product.find(JSON.parse(queryStr));

    // Sorting products

    if (req.query.sort) {
      const sortBy = req.query.sort.split("").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the products

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page Does not exist");
    }
    console.log(page, limit, skip);

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error); // Pass the error to Express error handling middleware
  }
});

// Add to Wish List
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Destructure _id directly from req.user
  const { prodId } = req.body;
  try {
    let user = await User.findById(_id); // Await the result of findById
    const alreadyAdded = user.wishlist.includes(prodId.toString());
    if (alreadyAdded) {
      user = await User.findOneAndUpdate(
        { _id },
        { $pull: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.rating.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          rating: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.rating.length;
    let ratingsum = getallratings.rating
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

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
      fs.unlinkSync(path)
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((url) => url),
      },
      { new: true }
    );
    res.json(findProduct);
  }  catch (error) {
    throw new Error(error);
  }
}
);

module.exports = {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
};
