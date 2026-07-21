
const redisclient = require("../config/redis");
const User=require("../models/user")
const validate=require("../utility/validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Submission=require("../models/submission")



const register=async(req,res)=>{
    try{

        //validate the data;
        validate(req.body);
        const {firstName,emailId, password}=req.body;

        //We can't directly create user without converting the password to the hashcode
        req.body.password=await bcrypt.hash(password,10);
        req.body.role='user';

        //we have to provide the token to the user.

        const user=await User.create(req.body);
        
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        const token=jwt.sign({_id:user._id,emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(201).json({
            user:reply,
            message:"User Registered Successfully"
        });
         
    }
    catch(err){
        res.status(400).send('Error '+err.message);
    }
}


const login=async(req,res)=>{
    try{
        const {emailId, password}=req.body;
        if(!emailId)throw new Error("Invalid Credentials");
        if(!password)throw new Error("Invalid Credentials");

        const user=await User.findOne({emailId});
        if(!user)throw new Error("User doesn't exist");

        const match=bcrypt.compare(password,user.password);
        if(!match)throw new Error("Invalid Credentials");

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }


        //you need to send the token here too.
        const token=jwt.sign({_id:user._id,emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(200).send("Login Successful")

    }catch(err){
        res.status(401).json({
            user:reply,
            message:"Login Successully"
        });
    }
}



//logout feature
const logout=async(req,res)=>{
    try{
        //add token to the Redis blocklist

        const {token}=req.cookies;
        const payload=jwt.decode(token);

        await redisclient.set(`token:${token}`,'Blocked');
        await redisclient.expireAt(`token:${token}`,payload.exp);


        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logged out Successfully")
    }
    catch(err){
        res.status(503).send("Error: "+err.message);
    }
}


const adminRegister=async(req,res)=>{
    
    try{
        // if(req.result.role!='admin')throw new Error("Invalid Token");
        //validate the data;
        validate(req.body);
        const {firstName,emailId, password}=req.body;

        //We can't directly create user without converting the password to the hashcode
        req.body.password=await bcrypt.hash(password,10);

        //we have to provide the token to the user.

        const user=await User.create(req.body);
        
        const token=jwt.sign({_id:user._id,emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("Admin Registered Successfully");
         
    }
    catch(err){
        res.status(400).send('Error '+err.message);
    }

}

const getProfile=async(req,res)=>{
    try{

    }catch(err){
        
    }
}

const deleteProfile=async(req,res)=>{
    try{
        const userId=req.result._id;
        //userSchema deletion
        await User.findByIdAndDelete(userId);

        //Delete the submissions of this user too
        // await Submission.deleteMany({userId});

        res.status(200).send("Deleted Successfully");

    }catch(err){
        res.status(500).send("Inernal Server Error");
    }
}


module.exports={register,login,logout,getProfile,adminRegister};