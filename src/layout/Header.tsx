import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import Logo from '../components/logo'
import Button from '../components/ui/Button'
import { useThemeStore } from '../store/themeStore'
import {
    CloseIconDark,
    CloseIconLight,
    HamburgerMenu,
    SearchIcon,
} from '../assets/svg'
import ThemeSwitcher from './utils/theme-switcher'
import { usePermissions } from '../hooks/usePermissions'

interface HeaderProps {
    setOpenMenu?: (open: boolean) => void
    openMenu?: boolean
}

const Index: React.FC<HeaderProps> = ({ setOpenMenu, openMenu }) => {
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()
    const { role } = usePermissions()

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

                    {/* Desktop Menu - Search, User Menu, Theme Switcher, Join Beta */}
                    <div className="items-center justify-between flex-grow hidden lg:flex lg:ml-10">
                        {/* Search component */}
                        <div className="flex-grow xl:max-w-[510px] lg:mr-10">
                            {/* <Search /> */}
                        </div>

                        {/* Right side buttons */}
                        <div className="flex items-center gap-x-1 lg:gap-x-2.5">
                            <ThemeSwitcher />
                            {isLoading ? (
                                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded"></div>
                            ) : isAuthenticated ? (
                                <>
                                    {role && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                                            {role === 'super_admin' ? 'Super Admin' : role === 'org_admin' ? 'Org Admin' : 'User'}
                                        </span>
                                    )}
                                    <Button
                                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                        variant="ghost"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => loginWithRedirect()}>
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
