// app/purchase-order/components/ReceivingReport.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PurchaseOrder } from '@/types/po-types';
import POHeaderDetails from './po-details';
import LineItemsTable from './po-line-items';
import { formatCurrency, formatDate } from '@/lib/po-utils';


interface ReceivingReportProps {
  purchaseOrder: PurchaseOrder;
}

const ReceivingReport: React.FC<ReceivingReportProps> = ({ purchaseOrder }) => {
  const totalAmount = purchaseOrder.lines.reduce((sum, line) => sum + line.totalLC, 0);

  return (
    <ScrollArea className="flex-1 p-6 bg-white">
      <div className="max-w-4xl mx-auto bg-white" id="receiving-report">
        {/* Company Header */}
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RECEIVING REPORT</h1>
          <p className="text-gray-600">Purchase Order Acknowledgment</p>
        </div>

        <POHeaderDetails header={purchaseOrder.header} />

        {/* Remarks */}
        {purchaseOrder.header.remarks && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Remarks</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {purchaseOrder.header.remarks}
            </p>
          </div>
        )}

        <LineItemsTable lines={purchaseOrder.lines} />

        {/* Total */}
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acknowledgment Section */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-6">Acknowledgment</h3>
          <p className="text-gray-700 mb-8 leading-relaxed">
            We hereby acknowledge the receipt of the above mentioned items/services as per Purchase Order #{purchaseOrder.header.docNum} 
            dated {formatDate(purchaseOrder.header.postingDate)}. All items/services have been received in good condition 
            and meet the specified requirements.
          </p>
          
          <div className="grid grid-cols-2 gap-12 mt-12">
            <div>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-gray-600">Received By</p>
                <p className="font-medium">Name & Signature</p>
                <p className="text-sm text-gray-500 mt-2">Date: _______________</p>
              </div>
            </div>
            <div>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-gray-600">Approved By</p>
                <p className="font-medium">Name & Signature</p>
                <p className="text-sm text-gray-500 mt-2">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ReceivingReport;