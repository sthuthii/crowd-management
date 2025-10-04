import React from 'react';
import { Car } from 'lucide-react';

const ParkingManagement = ({ parkingData, recommendedLevel }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Parking Management</h3>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="text-sm font-medium text-yellow-800">Recommended Level</div>
        <div className="text-2xl font-bold text-yellow-800">{recommendedLevel}</div>
      </div>
      <div className="space-y-3">
        {parkingData.map((level, idx) => {
          const percentage = (level.occupied / level.total) * 100;
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{level.level}</span>
                <span className="font-medium text-gray-800">{level.occupied}/{level.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    percentage > 90 ? 'bg-red-500' :
                    percentage > 70 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParkingManagement;