import React, { useState, useEffect } from 'react';
import { fetchOrganizations } from '../apiConfig/ApiService';
import CreateOrganization from './CreateOrganization';

const OrganizationManagement = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState('');

    const loadOrganizations = async () => {
        try {
            setLoading(true);
            const response = await fetchOrganizations();
            setOrganizations(response.data);
        } catch (error) {
            setError('Failed to load organizations');
            console.error('Error loading organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrganizations();
    }, []);

    const handleCreateSuccess = async (newOrg) => {
        setShowCreateModal(false);
        await loadOrganizations();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading organizations...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Organization Management</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Organization
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {organizations.map((org) => (
                    <div
                        key={org.code}
                        className="bg-gray-800 rounded-lg p-4 shadow-lg"
                    >
                        <h3 className="text-xl font-semibold text-white mb-2">{org.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">Code: {org.code}</p>
                        {org.description && (
                            <p className="text-gray-300 text-sm">{org.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <CreateOrganization
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
};

export default OrganizationManagement; 