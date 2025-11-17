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
import { usePermissions } from '../hooks/usePermissions'
import { useAuthStore } from '../store/authStore'
import UserDropdown from '../components/ui/UserDropdown'

interface HeaderProps {
    setOpenMenu?: (open: boolean) => void
    openMenu?: boolean
}

const Index: React.FC<HeaderProps> = ({ setOpenMenu, openMenu }) => {
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const {
        isAuthenticated: auth0Authenticated,
        isLoading: auth0Loading,
        loginWithRedirect,
        logout: auth0Logout,
        user: auth0User,
    } = useAuth0()
    const { isAuthenticated, isLoading, user, logout } = useAuthStore()
    const { role } = usePermissions()

    const handleLogout = async () => {
        // Logout from backend (destroys session)
        await logout()
        // Logout from Auth0
        auth0Logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        })
    }

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
                            {isLoading || auth0Loading ? (
                                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-20 rounded"></div>
                            ) : isAuthenticated ? (
                                <UserDropdown
                                    userName={
                                        user?.email.split('@')[0] ||
                                        auth0User?.name ||
                                        auth0User?.nickname
                                    }
                                    userEmail={user?.email || auth0User?.email}
                                    userPicture={auth0User?.picture}
                                    role={role || undefined}
                                    onLogout={handleLogout}
                                />
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
