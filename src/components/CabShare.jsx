import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import CabShareService from '../apiConfig/CabShareService';
import CabShareListing from './CabShareListing';
import CabShareForm from './CabShareForm';
import Modal from './Modal';

const CabShare = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    departureDate: '',
  });

  // Fetch user's active listings on component mount
  useEffect(() => {
    if (activeTab === 'myListings') {
      fetchMyListings();
    }
  }, [activeTab]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const response = await CabShareService.getUserListings();
      setMyListings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your listings. Please try again.');
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const departureDate = searchParams.departureDate ? format(new Date(searchParams.departureDate), "yyyy-MM-dd'T'HH:mm:ss") : '';
      
      const response = await CabShareService.findMatches(
        searchParams.source,
        searchParams.destination,
        departureDate
      );
      
      setListings(response.data);
    } catch (err) {
      setError('Error searching for rides. Please try again.');
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateListing = () => {
    setCurrentListing(null);
    setShowModal(true);
  };

  const handleEditListing = (listing) => {
    setCurrentListing(listing);
    setShowModal(true);
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await CabShareService.deleteListing(listingId);
      // Refresh listings after deletion
      fetchMyListings();
    } catch (err) {
      setError('Failed to delete listing. Please try again.');
      console.error('Error deleting listing:', err);
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (currentListing) {
        // Update existing listing
        await CabShareService.updateListing(currentListing.id, formData);
      } else {
        // Create new listing
        await CabShareService.createListing(formData);
      }
      
      // Close modal and refresh listings
      setShowModal(false);
      fetchMyListings();
      
      // If we're on the search tab, also refresh search results if we have search params
      if (activeTab === 'search' && (searchParams.source || searchParams.destination || searchParams.departureDate)) {
        handleSearch({ preventDefault: () => {} });
      }
    } catch (err) {
      setError(`Failed to ${currentListing ? 'update' : 'create'} listing. Please try again.`);
      console.error('Error submitting form:', err);
    }
  };

  // Function to refresh listings
  const refreshListings = () => {
    if (activeTab === 'search' && (searchParams.source || searchParams.destination || searchParams.departureDate)) {
      handleSearch({ preventDefault: () => {} });
    } else if (activeTab === 'myListings') {
      fetchMyListings();
    }
  };

  // Function to check if a listing is available (in the future and has seats)
  const isListingAvailable = (listing) => {
    // Check if it's a future listing
    const departureTime = new Date(listing.departureTime);
    const now = new Date();
    const isFuture = departureTime > now;
    
    // Check if it has available seats
    const seatsTaken = listing.seatsTaken || 0;
    const seatsAvailable = listing.seatsAvailable || 1;
    const hasSeats = seatsAvailable > seatsTaken;
    
    return isFuture && hasSeats;
  };

  // Filter listings to only show available ones if looking for rides
  const availableListings = listings.filter(isListingAvailable);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 text-gray-100 rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-purple-300">Cab Sharing</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'search' 
            ? 'border-b-2 border-purple-500 text-purple-300' 
            : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('search')}
        >
          Find a Ride
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'myListings' 
            ? 'border-b-2 border-purple-500 text-purple-300' 
            : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('myListings')}
        >
          My Listings
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Search tab */}
      {activeTab === 'search' && (
        <div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-purple-300">Search for Rides</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={searchParams.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Source location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Destination location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={searchParams.departureDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-300">Available Rides</h2>
              <button
                onClick={handleCreateListing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Offer a Ride
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p>Loading...</p>
              </div>
            ) : availableListings.length > 0 ? (
              <div className="space-y-4">
                {availableListings.map(listing => (
                  <CabShareListing
                    key={listing.id}
                    listing={listing}
                    isOwner={false}
                    onRefresh={refreshListings}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400">
                  {listings.length > 0 
                    ? "No rides with available seats found for your search criteria."
                    : "No rides found matching your criteria."}
                </p>
                <p className="text-gray-400 mt-2">Try different search parameters or offer a ride yourself!</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* My Listings tab */}
      {activeTab === 'myListings' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-300">My Listings</h2>
            <button
              onClick={handleCreateListing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create New Listing
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading...</p>
            </div>
          ) : myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map(listing => (
                <CabShareListing
                  key={listing.id}
                  listing={listing}
                  isOwner={true}
                  onEdit={handleEditListing}
                  onDelete={handleDeleteListing}
                  onRefresh={refreshListings}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">You haven't created any cab share listings yet.</p>
              <button
                onClick={handleCreateListing}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Create Your First Listing
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={currentListing ? 'Edit Listing' : 'Create New Listing'}>
          <div className="p-4 bg-gray-800 rounded-lg text-white">
            <CabShareForm
              listing={currentListing}
              onSubmit={handleSubmitForm}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CabShare; 