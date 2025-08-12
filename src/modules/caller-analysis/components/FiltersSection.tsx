import React from 'react';
import { TimeFilter, FilterSelect, DurationRangeFilter } from '../../../components/ui';
import { Search } from '../../../components/common';
import { campaignOptions, statusOptions } from '../data/mockData';
import type { FilterState } from '../types';

interface FiltersSectionProps {
  filters: FilterState;
  onFiltersChange: {
    dateRange: (range: { from?: Date; to?: Date }) => void;
    campaign: (value: string | string[]) => void;
    status: (value: string | string[]) => void;
    durationRange: (range: { min?: number; max?: number }) => void;
    search: (query: string) => void;
  };
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="flex gap-4">
      <TimeFilter onChange={onFiltersChange.dateRange} className='min-w-[20%]' />
      <Search
        placeholder='Search caller ID'
        className='min-w-[20%]'
        onSearch={onFiltersChange.search}
        disableDropdown={true}
      />
      <FilterSelect
        defaultValue={{ title: 'Campaign', value: 'campaign' }}
        filterList={campaignOptions}
        setFilter={onFiltersChange.campaign}
        multiple={true}
        selectedValues={filters.campaignFilter}
        className='flex-1/4'
      />
      <FilterSelect
        defaultValue={{ title: 'Status', value: 'status' }}
        filterList={statusOptions}
        setFilter={onFiltersChange.status}
        multiple={true}
        selectedValues={filters.statusFilter}
      />
      <DurationRangeFilter
        value={filters.durationRange}
        onChange={onFiltersChange.durationRange}
        className='min-w-[22%]'
      />
    </div>
  );
};
