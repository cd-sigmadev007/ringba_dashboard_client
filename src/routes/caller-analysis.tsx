import { useMemo, useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import type { RootRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Table, TimeFilter, FilterSelect, DurationRangeFilter } from '../components/ui';
import { useThemeStore } from '../store/themeStore';
import clsx from 'clsx';
import { Search } from '@/components';
import type { SelectOption } from '../components/ui/FilterSelect';
import type { DurationRange } from '../components/ui/DurationRangeFilter';
import Button from '@/components/ui/Button';
import CrossIcon from '../assets/svg/CrossIcon';
// import { Search } from '@/components';

// Types for our call data
interface CallData {
  id: string;
  callerId: string;
  lastCall: string;
  duration: string;
  lifetimeRevenue: number;
  campaign: string;
  action: string;
  status: string;
}

// Mock data based on your screenshot
const callData: CallData[] = [
  {
    id: '1',
    callerId: '+12025550173',
    lastCall: 'Aug 05, 06:00:00 AM ET',
    duration: '03m 25s',
    lifetimeRevenue: 503.99,
    campaign: 'H ⚠ P',
    action: 'Post Control',
    status: 'High Quality Unb...'
  },
  {
    id: '2',
    callerId: '+16175550112',
    lastCall: 'Aug 05, 02:45:00 AM ET',
    duration: '05m 12s',
    lifetimeRevenue: 30.96,
    campaign: '⚠',
    action: 'Chargeback Risk (C...',
    status: 'Chargeback Risk (C...'
  },
  {
    id: '3',
    callerId: '+13055550199',
    lastCall: 'Aug 04, 10:20:00 PM ET',
    duration: '02m 45s',
    lifetimeRevenue: 290.45,
    campaign: '⚠',
    action: 'Wrong Appliance Ca...',
    status: 'Wrong Appliance Ca...'
  },
  {
    id: '4',
    callerId: '+14155550147',
    lastCall: 'Aug 04, 05:00:00 PM ET',
    duration: '04m 05s',
    lifetimeRevenue: 110.95,
    campaign: 'H P',
    action: 'Wrong Appliance Ca...',
    status: 'Wrong Appliance Ca...'
  },
  {
    id: '5',
    callerId: '+14045550133',
    lastCall: 'Aug 04, 10:30:00 AM ET',
    duration: '06m 13s',
    lifetimeRevenue: 201.00,
    campaign: 'H ⚠ P',
    action: 'Wrong Post Control',
    status: 'Wrong Post Control'
  },
  {
    id: '6',
    callerId: '+13125550158',
    lastCall: 'Aug 03, 02:10:00 PM ET',
    duration: '05m 33s',
    lifetimeRevenue: 80.50,
    campaign: 'P',
    action: 'Inquiry / Previous',
    status: 'Caller Hung Up (IV...'
  },
  {
    id: '7',
    callerId: '+12125550184',
    lastCall: 'Aug 03, 09:00:00 AM ET',
    duration: '00m 05s',
    lifetimeRevenue: 0,
    campaign: 'H ⚠ P',
    action: 'Caller Hung Up (IV...',
    status: 'Caller Hung Up (IV...'
  },
  {
    id: '8',
    callerId: '+17135550129',
    lastCall: 'Aug 02, 03:20:00 PM ET',
    duration: '01m 09s',
    lifetimeRevenue: 90.50,
    campaign: '⚠ P',
    action: 'Competitor Mention...',
    status: 'Competitor Mention...'
  },
  {
    id: '9',
    callerId: '+18185550177',
    lastCall: 'Aug 02, 11:00:00 AM ET',
    duration: '03m 30s',
    lifetimeRevenue: 503.99,
    campaign: 'H ⚠',
    action: 'Positive Sentiment',
    status: 'Positive Sentiment'
  },
  {
    id: '10',
    callerId: '+15125550136',
    lastCall: 'Aug 01, 04:00:00 PM ET',
    duration: '01m 02s',
    lifetimeRevenue: 708.20,
    campaign: 'H P',
    action: 'Short Call (105)',
    status: 'Short Call (105)'
  }
];

// Filter options
const campaignOptions: SelectOption[] = [
  { title: 'H Only', value: 'H' },
  { title: 'P Only', value: 'P' },
  { title: 'Warning (⚠)', value: '⚠' },
  { title: 'H + P', value: 'H,P' },
  { title: 'H + Warning', value: 'H,⚠' },
  { title: 'P + Warning', value: 'P,⚠' },
  { title: 'All (H + P + Warning)', value: 'H,P,⚠' },
];

const statusOptions: SelectOption[] = [
  { title: 'High Quality', value: 'High Quality' },
  { title: 'Chargeback Risk', value: 'Chargeback' },
  { title: 'Wrong Appliance', value: 'Wrong' },
  { title: 'Inquiry/Previous', value: 'Inquiry' },
  { title: 'Caller Hung Up', value: 'Hung Up' },
  { title: 'Competitor Mention', value: 'Competitor' },
  { title: 'Positive Sentiment', value: 'Positive' },
  { title: 'Short Call', value: 'Short Call' },
];



// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const getStatusColor = (status: string) => {
    if (status.includes('High Quality')) return 'bg-blue-500 text-white';
    if (status.includes('Chargeback')) return 'bg-red-500 text-white';
    if (status.includes('Wrong')) return 'bg-orange-500 text-white';
    if (status.includes('Inquiry')) return 'bg-yellow-500 text-black';
    if (status.includes('Hung Up')) return 'bg-yellow-600 text-white';
    if (status.includes('Competitor')) return 'bg-green-500 text-white';
    if (status.includes('Positive')) return 'bg-green-600 text-white';
    if (status.includes('Short Call')) return 'bg-purple-500 text-white';
    return isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black';
  };

  return (
    <span className={clsx(
      'px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap',
      getStatusColor(status)
    )}>
      {status}
    </span>
  );
};

// Campaign component
const CampaignIcons = ({ campaign }: { campaign: string }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-1">
      {campaign.includes('H') && (
        <span className={clsx('text-xs font-bold', isDark ? 'text-blue-400' : 'text-blue-600')}>
          H
        </span>
      )}
      {campaign.includes('⚠') && (
        <span className="text-xs">⚠️</span>
      )}
      {campaign.includes('P') && (
        <span className={clsx('text-xs font-bold', isDark ? 'text-purple-400' : 'text-purple-600')}>
          P
        </span>
      )}
    </div>
  );
};

// Helper functions for filtering
const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)m\s+(\d+)s/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
};

const matchesCampaignFilter = (campaign: string, filters: string[]): boolean => {
  if (filters.length === 0) return true;

  // For multiple filters, check if campaign matches any of the selected filters
  return filters.some(filter => {
    // Handle special combinations
    if (filter.includes(',')) {
      const filterParts = filter.split(',').map(part => part.trim());
      // For combinations, check if campaign contains all specified parts
      return filterParts.every(part => campaign.includes(part));
    }

    // For single filters, check if campaign contains the part
    return campaign.includes(filter.trim());
  });
};

const matchesStatusFilter = (status: string, filters: string[]): boolean => {
  if (filters.length === 0) return true;
  return filters.some(filter => status.includes(filter));
};

const matchesDurationFilter = (duration: string, filter: string): boolean => {
  if (filter === 'all') return true;

  const seconds = parseDuration(duration);

  switch (filter) {
    case 'short':
      return seconds < 60;
    case 'medium':
      return seconds >= 60 && seconds < 180;
    case 'long':
      return seconds >= 180 && seconds < 300;
    case 'very-long':
      return seconds >= 300;
    default:
      return true;
  }
};

const matchesDurationRange = (duration: string, range: DurationRange): boolean => {
  if (!range.min && !range.max) return true;

  const seconds = parseDuration(duration);

  if (range.min !== undefined && seconds < range.min) {
    return false;
  }

  if (range.max !== undefined && seconds > range.max) {
    return false;
  }

  return true;
};

const matchesSearchQuery = (callerId: string, searchQuery: string): boolean => {
  if (!searchQuery.trim()) return true;

  try {
    // Create regex pattern - allow for flexible matching
    // Remove any existing + or special chars and create a flexible pattern
    const cleanQuery = searchQuery.replace(/[^\d\s]/g, '');
    const numbers = cleanQuery.split(/\s+/).filter(n => n.length > 0);

    if (numbers.length === 0) return true;

    // Create regex that matches numbers in sequence with optional separators
    const regexPattern = numbers.join('[\\s\\-\\(\\)\\.]*');
    const regex = new RegExp(regexPattern, 'i');

    // Test against caller ID (remove + prefix for matching)
    const cleanCallerId = callerId.replace(/^\+/, '');
    return regex.test(cleanCallerId) || regex.test(callerId);
  } catch (error) {
    // If regex fails, fall back to simple includes
    return callerId.toLowerCase().includes(searchQuery.toLowerCase());
  }
};

function CallerAnalysis() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [campaignFilter, setCampaignFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [durationRange, setDurationRange] = useState<DurationRange>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Define table columns
  const filteredData = useMemo(() => {
    return callData.filter((d) => {
      // Search filter (caller ID)
      if (!matchesSearchQuery(d.callerId, searchQuery)) {
        return false;
      }

      // Date filter
      if (dateRange.from && dateRange.to) {
        const dateStr = d.lastCall.split(' ET')[0];
        const date = dayjs(dateStr, 'MMM DD, hh:mm:ss A');
        if (!date.isSameOrAfter(dayjs(dateRange.from)) || !date.isSameOrBefore(dayjs(dateRange.to))) {
          return false;
        }
      }

      // Campaign filter
      if (!matchesCampaignFilter(d.campaign, campaignFilter)) {
        return false;
      }

      // Status filter
      if (!matchesStatusFilter(d.status, statusFilter)) {
        return false;
      }

      // Duration filter (legacy)
      if (!matchesDurationFilter(d.duration, durationFilter)) {
        return false;
      }

      // Duration range filter
      if (!matchesDurationRange(d.duration, durationRange)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, dateRange, campaignFilter, statusFilter, durationFilter, durationRange]);

  const columns = useMemo<ColumnDef<CallData>[]>(
    () => [
      {
        header: 'CALLER ID',
        accessorKey: 'callerId',
        meta: { sticky: true } as any,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="p-1 min-w-0 h-auto">
              📋
            </Button>
            <span className="font-mono text-sm">{getValue() as string}</span>
          </div>
        ),
      },
      {
        header: 'LAST CALL',
        accessorKey: 'lastCall',
        cell: ({ getValue }) => (
          <span className="text-sm whitespace-nowrap">{getValue() as string}</span>
        ),
      },
      {
        header: 'DURATION',
        accessorKey: 'duration',
        cell: ({ getValue }) => (
          <span className="text-sm font-mono">{getValue() as string}</span>
        ),
      },
      {
        header: 'LTR',
        accessorKey: 'lifetimeRevenue',
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <div className="text-sm">
              <div className={clsx('font-semibold', value > 0 ? 'text-green-500' : 'text-gray-500')}>
                ${value.toFixed(2)}
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded mt-1">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: 'CAMPAIGN',
        accessorKey: 'campaign',
        cell: ({ getValue }) => (
          <CampaignIcons campaign={getValue() as string} />
        ),
      },
      {
        header: 'ACTION',
        accessorKey: 'action',
        cell: () => (
          <div className="flex items-center gap-2">
            <button className={clsx('p-1 rounded hover:bg-gray-200', isDark && 'hover:bg-gray-700')}>
              ▶️
            </button>
            <button className={clsx('p-1 rounded hover:bg-gray-200', isDark && 'hover:bg-gray-700')}>
              📄
            </button>
            <button className={clsx('p-1 rounded hover:bg-gray-200', isDark && 'hover:bg-gray-700')}>
              ⚠️
            </button>
          </div>
        ),
      },
      {
        header: 'STATUS',
        accessorKey: 'status',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={getValue() as string} />
            <span className={clsx(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
              'bg-blue-500'
            )}>
              +{parseInt(row.id) + 3}
            </span>
          </div>
        ),
      },
    ],
    [isDark]
  );

  return (
    <div className="min-h-screen content">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={clsx(
            'text-2xl lg:text-3xl font-bold mb-2',
            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
          )}>
            Caller Analysis
          </h1>
          <p className={clsx(
            'text-sm',
            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
          )}>
            Comprehensive call tracking and analysis dashboard
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* First row - Date and Search */}
          <div className="flex gap-4">
            <TimeFilter onChange={setDateRange} className='min-w-[20%]' />
            <Search
              placeholder='Search caller ID'
              className='min-w-[20%]'
              onSearch={setSearchQuery}
              disableDropdown={true}
            />
            <FilterSelect
              defaultValue={{ title: 'Campaign', value: 'campaign' }}
              filterList={campaignOptions}
              setFilter={(value) => setCampaignFilter(Array.isArray(value) ? value : [value])}
              multiple={true}
              selectedValues={campaignFilter}
              className='flex-1/4'
            />
            <FilterSelect
              defaultValue={{ title: 'Status', value: 'status' }}
              filterList={statusOptions}
              setFilter={(value) => setStatusFilter(Array.isArray(value) ? value : [value])}
              multiple={true}
              selectedValues={statusFilter}
            />
            <DurationRangeFilter
              value={durationRange}
              onChange={setDurationRange}
              className='min-w-[22%]'
            />
          </div>

          {/* Applied Filters Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Campaign Filter Pills */}
            {campaignFilter.map(filter => {
              const option = campaignOptions.find(opt => opt.value === filter);
              return (
                <Button key={filter} variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
                  <span>{option?.title || filter}</span>
                  <p
                    onClick={() => setCampaignFilter(prev => prev.filter(v => v !== filter))}
                  >
                    <CrossIcon className='w-[20px] h-[20px]' />
                  </p>
                </Button>
              );
            })}

            {/* Status Filter Pills */}
            {statusFilter.map(filter => {
              const option = statusOptions.find(opt => opt.value === filter);
              return (

                <Button key={filter} variant='secondary' className='px-[10px] py-[7px] flex gap-[5px] items-center'>
                  <span>{option?.title || filter}</span>
                  <p
                    onClick={() => setStatusFilter(prev => prev.filter(v => v !== filter))}
                  >
                    <CrossIcon className='w-[20px] h-[20px]' />
                  </p>
                </Button>
              );
            })}

            {/* Duration Range Pill */}
            {(durationRange.min !== undefined || durationRange.max !== undefined) && (
              <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
                <p>{durationRange.min !== undefined && durationRange.max !== undefined
                    ? `${durationRange.min}s - ${durationRange.max}s`
                    : durationRange.min !== undefined
                      ? `Min: ${durationRange.min}s`
                      : `Max: ${durationRange.max}s`}
                </p>
                <p
                  onClick={() => setDurationRange({})}
                >
                  <CrossIcon className="w-[20px] h-[20px]" />
                </p>
              </Button>
            )}

            {/* Search Query Pill */}
            {searchQuery && (
              <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
                <p>Search: {searchQuery}</p>
                <p
                  onClick={() => setSearchQuery('')}
                >
                  <CrossIcon className="w-[20px] h-[20px]" />
                </p>
              </Button>
            )}

            {/* Date Range Pill */}
            {dateRange.from && (
              <Button variant='secondary' className='px-[10px] text-xs py-[7px] flex gap-[5px] items-center'>
                <p>
                  Date: {dayjs(dateRange.from).format('MMM DD, YYYY')}
                  {dateRange.to && ` - ${dayjs(dateRange.to).format('MMM DD, YYYY')}`}
                </p>
                <p
                  onClick={() => setDateRange({})}
                >
                  <CrossIcon className="w-[20px] h-[20px]" />
                </p>
              </Button>
            )}
          </div>

          {/* Filter summary */}
          <div className={clsx(
            'text-sm flex items-center gap-2',
            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
          )}>
            <span>Showing {filteredData.length} of {callData.length} calls</span>
            {(campaignFilter.length > 0 || statusFilter.length > 0 || durationFilter !== 'all' || dateRange.from || searchQuery || durationRange.min !== undefined || durationRange.max !== undefined) && (
              <Button
                variant='ghost'
                onClick={() => {
                  setCampaignFilter([]);
                  setStatusFilter([]);
                  setDurationFilter('all');
                  setDateRange({});
                  setSearchQuery('');
                  setDurationRange({});
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>
        {/* Main Table */}
        <div>
          <Table
            data={filteredData}
            columns={columns}
            showHeader={true}
            pagination={true}
            pageSize={20}
            clickableRows={false}
            size="medium"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/caller-analysis',
    component: CallerAnalysis,
    getParentRoute: () => parentRoute,
  })
