import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import Logo from '../components/logo'
import Button from '../components/ui/Button'
import { useThemeStore } from '../store/themeStore'
import {
    CloseIconDark,
    CloseIconLight,
    HamburgerMenu,
    SearchIcon,
} from '../assets/svg'
import { usePermissions } from '../hooks/usePermissions'
import UserDropdown from '../components/ui/UserDropdown'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
    setOpenMenu?: (open: boolean) => void
    openMenu?: boolean
}

const Index: React.FC<HeaderProps> = ({ setOpenMenu, openMenu }) => {
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { user, loading, logout } = useAuth()
    const navigate = useNavigate()
    const { role } = usePermissions()
    const isAuthenticated = !!user
    const userName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          user.email
        : undefined

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }

    const toAbsolutePictureUrl = (url?: string | null) => {
        if (!url) return undefined
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        const base = getApiBaseUrl()
        const path = url.startsWith('/') ? url : `/${url}`
        return `${base}${path}`
    }

    const userPicture = toAbsolutePictureUrl(user?.profilePictureUrl)

    return (
        <>
            <header className="bg-blur fixed w-full z-[200]">
                <nav className="px-4 lg:px-10 flex justify-between items-center h-[56px] lg:h-[65px] relative">
                    {/* Hamburger Menu Button */}
                    <button
                        className="xl:hidden mr-2.5"
                        onClick={() => setOpenMenu && setOpenMenu(!openMenu)}
                    >
                        <HamburgerMenu />
                    </button>

                    {/* Logo */}
                    <div className="xl:w-64">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>

                    {/* Search Button for Mobile */}
                    <button
                        className="lg:hidden"
                        onClick={() => setOpenSearchBar((prev) => !prev)}
                    >
                        {!openSearchBar ? (
                            <SearchIcon />
                        ) : isDark ? (
                            <CloseIconDark />
                        ) : (
                            <CloseIconLight />
                        )}
                    </button>

                    {/* Desktop Menu - Search, User Menu, Avatar */}
                    <div className="items-center justify-between flex-grow hidden lg:flex lg:ml-10">
                        {/* Search component */}
                        <div className="flex-grow xl:max-w-[510px] lg:mr-10">
                            {/* <Search /> */}
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-x-1 lg:gap-x-2.5">
                            {loading ? (
                                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded"></div>
                            ) : isAuthenticated ? (
                                <UserDropdown
                                    userName={userName}
                                    userEmail={user?.email}
                                    userPicture={userPicture}
                                    role={role || undefined}
                                    onLogout={() => logout()}
                                />
                            ) : (
                                <Button
                                    onClick={() => navigate({ to: '/login' })}
                                >
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Index
