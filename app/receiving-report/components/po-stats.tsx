// app/purchase-order/components/Stats.tsx
import React from 'react';

interface StatsProps {
  totalPOs: number;
  activePOs: number;
}

const Stats: React.FC<StatsProps> = ({ totalPOs, activePOs }) => (
  <div className="p-4 border-b border-gray-200 bg-gray-50">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{totalPOs}</div>
        <div className="text-xs text-gray-600">Total POs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{activePOs}</div>
        <div className="text-xs text-gray-600">Active POs</div>
      </div>
    </div>
  </div>
);

export default Stats;