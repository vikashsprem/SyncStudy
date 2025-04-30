import React, { useState, useEffect } from 'react';
import { getAllItems } from '../apiConfig/MarketplaceService';
import MarketplaceItem from './MarketplaceItem';
import ListItemModal from './ListItemModal';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiSearch, FiFilter } from 'react-icons/fi';
import Modal from './Modal';

const CATEGORIES = ['BOOK', 'CYCLE', 'BAG', 'ELECTRONICS', 'FURNITURE', 'OTHER'];

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showListModal, setShowListModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadItems();
    }, [selectedCategory, searchQuery]);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await getAllItems(selectedCategory, searchQuery);
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Campus Marketplace
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Buy and sell items within your campus community
                            </p>
                        </div>
                        <button
                            onClick={() => setShowListModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FiPlusCircle className="mr-2" />
                            List New Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <FiFilter className="mr-2" />
                                Filters
                            </button>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    /* Items Grid */
                    <div className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map(item => (
                                <MarketplaceItem
                                    key={item.id}
                                    item={item}
                                    onRefresh={loadItems}
                                />
                            ))}
                        </div>
                        {items.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 dark:text-gray-400">
                                    No items found
                                </div>
                                <button
                                    onClick={() => setShowListModal(true)}
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    List your first item
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* List Item Modal */}
            {showListModal && (
                <Modal onClose={() => setShowListModal(false)} title="List New Item">
                    <ListItemModal
                        onClose={() => setShowListModal(false)}
                        onSuccess={() => {
                            setShowListModal(false);
                            loadItems();
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Marketplace; 