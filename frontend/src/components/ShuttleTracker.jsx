import React from 'react';
import { Bus, CheckCircle, XCircle, Loader } from 'lucide-react';

const ShuttleTracker = ({ shuttleData }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bus className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Shuttle Tracker</h3>
      </div>
      <div className="space-y-3">
        {shuttleData.map(shuttle => (
          <div key={shuttle.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-gray-800">{shuttle.name}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                shuttle.status === 'active' ? 'bg-green-100 text-green-700' :
                shuttle.status === 'loading' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {shuttle.status === 'active' ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </>
                ) : shuttle.status === 'loading' ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Offline
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">{shuttle.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShuttleTracker;