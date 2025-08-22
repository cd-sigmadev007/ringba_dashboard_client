import React from 'react';
import { useCallerAnalysisApi } from '../hooks';
import { useThemeStore } from '@/store/themeStore';
import { Table, TableLoader } from '@/components/ui';
import type { FilterState } from '../types';
import { clsx } from 'clsx';

export const ApiDataDemo: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  // Sample filters for demo
  const sampleFilters: FilterState = {
    dateRange: {},
    campaignFilter: [],
    statusFilter: [],
    durationFilter: '',
    durationRange: {},
    searchQuery: '',
  };

  const {
    useGetAllCallers,
    useHealthCheck,
    useGetTableSchema,
    convertApiDataToCallData,
  } = useCallerAnalysisApi();

  // Fetch data from API
  const { data: apiData, isLoading, error, isError } = useGetAllCallers(sampleFilters, 1, 10);
  const { data: healthData } = useHealthCheck();
  const { data: schemaData } = useGetTableSchema();

  if (isLoading) {
    return <TableLoader />;
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          API Connection Error
        </h3>
        <p className="text-red-700 dark:text-red-300">
          {error?.message || 'Failed to connect to the backend API'}
        </p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Make sure the backend server is running on http://localhost:3001
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Check the backend README for setup instructions
          </p>
        </div>
      </div>
    );
  }

  if (!apiData?.data) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          No Data Available
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          The API is connected but no caller data was returned.
        </p>
      </div>
    );
  }

  // Convert API data to frontend format
  const callData = convertApiDataToCallData(apiData.data);

  // Simple table columns for demo
  const columns = [
    { accessorKey: 'callerId', header: 'Caller ID' },
    { accessorKey: 'lastCall', header: 'Last Call' },
    { accessorKey: 'duration', header: 'Duration' },
    { accessorKey: 'campaign', header: 'Campaign' },
    { accessorKey: 'action', header: 'Action' },
  ];

  return (
    <div className="space-y-6">
      {/* API Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-semibold text-green-800 dark:text-green-200">API Status</h4>
          <p className="text-green-700 dark:text-green-300">
            {healthData?.status || 'Unknown'}
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">Total Records</h4>
          <p className="text-blue-700 dark:text-blue-300">
            {apiData.pagination?.total || 0}
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="font-semibold text-purple-800 dark:text-purple-200">Page</h4>
          <p className="text-purple-700 dark:text-purple-300">
            {apiData.pagination?.page || 1} of {apiData.pagination?.totalPages || 1}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Caller Data from API
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {callData.length} of {apiData.pagination?.total || 0} records
          </p>
        </div>
        
        <Table
          data={callData}
          columns={columns}
          className={clsx(
            'w-full',
            isDark ? 'dark' : ''
          )}
        />
      </div>

      {/* Schema Information */}
      {schemaData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Database Schema
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemaData.map((column: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {column.column_name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {column.data_type} {column.is_nullable === 'YES' ? '(nullable)' : '(required)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
