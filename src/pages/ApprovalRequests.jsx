import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getEnrichedRequestsByStatus } from "../services/requestService";
import { getUserRole } from "../utils/auth";

// ... (StatusBadge helper component remains the same) ...
const StatusBadge = ({ status }) => {
  // ... (Your existing switch case for badge colors) ...
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

const ApprovalRequests = () => {
  const role = getUserRole();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const loadRequests = async (status = "PENDING") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnrichedRequestsByStatus(status);
      // Staff/Admin view should ideally show PENDING and APPROVED
      setRequests(
        data.filter(
          (req) => req.status !== "RETURNED" && req.status !== "REJECTED"
        )
      );
    } catch (err) {
      setError(
        "Failed to load requests list. Check API connection and authorization."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ADMIN" || role === "STAFF") {
      // Load PENDING and APPROVED requests to show action buttons
      loadRequests("PENDING");
    } else {
      setError("Access Denied. You must be Staff or Admin.");
    }
  }, [role]);

  // --- Action Handlers ---

  // The handler now accepts the full request item and the desired final status
  const handleAction = async (requestItem, newStatus) => {
    console.log();
    const confirmMessage =
      newStatus === "APPROVED"
        ? `Approve request #${requestItem.requestId}?`
        : newStatus === "REJECTED"
        ? `Reject request #${requestItem.requestId}?`
        : `Mark request #${requestItem.requestId} as RETURNED? This restores stock.`;

    if (!window.confirm(confirmMessage)) return;

    // 1. Construct the payload using the current item's data and updating ONLY the status
    const payload = {
      // Include all necessary fields from the request item (the backend needs these)
      userId: requestItem.userId,
      equipmentId: requestItem.equipmentId,
      requestedQuantity: requestItem.requestedQuantity,
      startDate: requestItem.startDate,
      endDate: requestItem.endDate,

      // 2. Set the new status
      status: newStatus,
    };

    try {
      // 3. Call the single PUT endpoint with the updated payload
      await api.put(`/requests/${requestItem.requestId}`, payload);

      alert(
        `Request #${requestItem.requestId} successfully set to ${newStatus}.`
      );

      // Refresh the list, typically focusing on PENDING requests again
      loadRequests("PENDING");
    } catch (err) {
      console.error(`Error processing request:`, err);

      setError(
        `Action failed: ${
          err.response?.data?.detail ||
          err.response?.data?.message ||
          `Could not set status to ${newStatus}.`
        }`
      );
    }
  };

  // --- Rendering ---
  if (loading)
    return <div className="text-center mt-5">Loading Pending Requests...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  if (role !== "ADMIN" && role !== "STAFF") return null;

  return (
    <div className="mt-4">
      <h2>Request Approvals 🛎️</h2>
      <p className="text-muted">
        Review and process all requests currently awaiting approval.
      </p>

      {/* Requests Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Equipment</th>
            <th>Quantity</th>
            <th>User ID</th>
            <th>Dates (Start/End)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((item, index) => (
              // Ensure the request ID is used if available, otherwise fallback
              <tr key={item.requestId || index}>
                <td>{item.requestId || index + 1}</td>
                <td>{item.equipmentName}</td>
                <td>{item.requestedQuantity}</td>
                <td>{item.userId}</td>
                <td>
                  {item.startDate} to {item.endDate}
                </td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  {/* PENDING Actions */}
                  {item.status === "PENDING" && (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleAction(item, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleAction(item, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {/* APPROVED Actions */}
                  {item.status === "APPROVED" && (
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => handleAction(item, "RETURNED")}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No pending or approved requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalRequests;
