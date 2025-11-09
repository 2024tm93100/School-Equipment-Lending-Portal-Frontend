import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Use the configured Axios instance
import { fetchEquipment } from '../services/equipmentService'; // To get the equipment list
import { getUserRole } from '../utils/auth';

const BorrowRequestForm = () => {
    const navigate = useNavigate();
    const role = getUserRole(); // Should be STUDENT

    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state for the request form
    const [formData, setFormData] = useState({
        equipmentId: '', // Must be set to a valid ID
        requestedQuantity: 1,
        startDate: '',
        endDate: '',
        userId: '',
        status: "PENDING"
    });

    // --- Data Fetching: Load Available Equipment ---
    useEffect(() => {
        if (role === 'STUDENT') {
            fetchEquipment()
                .then(data => {
                    // Filter equipment that has availableQuantity > 0
                    const available = data.filter(item => item.availableQuantity > 0);
                    setAvailableEquipment(available);
                    
                    // Set default equipment ID if available
                    if (available.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            equipmentId: available[0].equipmentId 
                        }));
                    }
                })
                .catch(err => {
                    setError("Failed to load available equipment.");
                })
                .finally(() => setLoading(false));
        }
    }, [role]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'requestedQuantity' || name === 'equipmentId' ? parseInt(value) || 1 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Basic validation
        if (!formData.equipmentId || formData.requestedQuantity <= 0 || !formData.startDate || !formData.endDate) {
            setError("Please fill out all required fields correctly.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Backend expects: equipmentId, requestedQuantity, startDate, endDate
            const payload = {
                ...formData,
                // The backend should handle setting userId from JWT and status to PENDING
            };

            await api.post('/requests', payload);
            
            alert('Borrow request submitted successfully! Awaiting staff approval.');
            navigate('/requests'); // Redirect to the student's request history page

        } catch (err) {
            console.error("Submission error:", err);
            setError(`Failed to submit request: ${err.response?.data?.message || "Check quantity or dates."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Rendering ---
    if (loading) return <div className="text-center mt-5">Loading available equipment...</div>;
    if (role !== 'STUDENT') return <div className="alert alert-danger mt-5">Access Denied. Only Students can submit requests.</div>;
    
    if (availableEquipment.length === 0) {
        return <div className="alert alert-info mt-5">No equipment is currently available for borrowing.</div>;
    }


    return (
        <div className="container mt-4">
            <h2>New Borrow Request 📝</h2>
            <p>Select the equipment and duration for your borrowing request.</p>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-4">
                
                {/* Equipment Dropdown */}
                <div className="mb-3">
                    <label htmlFor="equipmentId" className="form-label">Equipment</label>
                    <select
                        className="form-select"
                        id="equipmentId"
                        name="equipmentId"
                        value={formData.equipmentId}
                        onChange={handleChange}
                        required
                    >
                        {availableEquipment.map(item => (
                            <option key={item.equipmentId} value={item.equipmentId}>
                                {item.name} ({item.availableQuantity} available, Condition: {item.condition})
                            </option>
                        ))}
                    </select>
                    <small className="form-text text-muted">Only items with stock are shown.</small>
                </div>
                
                {/* Quantity */}
                <div className="mb-3">
                    <label htmlFor="requestedQuantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="requestedQuantity"
                        name="requestedQuantity"
                        value={formData.requestedQuantity}
                        onChange={handleChange}
                        required
                        min="1"
                        max={
                            availableEquipment.find(e => e.equipmentId === formData.equipmentId)?.availableQuantity || 1
                        }
                    />
                </div>
                
                <div className="row">
                    {/* Start Date */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="startDate" className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BorrowRequestForm;