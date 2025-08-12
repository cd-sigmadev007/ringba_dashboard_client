import React from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore';

interface CampaignProps {
  campaign: string;
}

export const Campaign: React.FC<CampaignProps> = ({ campaign }) => {
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
