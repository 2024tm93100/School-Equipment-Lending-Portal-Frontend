import api from '../api/axiosConfig';

const EQUIPMENT_API = '/equipment';

/**
 * Fetches all equipment, with optional filtering/searching.
 * @param {string} [search=''] - Search term for name or category.
 * @returns {Promise<Array>} List of equipment.
 */
export const fetchEquipment = async (search = '') => {
    try {
        const params = search ? { search } : {};
        const response = await api.get(EQUIPMENT_API, { params });
        return response.data;
    } catch (error) {
        // 💡 CRUCIAL CHANGE: Check if the error is a 404 (Not Found)
        const status = error.response?.status;
        
        // If the backend explicitly returned a 404 due to the list being empty,
        // we treat this as a successful fetch of an empty list and return [].
        if (status === 404) {
            console.log("Backend returned 404 (List Empty), treating as success with empty list.");
            return [];
        }
        
        // For all other errors (401, 500, network error, etc.), re-throw the error
        // so the frontend component can display an actual failure message.
        console.error("Error fetching equipment list:", error);
        throw error;
    }
};

/**
 * Adds new equipment.
 * @param {object} equipmentData - The data for the new equipment.
 * @returns {Promise<object>} The newly created equipment object.
 */
export const addEquipment = async (equipmentData) => {
    try {
        const response = await api.post(EQUIPMENT_API, equipmentData);
        return response.data;
    } catch (error) {
        console.error("Error adding equipment:", error);
        throw error;
    }
};

/**
 * Updates existing equipment.
 * @param {string} id - The ID of the equipment to update.
 * @param {object} equipmentData - The updated data.
 * @returns {Promise<object>} The updated equipment object.
 */
export const updateEquipment = async (id, equipmentData) => {
    try {
        const response = await api.put(`${EQUIPMENT_API}/${id}`, equipmentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment ${id}:`, error);
        throw error;
    }
};

/**
 * Deletes equipment by ID.
 * @param {string} id - The ID of the equipment to delete.
 */
export const deleteEquipment = async (id) => {
    try {
        await api.delete(`${EQUIPMENT_API}/${id}`);
    } catch (error) {
        console.error(`Error deleting equipment ${id}:`, error);
        throw error;
    }
};

/**
 * Fetches single equipment details (for Edit form initialization).
 */
export const getEquipmentById = async (id) => {
    try {
        const response = await api.get(`${EQUIPMENT_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment ${id}:`, error);
        throw error;
    }
};