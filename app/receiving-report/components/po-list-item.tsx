// app/purchase-order/components/POListItem.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PurchaseOrderListItem } from '@/types/po-types';
import { formatCurrency, formatDate, getStatusBadgeVariant, getStatusIcon } from '@/lib/po-utils';



interface POListItemProps {
  po: PurchaseOrderListItem;
  isSelected: boolean;
  onClick: () => void;
}

const POListItem: React.FC<POListItemProps> = ({ po, isSelected, onClick }) => {
  const StatusIcon = getStatusIcon(po.status);
  
  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm text-gray-900">
          PO #{po.docNum}
        </div>
        <Badge 
          variant={getStatusBadgeVariant(po.status)}
          className="flex items-center gap-1"
        >
          <StatusIcon className="w-4 h-4" />
          {po.status}
        </Badge>
      </div>
      
      <div className="text-sm text-gray-600 mb-2 truncate">
        {po.vendorName}
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">{formatDate(po.postingDate)}</span>
        <span className="font-medium text-green-600">
          {formatCurrency(po.totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default POListItem;