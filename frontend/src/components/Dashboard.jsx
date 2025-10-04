import React from 'react';
import { Shield } from 'lucide-react';
import EmergencyAlerts from './EmergencyAlerts';
import CrowdDensityMap from './CrowdDensityMap';
import CrowdForecast from './CrowdForecast';
import ParkingManagement from './ParkingManagement';
import QueueStatus from './QueueStatus';
import ShuttleTracker from './ShuttleTracker';

const AdminDashboard = ({ 
  currentVisitors, 
  alerts, 
  zones, 
  crowdData, 
  parkingData, 
  queueData, 
  shuttleData 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            </div>
            <p className="text-gray-600">Real-time temple management and crowd monitoring</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{currentVisitors.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Current Visitors</div>
          </div>
        </div>

        <div className="mb-6">
          <EmergencyAlerts alerts={alerts} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <CrowdDensityMap zones={zones} />
          <CrowdForecast data={crowdData} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ParkingManagement 
            parkingData={parkingData} 
            recommendedLevel="Basement 2" 
          />
          <QueueStatus queueData={queueData} />
          <ShuttleTracker shuttleData={shuttleData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;