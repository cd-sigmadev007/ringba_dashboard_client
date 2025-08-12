import React from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore';

interface StatusProps {
  status: string;
}

export const Status: React.FC<StatusProps> = ({ status }) => {
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
