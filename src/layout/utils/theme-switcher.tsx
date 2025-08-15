import React from 'react'
import clsx from 'clsx'
import Button from '../../components/ui/Button'
import { useThemeStore } from '../../store/themeStore'
import { MoonIcon, SunIcon } from '../../assets/svg'

interface ThemeSwitcherProps {
    className?: string
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
    const { theme, toggleTheme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <Button
            onClick={toggleTheme}
            className={clsx(
                '!px-[9px] banner-btn justify-center group',
                'flex items-center gap-2',
                'min-w-[44px] min-h-[44px]', // Touch-friendly size
                'sm:min-w-auto sm:min-h-auto',
                className
            )}
            variant="ghost"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
            {/* Icon container with consistent sizing */}
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                {isDark ? (
                    <SunIcon className="w-full h-full icon" />
                ) : (
                    <MoonIcon className="w-full h-full icon" />
                )}
            </div>

            {/* Text visible on mobile and hidden on desktop */}
            <span className="lg:hidden text-sm font-medium truncate">
                Switch to {isDark ? 'Light' : 'Dark'} Mode
            </span>
        </Button>
    )
}

export default ThemeSwitcher
