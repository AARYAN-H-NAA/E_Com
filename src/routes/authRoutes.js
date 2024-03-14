const express = require('express')
const routers = express.Router()
const {createUser, loginUserCtrl,
    getallUser, getaUser, deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword} = require('../controller/userCtrl')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
routers
    .post('/register',createUser)
    .post('/forgot-password-token',forgotPasswordToken)
    .post('/login',loginUserCtrl)

    .get('/get-Users' , getallUser)
    .get('/refresh-user',authMiddleware,isAdmin,handleRefreshToken)
    .get('/logout',logout )
    .get('/:id', authMiddleware,isAdmin,getaUser)

    .delete('/:id',deleteaUser)

    .put("/password",authMiddleware,updatePassword)
    .put('/reset-password/:token',resetPassword)
    .put('/edit-user',authMiddleware,updatedUser)
    .put('/block-user/:id',authMiddleware,isAdmin,blockUser)
    .put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser)

module.exports = routers