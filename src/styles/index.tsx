import React from 'react'
import '../styles.css'
import './main.css'
import './card.css'
import './buttons.css'
import './input.css'
import './table.css'
import './pagination.css'
import './datapicker.css'

import 'react-tooltip/dist/react-tooltip.css'

import clsx from 'clsx'
import { useThemeStore } from '../store/themeStore'
import type { ReactNode } from 'react'

interface IndexProps {
    children: ReactNode
}

const Index: React.FC<IndexProps> = ({ children }) => {
    const { theme } = useThemeStore() // get theme from Zustand
    const isDark = theme === 'dark'

    return (
        <div className={clsx(isDark ? 'theme-dark' : 'theme-light')}>
            {children}
        </div>
    )
}

export default Index
