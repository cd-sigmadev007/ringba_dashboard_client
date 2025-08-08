import React, { type FC } from 'react';
import Logo from '../components/logo';
import { get, map } from 'lodash';
import { socialLinks } from './utils/social-links';
import { Link } from '@tanstack/react-router';
import { useThemeStore } from '../store/themeStore';
import clsx from 'clsx';

interface SocialLink {
    link: string;
    icon: React.ReactNode;
}

const Footer: FC = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    
    return (
        <footer
            className={clsx(
                "w-full min-h-[97px] px-4 sm:px-6 lg:px-12 py-4 lg:py-6 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-4 lg:gap-0 transition-colors duration-300",
                isDark ? 'bg-[#001e3c]' : 'bg-white'
            )}
        >
            {/* Left Section - Logo and Social Icons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[14px]">
                {/* Logo */}
                <div className="w-[75px] h-6">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                
                {/* Social Icons */}
                <div className="flex items-center gap-3 sm:gap-[14px]">
                    {map(socialLinks as SocialLink[], (item, index) => (
                        <div key={index} className="w-4 h-4">
                            <a
                                rel="noreferrer"
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                href={get(item, 'link', '#')}
                                target="_blank"
                            >
                                {get(item, 'icon')}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Section - Links and Copyright */}
            <div className="flex flex-col items-center lg:items-end gap-2 lg:gap-[7px] text-center lg:text-right">
                {/* Legal Links */}
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-[14px]">
                    <span 
                        className={clsx(
                            "text-[12px] sm:text-[14px] font-medium cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap",
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5e6278]'
                        )}
                    >
                        Terms
                    </span>
                    <span 
                        className={clsx(
                            "text-[12px] sm:text-[14px] font-medium cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap",
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5e6278]'
                        )}
                    >
                        Privacy Policy
                    </span>
                    <span 
                        className={clsx(
                            "text-[12px] sm:text-[14px] font-medium cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap",
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5e6278]'
                        )}
                    >
                        Cookie Policy
                    </span>
                </div>
                
                {/* Copyright */}
                <p 
                    className={clsx(
                        "text-[10px] sm:text-[12px] lg:text-[14px] font-normal text-center lg:text-right max-w-[300px] sm:max-w-[500px] lg:max-w-[762px] leading-relaxed",
                        isDark ? 'text-[#7E8299]' : 'text-[#a1a5b7]'
                    )}
                >
                    © 2023 Insidefi.io All rights reserved by Clickdee Mediashare OÜ, 6 sepapaja, Harijumma, Tallinn, 15551, Estonia
                </p>
            </div>
        </footer>
    );
};

export default Footer;