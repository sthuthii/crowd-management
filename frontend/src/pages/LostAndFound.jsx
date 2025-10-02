// frontend/src/pages/LostAndFound.jsx

import React, { useState, useEffect } from 'react';
import { getLostAndFoundItems, createLostAndFoundItem } from '../services/api';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        item_name: '',
        category: 'Electronics',
        description: '',
        location: '',
        reporter_name: '',
        contact: '',
        status: 'lost'
    });

    const fetchItems = async () => {
        const response = await getLostAndFoundItems();
        setItems(response.data);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLostAndFoundItem(formData);
            // Clear form and refresh list
            setFormData({
                item_name: '', category: 'Electronics', description: '',
                location: '', reporter_name: '', contact: '', status: 'lost'
            });
            fetchItems();
        } catch (error) {
            console.error("Failed to submit report", error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Lost & Found</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Form Section */}
                    <div className="col-md-5">
                        <h4>Report an Item</h4>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields... */}
                            <div className="mb-2">
                                <input type="text" name="item_name" className="form-control" placeholder="Item Name (e.g., Phone)" value={formData.item_name} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <input type="text" name="location" className="form-control" placeholder="Last Seen Location" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div className="mb-2">
                                <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
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
                                <input type="text" name="contact" className="form-control" placeholder="Your Contact Info" value={formData.contact} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Submit Report</button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="col-md-7">
                        <h4>Reported Items</h4>
                        <ul className="list-group">
                            {items.map(item => (
                                <li key={item.id} className="list-group-item">
                                    <strong>{item.item_name}</strong> ({item.status})
                                    <br />
                                    <small>Location: {item.location} | Reported by: {item.reporter_name}</small>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostAndFound;