import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const CabShareForm = ({ listing = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureTime: '',
    returnTime: '',
    via: '',
    stops: '',
    seatsAvailable: 1,
    notes: '',
    shareContactInfo: false
  });

  useEffect(() => {
    if (listing) {
      // Convert ISO datetime strings to format acceptable for datetime-local input
      const formatDateForInput = (dateTimeStr) => {
        if (!dateTimeStr) return '';
        try {
          const date = new Date(dateTimeStr);
          return format(date, "yyyy-MM-dd'T'HH:mm");
        } catch (error) {
          return '';
        }
      };

      setFormData({
        source: listing.source || '',
        destination: listing.destination || '',
        departureTime: formatDateForInput(listing.departureTime) || '',
        returnTime: formatDateForInput(listing.returnTime) || '',
        via: listing.via || '',
        stops: listing.stops || '',
        seatsAvailable: listing.seatsAvailable || 1,
        notes: listing.notes || '',
        shareContactInfo: listing.shareContactInfo || false
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format dates to ISO strings for the API
    const preparedData = {
      ...formData,
      departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : null,
      returnTime: formData.returnTime ? new Date(formData.returnTime).toISOString() : null,
      seatsAvailable: parseInt(formData.seatsAvailable, 10) || 1,
    };
    
    onSubmit(preparedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-1">From *</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="E.g., IIITDM Kancheepuram"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">To *</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="E.g., Chennai Airport"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-1">Departure Time *</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Return Time (Optional)</label>
          <input
            type="datetime-local"
            name="returnTime"
            value={formData.returnTime}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Via (Optional)</label>
        <input
          type="text"
          name="via"
          value={formData.via}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Main routes you'll take"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Stops (Optional)</label>
        <input
          type="text"
          name="stops"
          value={formData.stops}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Places where you can pick up passengers"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Seats Available *</label>
        <input
          type="number"
          name="seatsAvailable"
          value={formData.seatsAvailable}
          onChange={handleChange}
          min="1"
          max="10"
          required
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          placeholder="Additional information about your trip"
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="shareContactInfo"
          name="shareContactInfo"
          checked={formData.shareContactInfo}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="shareContactInfo" className="text-gray-300">
          Share my contact info with accepted riders (email and WhatsApp number if available)
        </label>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
        >
          {listing ? 'Update Listing' : 'Create Listing'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CabShareForm; 