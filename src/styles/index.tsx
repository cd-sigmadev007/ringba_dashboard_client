import React, { type ReactNode } from 'react';
import './index.css';
import './billing-module.css';
import './card.css';
import './buttons.css';
import './input.css';
import './table.css';
import './pagination.css';
import './portfolio-sign-in.css';
import 'react-tooltip/dist/react-tooltip.css';

import clsx from 'clsx';
import { useThemeStore } from '@/store/themeStore';

interface IndexProps {
  children: ReactNode;
}

const Index: React.FC<IndexProps> = ({ children }) => {
  const { theme } = useThemeStore(); // get theme from Zustand
  const isDark = theme === 'dark';

  return (
    <div className={clsx(isDark ? 'theme-dark' : 'theme-light')}>
      {children}
    </div>
  );
};

export default Index;
