import React, { useState, useEffect, useRef } from 'react';
import { 
  getUnreadNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../apiConfig/NotificationService';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '../apiConfig/ApiClient';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [directApiData, setDirectApiData] = useState(null);
  const { fetchUnreadCount, resetUnreadCount } = useNotifications();
  const dropdownRef = useRef(null);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Try a direct API call as well
      tryDirectApiCall();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Try a direct API call to see what's in the database
  const tryDirectApiCall = async () => {
    try {
      console.log('Making direct API call to fetch notifications');
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      console.log('User ID from localStorage:', userId);
      console.log('Using token:', token ? 'Token found' : 'No token');
      
      const response = await apiClient.get('/api/notifications');
      console.log('Direct API call response:', response);
      setDirectApiData(response.data);
      
      // If we got data directly but not through our service, use it
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('Using data from direct API call');
        setNotifications(response.data.filter(n => !n.read));
      }
    } catch (error) {
      console.error('Direct API call failed:', error);
    }
  };

  const loadNotifications = async () => {
    setError(null);
    try {
      setLoading(true);
      console.log('Fetching unread notifications...');
      const response = await getUnreadNotifications();
      console.log('Received notifications response:', response);
      
      // Handle different response formats
      let notificationsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          notificationsData = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          notificationsData = response.data.content;
        } else {
          console.warn('Unexpected notification data format:', response.data);
        }
      }
      
      console.log('Processed notifications:', notificationsData);
      
      // Only update if we have data
      if (notificationsData && notificationsData.length > 0) {
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      console.log('Marking notification as read:', notificationId);
      await markNotificationAsRead(notificationId);
      // Remove the marked notification from the list
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Update unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('Failed to mark as read. Please try again.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log('Marking all notifications as read');
      await markAllNotificationsAsRead();
      setNotifications([]);
      // Reset unread count to 0
      resetUnreadCount();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setError('Failed to mark all as read. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error('Error formatting timestamp:', timestamp, e);
      return 'some time ago';
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    console.log('Notification type:', type);
    switch (type) {
      case 'INTEREST_SHOWN':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'INTEREST_ACCEPTED':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'ITEM_UNAVAILABLE':
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-200"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
            <button 
              onClick={loadNotifications} 
              className="block mx-auto mt-2 text-blue-500 hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {directApiData && directApiData.length > 0 ? (
              <div>
                <p>Found {directApiData.length} notifications but all are marked as read.</p>
                <button 
                  onClick={tryDirectApiCall} 
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  Check Again
                </button>
              </div>
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li 
                key={notification.id || index} 
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-800">{notification.message || 'No message'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.createdAt ? formatTimestamp(notification.createdAt) : 'recent'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    className="ml-2 text-xs text-gray-500 hover:text-blue-600"
                    disabled={!notification.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debug Information */}
      <div className="border-t border-gray-200 p-2 text-xs bg-gray-50">
        <button 
          onClick={tryDirectApiCall}
          className="text-blue-600 hover:text-blue-800"
        >
          Refresh Data
        </button>
        <p className="text-gray-500 mt-1">User ID: {localStorage.getItem('userId') || 'Not found'}</p>
      </div>
    </div>
  );
};

export default NotificationDropdown; 