import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, addEquipment, updateEquipment } from '../services/equipmentService';

const EquipmentForm = () => {
    const { id } = useParams(); // Used for editing (will be undefined for adding)
    const navigate = useNavigate();
    const isEdit = !!id;
       // Define the standard condition values
    const CONDITION_OPTIONS = [
    'NEW',
    'GOOD',
    'FAIR',
    'POOR',
    'DAMAGED'
    ];
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        totalQuantity: 1,
        description: '',
        condition: CONDITION_OPTIONS[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const title = isEdit ? `Edit Equipment ID: ${id.substring(0, 8)}...` : 'Add New Equipment';

    // --- Fetch data for Edit mode ---
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            getEquipmentById(id)
                .then(data => {
                    setFormData(data);
                })
                .catch(err => {
                    setError("Failed to load equipment details for editing.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalQuantity' ? parseInt(value) || 0 : value.trim(),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            if (isEdit) {
                await updateEquipment(id, formData);
                alert('Equipment updated successfully!');
            } else {
                await addEquipment(formData);
                alert('Equipment added successfully!');
            }
            navigate('/equipment'); // Redirect back to the list after success
        } catch (err) {
            setError(`Failed to ${isEdit ? 'update' : 'add'} equipment.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) return <div className="text-center mt-5">Loading Equipment Details...</div>;
    if (error && isEdit) return <div className="alert alert-danger mt-5">{error}</div>;


    return (
        <div className="container mt-4">
            <h2>{title}</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                   <label htmlFor="condition" className="form-label">Condition</label>
                    <select
                        className="form-select"
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                    >
                        {CONDITION_OPTIONS.map(option => (
                            <option key={option} value={option}>
                                {option.charAt(0) + option.slice(1).toLowerCase()} {/* Optional: Nicer display name */}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="totalQuantity" className="form-label">Total Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        id="totalQuantity"
                        name="totalQuantity"
                        value={formData.totalQuantity}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                {/* <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div> */}

                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/equipment')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update Equipment' : 'Add Equipment')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EquipmentForm;