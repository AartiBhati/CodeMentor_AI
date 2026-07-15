require('dotenv').config();
const express=require("express")
const app=express();

const main=require("./config/db")
const cookieParser=require("cookie-parser");
const authRouter=require('./routes/userAuth');
const problemRouter=require("./routes/problemCreator");
const redisclient=require("./config/redis");
const submitRouter = require('./routes/submit');


app.use(express.json());
app.use(cookieParser());

//user router
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);



const InitializeConnection=async()=>{
    try{
        await Promise.all([main(),redisclient.connect()]);
        console.log("DB Connected")

        app.listen(process.env.PORT,()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error "+err.message);
    }
}


InitializeConnection();

