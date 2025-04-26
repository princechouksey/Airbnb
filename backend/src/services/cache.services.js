const Redis = require('ioredis');

// console.log('env---->', process.env.REDIS_HOST)

const cacheClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    // maxRetriesPerRequest: null, // disable retry limit
})
cacheClient.on("connect", () => {
    console.log("redis connected");
  });
  
  cacheClient.on("error", () => {
    console.log("error in running redis");
  });
module.exports = cacheClient;
