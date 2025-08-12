import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore';
import Button from '../../../components/ui/Button';
import { Status, Campaign } from '../components';
import type { CallData } from '../types';

export const useTableColumns = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
          <Campaign campaign={getValue() as string} />
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
            <Status status={getValue() as string} />
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

  return columns;
};
