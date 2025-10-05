import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import DevoteeHeader from './components/DevoteeHeader';
import AlertsDisplay from './components/AlertsDisplay';
import ProtectedRoute from './components/ProtectedRoute';

import Emergency from './pages/Emergency';
import LostAndFound from './pages/LostAndFound';
import Admin from './pages/Admin';
import LoginPage from './pages/LoginPage';
import EvacuationPage from './pages/EvacuationPage';
import './App.css';

function App() {
  return (
    <>
      <DevoteeHeader />
      <AlertsDisplay />

      <div className="container">
        <main>
          <Routes>
            <Route path="/" element={<Emergency />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/evacuation" element={<EvacuationPage />} />
            
            <Route 
              path="/admin" 
              element={<ProtectedRoute><Admin /></ProtectedRoute>} 
            />
            {/* The /register route has been removed */}
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;