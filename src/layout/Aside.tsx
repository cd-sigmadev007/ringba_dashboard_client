import React, { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { get, map } from 'lodash'
import clsx from 'clsx'
import { Tooltip } from '../components/common'
import type { NavLinkItem } from '@/layout/utils/navLinks'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import ThemeSwitcher from '@/layout/utils/theme-switcher'
import { navLinks } from '@/layout/utils/navLinks'
import { ChevronDownDark, ChevronDownLight } from '@/assets/svg'
import { usePermissions } from '@/hooks/usePermissions'

interface NavItemProps {
    navItem: NavLinkItem
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
    expandedItems: Set<string | number>
    toggleExpanded: (id: string | number) => void
}

const NavItem: React.FC<NavItemProps> = ({
    navItem,
    setOpenMenu,
    expandedItems,
    toggleExpanded,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const location = useLocation()
    const { role } = usePermissions()
    const hasSubmenu = navItem.submenu && navItem.submenu.length > 0
    const isExpanded = expandedItems.has(navItem.id)
    const isActive =
        navItem.submenu?.some((item) => location.pathname === item.path) ||
        false

    if (get(navItem, 'disable')) {
        return (
            <Tooltip
                id={String(get(navItem, 'id', ''))}
                tooltipText="Coming soon"
            >
                <button
                    className={clsx('sidebar-item group cursor-pointer w-full')}
                    disabled
                >
                    <span>{get(navItem, 'icon')}</span>
                    <span>{get(navItem, 'title', '')}</span>
                </button>
            </Tooltip>
        )
    }

    if (hasSubmenu) {
        return (
            <li className="w-full">
                <Button
                    variant="secondary"
                    onClick={() => toggleExpanded(navItem.id)}
                    className={clsx(
                        'sidebar-item bg-transparent group w-full justify-between',
                        isActive && 'sidebar-item-active'
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <span>{get(navItem, 'icon')}</span>
                        <span>{get(navItem, 'title', '')}</span>
                    </div>
                    {isDark ? (
                        <ChevronDownDark
                            className={clsx(
                                'transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    ) : (
                        <ChevronDownLight
                            className={clsx(
                                'transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    )}
                </Button>
                {isExpanded && (
                    <ul className="ml-4 mt-[14px] flex flex-col gap-y-[14px]">
                        {navItem.submenu
                            ?.filter((subItem) => {
                                // Filter out items that should be hidden for current role
                                const hideForRoles = subItem.hideForRoles || []
                                return !hideForRoles.includes(role || '')
                            })
                            .map((subItem) => {
                                const isSubActive =
                                    location.pathname === subItem.path
                                return get(subItem, 'disable') ? (
                                    <Tooltip
                                        key={subItem.id}
                                        id={String(subItem.id)}
                                        tooltipText="Coming soon"
                                    >
                                        <Button
                                            className={clsx(
                                                'sidebar-item group cursor-pointer w-full text-sm pl-8 bg-transparent',
                                                'opacity-50 cursor-not-allowed'
                                            )}
                                            disabled
                                        >
                                            <span>{subItem.title}</span>
                                        </Button>
                                    </Tooltip>
                                ) : (
                                    <li key={subItem.id} className="w-full">
                                        <Link
                                            to={subItem.path}
                                            className={clsx(
                                                'sidebar-item group text-sm pl-8',
                                                isSubActive &&
                                                    'sidebar-item-active sidebar-subitem-active'
                                            )}
                                            activeProps={{
                                                className:
                                                    'sidebar-item-active sidebar-subitem-active group is-active',
                                            }}
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                    </ul>
                )}
            </li>
        )
    }

    return (
        <li>
            <Link
                to={get(navItem, 'path', '/')}
                className="sidebar-item group"
                activeProps={{
                    className: 'sidebar-item-active group is-active',
                }}
                onClick={() => setOpenMenu(false)}
            >
                <span>{get(navItem, 'icon')}</span>
                <span>{get(navItem, 'title', '')}</span>
            </Link>
        </li>
    )
}

interface IndexProps {
    openMenu: boolean
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Index: React.FC<IndexProps> = ({ openMenu, setOpenMenu }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const location = useLocation()
    const { role } = usePermissions()
    const [expandedItems, setExpandedItems] = useState<Set<string | number>>(
        new Set()
    )

    useEffect(() => {
        document.body.style.overflowY = openMenu ? 'hidden' : 'auto'
    }, [openMenu])

    // Auto-expand Organization menu if on any org route
    useEffect(() => {
        if (location.pathname.startsWith('/organization')) {
            setExpandedItems((prev) => new Set(prev).add(99887766))
        }
    }, [location.pathname])

    const toggleExpanded = (id: string | number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    return (
        <aside
            className={clsx(
                '-left-full xl:left-0 lg:w-64 z-[100] overflow-scroll py-[30px] px-4 fixed bottom-0 top-[56px] lg:top-[65px] transition-all duration-300 sidebar',
                openMenu && 'left-0 w-full lg:w-64',
                'flex flex-col justify-between',
                isDark
                    ? 'bg-[#001e3c] border-r border-[#001e3c]'
                    : 'bg-[#ffffff] border-r border-[#ececec]'
            )}
        >
            <ul className="flex flex-col gap-y-2.5 sidebar-item-list">
                {map(navLinks, (navItem: NavLinkItem) => {
                    // Filter out nav items that should be hidden for current role
                    const hideForRoles = navItem.hideForRoles || []
                    if (hideForRoles.includes(role || '')) {
                        return null
                    }
                    return (
                        <NavItem
                            key={navItem.id}
                            navItem={navItem}
                            setOpenMenu={setOpenMenu}
                            expandedItems={expandedItems}
                            toggleExpanded={toggleExpanded}
                        />
                    )
                })}
            </ul>

            <div className="flex flex-col gap-y-5 lg:hidden overflow-scroll">
                <ThemeSwitcher />
            </div>
        </aside>
    )
}

export default Index
