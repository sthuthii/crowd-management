import React from 'react';
import { Info, MapPin } from 'lucide-react';

const TempleInformation = () => {
  const facilities = [
    { name: 'Restrooms', location: 'Near Main Gate & Food Court' },
    { name: 'Water Stations', location: 'Every 100m along pilgrim path' },
    { name: 'Medical Aid', location: 'Emergency Station, Gate 1' },
    { name: 'Lost & Found', location: 'Information Desk, Main Entrance' },
    { name: 'Prasad Shop', location: 'Exit Plaza, Level 1' }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-800">Temple Information</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-3">Today's Timings</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-700 font-medium">Morning Darshan:</div>
            <div className="text-gray-600">6:00 AM - 12:00 PM</div>
          </div>
          <div>
            <div className="text-gray-700 font-medium">Evening Darshan:</div>
            <div className="text-gray-600">4:00 PM - 9:00 PM</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-700 font-medium">Special Pooja:</div>
            <div className="text-gray-600">7:00 PM - 8:00 PM</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-700 font-medium">Aarti:</div>
            <div className="text-gray-600">8:30 PM</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Facility Locations
        </h4>
        <div className="space-y-2 text-sm">
          {facilities.map((facility, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
              <span className="text-gray-700 font-medium">{facility.name}</span>
              <span className="text-gray-600 text-right">{facility.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TempleInformation;