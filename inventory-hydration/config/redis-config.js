import { createClient } from 'redis';

const useRedis = async () => {
    const client = createClient({
        url: `${process.env.REDIS_PREFIX}://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`,
        password: process.env.REDIS_KEY ? process.env.REDIS_KEY : null,
    });
    client.on('message', (channel, message) => {
        console.log(`## Redis channel [${channel}] message: ${message}.`);
    });
    client.on("error", (err) => {
        console.log("## Redis error: " + err);
    });
    client.on("end", () => {
        console.log("## Redis connection ended.");
    });
    client.on("connect", () => {
        console.log("## Redis connected.");
    });
    client.on("reconnecting", () => {
        console.log("## Redis reconnecting...");
    });
    await client.connect();
    return client;
};

export default useRedis;