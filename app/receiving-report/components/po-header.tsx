// app/purchase-order/components/Header.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Terminal, Download } from 'lucide-react';
import { PurchaseOrder } from '@/types/po-types';


interface HeaderProps {
  selectedPO: PurchaseOrder | null;
  onPrint: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedPO, onPrint, onExport }) => (
  <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          Purchase Order System
        </h1>
        <p className="text-gray-600 text-base mt-2">Professional receiving report management system</p>
      </div>
      {selectedPO && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrint} className="shadow-sm">
            <Terminal className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={onExport} className="shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default Header;