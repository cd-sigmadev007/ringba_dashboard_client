import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { useNavigate } from '@tanstack/react-router'
import { Modal } from './Modal'
import { useThemeStore } from '@/store/themeStore'
import { ChevronDownDark, ChevronDownLight, DefaultAvatar } from '@/assets/svg'
import { useClickOutside, useIsMobile } from '@/lib'

interface UserDropdownProps {
    userName?: string
    userEmail?: string
    userPicture?: string
    role?: string
    onLogout: () => void
    className?: string
}

const UserDropdown: React.FC<UserDropdownProps> = ({
    userName,
    userEmail,
    userPicture,
    role,
    onLogout,
    className,
}) => {
    const navigate = useNavigate()
    const [openDropdown, setOpenDropdown] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
        'bottom'
    )
    const theme = useThemeStore((s) => s.theme)
    const isMobile = useIsMobile()
    const isDark = theme === 'dark'
    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (!isMobile) {
            setOpenDropdown(false)
        }
    })

    // Check available space and position dropdown accordingly
    useEffect(() => {
        if (openDropdown && !isMobile && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const dropdownHeight = 120 // Approximate height for role + logout

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top')
            } else {
                setDropdownPosition('bottom')
            }
        }
    }, [openDropdown, isMobile])

    // Dropdown styles
    const dropdownBg = isDark ? 'bg-[#002B57]' : 'bg-white'
    const dropdownShadow = isDark
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.30)]'
        : 'shadow-[0_10px_35px_rgba(55,71,109,0.10)]'

    // Option styles
    const optionText = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const optionHover = isDark ? 'hover:bg-[#1B456C]' : 'hover:bg-[#F5F8FA]'

    const getRoleLabel = () => {
        if (!role) return 'User'
        if (role === 'super_admin') return 'Super Admin'
        if (role === 'org_admin') return 'Org Admin'
        return 'User'
    }

    const dropdownContent = (
        <ul
            className={clsx(
                'flex flex-col gap-y-1 text-xs p-2.5',
                !isMobile && 'overflow-y-auto custom-scroll'
            )}
        >
            {/* Role */}
            <li
                className={clsx(
                    'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-default',
                    optionText
                )}
            >
                <span className="flex-1">{getRoleLabel()}</span>
            </li>
            {/* Profile */}
            <li
                className={clsx(
                    'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-pointer transition-colors',
                    optionText,
                    optionHover
                )}
                onClick={() => {
                    navigate({ to: '/profile' })
                    setOpenDropdown(false)
                }}
            >
                <span className="flex-1">Profile</span>
            </li>
            {/* Logout */}
            <li
                className={clsx(
                    'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-pointer transition-colors',
                    optionText,
                    optionHover
                )}
                onClick={() => {
                    onLogout()
                    setOpenDropdown(false)
                }}
            >
                <span className="flex-1">Logout</span>
            </li>
        </ul>
    )

    return (
        <div
            ref={dropdownRef}
            className={twMerge('relative font-medium', className)}
        >
            {/* Trigger */}
            <div
                className={twMerge(
                    clsx(
                        'h-10 cursor-pointer flex gap-x-2.5 justify-between items-center py-[9px] text-xs px-[16px] rounded-[7px] transition-all duration-200'
                    )
                )}
                onClick={() => setOpenDropdown((prev) => !prev)}
            >
                <span className="flex items-center gap-x-2.5">
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                        {userPicture ? (
                            <img
                                src={userPicture}
                                alt={userName || 'User avatar'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <DefaultAvatar className="w-full h-full" />
                        )}
                    </div>
                    {/* User Name */}
                    <span>{userName || userEmail || 'User'}</span>
                </span>
                {/* Chevron */}
                {isDark ? (
                    <ChevronDownDark
                        className={clsx(
                            'transition-transform duration-200',
                            openDropdown && 'rotate-180'
                        )}
                    />
                ) : (
                    <ChevronDownLight
                        className={clsx(
                            'transition-transform duration-200',
                            openDropdown && 'rotate-180'
                        )}
                    />
                )}
            </div>

            {/* Desktop dropdown */}
            {!isMobile && openDropdown && (
                <div
                    className={clsx(
                        'min-w-full absolute rounded-[7px] z-40 backdrop-blur-[25px]',
                        dropdownPosition === 'bottom'
                            ? 'mt-2'
                            : 'mb-2 bottom-full',
                        dropdownBg,
                        dropdownShadow
                    )}
                >
                    {dropdownContent}
                </div>
            )}

            {/* Mobile modal */}
            {isMobile && (
                <Modal
                    open={openDropdown}
                    onClose={() => setOpenDropdown(false)}
                    title="User Menu"
                    size="sm"
                    className="w-full"
                    position="bottom"
                    animation="slide"
                    border={false}
                    showCloseButton={true}
                >
                    <div className="flex-1">{dropdownContent}</div>
                </Modal>
            )}
        </div>
    )
}

export default UserDropdown
