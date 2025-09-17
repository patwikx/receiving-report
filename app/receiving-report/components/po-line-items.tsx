// app/purchase-order/components/LineItemsTable.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { PurchaseOrderLine } from '@/types/po-types';
import { formatCurrency } from '@/lib/po-utils';


interface LineItemsTableProps {
  lines: PurchaseOrderLine[];
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ lines }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Package className="w-5 h-5 mr-2" />
      Items/Services Received
    </h3>
    
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">#</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">UoM</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Qty</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Unit Price</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lines.map((line, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{line.lineNum}</td>
              <td className="px-4 py-3 text-sm">
                <Badge variant={line.itemServiceType === 'Item' ? 'default' : 'secondary'}>
                  {line.itemServiceType}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{line.description}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{line.uom}</td>
              <td className="px-4 py-3 text-sm text-right">{line.quantity.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-right">{formatCurrency(line.unitPrice)}</td>
              <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(line.totalLC)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LineItemsTable;