import api from '../api/axiosConfig';
import { fetchEquipment } from './equipmentService'; // We'll need this to get equipment names

const REQUEST_API = '/requests';

/**
 * Fetches all borrow requests for the currently authenticated user.
 * The backend endpoint is assumed to be GET /api/requests/me
 */
export const fetchMyRequests = async (id) => {
    try {
        // Assume the backend uses '/requests/me' or similar to filter by JWT user
        const response = await api.get(`${REQUEST_API}/user/${id}`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching user requests:", error);
        throw error;
    }
};

/**
 * Fetches requests and enriches them with equipment names for display.
 */
export const getEnrichedUserRequests = async (id) => {
    // 1. Fetch user's requests
    const requests = await fetchMyRequests(id);
    
    // 2. Fetch all equipment (to get name mapping)
    const equipmentList = await fetchEquipment(); 
    
    // Map equipmentId to equipment object for quick lookup
    const equipmentMap = new Map();
    equipmentList.forEach(eq => {
        // Use equipmentId, which the backend returns
        equipmentMap.set(eq.equipmentId, eq); 
    });

    // 3. Enrich requests
    return requests.map(req => {
        const equipmentDetails = equipmentMap.get(req.equipmentId);
        return {
            ...req,
            // Add displayable equipment name
            equipmentName: equipmentDetails ? equipmentDetails.name : 'Unknown Equipment',
            // Add a friendly ID (if your backend returns a unique ID for the request itself, 
            // otherwise using index might be required, but assuming a 'requestId' exists)
            displayId: req.requestId || req.id // Assuming a unique request ID exists
        };
    });
}

export const getEnrichedRequestsByStatus = async (status) => {
    // 1. Fetch filtered requests (basic DTO)
    const requests = await api.get(REQUEST_API+"/user", { params: { status: status } });
    return requests.data;
}