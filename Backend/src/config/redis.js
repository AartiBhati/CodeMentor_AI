require('dotenv').config()

const { createClient } =require('redis');

const redisclient = createClient({
    username: 'default',
    password:process.env.REDIS_PASS,
    socket: {
        host: 'positive-egg-cornflower-72622.db.redis.io',
        port: 18869
    }
});


module.exports=redisclient;