import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { get, map } from 'lodash';
import clsx from 'clsx';
import Button from './button';
import ThemeSwitcher from './theme-switcher';
import { navLinks } from './navLinks';
import Tooltip from './tooltip';
import { useThemeStore } from '../store/themeStore';



interface NavLinkItem {
    id?: string;
    title?: string;
    path?: string;
    icon?: React.ReactNode;
    disable?: boolean;
}

interface NavItemProps {
    navItem: NavLinkItem;
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavItem: React.FC<NavItemProps> = ({ navItem, setOpenMenu }) => {
    return get(navItem, 'disable') ? (
        <Tooltip id={get(navItem, 'id', '')} tooltipText="Coming soon">
            <button
                className={clsx('sidebar-item group cursor-pointer w-full')}
                disabled
            >
                <span>{get(navItem, 'icon')}</span>
                <span>{get(navItem, 'title', '')}</span>
            </button>
        </Tooltip>
    ) : (
        <Link
            to={get(navItem, 'path', '/')}
            className="sidebar-item group"
            activeProps={{ className: 'sidebar-item-active group is-active' }}
            onClick={() => setOpenMenu(false)}
        >
            <span>{get(navItem, 'icon')}</span>
            <span>{get(navItem, 'title', '')}</span>
        </Link>
    );
};

interface IndexProps {
    openMenu: boolean;
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index: React.FC<IndexProps> = ({ openMenu, setOpenMenu }) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    useEffect(() => {
        document.body.style.overflowY = openMenu ? 'hidden' : 'auto';
    }, [openMenu]);

    // ✅ Define navigatesignup
    const navigatesignup = () => {
        window.location.href = '/signup';
    };

    return (
        <aside
            className={clsx(
                '-left-full xl:left-0 lg:w-64 z-[100] overflow-scroll py-[30px] px-4 fixed bottom-0 top-[56px] lg:top-[65px] transition-all duration-300 sidebar',
                openMenu && 'left-0 w-full lg:w-64',
                'flex flex-col justify-between',
                isDark ? 'bg-[#001e3c] border-r border-[#001e3c]' : 'bg-[#ffffff] border-r border-[#ececec]'
            )}
        >
            <ul className="flex flex-col gap-y-2.5 sidebar-item-list">
                {map(navLinks, (navItem: NavLinkItem, index: number) => (
                    <NavItem key={index} navItem={navItem} setOpenMenu={setOpenMenu} />
                ))}
            </ul>

            <div className="flex flex-col gap-y-5 lg:hidden overflow-scroll">
                <ThemeSwitcher />
                <Button className="h-11" onClick={navigatesignup}>
                    Join Beta
                </Button>
            </div>
        </aside>
    );
};

export default Index;

