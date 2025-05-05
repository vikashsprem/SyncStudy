import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showInterest } from '../apiConfig/MarketplaceService';
import { useAuth } from '../security/AuthContext';

const MarketplaceItem = ({ item, onRefresh }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();

    const handleShowInterest = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        try {
            setLoading(true);
            await showInterest(item.id);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to show interest:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToItemDetails = (e) => {
        e.stopPropagation();
        navigate(`/market-place/${item.id}`);
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/market-place/${item.id}`)}
        >
            {/* Item Image */}
            <div className="relative h-48">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                        {item.condition}
                    </span>
                </div>
            </div>

            {/* Item Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {item.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        ₹{item.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {item.category}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    {userId && item.seller && userId === item.seller.id ? (
                        // Seller View - Show count and navigate to details
                        <button
                            onClick={navigateToItemDetails}
                            className="w-full px-4 py-2 rounded-md text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700"
                        >
                            View Interested Users ({item.interestedUsers?.length || 0})
                        </button>
                    ) : (
                        // Buyer View
                        <button
                            onClick={handleShowInterest}
                            className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : !item.available
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : item.interestedUsers?.some(u => u.id === userId)
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={loading || !item.available}
                        >
                            {loading 
                                ? 'Processing...'
                                : !item.available
                                    ? 'Sold'
                                    : item.interestedUsers?.some(u => u.id === userId)
                                        ? 'Interested'
                                        : 'Show Interest'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceItem; 