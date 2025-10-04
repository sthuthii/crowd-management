import React, { useState } from 'react';
import { Accessibility, CheckCircle } from 'lucide-react';

const AccessibilityServices = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    assistance: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Assistance request submitted successfully! Our team will contact you shortly.');
    setFormData({ name: '', phone: '', assistance: '' });
  };

  const services = [
    'Wheelchair assistance and accessible routes',
    'Priority queue for elderly and differently-abled',
    'Dedicated parking spaces near entrances',
    'Audio guidance system for visually impaired'
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Accessibility className="w-5 h-5 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-800">Accessibility Services</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">Priority Services Available</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {services.map((service, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{service}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Request Assistance</h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="tel" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="e.g., Wheelchair, Guide assistance" 
            value={formData.assistance}
            onChange={(e) => setFormData({...formData, assistance: e.target.value})}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Request Assistance
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccessibilityServices;