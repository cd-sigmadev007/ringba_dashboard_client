import React from 'react'
import clsx from 'clsx'
import type { UserDto } from '../services/usersApi'
import { useThemeStore } from '@/store/themeStore'
import { DefaultAvatar } from '@/assets/svg'

export interface UserDetailModalProps {
    user: UserDto | null
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    if (!user) {
        return (
            <div className="w-full overflow-y-auto custom-scroll">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No user selected
                </p>
            </div>
        )
    }

    const getRoleLabel = (role: string) => {
        if (role === 'super_admin') return 'Super Admin'
        if (role === 'org_admin') return 'Org Admin'
        return 'User'
    }

    const getInvitationStatusLabel = (status?: string | null) => {
        if (!status) return 'NA'
        if (status === 'send') return 'Sent'
        if (status === 'accepted') return 'Accepted'
        if (status === 'expired') return 'Expired'
        return status
    }

    const getInvitationStatusColor = (status?: string | null) => {
        if (!status) return isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
        if (status === 'send') return 'text-yellow-500'
        if (status === 'accepted') return 'text-green-500'
        if (status === 'expired') return 'text-red-500'
        return isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    }

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }

    const toAbsoluteLogoUrl = (logoUrl?: string | null) => {
        if (!logoUrl) return ''
        if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))
            return logoUrl
        const base = getApiBaseUrl()
        const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
        return `${base}${path}`
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        } catch {
            return dateString
        }
    }

    const userInfo = [
        { label: 'Name', value: user.email.split('@')[0] || 'N/A' },
        { label: 'Email', value: user.email },
        { label: 'Role', value: getRoleLabel(user.role) },
        {
            label: 'Organization',
            value: user.org_id || 'Not assigned',
        },
        {
            label: 'Invitation Status',
            value: getInvitationStatusLabel(user.invitation_status),
            valueClassName: getInvitationStatusColor(user.invitation_status),
        },
        {
            label: 'Created At',
            value: formatDate(user.created_at),
        },
    ]

    const labelClass = clsx(
        'text-sm w-full max-w-[150px] whitespace-nowrap',
        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    )
    const valueClass = clsx(
        'text-sm',
        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    )

    const borderClass = clsx(
        'border',
        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
    )

    const containerBgClass = clsx(isDark ? 'bg-transparent' : 'bg-[#FFFFFF]')

    const logoUrl = toAbsoluteLogoUrl(user.logo_url)

    return (
        <div className="w-full overflow-y-auto custom-scroll">
            <h2
                className={clsx(
                    'text-md font-semibold mb-6',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                User Details
            </h2>

            {/* User Info */}
            <div
                className={clsx(
                    'flex flex-col rounded-sm',
                    containerBgClass,
                    borderClass
                )}
            >
                {/* User Logo/Avatar */}
                <div
                    className={clsx(
                        'flex p-3.5 items-center gap-x-[32px] border-b',
                        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                    )}
                >
                    <p className={labelClass}>Avatar</p>
                    <div className="flex items-center">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="User avatar"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <DefaultAvatar className="w-12 h-12" />
                        )}
                    </div>
                </div>

                {userInfo.map((item, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            'flex p-3.5 items-start gap-x-[32px] border-b last:border-b-0',
                            isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                        )}
                    >
                        <p className={labelClass}>{item.label}</p>
                        <p
                            className={clsx(
                                valueClass,
                                item.valueClassName || ''
                            )}
                        >
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
