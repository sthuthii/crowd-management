
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import "./styles/components.css";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Traffic from "./pages/Traffic";
import Queue from "./pages/Queue";
import Accessibility from "./pages/Accessibility";
import Emergency from "./pages/Emergency";

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { getQueues, bookPass, registerUser, loginUser } from './services/api';
import './App.css';


// --- Login Page Component ---
const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(username, password);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                onLoginSuccess();
            }
        } catch (error) {
            alert('Login failed! Please check your credentials.');
            console.error(error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Login to Darshan Sahaay</h2>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </form>
        </div>
    );
};

// --- Register Page Component ---
const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, password);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.detail || 'Please try again.'));
            console.error(error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};

// --- Queue Page Component ---
const QueuePage = ({ onLogout }) => {
    const [queues, setQueues] = useState([]);
    const [bookedPass, setBookedPass] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formState, setFormState] = useState({
        queue_id: 'q_general',
        number_of_people: 1,
    });

    useEffect(() => {
        const fetchQueues = async () => {
            try {
                const response = await getQueues();
                setQueues(response.data);
            } catch (error) {
                console.error("Failed to fetch queues:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQueues();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            // The user_id is now handled by the backend from the auth token
            const passData = { ...formState, number_of_people: parseInt(formState.number_of_people) };
            const response = await bookPass(passData);
            setBookedPass(response.data);
            alert('Pass booked successfully!');
        } catch (error) {
            alert('Booking failed! ' + (error.response?.data?.detail || 'You may already have a booking.'));
            console.error('Booking failed:', error);
        }
    };

    if (isLoading) return <div className="container"><h1>Loading...</h1></div>;

    return (
        <div className="container">
            <button onClick={onLogout} className="logout-button">Logout</button>
            <h1>Darshan Sahaay - Smart Queue & Ticketing</h1>
            <div className="main-layout">
                <div className="card">
                    <h2>Live Queue Status</h2>
                    <ul className="queues-list">{queues.map(q => <li key={q.id}><span>{q.name}</span><span className={`status-${q.status}`}><strong>{q.wait_time_minutes} mins</strong></span></li>)}</ul>
                </div>
                <div className="card">
                    <form className="booking-form" onSubmit={handleBooking}>
                        <h2>Book a Digital Pass</h2>
                        <select name="queue_id" value={formState.queue_id} onChange={handleInputChange}>{queues.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}</select>
                        <input name="number_of_people" type="number" value={formState.number_of_people} onChange={handleInputChange} min="1" required />
                        <button type="submit">Book My Pass</button>
                    </form>
                </div>
            </div>
            {bookedPass && (
                <div className="pass-details card">
                    <h3>Your Pass is Booked!</h3>
                    <p><strong>Pass ID:</strong> {bookedPass.pass_id}</p>
                    <p><strong>Queue:</strong> {bookedPass.queue_name}</p>
                    <img src={bookedPass.qr_code_url} alt="QR Code" />
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---
function App() {

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/emergency" element={<Emergency />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
{
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        setToken(localStorage.getItem('token'));
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={token ? <QueuePage onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

// --- App Wrapper with Router ---
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;

