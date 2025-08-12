import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useThemeStore } from '../../../store/themeStore';
import Button from '../../../components/ui/Button';
import CrossIcon from '../../../assets/svg/CrossIcon';
import { campaignOptions, statusOptions } from '../data/mockData';
import type { FilterState } from '../types';
import type { DurationRange } from '../../../components/ui/DurationRangeFilter';

interface FilterPillsProps {
  filters: FilterState;
  onRemoveFilter: {
    campaign: (filter: string) => void;
    status: (filter: string) => void;
    durationRange: () => void;
    search: () => void;
    dateRange: () => void;
  };
}

export const FilterPills: React.FC<FilterPillsProps> = ({ filters, onRemoveFilter }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const formatDurationRange = (range: DurationRange) => {
    if (range.min !== undefined && range.max !== undefined) {
      return `${range.min}s - ${range.max}s`;
    }
    if (range.min !== undefined) {
      return `Min: ${range.min}s`;
    }
    if (range.max !== undefined) {
      return `Max: ${range.max}s`;
    }
    return '';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Campaign Filter Pills */}
      {filters.campaignFilter.map(filter => {
        const option = campaignOptions.find(opt => opt.value === filter);
        return (
          <Button key={filter} variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
            <span>{option?.title || filter}</span>
            <p onClick={() => onRemoveFilter.campaign(filter)}>
              <CrossIcon className='w-[20px] h-[20px]' />
            </p>
          </Button>
        );
      })}

      {/* Status Filter Pills */}
      {filters.statusFilter.map(filter => {
        const option = statusOptions.find(opt => opt.value === filter);
        return (
          <Button key={filter} variant='secondary' className='px-[10px] py-[7px] flex gap-[5px] items-center'>
            <span>{option?.title || filter}</span>
            <p onClick={() => onRemoveFilter.status(filter)}>
              <CrossIcon className='w-[20px] h-[20px]' />
            </p>
          </Button>
        );
      })}

      {/* Duration Range Pill */}
      {(filters.durationRange.min !== undefined || filters.durationRange.max !== undefined) && (
        <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
          <p>{formatDurationRange(filters.durationRange)}</p>
          <p onClick={onRemoveFilter.durationRange}>
            <CrossIcon className="w-[20px] h-[20px]" />
          </p>
        </Button>
      )}

      {/* Search Query Pill */}
      {filters.searchQuery && (
        <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
          <p>Search: {filters.searchQuery}</p>
          <p onClick={onRemoveFilter.search}>
            <CrossIcon className="w-[20px] h-[20px]" />
          </p>
        </Button>
      )}

      {/* Date Range Pill */}
      {filters.dateRange.from && (
        <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
          <p>
            Date: {dayjs(filters.dateRange.from).format('MMM DD, YYYY')}
            {filters.dateRange.to && ` - ${dayjs(filters.dateRange.to).format('MMM DD, YYYY')}`}
          </p>
          <p onClick={onRemoveFilter.dateRange}>
            <CrossIcon className="w-[20px] h-[20px]" />
          </p>
        </Button>
      )}
    </div>
  );
};
