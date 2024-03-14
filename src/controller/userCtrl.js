const User = require("../model/userModel");

const asyncHandler = require("express-async-handler");

const jwt = require('jsonwebtoken')

const crypto = require('crypto')

const { generateToken } = require("../config/jwtToken");

const validateMongodbId = require("../utils/validateMangodbid");

const { generateRefreshToken } = require("../config/refreshToken");
const { Error } = require("mongoose");
const sendEmail = require("./emailCtrl");

// register a user
const createUser = async (req, res) => {
    console.log('1')
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.json({
      msg: "User Already Exist",
      success: false,
    });
  }
};

// login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    console.log('2')
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });



// Update a user
const updatedUser = asyncHandler(async (req, res) => {
    console.log('3')
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const updateUser = await User.findByIdAndUpdate(id, {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    });
    res.send(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log('4')
    const cookies = req.cookies; 
    console.log(cookies); 
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });


// Logout Functionality


const logout = asyncHandler(async(req,res) => {

  const cookies = req.cookies;
  if (!cookies?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken',
    {
      httpOnly: true,
      secure: true
    });
    res.sendStatus(204);
  }

  await User.findOneAndUpdate({refreshToken},{
    refreshToken: "",
  });
  res.clearCookie('refreshToken',
  {
    httpOnly: true,
    secure: true
  })
  res.sendStatus(204)
})

// Get all users
const getallUser = asyncHandler(async (req, res) => {
    console.log('4')
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get a user
const getaUser = asyncHandler(async (req, res) => {
    console.log('5')
    
  
    try {
    const { id } = req.params;
    validateMongodbId(id);
      const getaUser = await User.findById(id);
      res.json({
        getaUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
    console.log('6')
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Block A User
const blockUser = asyncHandler(async (req, res) => {
    console.log('7')
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock A User
const unblockUser = asyncHandler(async (req, res) => {
    console.log('8')
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "User Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req,res)=>{

  console.log("password")
  const {_id} = req.user
  const {password} =  req.body
  console.log(req.body)
  validateMongodbId(_id)
  const user = await User.findById(_id);
  if(password){ 
    user.password=password;
    const updatedUser = await user.save();
    res.json(updatedUser)
  }else{
    res.json(user)
  }
})

const forgotPasswordToken = asyncHandler(async(req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password. This link is valid for 10 minutes. <a href="http://localhost:4000/api/user/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Reset Password Link",
      htm: resetURL
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

const resetPassword = asyncHandler(async(req,res)=>{
  const {password}= req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now()}
  })
  if(!user) throw new Error("Token Expired , Please Try again")
  user.password= password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken=undefined;
  await user.save();
  res.json(user)
})


module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
