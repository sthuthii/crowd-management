import React from 'react';
import { Shield, Info, Phone, Users } from 'lucide-react';

const Navbar = ({ currentView, onViewChange }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Darshan Sahay</h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-800 transition">
            Home
          </button>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition">
            <Info className="w-4 h-4" /> About
          </button>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition">
            <Phone className="w-4 h-4" /> Contact
          </button>
          <button 
            onClick={() => onViewChange('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentView === 'admin' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Admin Dashboard
          </button>
          <button 
            onClick={() => onViewChange('pilgrim')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              currentView === 'pilgrim' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" /> Pilgrim Portal
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;