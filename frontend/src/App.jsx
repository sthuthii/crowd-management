import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { getQueues, bookPass, registerUser, loginUser, getMyPass } from './services/api';
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
            alert('Login failed!');
        }
    };

    return (
        <div className="auth-container">
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </form>
            </div>
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
            alert('Registration failed: ' + (error.response?.data?.detail || 'Error.'));
        }
    };

    return (
        <div className="auth-container">
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Register</button>
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </form>
            </div>
        </div>
    );
};

// --- Queue Page Component ---
const QueuePage = ({ onLogout }) => {
    const [queues, setQueues] = useState([]);
    const [bookedPass, setBookedPass] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formState, setFormState] = useState({ queue_id: 'q_general', number_of_people: 1 });

    const fetchUserAndQueueData = useCallback(async () => {
        setIsLoading(true);
        try {
            const passResponse = await getMyPass();
            setBookedPass(passResponse.data);
        } catch (error) {
            console.log("No active pass found.");
        }
        try {
            const queuesResponse = await getQueues();
            setQueues(queuesResponse.data);
        } catch (error) {
            if (error.response?.status === 401) onLogout();
        } finally {
            setIsLoading(false);
        }
    }, [onLogout]);

    useEffect(() => {
        fetchUserAndQueueData();
    }, [fetchUserAndQueueData]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const passData = { ...formState, number_of_people: parseInt(formState.number_of_people) };
            const response = await bookPass(passData);
            setBookedPass(response.data);
            alert('Pass booked successfully!');
        } catch (error) {
            if (error.response?.data?.detail === "User already has an active pass.") {
                const confirmView = window.confirm("You already have a booking. Do you want to view your existing pass?");
                if (confirmView) {
                    const passResponse = await getMyPass();
                    setBookedPass(passResponse.data);
                    document.getElementById('pass-card')?.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                alert('Booking failed!');
            }
        }
    };

    if (isLoading) return <div className="app-container"><h1>Loading...</h1></div>;

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1 className="navbar-title">Darshan Sahaay</h1>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </nav>
            <main className="main-content">
                <div className="main-layout">
                    <div className="card">
                        <h2>Live Queue Status</h2>
                        <ul className="queues-list">
                            {queues.map(q => (
                                <li key={q.id}>
                                    <span>{q.name}</span>
                                    <span className={`status-${q.status}`}><strong>{q.wait_time_minutes} mins</strong></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <form className="booking-form" onSubmit={handleBooking}>
                            <h2>Book a Digital Pass</h2>
                            <select name="queue_id" value={formState.queue_id} onChange={e => setFormState({...formState, queue_id: e.target.value})}>
                                {queues.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                            </select>
                            <input name="number_of_people" type="number" value={formState.number_of_people} onChange={e => setFormState({...formState, number_of_people: e.target.value})} min="1" required />
                            <button type="submit">Book My Pass</button>
                        </form>
                    </div>
                </div>

                {bookedPass && (
                    <div id="pass-card" className="pass-details card">
                        <h3>Your Pass is Booked!</h3>
                        <p><strong>Devotee:</strong> {bookedPass.owner.username}</p>
                        <p><strong>Pass ID:</strong> {bookedPass.pass_id}</p>
                        <a href={bookedPass.qr_code_url} download={`darshan-pass-${bookedPass.pass_id}.png`}>
                            <img src={bookedPass.qr_code_url} alt="QR Code" />
                        </a>
                        <p style={{textAlign: 'center', marginTop: '10px'}}>
                            <a href={bookedPass.qr_code_url} download={`darshan-pass-${bookedPass.pass_id}.png`}>Download QR Code</a>
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- App Wrapper ---
function App() {
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

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
