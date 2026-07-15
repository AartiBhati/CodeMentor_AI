//It's a rate limiter for the user so that the user's don't request submission frequently. They must wait for a while.
const redisClient=require("../config/redis");


const submitCodeRateLimiter=async (req,res,next)=>{
    const userId=req.result._id;
    const redisKey=`submit_cooldown:${userId}`;

    try{
        //Check if user has a recent submission
        const exists=await redisClient.exists(redisKey);
        if(exists){
            return res.status(429).json({
                error:'Please wait 10 seconds before submitting again.'
            });
        }

        //Set cooldown period
        await redisClient.set(redisKey,'cooldown_active',{
            EX:10,//Expiry time is  10 seconds
            NX:true //Only set if not exists
        });

        next();
    }
    catch(err){
        console.error("Submit Rate Limiter Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}


module.exports=submitCodeRateLimiter;