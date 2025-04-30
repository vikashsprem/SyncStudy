import { apiClient } from "./ApiClient";

export const retrieveAllBooks = () => apiClient.get("/api/books");

export const addBook = (formData) => apiClient.post(`/api/add/book`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const retrieveBook = (id) => apiClient.get(`/api/books/${id}`);


// Jwt Authentication
export const executeJwtAuthenticationService = async (username, password) => {
    const response = await apiClient.post(`/authenticate`, { username, password });
    return response;
};

export const executeRegistrationService = (userData) => 
    apiClient.post('/api/users/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        organizationCode: userData.organizationCode
    });

export const fetchOrganizations = () =>
    apiClient.get('/api/organizations');

export const createOrganization = (organizationData) =>
    apiClient.post('/api/organizations', organizationData);