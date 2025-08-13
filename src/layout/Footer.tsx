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
                "w-full",
                isDark ? 'bg-[#001E3C]' : 'bg-white'
            )}
        >
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between px-12 py-6">
                {/* Left Section - Logo and Social Icons */}
                <div className="flex items-center gap-[14px] m-w-[75px]">
                    {/* Logo */}
                    <div className="h-6">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                    
                    {/* Social Icons */}
                    <div className="flex items-center gap-[14px]">
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
                <div className="flex flex-col items-end gap-[7px]">
                    {/* Legal Links */}
                    <div className="flex items-center gap-[14px]">
                        <span 
                            className={clsx(
                                "!text-sm cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Terms
                        </span>
                        <span 
                            className={clsx(
                                "!text-sm cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Privacy Policy
                        </span>
                        <span 
                            className={clsx(
                                "!text-sm cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Cookie Policy
                        </span>
                    </div>
                    
                    {/* Copyright */}
                    <p 
                        className={clsx(
                            "!text-sm !text-center",
                            isDark ? '!text-[#7E8299]' : '!text-[#7E8299]'
                        )}
                    >
                        © 2023 Insidefi.io All rights reserved by Clickdee Mediashare OÜ, 6 sepapaja, Harijumma, Tallinn, 15551, Estonia
                    </p>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col px-4 py-6 gap-10">
                {/* Logo and Social Icons */}
                <div className="flex flex-col items-center gap-6">
                    {/* Logo */}
                        <Link to="/">
                            <Logo />
                        </Link>
                    
                    {/* Social Icons */}
                    <div className="flex items-center gap-[25px]">
                        {map(socialLinks as SocialLink[], (item, index) => (
                            <div key={index} className="w-5 h-5">
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

                {/* Content Sections */}
                <div className="flex justify-around gap-[30px]">
                    {/* Legal Section */}
                    <div className="flex flex-col gap-[10px]">
                        <h3 
                            className={clsx(
                                "!text-[25px] font-semibold",
                                isDark ? '!text-[#EDEDED]' : '!text-[#2B2B2B]'
                            )}
                        >
                            Legal
                        </h3>
                        <span 
                            className={clsx(
                                "cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Terms
                        </span>
                        <span 
                            className={clsx(
                                "cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Privacy Policy
                        </span>
                    </div>

                    {/* Company Section */}
                    <div className="flex flex-col gap-[10px]">
                        <h3 
                            className={clsx(
                                "!text-[24px] font-semibold",
                                isDark ? '!text-[#EDEDED]' : '!text-[#2B2B2B]'
                            )}
                        >
                            Company
                        </h3>
                        <span 
                            className={clsx(
                                "cursor-pointer hover:opacity-80 transition-opacity",
                                isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                            )}
                        >
                            Blogs
                        </span>
                        <div className="flex items-center gap-[10px]">
                            <span 
                                className={clsx(
                                    "cursor-pointer hover:opacity-80 transition-opacity",
                                    isDark ? '!text-[#A1A5B7]' : '!text-[#A1A5B7]'
                                )}
                            >
                                Join Beta
                            </span>
                            <div className="bg-[#002B57] rounded-[7px] px-[6px] py-[1px]">
                                <span className="!text-xs !text-[#42A0FF]">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div 
                    className={clsx(
                        "w-full h-px",
                        isDark ? 'bg-[#1B456F]' : 'bg-[#E5E5E5]'
                    )}
                />

                {/* Copyright */}
                <p 
                    className={clsx(
                        "!text-sm !text-center leading-relaxed",
                        isDark ? '!text-[#7E8299]' : '!text-[#7E8299]'
                    )}
                >
                    © 2023 Insidefi.io All rights reserved by Clickdee Mediashare OÜ, 6 sepapaja, Harijumma, Tallinn, 15551, Estonia
                </p>
            </div>
        </footer>
    );
};

export default Footer;