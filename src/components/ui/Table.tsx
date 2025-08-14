/**
 * Reusable Table Component
 * Based on defiportfolio table design with TanStack React Table
 */

import { useEffect, useRef, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import clsx from 'clsx';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../lib/utils';
import TableLoader from './TableLoader';

interface TableProps<T = any> {
  /**
   * Table data array
   */
  data: T[];
  /**
   * Column definitions for the table
   */
  columns: ColumnDef<T>[];
  /**
   * Whether to show table header
   */
  showHeader?: boolean;
  /**
   * Custom className for the table container
   */
  className?: string;
  /**
   * Whether table is collapsible
   */
  collapsible?: boolean;
  /**
   * Initial collapsed state
   */
  initialCollapsed?: boolean;
  /**
   * Table size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to enable pagination
   */
  pagination?: boolean;
  /**
   * Page size for pagination
   */
  pageSize?: number;
  /**
   * Whether rows are clickable
   */
  clickableRows?: boolean;
  /**
   * Row click handler
   */
  onRowClick?: (row: T) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
}

const Table = <T,>({
  data,
  columns,
  showHeader = true,
  className,
  collapsible = false,
  initialCollapsed = false,
  size = 'medium',
  pagination = false,
  pageSize = 20,
  clickableRows = false,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [sorting, setSorting] = useState<SortingState>([]);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Size variants for cells
  const sizeVariants = {
    small: 'px-3 py-2',
    medium: 'px-5 py-3.5',
    large: 'px-6 py-4',
  };

  // Check for horizontal overflow
  useEffect(() => {
    const checkOverflow = () => {
      const tableElement = tableRef.current;
      const containerElement = containerRef.current;

      if (tableElement && containerElement) {
        const isOverflowingHorizontally =
          tableElement.clientWidth > containerElement.clientWidth;
        setIsOverflowing(isOverflowingHorizontally);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  // Fuzzy filter function
  const fuzzyFilter = (row: any, columnId: string, value: string) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    return itemRank.passed;
  };

  // Initialize table
  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    enablePinning: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: pagination
        ? {
          pageIndex: 0,
          pageSize,
        }
        : undefined,
    },
  });

  // Handle row click
  const handleRowClick = (row: T) => {
    if (clickableRows && onRowClick) {
      onRowClick(row);
    }
  };

  if (loading) {
    // Create headers configuration from columns for the loader
    const loaderHeaders = columns.map((column: any) => ({
      title: column.header || column.id || 'Column',
      width: column.meta?.width || undefined,
    }));

    return (
      <div className={cn('w-full', className)}>
        <div className="card rounded-[10px] overflow-hidden">
          <TableLoader
            headers={loaderHeaders}
            withThead={showHeader}
            withHeading={false}
            rowCount={pageSize || 5}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <div className="card rounded-[10px] p-8 text-center">
          <div
            className={clsx(
              'text-lg font-medium mb-2',
              isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
            )}
          >
            {emptyMessage}
          </div>
          <div
            className={clsx(
              'text-sm',
              isDark ? 'text-[#7E8299]' : 'text-[#A1A5B7]'
            )}
          >
            No records found to display
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className="card rounded-[10px] overflow-hidden table-container"
        ref={containerRef}
      >
        {/* Collapsible header */}
        {collapsible && (
          <div
            className={clsx(
              'px-5 py-3 border-b cursor-pointer flex items-center justify-between',
              isDark
                ? 'bg-[#001E3C] border-[#1B456F] hover:bg-[#002B57]'
                : 'bg-[#F5F8FA] border-[#ECECEC] hover:bg-[#EFF2F5]'
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <div
              className={clsx(
                'font-semibold',
                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
              )}
            >
              Table Data ({data.length} items)
            </div>
          </div>
        )}

        {/* Table container */}
        <div
          className={clsx(
            'overflow-x-auto transition-all duration-500 ease-out',
            collapsed ? 'max-h-0 overflow-hidden' : 'max-h-none'
          )}
        >
          <table
            className="table-auto w-full single-table relative"
            ref={tableRef}
          >
            {/* Table Header */}
            {showHeader && (
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className={clsx(
                      'border-b thead-tr',
                      isDark
                        ? 'bg-[#001E3C] border-[#1B456F]'
                        : 'bg-[#F5F8FA] border-[#ECECEC]'
                    )}
                  >
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={clsx(
                          'px-5 py-[9px] uppercase text-[14px] font-semibold text-left',
                          (header.column.columnDef.meta as any)?.sticky && isOverflowing
                            ? 'sticky left-0 w-full sticky-column-th z-10'
                            : 'static w-auto',
                          isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]',
                          index === 0 && 'first:rounded-tl-[10px]',
                          index === headerGroup.headers.length - 1 && 'last:rounded-tr-[10px]'
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <div
                            className="flex items-center gap-x-2 cursor-pointer select-none hover:opacity-80"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <div className="flex items-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="17" 
                                height="17" 
                                viewBox="0 0 17 17" 
                                fill="none"
                                className="transform transition-opacity"
                              > 
                                <path 
                                  fillRule="evenodd" 
                                  clipRule="evenodd" 
                                  d="M5.18918 5.79405C5.13402 5.84473 5.08978 5.90584 5.0591 5.97375C5.02841 6.04165 5.01192 6.11495 5.01059 6.18928C5.00926 6.26361 5.02312 6.33744 5.05136 6.40637C5.07959 6.4753 5.12162 6.53791 5.17493 6.59048C5.22824 6.64304 5.29174 6.68448 5.36165 6.71233C5.43155 6.74017 5.50643 6.75384 5.58181 6.75253C5.65719 6.75122 5.73152 6.73495 5.80039 6.70469C5.86925 6.67444 5.93123 6.63081 5.98263 6.57643L8.39292 4.19978L10.8032 6.57643C10.9096 6.67421 11.0504 6.72744 11.1958 6.72491C11.3413 6.72238 11.4801 6.66429 11.5829 6.56286C11.6858 6.46144 11.7447 6.32461 11.7473 6.1812C11.7498 6.03778 11.6958 5.89899 11.5967 5.79405L8.78965 3.02621C8.68438 2.92255 8.54169 2.86432 8.39292 2.86432C8.24415 2.86432 8.10146 2.92255 7.9962 3.02621L5.18918 5.79405Z" 
                                  fill={isDark ? '#A1A5B7' : '#5E6278'}
                                  className={clsx(
                                    header.column.getIsSorted() === 'asc' ? 'opacity-100' : 'opacity-30'
                                  )}
                                /> 
                                <path 
                                  fillRule="evenodd" 
                                  clipRule="evenodd" 
                                  d="M5.18918 10.8585C5.13402 10.8079 5.08978 10.7467 5.0591 10.6788C5.02841 10.6109 5.01192 10.5376 5.01059 10.4633C5.00926 10.389 5.02312 10.3151 5.05136 10.2462C5.07959 10.1773 5.12162 10.1147 5.17493 10.0621C5.22824 10.0095 5.29174 9.9681 5.36165 9.94026C5.43155 9.91242 5.50643 9.89875 5.58181 9.90006C5.65719 9.90137 5.73152 9.91764 5.80039 9.94789C5.86925 9.97815 5.93123 10.0218 5.98263 10.0762L8.39292 12.4528L10.8032 10.0762C10.9096 9.97838 11.0504 9.92515 11.1958 9.92768C11.3413 9.93021 11.48 9.9883 11.5829 10.0897C11.6858 10.1911 11.7447 10.328 11.7473 10.4714C11.7498 10.6148 11.6958 10.7536 11.5967 10.8585L8.78965 13.6264C8.68438 13.73 8.54169 13.7883 8.39292 13.7883C8.24415 13.7883 8.10146 13.73 7.9962 13.6264L5.18918 10.8585Z" 
                                  fill={isDark ? '#A1A5B7' : '#5E6278'}
                                  className={clsx(
                                    header.column.getIsSorted() === 'desc' ? 'opacity-100' : 'opacity-30'
                                  )}
                                /> 
                              </svg>
                            </div>
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}

            {/* Table Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'transition-all duration-300 ease-linear group tr border-b last:border-b-0',
                    isDark
                      ? 'border-[#1B456F] hover:bg-[#001E3C]/50'
                      : 'border-[#ECECEC] hover:bg-[#F5F8FA]/50',
                    clickableRows && 'cursor-pointer'
                  )}
                  onClick={() => handleRowClick(row.original as T)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        'font-medium transition-colors',
                        sizeVariants[size],
                        (cell.column.columnDef.meta as any)?.sticky && isOverflowing
                          ? 'sticky left-0 w-full sticky-column z-[5]'
                          : 'static',
                        isDark
                          ? 'text-[#F5F8FA] bg-[#071B2F] group-hover:bg-[#001E3C]/80'
                          : 'text-[#3F4254] bg-white group-hover:bg-[#F5F8FA]/80'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div
            className={clsx(
              'px-5 py-3 border-t flex items-center justify-between',
              isDark
                ? 'bg-[#001E3C] border-[#1B456F]'
                : 'bg-[#F5F8FA] border-[#ECECEC]'
            )}
          >
            <div
              className={clsx(
                'text-sm',
                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
              )}
            >
              Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                table.getPrePaginationRowModel().rows.length
              )}{' '}
              of {table.getPrePaginationRowModel().rows.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  table.getCanPreviousPage()
                    ? isDark
                      ? 'bg-[#132F4C] text-[#F5F8FA] hover:bg-[#1B456F]'
                      : 'bg-[#007FFF] text-white hover:bg-[#0254A5]'
                    : isDark
                      ? 'bg-[#132F4C]/50 text-[#7E8299] cursor-not-allowed'
                      : 'bg-[#E0E0E0] text-[#A1A5B7] cursor-not-allowed'
                )}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  table.getCanNextPage()
                    ? isDark
                      ? 'bg-[#132F4C] text-[#F5F8FA] hover:bg-[#1B456F]'
                      : 'bg-[#007FFF] text-white hover:bg-[#0254A5]'
                    : isDark
                      ? 'bg-[#132F4C]/50 text-[#7E8299] cursor-not-allowed'
                      : 'bg-[#E0E0E0] text-[#A1A5B7] cursor-not-allowed'
                )}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
