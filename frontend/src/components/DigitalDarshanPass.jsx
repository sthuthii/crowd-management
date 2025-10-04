import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const DigitalDarshanPass = ({ queueData }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    queueType: 'general'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Queue slot booked successfully! You will receive SMS updates.');
    setShowBookingForm(false);
    setFormData({ name: '', phone: '', queueType: 'general' });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-800">Digital Darshan Pass</h3>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-orange-800 mb-2">Book Virtual Queue Slot</div>
        <p className="text-sm text-gray-700 mb-4">
          Reserve your place in line and receive SMS updates about your queue status.
        </p>
        {!showBookingForm ? (
          <button 
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Book Queue Slot
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input 
              type="tel" 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={formData.queueType}
              onChange={(e) => setFormData({...formData, queueType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="general">General Darshan</option>
              <option value="vip">VIP Pass</option>
              <option value="prasad">Prasad Counter</option>
              <option value="special">Special Services</option>
            </select>
            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Confirm Booking
              </button>
              <button 
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">Current Wait Times</h4>
        <div className="space-y-3">
          {queueData.map((queue, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{queue.name}</div>
                <div className="text-xs text-gray-500">Estimated wait</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  queue.status === 'high' ? 'text-red-600' :
                  queue.status === 'normal' ? 'text-green-600' :
                  'text-blue-600'
                }`}>
                  {queue.wait}
                </div>
                <div className={`text-xs px-2 py-1 rounded font-medium ${
                  queue.status === 'high' ? 'bg-red-100 text-red-600' :
                  queue.status === 'normal' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {queue.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalDarshanPass;