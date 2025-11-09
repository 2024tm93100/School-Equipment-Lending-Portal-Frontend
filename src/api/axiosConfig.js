import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your backend address
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Define the paths that do NOT require a token
  // Use a regex or check for inclusion in a list for security
  const unauthenticatedPaths = [
    '/auth/login', 
    // Add other public endpoints here if needed, e.g., '/public/data'
  ];

  // 1. Check if the current request URL matches an unauthenticated path
  // We use config.url which holds the relative path like '/auth/login'
  const requiresAuth = !unauthenticatedPaths.includes(config.url);

  if (requiresAuth) {
    const token = localStorage.getItem("token"); 

    if (token) {
      // 2. Add token ONLY if required and available
      config.headers.Authorization = `Bearer ${token}`; 
    } 
    // OPTIONAL: If token is required but missing, you could redirect to /login here, 
    // but the PrivateRoute component usually handles this check more cleanly.
  }

  return config;
}, (error) => {
    // Handle request setup errors
    return Promise.reject(error);
});

export default api;