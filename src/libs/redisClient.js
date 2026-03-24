const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err) => {
  console.log("Redis error:", err.message);
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log("Redis connect failed:", err.message);
  }
})();

module.exports = client;
