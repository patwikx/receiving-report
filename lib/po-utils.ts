// app/purchase-order/utils.ts
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'o':
    case 'open': 
      return 'default';
    case 'c':
    case 'closed': 
      return 'secondary';
    case 'cancelled':
    case 'canceled': 
      return 'destructive';
    default: return 'outline';
  }
};

export const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'o':
    case 'open': 
      return Clock;
    case 'c':
    case 'closed': 
      return CheckCircle;
    case 'cancelled':
    case 'canceled': 
      return XCircle;
    default: return AlertCircle;
  }
};

export const getStatusLabel = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'o': return 'Open';
    case 'c': return 'Closed';
    case 'open': return 'Open';
    case 'closed': return 'Closed';
    case 'cancelled': return 'Cancelled';
    case 'canceled': return 'Cancelled';
    default: return status;
  }
};