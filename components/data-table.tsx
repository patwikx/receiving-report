'use client';

import { useState, useEffect, useMemo } from 'react';
import { JournalEntry } from '@/types/sap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, X, FileText, Check, ChevronsUpDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface FlattenedJournalEntry {
  transId: string; // Changed to string to match your sap.ts
  postingDate: string;
  bpName: string;
  bpCode: string;
  category: string;
  remark: string;
  debit: number;
  credit: number;
  color: string;
  glAccountCode: string;
  glAccountName: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'MANCOM MEALS', label: 'MANCOM MEALS', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'EXECOM MEALS', label: 'EXECOM MEALS', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'EXCESS MEALS', label: 'EXCESS MEALS', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'INSURANCE', label: 'INSURANCE', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'HMO', label: 'HMO', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { value: 'OTHER', label: 'OTHER', color: 'bg-gray-50 text-gray-700 border-gray-200' }
];

export function DataTable() {
  const [rawData, setRawData] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBP, setSelectedBP] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [itemsPerPage] = useState(50);

  const fetchData = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      
      if (selectedBP) {
        // Check if it's likely a BP Code (shorter, alphanumeric) or BP Name
        if (selectedBP.length <= 10 && /^[A-Z0-9_-]+$/i.test(selectedBP)) {
          params.append('bpCode', selectedBP);
        } else {
          params.append('bpName', selectedBP);
        }
      }

      const response = await fetch(`/api/sap-data?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setRawData(result.data);
        setPagination(result.pagination);
        setCurrentPage(page);
      } else {
        console.error('API Error:', result.error);
        alert('Failed to fetch data: ' + result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to connect to the database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [selectedBP]);

  // Create unique options for BP selection
  const bpOptions = useMemo(() => {
    const options = new Set<string>();
    rawData.forEach(item => {
      if (item.bpName) options.add(item.bpName);
      if (item.bpCode) options.add(item.bpCode);
    });
    return Array.from(options).sort();
  }, [rawData]);

  // Convert raw data to flattened display format
  const flattenedData = useMemo((): FlattenedJournalEntry[] => {
    return rawData.map(entry => {
      const lineRemarks = entry.lineRemarks?.toUpperCase() || '';
      let category = 'OTHER';
      let color = 'bg-gray-50 text-gray-700 border-gray-200';

      if (lineRemarks.includes('MANCOM MEALS')) {
        category = 'MANCOM MEALS';
        color = 'bg-blue-50 text-blue-700 border-blue-200';
      } else if (lineRemarks.includes('EXECOM MEALS')) {
        category = 'EXECOM MEALS';
        color = 'bg-green-50 text-green-700 border-green-200';
      } else if (lineRemarks.includes('EXCESS MEALS')) {
        category = 'EXCESS MEALS';
        color = 'bg-yellow-50 text-yellow-700 border-yellow-200';
      } else if (lineRemarks.includes('INSURANCE')) {
        category = 'INSURANCE';
        color = 'bg-purple-50 text-purple-700 border-purple-200';
      } else if (lineRemarks.includes('HMO')) {
        category = 'HMO';
        color = 'bg-pink-50 text-pink-700 border-pink-200';
      }

      return {
        transId: entry.transId,
        postingDate: entry.postingDate,
        bpName: entry.bpName || 'Unknown',
        bpCode: entry.bpCode || '',
        category,
        remark: entry.lineRemarks || '',
        debit: entry.debitLC || 0,
        credit: entry.creditLC || 0,
        color,
        glAccountCode: entry.glAccountCode || '',
        glAccountName: entry.glAccountName || ''
      };
    });
  }, [rawData]);

  // Apply filters (client-side filtering for current page)
  const filteredData = useMemo(() => {
    let filtered = flattenedData;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.bpName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bpCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remark.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [flattenedData, searchTerm, selectedCategory]);

  // Use server-side pagination, so no need for client-side pagination logic
  const paginatedData = filteredData;

  const clearFilters = () => {
    setSelectedBP('');
    setSelectedCategory('all');
    setSearchTerm('');
    setComboboxOpen(false);
    fetchData(1);
  };

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, pagination.totalPages));
    fetchData(newPage);
  };

  // Get category counts for the current data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    flattenedData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [flattenedData]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">

      {/* Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Business Partner</label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedBP || "Select BP Name or Code..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search business partner..." />
                    <CommandEmpty>No business partner found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {bpOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={(currentValue) => {
                            setSelectedBP(currentValue === selectedBP ? "" : currentValue);
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedBP === option ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <span className="font-medium">{option}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        {category.value !== 'all' && categoryCounts[category.value] && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {categoryCounts[category.value]}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Actions</label>
              <div className="flex space-x-2">
                <Button onClick={() => fetchData(currentPage)} disabled={loading} className="flex-1">
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  disabled={!selectedBP && !searchTerm && selectedCategory === 'all'}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedBP || selectedCategory !== 'all' || searchTerm) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedBP && (
                  <Badge variant="secondary" className="flex items-center">
                    BP: {selectedBP}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
                      onClick={() => setSelectedBP('')}
                    />
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center">
                    Category: {selectedCategory}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center">
                    Search: &quot;{searchTerm}&quot;
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Journal Entries Data 
              <Badge variant="secondary" className="ml-2">
                {pagination.totalRecords} total records
              </Badge>
              {filteredData.length !== flattenedData.length && (
                <Badge variant="outline" className="ml-2">
                  {filteredData.length} filtered
                </Badge>
              )}
            </CardTitle>
            
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalRecords)} of {pagination.totalRecords} entries
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Trans ID</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Business Partner</th>
                  <th className="text-left p-4 font-semibold text-gray-900">BP Code</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Remark</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Debit</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={`${item.transId}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Badge variant="outline" className="font-mono">
                        {item.transId}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {item.postingDate ? new Date(item.postingDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.bpName}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-mono">
                        {item.bpCode || 'N/A'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
                        {item.category}
                      </div>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="text-sm text-gray-700 break-words">
                        {item.remark}
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-sm">
                      {item.debit > 0 ? `₱${item.debit.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-right font-mono text-sm">
                      {item.credit > 0 ? `₱${item.credit.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {paginatedData.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">No data found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 font-medium">Loading data...</p>
                <p className="text-gray-400 text-sm">Please wait while we fetch your data</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber: number;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else {
                      // Show current page and surrounding pages
                      const start = Math.max(1, currentPage - 2);
                      pageNumber = start + i;
                      if (pageNumber > pagination.totalPages) return null;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}