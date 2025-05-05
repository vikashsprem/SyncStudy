import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetails, showInterest, getInterestedUsers, acceptInterest } from '../apiConfig/MarketplaceService';
import { useAuth } from '../security/AuthContext';

const MarketplaceItemDetail = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interestedUsers, setInterestedUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        loadItemDetails();
    }, [itemId]);

    useEffect(() => {
        // If user is seller, load interested users
        if (item && userId === item.seller?.id) {
            loadInterestedUsers();
        }
    }, [item, userId]);

    const loadItemDetails = async () => {
        try {
            setLoading(true);
            const response = await getItemDetails(itemId);
            setItem(response.data);
        } catch (err) {
            setError('Failed to load item details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadInterestedUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await getInterestedUsers(itemId);
            setInterestedUsers(response.data || []);
        } catch (err) {
            console.error('Failed to load interested users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleShowInterest = async () => {
        try {
            setLoading(true);
            await showInterest(itemId);
            loadItemDetails(); // Refresh the item details
        } catch (err) {
            setError('Failed to show interest');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInterest = async (buyerId) => {
        try {
            setLoadingUsers(true);
            await acceptInterest(itemId, buyerId);
            // Refresh both the item details and interested users
            await loadItemDetails();
            await loadInterestedUsers();
        } catch (err) {
            setError('Failed to accept interest');
            console.error(err);
        } finally {
            setLoadingUsers(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-red-600 text-lg mb-4">{error}</div>
                <button
                    onClick={() => navigate('/market-place')}
                    className="text-blue-600 hover:text-blue-700"
                >
                    Back to Marketplace
                </button>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-gray-600 text-lg mb-4">Item not found</div>
                <button
                    onClick={() => navigate('/market-place')}
                    className="text-blue-600 hover:text-blue-700"
                >
                    Back to Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/market-place')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Marketplace
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="relative h-96 md:h-full">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">No image available</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                                    {item.condition}
                                </span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {item.title}
                                    </h1>
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                                            ₹{item.price}
                                        </p>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            item.available 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.available ? 'Available' : 'Sold'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span>{item.category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Listed by: {item.seller?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Listed: {new Date(item.listedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Description
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-6">
                                    {userId !== item.seller?.id ? (
                                        <button
                                            onClick={handleShowInterest}
                                            disabled={loading || !item.available || item.interestedUsers?.some(u => u.id === userId)}
                                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
                                                loading 
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : !item.available
                                                        ? 'bg-gray-500 cursor-not-allowed'
                                                        : item.interestedUsers?.some(u => u.id === userId)
                                                            ? 'bg-green-600'
                                                            : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            {loading 
                                                ? 'Processing...'
                                                : !item.available
                                                    ? 'Sold Out'
                                                    : item.interestedUsers?.some(u => u.id === userId)
                                                        ? 'Interested'
                                                        : 'Show Interest'}
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Your Listing
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    {interestedUsers.length} interested {interestedUsers.length === 1 ? 'user' : 'users'}
                                                </p>
                                            </div>
                                            
                                            {/* Interested Users List */}
                                            {interestedUsers.length > 0 && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                        Interested Users
                                                    </h3>
                                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                                        {loadingUsers ? (
                                                            <div className="flex justify-center py-4">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                            </div>
                                                        ) : (
                                                            interestedUsers.map(user => (
                                                                <div 
                                                                    key={user.id}
                                                                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow"
                                                                >
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                                            {user.name}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {user.email}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleAcceptInterest(user.id)}
                                                                        disabled={!item.available || loadingUsers}
                                                                        className={`px-4 py-2 rounded-md text-white font-medium ${
                                                                            !item.available || loadingUsers
                                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                                : 'bg-green-600 hover:bg-green-700'
                                                                        }`}
                                                                    >
                                                                        {loadingUsers ? 'Processing...' : 'Accept'}
                                                                    </button>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceItemDetail; 