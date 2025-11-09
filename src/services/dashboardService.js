import api from '../api/axiosConfig';

/**
 * Fetches the currently authenticated user's details.
 * @returns {Promise<object>} User data object.
 */
// export const fetchUserDetails = async () => {
//     try {
//         const response = await api.get('/users/me');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching user details:", error);
//         throw error;
//     }
// };

export const fetchUserDetails = async (token = null) => {
    try {
        // Create a temporary config object for this specific request if a token is provided
        const config = {}; 
        
        if (token) {
            // This bypasses the interceptor for this one specific call if needed, 
            // or simply adds the header if the interceptor hasn't run yet.
            config.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        
        // Use the optional config object in the request
        const response = await api.get('/users/me', config); 
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};

/**
 * Fetches the list of all available equipment.
 * @returns {Promise<Array>} List of equipment.
 */
export const fetchAllEquipment = async () => {
    try {
        const response = await api.get('/equipment');
        return response.data;
    } catch (error) {
        console.error("Error fetching all equipment:", error);
        throw error;
    }
};

/**
 * Fetches analytics summary for the Admin.
 * @returns {Promise<object>} Object with counts (e.g., totalEquipment, pendingRequests, etc.).
 */
export const fetchAdminAnalytics = async () => {
    // Assuming a backend endpoint exists for dashboard analytics
    try {
        const response = await api.get('/analytics/summary'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching admin analytics:", error);
        throw error;
    }
};

/**
 * Fetches requests filtered by user (Student) or status (Staff/Admin).
 * @param {string} role - The role of the current user.
 * @param {string} userId - The ID of the current user (if student).
 * @returns {Promise<Array>} List of requests.
 */
export const fetchUserRequests = async (role, userId) => {
    let endpoint = '/requests';
    
    if (role === 'STUDENT') {
        // Endpoint for student's own requests
        endpoint = `/requests/user/${userId}`; 
    } else if (role === 'STAFF' || role === 'ADMIN') {
        // Endpoint for pending requests requiring approval
        endpoint = '/requests?status=PENDING';
    }

    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${role} requests:`, error);
        throw error;
    }
};