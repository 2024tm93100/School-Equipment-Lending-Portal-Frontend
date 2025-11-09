// Function to decode JWT payload
export const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode token", e);
        return null;
    }
};

// Function to extract the application role
export const extractAppRole = (decodedToken) => {
    const realmRoles = decodedToken?.realm_access?.roles || [];
    
    // Define the hierarchy to prioritize which role to store
    const roleHierarchy = ['ADMIN', 'STAFF', 'STUDENT'];

    for (const role of roleHierarchy) {
        if (realmRoles.includes(role)) {
            return role;
        }
    }
    return null; // Return null if no recognized application role is found
};
