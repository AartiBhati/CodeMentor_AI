require('dotenv').config()

const { createClient } =require('redis');

const redisclient = createClient({
    username: 'default',
    password:process.env.REDIS_PASS,
    socket: {
        host: 'table-door-island-47368.db.redis.io',
        port: 19819
    }
});


module.exports=redisclient;