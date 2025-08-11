import { useMemo, useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import type { RootRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Table, TimeFilter } from '../components/ui';
import { useThemeStore } from '../store/themeStore';
import clsx from 'clsx';
import { Search } from '@/components';
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

// Campaign icons component
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

function CallerAnalysis() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Define table columns
  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return callData;
    return callData.filter((d) => {
      const dateStr = d.lastCall.split(' ET')[0];
      const date = dayjs(dateStr, 'MMM DD, hh:mm:ss A');
      return date.isSameOrAfter(dayjs(dateRange.from)) && date.isSameOrBefore(dayjs(dateRange.to));
    });
  }, [dateRange]);

  const columns = useMemo<ColumnDef<CallData>[]>(
    () => [
      {
        header: 'CALLER ID',
        accessorKey: 'callerId',
        meta: { sticky: true } as any,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <button className={clsx('p-1 rounded hover:bg-gray-200', isDark && 'hover:bg-gray-700')}>
              📋
            </button>
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

        <div className="flex flex-col md:flex-row gap-4">
          <TimeFilter onChange={setDateRange} />
          <Search placeholder='Search caller ID' className='w-full' />
        </div>
        {/* Main Table */}
        <div className="mt-8">
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
