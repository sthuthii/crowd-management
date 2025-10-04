// frontend/src/App.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

// Import Components and Pages
import Navbar from './components/Navbar';
import AlertsDisplay from './components/AlertsDisplay';
import Emergency from './pages/Emergency';
import LostAndFound from './pages/LostAndFound';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import './App.css';
import LoginPage from './pages/LoginPage';
import EvacuationPage from './pages/EvacuationPage';

function App() {
  return (
    <> {/* Use a fragment to wrap elements */}
      <Navbar />
      <AlertsDisplay/>
      <div className="container">
        <main>
          <Routes>
            <Route path="/" element={<Emergency />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/evacuation" element={<EvacuationPage />} /> 
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;