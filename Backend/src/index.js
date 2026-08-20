require('dotenv').config();
const dns=require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express=require("express")
const app=express();

const main=require("./config/db")
const cookieParser=require("cookie-parser");
const authRouter=require('./routes/userAuth');
const problemRouter=require("./routes/problemCreator");
const redisclient=require("./config/redis");
const submitRouter = require('./routes/submit');
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors=require('cors')


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));


app.use(express.json());
app.use(cookieParser());

//user router
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/chat',aiRouter);
app.use("/video",videoRouter);




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

