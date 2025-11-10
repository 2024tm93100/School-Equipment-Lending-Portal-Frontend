import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, logout, isAuthenticated } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const role = getUserRole(); // 'STUDENT', 'STAFF', or 'ADMIN'
    const isLoggedIn = isAuthenticated();

    const handleLogout = () => {
        logout(); // Clears localStorage
        navigate('/login'); // Redirect to login page
    };

    // Helper function to render links based on user role
    const renderNavLinks = () => {
        if (!isLoggedIn) {
            return (
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
            );
        }

        const links = [];

        // All Logged-in Users
        links.push(<li key="dash" className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>);
        
        // Students
        if (role === 'STUDENT') {
            links.push(<li key="req" className="nav-item"><Link className="nav-link" to="/requests">My Requests</Link></li>);
            links.push(<li key="newreq" className="nav-item"><Link className="nav-link" to="/requests/new">New Request</Link></li>);
        }

        // Staff and Admin
        if (role === 'STAFF' || role === 'ADMIN') {
            links.push(<li key="appr" className="nav-item"><Link className="nav-link" to="/approvals">Approvals</Link></li>);
        }

        // Admin Only
        if (role === 'ADMIN') {
            links.push(<li key="equip" className="nav-item"><Link className="nav-link" to="/equipment">Manage Equipment</Link></li>);
        }

        // Profile and Logout (for logged-in users)
        links.push(<li key="prof" className="nav-item"><Link className="nav-link" to="/profile">Profile ({role})</Link></li>);
        links.push(
            <li key="logout" className="nav-item">
                <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>
                    Logout
                </button>
            </li>
        );

        return links;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/dashboard">MGM Co-Ed School</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {renderNavLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;