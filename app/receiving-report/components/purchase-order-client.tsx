// app/purchase-order/components/PurchaseOrderClient.tsx
'use client';

import { PurchaseOrder, PurchaseOrderListItem } from '@/types/po-types';
import React, { useState, useEffect } from 'react';
import Header from './po-header';
import Sidebar from './po-sidebar';
import ReceivingReport from './po-receiving-report';
import EmptyState from './po-empty-state';


const PurchaseOrderClient: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderListItem[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDocNum, setSelectedDocNum] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch PO list
  const fetchPurchaseOrders = async (vendor = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: '0', // Get all records
        vendor
      });
      
      const response = await fetch(`/api/po-data?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON - check API route exists");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPurchaseOrders(data.data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        throw new Error(data.error || 'Failed to fetch purchase orders');
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed PO
  const fetchPurchaseOrderDetail = async (docNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/purchase-orders?docNum=${docNum}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON - check API route exists");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedPO(data.data);
        setSelectedDocNum(docNum);
      } else {
        throw new Error(data.error || 'Failed to fetch purchase order details');
      }
    } catch (error) {
      console.error('Error fetching purchase order detail:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch purchase order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders('');
  }, []);

  const handleSearch = () => {
    fetchPurchaseOrders(searchTerm);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Export functionality to be implemented');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header 
        selectedPO={selectedPO}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          purchaseOrders={purchaseOrders}
          selectedDocNum={selectedDocNum}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onPOSelect={fetchPurchaseOrderDetail}
        />

        <div className="flex-1 flex flex-col">
          {selectedPO ? (
            <ReceivingReport purchaseOrder={selectedPO} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderClient;