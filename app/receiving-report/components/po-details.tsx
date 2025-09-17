// app/purchase-order/components/POHeaderDetails.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Building } from 'lucide-react';
import { PurchaseOrderHeader } from '@/types/po-types';
import { formatDate, getStatusBadgeVariant } from '@/lib/po-utils';


interface POHeaderDetailsProps {
  header: PurchaseOrderHeader;
}

const POHeaderDetails: React.FC<POHeaderDetailsProps> = ({ header }) => (
  <div className="grid grid-cols-2 gap-8 mb-8">
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Purchase Order Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">PO Number:</span>
          <span>#{header.docNum}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant={getStatusBadgeVariant(header.status)}>
            {header.status}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Posting Date:</span>
          <span>{formatDate(header.postingDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Delivery Date:</span>
          <span>{formatDate(header.deliveryDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Document Date:</span>
          <span>{formatDate(header.documentDate)}</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Building className="w-5 h-5 mr-2" />
        Vendor Information
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Vendor Code:</span>
          <span>{header.vendorCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Vendor Name:</span>
          <span className="text-right">{header.vendorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Vendor Ref No:</span>
          <span>{header.vendorRefNo || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Currency:</span>
          <span>{header.localCurrency}</span>
        </div>
      </div>
    </div>
  </div>
);

export default POHeaderDetails;