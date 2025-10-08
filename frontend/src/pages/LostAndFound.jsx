// frontend/src/pages/LostAndFound.jsx

import React, { useState, useEffect } from 'react';
import { getLostAndFoundItems, createLostAndFoundItem, updateLostAndFoundItem } from '../services/api';
import './lost-and-found.css';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        item_name: '', category: 'Electronics', description: '',
        location: '', reporter_name: '', contact: '', status: 'lost'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [listIsLoading, setListIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        setListIsLoading(true);
        setError('');
        try {
            const response = await getLostAndFoundItems();
            setItems(response.data);
        } catch (err) {
            setError('Could not fetch reported items. Please try again later.');
            console.error(err);
        } finally {
            setListIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await createLostAndFoundItem(formData);
            setFormData({
                item_name: '', category: 'Electronics', description: '',
                location: '', reporter_name: '', contact: '', status: 'lost'
            });
            fetchItems(); // Refresh the list after new submission
        } catch (err) {
            setError('Failed to submit report. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- IMPROVEMENT: Optimistic UI Update ---
    const handleStatusUpdate = async (id, newStatus) => {
        const originalItems = [...items]; // Save the original state
        
        // Update the UI instantly
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, status: newStatus } : item
            )
        );

        // Make the API call
        try {
            await updateLostAndFoundItem(id, { status: newStatus });
        } catch (error) {
            setError('Failed to update status. Reverting changes.');
            setItems(originalItems); // Revert on failure
            console.error("Failed to update status", error);
        }
    };

    // --- IMPROVEMENT: Helper function for badge styles ---
    const getStatusBadge = (status) => {
        switch (status) {
            case 'lost':
                return 'bg-danger';
            case 'found':
                return 'bg-success';
            case 'returned':
                return 'bg-info'; // New badge for "returned"
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Lost & Found</h3>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                    {/* Form Section - Now with improved readability */}
                    <div className="col-md-6">
                        <h4>Report an Item</h4>
                        <form onSubmit={handleSubmit}>
                            {/* --- IMPROVEMENT: Formatted JSX --- */}
                            <div className="mb-2">
                                <input type="text" name="item_name" className="form-control" placeholder="Item Name (e.g., Phone)" value={formData.item_name} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <input type="text" name="location" className="form-control" placeholder="Last Seen Location" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <textarea name="description" className="form-control" placeholder="Description (color, brand, etc.)" value={formData.description} onChange={handleChange}></textarea>
                            </div>
                            <div className="mb-2">
                                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                    <option value="lost">I Lost This Item</option>
                                    <option value="found">I Found This Item</option>
                                </select>
                            </div>
                            <hr/>
                            <div className="mb-2">
                                <input type="text" name="reporter_name" className="form-control" placeholder="Your Name" value={formData.reporter_name} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <input type="text" name="contact" className="form-control" placeholder="Your Contact Info (Email or Phone)" value={formData.contact} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="col-md-6">
                        <h4>Reported Items</h4>
                        {listIsLoading ? (<p>Loading items...</p>) : (
                            <ul className="list-group">
                                {items.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.item_name}</strong>
                                            <span className={`badge ms-2 ${getStatusBadge(item.status)}`}>{item.status}</span>
                                            <br />
                                            <small>Location: {item.location}</small>
                                        </div>
                                        {/* --- IMPROVEMENT: Conditional rendering for buttons --- */}
                                        {item.status !== 'returned' && (
                                            <div className="btn-group">
                                                <button 
                                                    className="btn btn-sm btn-success" 
                                                    onClick={() => handleStatusUpdate(item.id, 'found')}
                                                    disabled={item.status === 'found'}
                                                >
                                                    Found
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-info text-white" 
                                                    onClick={() => handleStatusUpdate(item.id, 'returned')}
                                                >
                                                    Returned
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostAndFound;