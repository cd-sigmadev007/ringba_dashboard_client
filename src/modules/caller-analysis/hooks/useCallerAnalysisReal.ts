import React from 'react';
import { useCallerAnalysisApi } from './useCallerAnalysisApi';
import type { FilterState, CallData } from '../types';

export const useCallerAnalysisReal = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  
  const {
    useGetAllCallers,
    convertApiDataToCallData,
  } = useCallerAnalysisApi();

  // Sample filters for now - you can expand this later
  const sampleFilters: FilterState = {
    dateRange: {},
    campaignFilter: [],
    statusFilter: [],
    durationFilter: '',
    durationRange: {},
    searchQuery: '',
  };

  // Fetch real data from API
  const { 
    data: apiData, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useGetAllCallers(sampleFilters, currentPage, pageSize);

  // Convert API data to frontend format
  const filteredData: CallData[] = React.useMemo(() => {
    if (!apiData?.data) return [];
    return convertApiDataToCallData(apiData.data);
  }, [apiData?.data, convertApiDataToCallData]);

  // Mock filter functions for now - you can implement real filtering later
  const updateFilters = (_newFilters: Partial<FilterState>) => {
    // For now, just refetch data when filters change
    // You can implement real filtering logic here
    refetch();
  };

  const removeFilters = (_filterType: keyof FilterState) => {
    // Implement filter removal logic
    refetch();
  };

  const clearAllFilters = () => {
    // Implement clear all filters logic
    refetch();
  };

  const hasActiveFilters = false; // You can implement this based on your filter state

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    // Data
    filteredData,
    isLoading,
    error,
    isError,
    
    // Filters
    filters: sampleFilters,
    updateFilters,
    removeFilters,
    clearAllFilters,
    hasActiveFilters,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages: apiData?.pagination?.totalPages || 1,
    totalRecords: apiData?.pagination?.total || 0,
    handlePageChange,
    handlePageSizeChange,
    
    // Refresh
    refetch,
  };
};
