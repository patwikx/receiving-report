// app/purchase-order/components/Stats.tsx
import React from 'react';

interface StatsProps {
  totalPOs: number;
  activePOs: number;
}

const Stats: React.FC<StatsProps> = ({ totalPOs, activePOs }) => (
  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{totalPOs}</div>
        <div className="text-xs text-blue-700 font-medium">Total POs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{activePOs}</div>
        <div className="text-xs text-green-700 font-medium">Active POs</div>
      </div>
    </div>
  </div>
);

export default Stats;