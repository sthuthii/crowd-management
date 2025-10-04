import React from 'react';
import { Users } from 'lucide-react';
import DigitalDarshanPass from './DigitalDarshanPass';
import TempleInformation from './TempleInformation';
import AccessibilityServices from './AccessibilityServices';
import EmergencyContacts from './EmergencyContacts';

const PilgrimPortal = ({ queueData }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-12 h-12" />
            <h2 className="text-4xl font-bold">Pilgrim Portal</h2>
          </div>
          <p className="text-xl text-blue-100">Your digital companion for a smooth temple visit</p>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <DigitalDarshanPass queueData={queueData} />
          <TempleInformation />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <AccessibilityServices />
          <EmergencyContacts />
        </div>
      </div>
    </div>
  );
};

export default PilgrimPortal;