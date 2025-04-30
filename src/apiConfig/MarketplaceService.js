import { apiClient } from "./ApiClient";

// List a new item with multiple images
export const listItem = async (formData) => {
    try {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User not authenticated');
        }
        
        // Log the form data for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        // Make the API call (auth header will be added by interceptor)
        const response = await apiClient.post("/api/marketplace/items", formData);
        
        return response;
    } catch (error) {
        console.error('Error in listItem service:', error);
        throw error;
    }
};

// Get item details
export const getItemDetails = (itemId) =>
    apiClient.get(`/api/marketplace/items/${itemId}`);

// Show interest in an item
export const showInterest = (itemId) => 
    apiClient.post(`/api/marketplace/items/${itemId}/interest`);

// Accept interest from a buyer
export const acceptInterest = (itemId, buyerId) => 
    apiClient.post(`/api/marketplace/items/${itemId}/accept/${buyerId}`);

// Get all available items
export const getAllItems = (category, search) => {
    let url = "/api/marketplace/items";
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get(url);
};

// Get my listed items
export const getMyItems = () => 
    apiClient.get("/api/marketplace/my-items");

// Get interested users for an item
export const getInterestedUsers = (itemId) => 
    apiClient.get(`/api/marketplace/items/${itemId}/interested`);

// Get notifications
export const getNotifications = () => 
    apiClient.get("/api/notifications");

// Get unread notifications
export const getUnreadNotifications = () => 
    apiClient.get("/api/notifications/unread");

// Get unread notification count
export const getUnreadNotificationCount = () => 
    apiClient.get("/api/notifications/unread/count");

// Mark notification as read
export const markNotificationAsRead = (notificationId) => 
    apiClient.post(`/api/notifications/${notificationId}/read`);

// Mark all notifications as read
export const markAllNotificationsAsRead = () => 
    apiClient.post("/api/notifications/read-all"); 