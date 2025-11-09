import React, { useState, useEffect } from 'react';
import { getUserRole } from '../utils/auth';
import { 
    fetchUserDetails, 
    fetchAllEquipment, 
    fetchAdminAnalytics, 
    fetchUserRequests 
} from '../services/dashboardService';

// Fallback component for loading state
const Loader = () => (
    <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Dashboard Data...</p>
    </div>
);

const Dashboard = () => {
    const role = getUserRole();
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [data, setData] = useState({}); // Stores equipment list, analytics, or requests

    useEffect(() => {
      const token = localStorage.getItem("token");
        const loadDashboardData = async () => {
            setLoading(true);
            let tempUserData = null;
            let tempData = {};

            try {
                // 1. Fetch User Details (Required for all roles)
                tempUserData = await fetchUserDetails();
                setUserDetails(tempUserData);
                const userId = tempUserData.id; // Assuming user details include ID

                // 2. Fetch Role-Specific Data
                if (role === 'STUDENT') {
                    tempData.availableEquipment = await fetchAllEquipment();
                    tempData.requestHistory = await fetchUserRequests('STUDENT', userId);
                } else if (role === 'STAFF' || role === 'ADMIN') {
                    // Both Staff and Admin view pending requests on the dashboard
                    tempData.pendingRequests = await fetchUserRequests(role, userId);
                }
                
                if (role === 'ADMIN') {
                    tempData.analytics = await fetchAdminAnalytics();
                }

                setData(tempData);
            } catch (error) {
                // Handle API error globally (e.g., show toast)
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (role &&  token) {
            loadDashboardData();
        }
    }, [role]);

    if (loading || !userDetails) {
        return <Loader />;
    }

    // --- Role-Based Rendering Logic ---

    // 1. Admin View
    if (role === 'ADMIN') {
        const { analytics, pendingRequests } = data;
        return (
            <div className="mt-4">
                <h2>Admin Dashboard Analytics 📊</h2>
                <p>Welcome, **{userDetails.preferred_username}**.</p>
                <div className="row">
                    <div className="col-md-4"><div className="card text-white bg-primary mb-3"><div className="card-body"><h5 className="card-title">Total Equipment</h5><p className="card-text fs-3">{analytics?.totalEquipment || 0}</p></div></div></div>
                    <div className="col-md-4"><div className="card text-white bg-warning mb-3"><div className="card-body"><h5 className="card-title">Pending Approvals</h5><p className="card-text fs-3">{analytics?.pendingRequestsCount || pendingRequests?.length || 0}</p></div></div></div>
                    <div className="col-md-4"><div className="card text-white bg-success mb-3"><div className="card-body"><h5 className="card-title">Available Items</h5><p className="card-text fs-3">{analytics?.availableItems || 0}</p></div></div></div>
                </div>
                <h4>Pending Requests (Quick View)</h4>
                {/* A link or snippet of the pending requests table */}
                <p>You have {pendingRequests?.length || 0} pending requests. <a href="/approvals">Go to Approvals</a></p>
            </div>
        );
    }

    // 2. Staff View
    if (role === 'STAFF') {
        const { pendingRequests } = data;
        return (
            <div className="mt-4">
                <h2>Staff Approval Queue 🧑‍🏫</h2>
                <p>Welcome, **{userDetails.preferred_username}**. You are responsible for reviewing borrowing requests.</p>
                <div className="alert alert-warning">
                    You have **{pendingRequests?.length || 0}** pending requests requiring immediate action. 
                    <a href="/approvals" className="alert-link ms-2">Review Requests Now</a>
                </div>
                {/* Optional: Embed a small table view of the top 5 pending requests */}
            </div>
        );
    }

    // 3. Student View
    if (role === 'STUDENT') {
        const { availableEquipment, requestHistory } = data;
        return (
            <div className="mt-4">
                <h2>Student Portal 👋</h2>
                <p>Welcome, **{userDetails.preferred_username}**. Quick links to manage your borrowings.</p>
                
                <h4 className="mt-4">Available Equipment ({availableEquipment?.length || 0})</h4>
                <p>See the <a href="/equipment">full list of items</a> you can borrow.</p>

                <h4 className="mt-4">Your Recent Requests</h4>
                <p>You have **{requestHistory?.length || 0}** total requests. <a href="/requests">View History</a>.</p>
                {/* Optional: Show a quick list of 3 most recent requests */}
            </div>
        );
    }
    
    // Fallback if role is not recognized
    return <div className="mt-4"><h2>Welcome!</h2><p>Your dashboard role is not recognized: {role}</p></div>;
};

export default Dashboard;