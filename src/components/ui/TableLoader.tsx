import React from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../../store/themeStore';

interface TableLoaderProps {
  /**
   * Table headers configuration for skeleton layout
   */
  headers?: Array<{ title: string; width?: string }>;
  /**
   * Whether to show table header skeleton
   */
  withThead?: boolean;
  /**
   * Whether to show heading section skeleton
   */
  withHeading?: boolean;
  /**
   * Additional skeleton elements in heading
   */
  extra?: boolean;
  /**
   * Number of skeleton rows to show
   */
  rowCount?: number;
  /**
   * Custom className for the loader container
   */
  className?: string;
}

/**
 * Enhanced Table Loader Component
 * Based on the frontend repository table loader with improved styling
 */
const TableLoader: React.FC<TableLoaderProps> = ({
  headers = [
    { title: 'Name', width: 'w-48' },
    { title: 'Phone', width: 'w-32' },
    { title: 'Date', width: 'w-28' },
    { title: 'Duration', width: 'w-24' },
    { title: 'Status', width: 'w-20' },
  ],
  withThead = true,
  withHeading = false,
  extra = false,
  rowCount = 5,
  className,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const SkeletonRect: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = 'w-20', 
    height = 'h-4', 
    className: rectClassName 
  }) => (
    <div
      className={clsx(
        'animate-pulse rounded-lg',
        width,
        height,
        isDark ? 'bg-[#132F4C]' : 'bg-[#ECECEC]',
        rectClassName
      )}
    />
  );

  return (
    <div className={clsx('w-full', className)}>
      {withHeading && (
        <div
          className={clsx(
            'flex justify-between items-center px-5 pt-[21px] pb-[26px] rounded-t-[10px] border-b',
            isDark
              ? 'bg-[#001E3C] border-[#1B456F]'
              : 'bg-white border-[#ECECEC]'
          )}
        >
          <SkeletonRect width={extra ? 'w-20' : 'w-44'} height="h-4" />
          {extra && <SkeletonRect width="w-20" height="h-4" />}
        </div>
      )}
      
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          {withThead && (
            <thead>
              <tr
                className={clsx(
                  'border-b',
                  isDark
                    ? 'bg-[#001E3C] border-[#1B456F]'
                    : 'bg-[#F5F8FA] border-[#ECECEC]'
                )}
              >
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={clsx(
                      'px-5 py-4 text-left',
                      header.width || 'w-auto'
                    )}
                  >
                    <SkeletonRect width="w-16" height="h-3" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={clsx(
                  'border-b last:border-b-0',
                  isDark
                    ? 'bg-[#001E3C] border-[#1B456F]'
                    : 'bg-white border-[#ECECEC]',
                  // Add opacity variation for visual depth
                  rowIndex % 2 === 1 && 'bg-opacity-50'
                )}
              >
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-6">
                    <SkeletonRect 
                      width={
                        cellIndex === 0 ? 'w-24' : // First column (name) wider
                        cellIndex === 1 ? 'w-20' : // Phone number
                        cellIndex === 2 ? 'w-16' : // Date
                        cellIndex === 3 ? 'w-12' : // Duration
                        'w-14' // Status or other columns
                      }
                      height="h-4"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoader;
