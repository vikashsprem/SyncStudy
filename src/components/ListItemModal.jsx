import React, { useState } from 'react';
import { listItem } from '../apiConfig/MarketplaceService';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../security/AuthContext';

const CATEGORIES = ['BOOK', 'CYCLE', 'BAG', 'ELECTRONICS', 'FURNITURE', 'OTHER'];
const CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

const ListItemModal = ({ onClose, onSuccess }) => {
    const navigate = useNavigate();
    const { userId, isAuthenticated } = useAuth();
    
    console.log('Auth state:', { userId, isAuthenticated });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isUnderLimit = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isValid && isUnderLimit;
        });

        if (validFiles.length + images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        setImages(prev => [...prev, ...validFiles]);

        // Create preview URLs
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrls(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started');
        setError(null);
        setLoading(true);

        try {
            // Check if user is authenticated
            if (!isAuthenticated || !userId) {
                console.log('Authentication check failed:', { isAuthenticated, userId });
                throw new Error('Please log in to list items');
            }

            // Validate form
            if (!formData.title || !formData.price || !formData.category || !formData.condition) {
                throw new Error('Please fill in all required fields');
            }

            // Create FormData object
            const submitFormData = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                submitFormData.append(key, formData[key]);
                console.log(`Appending ${key}:`, formData[key]);
            });

            // Append images
            images.forEach((image, index) => {
                submitFormData.append('image', image);
                console.log(`Appending image ${index}:`, image.name);
            });

            console.log('Making API call to list item');
            const response = await listItem(submitFormData);
            console.log('API response:', response);
            
            onSuccess();
        } catch (err) {
            console.error('Error listing item:', err);
            if (err.message === 'User not authenticated') {
                setError('Please log in to list items');
                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            } else {
                setError(err.message || 'Failed to list item');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-[#11171e]">
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Condition *
                        </label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select condition</option>
                            {CONDITIONS.map(condition => (
                                <option key={condition} value={condition}>
                                    {condition.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Images (Max 5 images, 5MB each)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-400">
                                <label
                                    htmlFor="images"
                                    className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Upload images</span>
                                    <input
                                        id="images"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        multiple
                                        className="sr-only"
                                        disabled={images.length >= 5}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-400">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiTrash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Listing...' : 'List Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ListItemModal; 