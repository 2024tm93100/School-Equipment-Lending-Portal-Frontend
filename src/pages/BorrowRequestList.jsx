import React, { useState, useEffect } from "react";
import { getEnrichedUserRequests } from "../services/requestService";
import { getUserRole } from "../utils/auth";
import { fetchUserDetails } from "../services/dashboardService";

// Helper function to render status badges
const StatusBadge = ({ status }) => {
  let colorClass = "bg-secondary";
  switch (status) {
    case "PENDING":
      colorClass = "bg-warning text-dark";
      break;
    case "APPROVED":
      colorClass = "bg-success";
      break;
    case "REJECTED":
      colorClass = "bg-danger";
      break;
    case "RETURNED":
      colorClass = "bg-info text-dark";
      break;
    default:
      colorClass = "bg-secondary";
  }
  return <span className={`badge ${colorClass}`}>{status}</span>;
};

const BorrowRequestList = () => {
  const role = getUserRole();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const loadRequests = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnrichedUserRequests(userId);
      setRequests(data);
    } catch (err) {
      setError("Failed to load your borrow requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only run if the user is a student (or staff/admin if allowed)
    if (role) {
      fetchUserDetails()
        .then((tempUserData) => {
          const userId = tempUserData.id;
          localStorage.setItem("id", userId);
          loadRequests(userId);
        })
        .catch((err) => {
          setError("Failed to load available equipment.");
        })
        .finally(() => setLoading(false));
    }
  }, [role]);

  // --- Rendering ---
  if (loading)
    return <div className="text-center mt-5">Loading Requests...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="mt-4">
      <h2>My Borrow Requests 📋</h2>
      <p className="text-muted">
        A history of your equipment borrowing submissions.
      </p>

      {/* Requests Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Equipment</th>
            <th>Quantity</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            {/* No actions needed for simple view, but could add Cancel for PENDING */}
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((item, index) => (
              <tr key={item.displayId || index}>
                <td>{item.displayId || index + 1}</td>
                <td>{item.equipmentName}</td>
                <td>{item.requestedQuantity}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                You have no active or historical borrow requests.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowRequestList;
