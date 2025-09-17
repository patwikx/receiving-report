// app/purchase-order/components/Pagination.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  loading, 
  onPrevious, 
  onNext 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage <= 1 || loading}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;