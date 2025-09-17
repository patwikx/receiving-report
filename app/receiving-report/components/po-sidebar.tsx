// app/purchase-order/components/Sidebar.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { PurchaseOrderListItem } from '@/types/po-types';
import SearchBar from './po-searchbar';
import Stats from './po-stats';
import ErrorDisplay from './po-error-display';
import POListItem from './po-list-item';
import Pagination from './po-pagination';

interface SidebarProps {
  purchaseOrders: PurchaseOrderListItem[];
  selectedDocNum: number | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onPOSelect: (docNum: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  purchaseOrders,
  selectedDocNum,
  loading,
  error,
  searchTerm,
  currentPage,
  totalPages,
  onSearchChange,
  onSearch,
  onPOSelect,
  onPrevious,
  onNext
}) => (
  <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
    <SearchBar 
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
    />
    
    <Stats 
      totalPOs={purchaseOrders.length}
      activePOs={purchaseOrders.filter(po => po.status.toLowerCase() === 'open').length}
    />
    
    {error && <ErrorDisplay error={error} />}
    
    <ScrollArea className="flex-1">
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading purchase orders...
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No purchase orders found
          </div>
        ) : (
          purchaseOrders.map((po) => (
            <POListItem
              key={po.docNum}
              po={po}
              isSelected={selectedDocNum === po.docNum}
              onClick={() => onPOSelect(po.docNum)}
            />
          ))
        )}
      </div>
    </ScrollArea>
    
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      loading={loading}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  </div>
);

export default Sidebar;