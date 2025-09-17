// app/purchase-order/page.tsx (Server Component)
import { Metadata } from 'next';
import PurchaseOrderClient from './components/purchase-order-client';


export const metadata: Metadata = {
  title: 'Purchase Orders - Receiving Reports',
  description: 'Manage and track purchase order receiving reports',
};

export default function PurchaseOrderPage() {
  return (
    <div className="h-screen">
      <PurchaseOrderClient />
    </div>
  );
}