import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEquipment, deleteEquipment } from '../services/equipmentService';
import { getUserRole } from '../utils/auth';

const EquipmentList = () => {
    const navigate = useNavigate();
    const role = getUserRole(); // Should always be ADMIN due to PrivateRoute
    
    const [equipment, setEquipment] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    const loadEquipment = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchEquipment(search);
            // Since the backend might return equipmentId, we can normalize it here if needed,
            // but we'll use the backend keys directly in the render logic below.
            setEquipment(data);
        } catch (err) {
            setError("Failed to load equipment list. Please check the API connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === 'ADMIN') {
            loadEquipment();
        }
    }, [search, role]); 

    // --- Handlers (using backend key: equipmentId) ---
    const handleSearch = (e) => {
        e.preventDefault();
        loadEquipment();
    };

    const handleEdit = (id) => {
        // Use the backend's key, equipmentId
        navigate(`/equipment/edit/${id}`);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete equipment: ${name}?`)) {
            try {
                // Use the backend's key, equipmentId
                await deleteEquipment(id);
                // Filter using the backend's key, equipmentId
                setEquipment(equipment.filter(item => item.equipmentId !== id)); 
            } catch (err) {
                alert("Failed to delete equipment. It may be currently borrowed.");
            }
        }
    };

    // --- Rendering ---
    if (loading) return <div className="text-center mt-5">Loading Equipment...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;
    
    if (role !== 'ADMIN') return <div className="alert alert-danger mt-5">Access Denied.</div>;


    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Equipment Inventory (Admin) 🧰</h2>
                <button 
                    className="btn btn-success" 
                    onClick={() => navigate('/equipment/add')}
                >
                    + Add New Equipment
                </button>
            </div>

            {/* Search Bar (unchanged) */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
            </form>

            {/* Equipment Table */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        {/* Mapped to backend keys */}
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Condition</th> {/* 💡 NEW COLUMN */}
                        <th>Total Stock</th>
                        <th>Borrowed</th> {/* 💡 NEW COLUMN */}
                        <th>Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.length > 0 ? (
                        equipment.map(item => (
                            <tr key={item.equipmentId}> {/* Use backend key */}
                                <td>{item.equipmentId}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.condition}</td> {/* 💡 DISPLAY CONDITION */}
                                <td>{item.totalQuantity}</td> {/* Mapped: totalQuantity */}
                                <td>{item.borrowedCount}</td> {/* Mapped: borrowedCount */}
                                <td>{item.availableQuantity}</td> {/* Mapped: availableQuantity */}
                                <td>
                                    <button 
                                        className="btn btn-sm btn-info me-2" 
                                        onClick={() => handleEdit(item.equipmentId)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => handleDelete(item.equipmentId, item.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No equipment found.</td> {/* Updated colspan */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentList;