// app/purchase-order/utils.ts
import { AlertCircle, CheckCircle } from 'lucide-react';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  } catch {
    return dateString;
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open': return 'default';
    case 'closed': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open': return AlertCircle;
    case 'closed': return CheckCircle;
    default: return AlertCircle;
  }
};