import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
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

interface HeaderProps {
    setOpenMenu?: (open: boolean) => void
    openMenu?: boolean
}

const Index: React.FC<HeaderProps> = ({ setOpenMenu, openMenu }) => {
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

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
                            <a href="/sign-up" target="_blank">
                                <Button>Join Beta</Button>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Index
