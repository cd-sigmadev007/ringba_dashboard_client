import React from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore';
import { Table } from '../../../components/ui';
import Button from '../../../components/ui/Button';
import { FiltersSection, FilterPills } from '../components';
import { useCallerAnalysis, useTableColumns } from '../hooks';

export const CallerAnalysisContainer: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const {
    filters,
    filteredData,
    updateFilters,
    removeFilters,
    clearAllFilters,
    hasActiveFilters,
    totalRecords
  } = useCallerAnalysis();

  const columns = useTableColumns();

  return (
    <div className="min-h-screen content">
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={clsx(
            'text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2',
            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
          )}>
            Caller Analysis
          </h1>
          <p className={clsx(
            'text-xs sm:text-sm',
            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
          )}>
            Comprehensive call tracking and analysis dashboard
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {/* Filter Controls */}
          <FiltersSection
            filters={filters}
            onFiltersChange={updateFilters}
          />

          {/* Applied Filters Pills */}
          <FilterPills
            filters={filters}
            onRemoveFilter={removeFilters}
          />

          {/* Filter Summary */}
          <div className={clsx(
            'text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2',
            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
          )}>
            <span>Showing {filteredData.length} of {totalRecords} calls</span>
            {hasActiveFilters && (
              <Button
                variant='ghost'
                onClick={clearAllFilters}
                className="text-xs sm:text-sm"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <Table
            data={filteredData}
            columns={columns}
            showHeader={true}
            pagination={true}
            pageSize={20}
            clickableRows={false}
            size="medium"
            className="w-full min-w-[600px]"
          />
        </div>
      </div>
    </div>
  );
};
