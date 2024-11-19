import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;
const PORT = process.env.REACT_APP_PORT || 4000;
const WS_PORT = process.env.REACT_APP_WS_PORT || 4001;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();


// List of allowed origins
const allowedOrigins = ["http://localhost:5173", "https://private-subot-admin.onrender.com", "http://localhost:4173"];

// Custom CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
    }
  }
}));
app.use(express.json()); // Middleware to parse JSON body

// In-memory store for users and chat history
let users = [];
let chatHistory = [];

// WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });
let websocketClients = [];

wss.on("connection", (ws) => {
  websocketClients.push(ws);
  console.log("WebSocket client connected");

  ws.on("close", () => {
    websocketClients = websocketClients.filter((client) => client !== ws);
    console.log("WebSocket client disconnected");
  });
});

// Function to send notifications via WebSocket
const sendNotification = (data) => {
  websocketClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

// Add users who send the /start command
bot.onText(/\/start/, (msg) => {
  const userId = msg.chat.id;
  const username = msg.chat.username || null;

  // Avoid duplicates
  if (!users.some((user) => user.id === userId)) {
    users.push({ id: userId, username });
    chatHistory[userId] = []; // Initialize chat history for the user
  }

  bot.sendMessage(userId, "Welcome! You're now registered. 🚀");
});

// Store incoming messages and notify admin
bot.on("message", (msg) => {
  const userId = msg.chat.id;
  const text = msg.text;

  if (!chatHistory[userId]) {
    chatHistory[userId] = [];
  }

  const message = { sender: "user", text, timestamp: new Date() };
  chatHistory[userId].push(message);

  // Notify via WebSocket
  sendNotification({
    type: "new_message",
    userId,
    username: msg.chat.username || `User ${userId}`,
    message: text,
  });
});

// API to get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// API to send a message to a specific user
app.post("/send-message", (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).send("userId and message are required");
  }

  bot.sendMessage(userId, message)
    .then(() => {
      if (!chatHistory[userId]) {
        chatHistory[userId] = [];
      }
      chatHistory[userId].push({ sender: "bot", text: message, timestamp: new Date() });
      res.send("Message sent!");
    })
    .catch((err) => {
      console.error("Error sending message:", err);
      res.status(500).send("Failed to send message");
    });
});

// API to fetch chat history for a specific user
app.get("/chat-history/:userId", (req, res) => {
  const { userId } = req.params;
  const history = chatHistory[userId] || [];
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});
console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);
