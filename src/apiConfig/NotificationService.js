import { apiClient } from './ApiClient';

// Get current user ID from token
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Log token for debugging
    console.log('Current auth token:', token);
    
    return localStorage.getItem('userId');
  } catch (error) {
    console.error('Error getting user ID from localStorage:', error);
    return null;
  }
};

// Service for handling notification-related API calls
export const getNotifications = () => {
  try {
    console.log('Fetching all notifications for user ID:', getCurrentUserId());
    return apiClient.get('/api/notifications');
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
};

export const getUnreadNotifications = async () => {
  const userId = getCurrentUserId();
  console.log('Attempting to fetch unread notifications for user ID:', userId);
  
  try {
    // Try the standard endpoint
    console.log('Attempting to fetch unread notifications from standard endpoint');
    const response = await apiClient.get('/api/notifications/unread');
    console.log('Standard endpoint response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching unread notifications from standard endpoint:', error);
    
    // Try with explicit parameters
    try {
      console.log('Attempting to fetch unread notifications with userId parameter');
      const response = await apiClient.get(`/api/notifications/unread?userId=${userId}`);
      console.log('User-specific endpoint response:', response);
      return response;
    } catch (secondError) {
      console.error('Error fetching with userId parameter:', secondError);
      
      // If that fails, try alternative endpoint
      try {
        console.log('Attempting to fetch unread notifications from alternative endpoint');
        const response = await apiClient.get('/api/notifications?read=false');
        console.log('Alternative endpoint response:', response);
        return response;
      } catch (thirdError) {
        console.error('Error fetching unread notifications from alternative endpoint:', thirdError);
        
        // Return empty array rather than throwing to avoid breaking the UI
        return { data: [] };
      }
    }
  }
};

export const getUnreadNotificationCount = async () => {
  const userId = getCurrentUserId();
  console.log('Fetching notification count for user ID:', userId);
  
  try {
    // Try the dedicated count endpoint
    console.log('Attempting to fetch notification count from dedicated endpoint');
    const response = await apiClient.get('/api/notifications/unread/count');
    console.log('Count endpoint response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching unread notification count from dedicated endpoint:', error);
    
    // If that fails, try fetching all unread notifications and count them
    try {
      console.log('Attempting to calculate count by fetching all unread notifications');
      const unreadResponse = await getUnreadNotifications();
      
      let count = 0;
      if (unreadResponse.data) {
        if (Array.isArray(unreadResponse.data)) {
          count = unreadResponse.data.length;
        } else if (unreadResponse.data.content && Array.isArray(unreadResponse.data.content)) {
          count = unreadResponse.data.content.length;
        }
      }
      
      console.log('Calculated notification count:', count);
      return { data: count };
    } catch (secondError) {
      console.error('Error calculating notification count:', secondError);
      return { data: 0 }; // Default to 0 to avoid UI errors
    }
  }
};

export const markNotificationAsRead = (notificationId) => {
  try {
    console.log(`Marking notification ${notificationId} as read for user:`, getCurrentUserId());
    return apiClient.post(`/api/notifications/${notificationId}/read`);
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

export const markAllNotificationsAsRead = () => {
  try {
    console.log('Marking all notifications as read for user:', getCurrentUserId());
    return apiClient.post('/api/notifications/mark-all-read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}; 