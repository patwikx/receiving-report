// app/purchase-order/components/LineItemsTable.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { PurchaseOrderLine } from '@/types/po-types';


interface LineItemsTableProps {
  lines: PurchaseOrderLine[];
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ lines }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Package className="w-5 h-5 mr-2" />
      Items/Services Received
    </h3>
    
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">#</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">UoM</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-b">Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lines.map((line, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium">{line.lineNum}</td>
              <td className="px-6 py-4 text-sm">
                <Badge variant={line.itemServiceType === 'Item' ? 'default' : 'secondary'}>
                  {line.itemServiceType}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{line.description}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{line.uom || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-right font-medium">{line.quantity.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LineItemsTable;