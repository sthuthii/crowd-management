// frontend/src/pages/LostAndFound.jsx

import React, { useState, useEffect } from 'react';
import { getLostAndFoundItems, createLostAndFoundItem, updateLostAndFoundItem } from '../services/api';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        item_name: '', category: 'Electronics', description: '',
        location: '', reporter_name: '', contact: '', status: 'lost'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false); // For the form
    const [listIsLoading, setListIsLoading] = useState(true); // For the list
    const [error, setError] = useState('');

    const fetchItems = async () => {
        // --- ADDED ERROR HANDLING TO FETCH ---
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
            fetchItems();
        } catch (err) {
            setError('Failed to submit report. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateLostAndFoundItem(id, { status: newStatus });
            fetchItems();
        } catch (error) {
            setError('Failed to update status.');
            console.error("Failed to update status", error);
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
                    {/* Form Section */}
                    <div className="col-md-5">
                        <h4>Report an Item</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2"><input type="text" name="item_name" className="form-control" placeholder="Item Name (e.g., Phone)" value={formData.item_name} onChange={handleChange} required /></div><div className="mb-2"><input type="text" name="location" className="form-control" placeholder="Last Seen Location" value={formData.location} onChange={handleChange} required /></div><div className="mb-2"><textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange}></textarea></div><div className="mb-2"><select name="status" className="form-select" value={formData.status} onChange={handleChange}><option value="lost">I Lost This Item</option><option value="found">I Found This Item</option></select></div><hr/><div className="mb-2"><input type="text" name="reporter_name" className="form-control" placeholder="Your Name" value={formData.reporter_name} onChange={handleChange} required /></div><div className="mb-2"><input type="text" name="contact" className="form-control" placeholder="Your Contact Info" value={formData.contact} onChange={handleChange} required /></div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="col-md-7">
                        <h4>Reported Items</h4>
                        {listIsLoading ? (
                            <p>Loading items...</p>
                        ) : (
                            <ul className="list-group">
                                {items.map(item => (
                                    // --- FIXED a typo here: align-items-center ---
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.item_name}</strong>
                                            <span className={`badge ms-2 ${item.status === 'lost' ? 'bg-danger' : 'bg-success'}`}>{item.status}</span>
                                            <br />
                                            <small>Location: {item.location}</small>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(item.id, 'found')}>Found</button>
                                            <button className="btn btn-sm btn-info" onClick={() => handleStatusUpdate(item.id, 'returned')}>Returned</button>
                                        </div>
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