import React from 'react';
import { Clock } from 'lucide-react';

const QueueStatus = ({ queueData }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Queue Status</h3>
      </div>
      <div className="space-y-3">
        {queueData.map((queue, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-800">{queue.name}</div>
                <div className="text-xs text-gray-500">Wait Time</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  queue.status === 'high' ? 'text-red-600' :
                  queue.status === 'normal' ? 'text-green-600' :
                  'text-blue-600'
                }`}>
                  {queue.wait}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  queue.status === 'high' ? 'bg-red-100 text-red-600' :
                  queue.status === 'normal' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {queue.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueStatus;