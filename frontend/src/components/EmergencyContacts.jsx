import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

const EmergencyContacts = () => {
  const contacts = [
    {
      name: 'Medical Emergency',
      availability: '24/7',
      number: '108'
    },
    {
      name: 'Security',
      availability: '24/7',
      number: '+91-9876543210'
    },
    {
      name: 'Temple Information',
      availability: '6 AM - 10 PM',
      number: '+91-9876543211'
    },
    {
      name: 'Lost & Found',
      availability: '6 AM - 10 PM',
      number: '+91-9876543212'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-800">Emergency Contacts</h3>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, idx) => (
          <div key={idx} className={`pb-4 ${idx !== contacts.length - 1 ? 'border-b' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.availability}</div>
              </div>
              <div className={`font-bold text-gray-800 ${
                contact.number === '108' ? 'text-2xl' : 'text-lg'
              }`}>
                {contact.number}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">In case of emergency, call 108 immediately</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;