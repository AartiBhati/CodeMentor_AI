const express=require("express");

const authRouter=express.Router();
const {register,login,logout,getProfile,adminRegister,deleteProfile}=require('../controllers/userAuthenticate');
const userMiddleware=require("../middleware/userMiddleware");
const adminMiddleware=require('../middleware/adminMiddleware');


//Register
authRouter.post('/register',register);

//login
authRouter.post('/login',login);

//logout
authRouter.post('/logout',userMiddleware,logout);

//GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile);

//delete Profile
authRouter.delete("/profile",userMiddleware,deleteProfile);

//admin Register
authRouter.post('/admin/register',adminMiddleware,adminRegister);


module.exports=authRouter;