// app/purchase-order/components/POHeaderDetails.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { PurchaseOrderHeader } from '@/types/po-types';
import { formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/po-utils';


interface POHeaderDetailsProps {
  header: PurchaseOrderHeader;
}

const POHeaderDetails: React.FC<POHeaderDetailsProps> = ({ header }) => (
  <div className="mb-8">
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Purchase Order Details
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">PO Number:</span>
            <span className="font-semibold">#{header.docNum}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <Badge variant={getStatusBadgeVariant(header.status)}>
              {getStatusLabel(header.status)}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Posting Date:</span>
            <span>{formatDate(header.postingDate)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Vendor Name:</span>
            <span className="text-right font-medium">{header.vendorName}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default POHeaderDetails;