import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TelegramBotComponent.css";

const TelegramBotComponent: React.FC = () => {
  const [users, setUsers] = useState<{ id: number; username: string | null }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; username: string | null } | null>(
    null
  );
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; timestamp: string }[]>([]);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  // Fetch users
  useEffect(() => {
    axios
      .get("https://private-subot-admin.onrender.com/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch chat history when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchChatHistory(selectedUser.id);
    }
  }, [selectedUser]);

  // Function to fetch chat history
  const fetchChatHistory = (userId: number) => {
    axios
      .get(`https://private-subot-admin.onrender.com/chat-history/${userId}`)
      .then((response) => setChatHistory(response.data))
      .catch((error) => console.error("Error fetching chat history:", error));
  };

  // Send a message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    axios
      .post("https://private-subot-admin.onrender.com/send-message", {
        userId: selectedUser.id,
        message,
      })
      .then(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: message, timestamp: new Date().toISOString() },
        ]);
        setMessage("");
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    const ws = new WebSocket("ws://private-subot-admin.onrender.com");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_message") {
        setNotifications((prev) => [
          ...prev,
          `New message from ${data.username || `User ${data.userId}`}: ${data.message}`,
        ]);

        // If the message is from the currently selected user, update the chat history
        if (selectedUser && selectedUser.id === data.userId) {
          fetchChatHistory(data.userId);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [selectedUser]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button
                className={selectedUser?.id === user.id ? "selected" : ""}
                onClick={() => setSelectedUser(user)}
              >
                {user.username || `User ${user.id}`}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        {selectedUser ? (
          <>
            <div className="chat-history">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-message ${chat.sender === "bot" ? "bot" : "user"}`}
                >
                  <div className="message-content">{chat.text}</div>
                  <div className="timestamp">
                    {new Date(chat.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="default-message">
            <p>Select a user to view chat</p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ width: "25%", background: "#f0f0f0", color: 'black', padding: "10px" }}>
        <h2>Notifications</h2>
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TelegramBotComponent;
