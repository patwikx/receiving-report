// app/purchase-order/components/ErrorDisplay.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="p-4 bg-red-50 border-l-4 border-red-400">
    <div className="flex">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <div className="ml-3">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  </div>
);

export default ErrorDisplay;