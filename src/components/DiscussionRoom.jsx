import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Circle } from 'lucide-react';

const GroupChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey everyone! 👋", sender: "Alice", timestamp: "10:00 AM" },
    { id: 2, text: "Hi Alice! How are you?", sender: "Bob", timestamp: "10:01 AM" },
    { id: 3, text: "I'm doing great! What's new?", sender: "Alice", timestamp: "10:02 AM" },
    { id: 4, text: "How are you?", sender: "You", timestamp: "12:01" }
  ]);

  const [users] = useState([
    { id: 1, name: "Alice", status: "online", lastSeen: "now" },
    { id: 2, name: "Bob", status: "online", lastSeen: "now" },
    { id: 3, name: "Charlie", status: "offline", lastSeen: "5m ago" },
    { id: 4, name: "David", status: "online", lastSeen: "now" },
    { id: 5, name: "Eve", status: "offline", lastSeen: "23m ago" },
    { id: 6, name: "Frank", status: "offline", lastSeen: "1h ago" }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const onlineUsers = users.filter(user => user.status === "online");
  const offlineUsers = users.filter(user => user.status === "offline");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[91vh] w-full mx-auto bg-[#2A2E35] shadow-xl">
      {/* User List Sidebar */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        {/* Online Users Section */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3">Online Users</h3>
          <div className="space-y-2">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center text-gray-300 hover:bg-gray-700 p-2 rounded">
                <Circle className="w-2 h-2 text-green-500 mr-2" fill="currentColor" />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* All Users Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">All Users</h3>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between text-gray-300 hover:bg-gray-700 p-2 rounded">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{user.name}</span>
                </div>
                <span className="text-xs text-gray-500">{user.status === 'online' ? 'Active' : user.lastSeen}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col px-5">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <div className="bg-gray-600 rounded-full p-2">
            <User className="w-6 h-6 text-gray-300" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-white">Group Chat</h2>
            <p className="text-sm text-gray-400">{onlineUsers.length} online · {users.length} total</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] rounded-lg ${
                message.sender === "You" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-900"
              } p-3`}>
                <div className="font-medium text-sm mb-1">
                  {message.sender}
                </div>
                <div className="text-sm break-words">
                  {message.text}
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === "You" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </button>
            </div>
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;