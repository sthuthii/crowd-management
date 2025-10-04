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
            alert('Registration failed: ' + (error.response?.data?.detail || 'Please try again.'));
            console.error(error);
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

    useEffect(() => {
        const fetchQueues = async () => {
            setIsLoading(true);
            try {
                const response = await getQueues();
                setQueues(response.data);
            } catch (error) {
                console.error("Failed to fetch queues:", error);
                if (error.response?.status === 401) onLogout();
            } finally {
                setIsLoading(false);
            }
        };
        fetchQueues();
    }, [onLogout]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const passData = { ...formState, number_of_people: parseInt(formState.number_of_people) };
            const response = await bookPass(passData);
            setBookedPass(response.data);
            alert('Pass booked successfully!');
        } catch (error) {
            alert('Booking failed! ' + (error.response?.data?.detail || 'You may already have a booking.'));
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
                        <ul className="queues-list">{queues.map(q => <li key={q.id}><span>{q.name}</span><span className={`status-${q.status}`}><strong>{q.wait_time_minutes} mins</strong></span></li>)}</ul>
                    </div>
                    <div className="card">
                        <form className="booking-form" onSubmit={handleBooking}>
                            <h2>Book a Digital Pass</h2>
                            <select name="queue_id" value={formState.queue_id} onChange={e => setFormState({...formState, queue_id: e.target.value})}>{queues.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}</select>
                            <input name="number_of_people" type="number" value={formState.number_of_people} onChange={e => setFormState({...formState, number_of_people: e.target.value})} min="1" required />
                            <button type="submit">Book My Pass</button>
                        </form>
                    </div>
                </div>
                {bookedPass && (
                    <div className="pass-details card">
                        <h3>Your Pass is Booked!</h3>
                        <p><strong>Pass ID:</strong> {bookedPass.pass_id}</p>
                        <img src={bookedPass.qr_code_url} alt="QR Code" />
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Main App Component (Handles Routing) ---
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

// --- App Wrapper with Router ---
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;