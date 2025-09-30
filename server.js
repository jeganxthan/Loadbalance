import express from "express";
import { WebSocketServer } from "ws";
import Redis from "ioredis";

const app = express();

const redisPub = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT) || 6379
});

const redisSub = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT) || 6379
});


const server = app.listen(3000, () => console.log("Server running on 3000"));
const wss = new WebSocketServer({ server, path: "/w" });

const clients = new Map(); // userId → ws connection

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.replace("/w?", ""));
  const userId = params.get("userId"); // e.g., ws://localhost:3000/w?userId=123

  if (!userId) {
    ws.close(1008, "Missing userId");
    return;
  }

  clients.set(userId, ws);
  console.log(`User connected: ${userId}`);

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString()); // { to: "user2", text: "Hello" }
      data.from = userId;
      redisPub.publish("chat", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  });

  ws.on("close", () => {
    clients.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

// Listen to Redis
redisSub.subscribe("chat");
redisSub.on("message", (channel, message) => {
  const data = JSON.parse(message);
  const receiver = clients.get(data.to);

  if (receiver && receiver.readyState === 1) {
    receiver.send(JSON.stringify({ from: data.from, text: data.text }));
  }
});
