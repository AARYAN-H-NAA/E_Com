const routes = require('express').Router();

const { createCoupon, 
    getAllCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,} = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');




routes.post("/", authMiddleware, isAdmin, createCoupon);
routes.get("/", authMiddleware, isAdmin, getAllCoupon);
routes.get("/:id", authMiddleware, isAdmin, getCoupon);
routes.put("/:id", authMiddleware, isAdmin, updateCoupon);
routes.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = routes;