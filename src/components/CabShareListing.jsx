import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../security/AuthContext';
import CabShareService from '../apiConfig/CabShareService';

const CabShareListing = ({ listing, onDelete, onEdit, isOwner = false, onRefresh }) => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showInterestedUsers, setShowInterestedUsers] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  const handleShowInterest = async () => {
    try {
      setLoading(true);
      await CabShareService.showInterest(listing.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to show interest:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInterestedUsers = async () => {
    if (!isOwner) return;
    
    try {
      setLoadingUsers(true);
      const response = await CabShareService.getInterestedUsers(listing.id);
      setInterestedUsers(response.data || []);
      setShowInterestedUsers(true);
    } catch (error) {
      console.error('Failed to load interested users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAcceptInterest = async (userId) => {
    try {
      setLoadingUsers(true);
      await CabShareService.acceptInterest(listing.id, userId);
      
      // Reload interested users
      const response = await CabShareService.getInterestedUsers(listing.id);
      setInterestedUsers(response.data || []);
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to accept interest:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleInterestedUsers = () => {
    if (showInterestedUsers) {
      setShowInterestedUsers(false);
    } else {
      loadInterestedUsers();
    }
  };

  // Check if the current user is interested in this listing
  const isInterested = listing.interestedUsers?.some(u => u.id === userId);
  
  // Check if the current user has been accepted for this listing
  const isAccepted = listing.acceptedUsers?.some(u => u.id === userId);
  
  // Calculate seats info
  const seatsTaken = listing.seatsTaken || 0;
  const seatsAvailable = listing.seatsAvailable || 1;
  const remainingSeats = seatsAvailable - seatsTaken;
  const isFull = remainingSeats <= 0;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 border border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-300">
            {listing.source} → {listing.destination}
          </h3>
          <p className="text-gray-300 mt-1">
            <span className="font-medium text-indigo-300">When:</span> {formatDateTime(listing.departureTime)}
          </p>
          
          {listing.returnTime && (
            <p className="text-gray-300">
              <span className="font-medium text-indigo-300">Return:</span> {formatDateTime(listing.returnTime)}
            </p>
          )}
          
          {listing.via && (
            <p className="text-gray-300">
              <span className="font-medium text-indigo-300">Via:</span> {listing.via}
            </p>
          )}
          
          {listing.stops && (
            <p className="text-gray-300">
              <span className="font-medium text-indigo-300">Stops:</span> {listing.stops}
            </p>
          )}
          
          <p className="text-gray-300">
            <span className="font-medium text-indigo-300">Seats:</span> {seatsTaken} taken / {seatsAvailable} available
            {isFull && <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">FULL</span>}
          </p>
          
          {listing.notes && (
            <p className="text-gray-300 mt-2">
              <span className="font-medium text-indigo-300">Notes:</span> {listing.notes}
            </p>
          )}
          
          {/* Show contact info if this user is accepted and info sharing is enabled */}
          {isAccepted && listing.shareContactInfo && (
            <div className="mt-3 p-2 bg-gray-700 rounded border border-indigo-500">
              <h4 className="text-indigo-300 font-medium">Contact Information:</h4>
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Email:</span> {listing.user.email}
              </p>
              {listing.user.whatsappNumber && (
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">WhatsApp:</span> {listing.user.whatsappNumber}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="ml-4 min-w-[140px] flex flex-col">
          <p className="text-sm text-gray-400 mb-2">Posted by: {listing.user.name || listing.user.username}</p>
          
          {isOwner ? (
            /* Owner Actions */
            <div className="space-y-2">
              <button 
                onClick={() => onEdit(listing)} 
                className="w-full px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(listing.id)} 
                className="w-full px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button 
                onClick={toggleInterestedUsers}
                className="w-full px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {showInterestedUsers ? 'Hide Requests' : 'Show Requests'}
              </button>
            </div>
          ) : (
            /* Non-owner Actions */
            <button
              onClick={handleShowInterest}
              disabled={loading || isFull || isInterested || isAccepted}
              className={`w-full px-3 py-1.5 rounded text-white font-medium transition-colors ${
                loading ? 'bg-gray-500 cursor-not-allowed' :
                isFull ? 'bg-red-700 cursor-not-allowed' :
                isAccepted ? 'bg-green-700 cursor-default' :
                isInterested ? 'bg-blue-700 cursor-default' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' :
               isFull ? 'Full' :
               isAccepted ? 'Accepted' :
               isInterested ? 'Interested' :
               'Show Interest'}
            </button>
          )}
        </div>
      </div>
      
      {/* Interested Users Section (for owner only) */}
      {isOwner && showInterestedUsers && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <h4 className="text-indigo-300 font-medium mb-2">Interested Riders</h4>
          
          {loadingUsers ? (
            <p className="text-gray-400 italic">Loading...</p>
          ) : interestedUsers.length === 0 ? (
            <p className="text-gray-400 italic">No riders interested yet</p>
          ) : (
            <div className="space-y-2">
              {interestedUsers.map(user => {
                const isUserAccepted = listing.acceptedUsers?.some(u => u.id === user.id);
                
                return (
                  <div key={user.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>
                    
                    {!isUserAccepted && !isFull && (
                      <button
                        onClick={() => handleAcceptInterest(user.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        disabled={loadingUsers}
                      >
                        {loadingUsers ? '...' : 'Accept'}
                      </button>
                    )}
                    
                    {isUserAccepted && (
                      <span className="px-3 py-1 bg-green-700 text-white text-sm rounded">Accepted</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CabShareListing; 