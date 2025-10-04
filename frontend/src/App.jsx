import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/Dashboard';
import PilgrimPortal from './components/PilgrimPortal';

function App() {
  const [currentView, setCurrentView] = useState('admin');
  const [currentVisitors, setCurrentVisitors] = useState(12450);

  // Mock data - will be replaced with API calls later
  const [alerts] = useState([
    { id: 1, time: '14:32', message: 'High crowd density detected in Zone A', type: 'critical' },
    { id: 2, time: '14:28', message: 'Parking Level 1 at 95% capacity', type: 'warning' },
    { id: 3, time: '14:25', message: 'All systems operating normally', type: 'info' }
  ]);

  const [zones] = useState([
    { name: 'Main Temple', visitors: 3200, status: 'high' },
    { name: 'Queue Area', visitors: 2800, status: 'medium' },
    { name: 'Parking', visitors: 1500, status: 'low' },
    { name: 'Food Court', visitors: 1200, status: 'medium' }
  ]);

  const [crowdData] = useState([
    { time: '6:00', predicted: 2000, actual: 1800, max: 16000 },
    { time: '8:00', predicted: 4500, actual: 4200, max: 16000 },
    { time: '10:00', predicted: 8000, actual: 8500, max: 16000 },
    { time: '12:00', predicted: 12000, actual: 12450, max: 16000 },
    { time: '14:00', predicted: 14500, actual: null, max: 16000 },
    { time: '16:00', predicted: 15200, actual: null, max: 16000 },
    { time: '20:00', predicted: 8000, actual: null, max: 16000 }
  ]);

  const [parkingData] = useState([
    { level: 'Ground Floor', occupied: 180, total: 200 },
    { level: 'Basement 1', occupied: 295, total: 300 },
    { level: 'Basement 2', occupied: 120, total: 350 },
    { level: 'Basement 3', occupied: 45, total: 250 }
  ]);

  const [queueData] = useState([
    { name: 'General Darshan', wait: '25min', status: 'normal' },
    { name: 'VIP Pass', wait: '8min', status: 'low' },
    { name: 'Prasad Counter', wait: '45min', status: 'high' },
    { name: 'Special Services', wait: '12min', status: 'normal' }
  ]);

  const [shuttleData] = useState([
    { id: 1, name: 'Bus #1', location: 'En route to Gate 2', status: 'active' },
    { id: 2, name: 'Bus #2', location: 'At Parking Level B1', status: 'loading' },
    { id: 3, name: 'Bus #3', location: 'Maintenance', status: 'offline' }
  ]);

  // Simulate real-time visitor count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVisitors(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(10000, Math.min(16000, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      {currentView === 'admin' ? (
        <AdminDashboard 
          currentVisitors={currentVisitors}
          alerts={alerts}
          zones={zones}
          crowdData={crowdData}
          parkingData={parkingData}
          queueData={queueData}
          shuttleData={shuttleData}
        />
      ) : (
        <PilgrimPortal queueData={queueData} />
      )}
    </div>
  );
}

export default App;