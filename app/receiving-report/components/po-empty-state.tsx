// app/purchase-order/components/EmptyState.tsx
import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState: React.FC = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Order Selected</h3>
      <p className="text-gray-500">Select a purchase order from the sidebar to view the receiving report</p>
    </div>
  </div>
);

export default EmptyState;