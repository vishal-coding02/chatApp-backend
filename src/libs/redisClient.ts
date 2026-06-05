import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST as string,
    port: 6379,
    tls: true,
  },
  username: "default",
  password: process.env.REDIS_PASSWORD as string,
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err: any) => {
  console.log("Redis error:", err.message);
});

(async () => {
  try {
    await client.connect();
  } catch (err: any) {
    console.log("Redis connect failed:", err.message);
  }
})();

export default client;
