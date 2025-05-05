import { apiClient } from './ApiClient';

class CabShareService {
  // Get user's active cab share listings
  getUserListings() {
    return apiClient.get('/api/cabshare/listings/my');
  }

  // Get a specific cab share listing by ID
  getListingById(id) {
    return apiClient.get(`/api/cabshare/listings/${id}`);
  }

  // Create a new cab share listing
  createListing(listingData) {
    return apiClient.post('/api/cabshare/listings', listingData);
  }

  // Update an existing cab share listing
  updateListing(id, listingData) {
    return apiClient.put(`/api/cabshare/listings/${id}`, listingData);
  }

  // Delete (deactivate) a cab share listing
  deleteListing(id) {
    return apiClient.delete(`/api/cabshare/listings/${id}`);
  }

  // Find matching cab share listings based on criteria
  findMatches(source, destination, departureTime) {
    let url = '/api/cabshare/matches?';
    
    if (source) url += `source=${encodeURIComponent(source)}&`;
    if (destination) url += `destination=${encodeURIComponent(destination)}&`;
    if (departureTime) url += `departureTime=${encodeURIComponent(departureTime)}`;
    
    return apiClient.get(url);
  }
  
  // Show interest in a cab share listing
  showInterest(listingId) {
    return apiClient.post(`/api/cabshare/listings/${listingId}/interest`);
  }
  
  // Accept interest from a user
  acceptInterest(listingId, userId) {
    return apiClient.post(`/api/cabshare/listings/${listingId}/accept/${userId}`);
  }
  
  // Get interested users for a listing
  getInterestedUsers(listingId) {
    return apiClient.get(`/api/cabshare/listings/${listingId}/interested`);
  }
}

export default new CabShareService(); 