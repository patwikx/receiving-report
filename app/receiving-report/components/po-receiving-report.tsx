// app/purchase-order/components/ReceivingReport.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PurchaseOrder } from '@/types/po-types';
import POHeaderDetails from './po-details';
import LineItemsTable from './po-line-items';
import { formatDate } from '@/lib/po-utils';


interface ReceivingReportProps {
  purchaseOrder: PurchaseOrder;
}

const ReceivingReport: React.FC<ReceivingReportProps> = ({ purchaseOrder }) => {

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg border" id="receiving-report">
            <div className="p-8">
              {/* Company Header */}
              <div className="text-center mb-8 border-b-2 border-gray-200 pb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">RECEIVING REPORT</h1>
                <p className="text-lg text-gray-600">Purchase Order Acknowledgment</p>
              </div>

              <POHeaderDetails header={purchaseOrder.header} />

              <LineItemsTable lines={purchaseOrder.lines} />

              {/* Acknowledgment Section */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-900">ACKNOWLEDGMENT</h3>
                <p className="text-gray-700 mb-10 leading-relaxed text-base">
                  We hereby acknowledge the receipt of the above mentioned items/services as per Purchase Order #{purchaseOrder.header.docNum} 
                  dated {formatDate(purchaseOrder.header.postingDate)}. All items/services have been received in good condition 
                  and meet the specified requirements.
                </p>
                
                <div className="space-y-16 mt-16">
                  {/* Received By Section */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Received by:</p>
                      <div className="border-b-2 border-gray-400 w-80 h-16 mb-2"></div>
                      <p className="text-xs text-gray-500">Printed Name/ Signature/ CP No.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600">Date/Time:</span>
                      <div className="border-b-2 border-gray-400 w-60 h-8"></div>
                    </div>
                  </div>
                  
                  {/* Noted By Section */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Noted By:</p>
                      <div className="border-b-2 border-gray-400 w-80 h-16 mb-2"></div>
                      <p className="text-xs text-gray-500">AVP - Finance/Controller</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer Note */}
                <div className="mt-16 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                  <p className="text-sm text-red-700 font-medium">
                    NOTE: PLEASE SUBMIT BIR FORM 2307 SO WE CAN DEDUCT IT FROM YOUR ACCOUNT.
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Should payment have been made thru the bank, kindly send proof of payment to{' '}
                    <span className="font-medium">collectiongroup@rdrealty.com.ph</span>
                  </p>
                  <p className="text-sm text-red-600 italic mt-1">Thank you!</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
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
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ReceivingReport;