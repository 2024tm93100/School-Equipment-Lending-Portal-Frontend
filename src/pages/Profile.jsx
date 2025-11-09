// src/pages/Profile.js
import React from 'react';
import { logout, getUserRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  // 👤 7️⃣ To be completed: Fetch user details via GET /api/users/me

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mt-4">
      <h3>User Profile</h3>
      <p>Role: <strong>{role}</strong></p>
      {/* User details display here */}
      
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;