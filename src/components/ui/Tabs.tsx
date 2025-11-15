import React, { useState } from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'

export interface TabItem {
    id: string
    label: string
    content: React.ReactNode
}

export interface TabsProps {
    tabs: Array<TabItem>
    defaultActiveTab?: string
    className?: string
    tabsClassName?: string
    contentClassName?: string
    onChange?: (activeTabId: string) => void
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultActiveTab,
    className,
    tabsClassName,
    contentClassName,
    onChange,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [activeTab, setActiveTab] = useState(
        defaultActiveTab || tabs[0]?.id || ''
    )

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
        onChange?.(tabId)
    }

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
        <div className={clsx('w-full', className)}>
            {/* Tab Headers */}
            <div className={clsx('flex items-center gap-2.5', tabsClassName)}>
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={clsx(
                                'px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center relative',
                                isActive && [
                                    // Active tab styles - blue bottom border
                                    isDark
                                        ? 'text-[#F5F8FA]'
                                        : 'text-[#F5F8FA]',
                                    'border-b-2 border-[#007FFF]',
                                ],
                                !isActive && [
                                    // Inactive tab styles
                                    isDark
                                        ? 'text-[#7E8299]'
                                        : 'text-[#7E8299]',
                                ]
                            )}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className={clsx('w-full', contentClassName)}>
                {activeTabContent}
            </div>
        </div>
    )
}

export default Tabs
