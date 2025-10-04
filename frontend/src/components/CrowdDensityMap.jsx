import React from 'react';
import { MapPin } from 'lucide-react';

const CrowdDensityMap = ({ zones }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Live Crowd Density Map</h3>
      </div>
      <div className="space-y-3">
        {zones.map((zone, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
            <div>
              <div className="font-medium text-gray-800">{zone.name}</div>
              <div className="text-sm text-gray-600">{zone.visitors} visitors</div>
            </div>
            <div className={`w-4 h-4 rounded-full ${
              zone.status === 'high' ? 'bg-red-500 animate-pulse' :
              zone.status === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Low Density</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-600">Medium Density</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600">High Density</span>
        </div>
      </div>
    </div>
  );
};

export default CrowdDensityMap;