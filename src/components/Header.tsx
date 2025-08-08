import React, { useState } from 'react';
import Logo from './logo';
import ThemeSwitcher from './theme-switcher';
import Button from './ui/Button';
import { useThemeStore } from '../store/themeStore';
import { Link } from '@tanstack/react-router';

interface HeaderProps {
  setOpenMenu?: (open: boolean) => void;
  openMenu?: boolean;
}

const Index: React.FC<HeaderProps> = ({ setOpenMenu, openMenu }) => {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <>
      <header className="bg-blur fixed w-full z-[200]">
        <nav className="px-4 lg:px-10 flex justify-between items-center h-[56px] lg:h-[65px] relative">
          {/* Hamburger Menu Button */}
          <button
            className="xl:hidden mr-2.5"
            onClick={() => setOpenMenu && setOpenMenu(!openMenu)}
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.00098 18.8811C3.71764 18.8811 3.48031 18.7851 3.28898 18.5931C3.09698 18.4018 3.00098 18.1644 3.00098 17.8811C3.00098 17.5978 3.09698 17.3604 3.28898 17.1691C3.48031 16.9771 3.71764 16.8811 4.00098 16.8811H20.001C20.2843 16.8811 20.5216 16.9771 20.713 17.1691C20.905 17.3604 21.001 17.5978 21.001 17.8811C21.001 18.1644 20.905 18.4018 20.713 18.5931C20.5216 18.7851 20.2843 18.8811 20.001 18.8811H4.00098ZM4.00098 13.8811C3.71764 13.8811 3.48031 13.7851 3.28898 13.5931C3.09698 13.4018 3.00098 13.1644 3.00098 12.8811C3.00098 12.5978 3.09698 12.3601 3.28898 12.1681C3.48031 11.9768 3.71764 11.8811 4.00098 11.8811H20.001C20.2843 11.8811 20.5216 11.9768 20.713 12.1681C20.905 12.3601 21.001 12.5978 21.001 12.8811C21.001 13.1644 20.905 13.4018 20.713 13.5931C20.5216 13.7851 20.2843 13.8811 20.001 13.8811H4.00098ZM4.00098 8.8811C3.71764 8.8811 3.48031 8.78544 3.28898 8.5941C3.09698 8.4021 3.00098 8.16444 3.00098 7.8811C3.00098 7.59777 3.09698 7.3601 3.28898 7.1681C3.48031 6.97677 3.71764 6.8811 4.00098 6.8811H20.001C20.2843 6.8811 20.5216 6.97677 20.713 7.1681C20.905 7.3601 21.001 7.59777 21.001 7.8811C21.001 8.16444 20.905 8.4021 20.713 8.5941C20.5216 8.78544 20.2843 8.8811 20.001 8.8811H4.00098Z"
                className="btn-aside"
              />
            </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M17.2059 16.4688L20.374 19.6362C20.7203 19.9824 20.7203 20.5437 20.3741 20.8899C20.0279 21.2362 19.4665 21.2361 19.1203 20.8899L15.9529 17.7217C14.5412 18.8535 12.7852 19.469 10.9758 19.4664C6.57369 19.4664 3.00098 15.8937 3.00098 11.4916C3.00098 7.08955 6.57369 3.51685 10.9758 3.51685C15.3779 3.51685 18.9506 7.08955 18.9506 11.4916C18.9531 13.301 18.3376 15.057 17.2059 16.4688ZM15.4284 15.8113C16.5529 14.6549 17.1809 13.1047 17.1784 11.4916C17.1784 8.06514 14.4023 5.28902 10.9758 5.28902C7.54927 5.28902 4.77315 8.06514 4.77315 11.4916C4.77315 14.9181 7.54927 17.6943 10.9758 17.6943C12.5888 17.6968 14.139 17.0688 15.2955 15.9442L15.4284 15.8113Z"
                  className="btn-aside"
                />
              </svg>
            ) : isDark ? (
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75879 17.6072L12.0018 12.3642L17.2448 17.6072M17.2448 7.12122L12.0008 12.3642L6.75879 7.12122"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75879 18.1242L12.0018 12.8812L17.2448 18.1242M17.2448 7.63818L12.0008 12.8812L6.75879 7.63818"
                  stroke="#3F4254"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
  );
};

export default Index;