import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmergencyAlerts = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg border-l-4 border-red-500 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-800">Emergency & Safety Alerts</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded transition">
            <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
              alert.type === 'critical' ? 'bg-red-100 text-red-700' :
              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {alert.time}
            </span>
            <span className="text-gray-700">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyAlerts;