import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUnreadNotificationCount } from '../apiConfig/NotificationService';
import { useAuth } from '../security/AuthContext';

// Create notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Function to fetch unread notification count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      console.log('Fetching unread notification count...');
      const response = await getUnreadNotificationCount();
      console.log('Received unread count:', response.data);
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  // Function to manually update the unread count
  const updateUnreadCount = (count) => {
    console.log('Manually updating unread count to:', count);
    setUnreadCount(count);
  };

  // Function to increment the unread count (for real-time notifications)
  const incrementUnreadCount = () => {
    console.log('Incrementing unread count');
    setUnreadCount(prev => prev + 1);
  };

  // Function to reset the unread count
  const resetUnreadCount = () => {
    console.log('Resetting unread count to 0');
    setUnreadCount(0);
  };

  // Fetch unread count on component mount and when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Auth status changed, fetching notification count');
      fetchUnreadCount();
      
      // Poll for notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Context value
  const contextValue = {
    unreadCount,
    fetchUnreadCount,
    updateUnreadCount,
    incrementUnreadCount,
    resetUnreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 