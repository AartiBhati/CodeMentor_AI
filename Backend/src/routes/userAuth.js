const express=require("express");

const authRouter=express.Router();
const {register,login,logout,getProfile,adminRegister,deleteProfile,forgotPassword,resetPassword}=require('../controllers/userAuthenticate');
const userMiddleware=require("../middleware/userMiddleware");
const adminMiddleware=require('../middleware/adminMiddleware');


//Register
authRouter.post('/register',register);

//login
authRouter.post('/login',login);

//logout
authRouter.post('/logout',userMiddleware,logout);

// // Forgot Password
// authRouter.post('/forgot-password', forgotPassword);

// // Reset Password
// authRouter.post('/reset-password/:token', resetPassword);

//GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile);

//delete Profile
authRouter.delete("/profile",userMiddleware,deleteProfile);

//admin Register
authRouter.post('/admin/register',adminMiddleware,adminRegister);

authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})


module.exports=authRouter;