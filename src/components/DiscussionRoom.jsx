import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Circle, Menu, X } from 'lucide-react';
import { apiClient } from '../apiConfig/ApiClient';
import { useAuth } from '../security/AuthContext';
import { formatDistanceToNow } from 'date-fns';
// We're now using the global SockJS and Stomp directly from the CDN
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';

const DiscussionRoom = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const { username, userId } = useAuth();

  const user = {
    id: userId,
    name: username.split("@")[0]
  }

  // Normal REST API call to get messages
  const loadMessages = async () => {
    try {
      const response = await apiClient.get('/api/discussion/messages');
      setMessages(response.data);
      setError("");
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError("Failed to load messages. Please try again later.");
    }
  };

  // REST API call to get users
  const loadUsers = async () => {
    try {
      const response = await apiClient.get('/api/discussion/users');
      setOnlineCount(response.data.onlineCount);
      // In a real app, you would get the list of users from the API
      setUsers([
        { id: 1, name: user?.name || "You", status: "online", lastSeen: "now" },
        { id: 2, name: "Alice", status: "online", lastSeen: "now" },
        { id: 3, name: "Bob", status: "offline", lastSeen: "5m ago" },
        { id: 4, name: "Charlie", status: "offline", lastSeen: "23m ago" }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to load user data. Please try again later.");
    }
  };

  // Connect to WebSocket
  const connectWebSocket = () => {
    // Get authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      setError('No authentication token found. Please log in again.');
      return false;
    }

    try {
      // Make sure SockJS is available globally
      if (!window.SockJS) {
        console.error('SockJS not loaded');
        setError('SockJS library not loaded. Using REST API fallback.');
        return false;
      }

      // Create WebSocket connection
      const socketUrl = `${apiClient.defaults.baseURL}/ws`;
      console.log('Connecting to WebSocket at:', socketUrl);
      
      const socket = new window.SockJS(socketUrl);
      const client = Stomp.over(socket);
      
      // Configure client
      client.connectHeaders = {
        'Authorization': `Bearer ${token}`
      };
      
      // Debug
      client.debug = (msg) => {
        console.log('STOMP:', msg);
      };

      // Connect
      client.connect(
        { 'Authorization': `Bearer ${token}` },
        () => {
          // Success callback
          console.log('Connected to WebSocket');
          setConnected(true);
          setError('');
          
          // Subscribe to topic
          client.subscribe('/topic/public', (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log('Received message:', receivedMessage);
              
              // Only add message to state if we don't already have it
              // We use the message.id to check this
              setMessages((prevMessages) => {
                // Check if message already exists in our state
                const messageExists = prevMessages.some(msg => 
                  msg.id === receivedMessage.id || 
                  (msg.text === receivedMessage.text && 
                   msg.sender.id === receivedMessage.senderId && 
                   msg.sender.name === receivedMessage.senderName)
                );
                
                if (messageExists) {
                  // Message already exists, don't add it again
                  return prevMessages;
                }
                
                // Add the new message
                return [...prevMessages, {
                  id: receivedMessage.id || Math.random().toString(),
                  text: receivedMessage.text,
                  sender: {
                    id: receivedMessage.senderId,
                    name: receivedMessage.senderName
                  },
                  timestamp: receivedMessage.timestamp || new Date().toISOString()
                }];
              });
            } catch (e) {
              console.error('Error processing message:', e);
            }
          });
        },
        (error) => {
          // Error callback
          console.error('STOMP connection error:', error);
          setConnected(false);
          setError('Could not connect to chat server. Using REST API fallback.');
          return false;
        }
      );
      
      stompClient.current = client;
      return true;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setError('Error connecting to chat. Using REST API fallback.');
      return false;
    }
  };

  // Disconnect from WebSocket
  const disconnectWebSocket = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.disconnect();
      setConnected(false);
    }
  };

  // On component mount
  useEffect(() => {
    // Load initial data
    loadMessages();
    loadUsers();
    
    // Try to connect to WebSocket
    const websocketConnected = connectWebSocket();
    
    // If WebSocket fails, poll for new messages
    let intervalId;
    if (!websocketConnected) {
      intervalId = setInterval(() => {
        loadMessages();
      }, 5000);
    }
    
    // Clean up on unmount
    return () => {
      disconnectWebSocket();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send a message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // Try WebSocket first
      if (connected && stompClient.current && stompClient.current.connected) {
        console.log('Sending message via WebSocket, user:', user);
        
        // We don't add the message to UI directly anymore
        // We'll let the WebSocket subscription handle it
        const messageData = {
          text: newMessage,
          senderId: user.id,
          senderName: user.name || "Anonymous"
        };
        
        console.log('Message data:', messageData);
        
        // Send message via WebSocket
        stompClient.current.send(
          "/app/chat.sendMessage", 
          {}, 
          JSON.stringify(messageData)
        );
        
        // Clear input
        setNewMessage("");
      } else {
        // Fall back to REST API
        await apiClient.post('/api/discussion/messages', { text: newMessage });
        setNewMessage("");
        // In REST API mode, we need to reload messages to see our new message
        await loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  const onlineUsers = users.filter(user => user.status === "online");

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-[91vh] w-full mx-auto bg-[#2A2E35] shadow-xl relative">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden absolute top-0 left-4 z-30 text-white p-2 rounded-full  h-16 flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* User List Sidebar - Hidden on mobile unless toggled */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex md:w-80 w-full md:static absolute z-10 h-full md:h-auto bg-[#2A2E35] border-r border-gray-700 flex-col`}>
        {/* Online Users Section */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-3 pt-8 md:pt-0">Online Users {connected && <span className="text-green-500 text-xs">(Connected)</span>}</h3>
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
      <div className="flex-1 flex flex-col px-2 md:px-5">
        {/* Chat Header */}
        <div className="flex items-center justify-center md:justify-start h-16 border-b border-gray-700">
          <div className="w-full flex items-center justify-center md:justify-start px-4">
            <div className="flex items-center">
              <div className="bg-gray-600 rounded-full p-2">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-semibold text-white">Group Chat</h2>
                <p className="text-sm text-gray-400">{onlineCount} online · {users.length} total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 text-white p-2 m-2 rounded">
            {error}
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === user.id ? "justify-end" : "justify-start"} w-full`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] rounded-lg ${
                  message.sender.id === user.id 
                    ? "bg-blue-500 text-white" 
                    : "bg-white text-gray-900"
                } p-3 break-words`}>
                  <div className="font-medium text-sm mb-1">
                    {message.sender.name}
                  </div>
                  <div className="text-sm break-words">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.sender.id === user.id ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-2 md:p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 p-2 md:p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white rounded-full p-2 md:p-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;