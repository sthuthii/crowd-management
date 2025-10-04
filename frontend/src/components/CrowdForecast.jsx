import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const CrowdForecast = ({ data }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Crowd Forecast vs Reality</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            strokeDasharray="5 5" 
            name="Predicted"
            dot={{ fill: '#f59e0b', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            name="Actual"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="max" 
            stroke="#ef4444" 
            strokeWidth={1} 
            strokeDasharray="3 3" 
            name="Max Capacity"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
        <span>Peak expected at 4:30 PM</span>
        <span>Based on historical data</span>
      </div>
    </div>
  );
};

export default CrowdForecast;