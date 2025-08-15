import React from 'react'
import clsx from 'clsx'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { Status } from '@/modules'

export interface PersonalIdentificationProps {
    callerData: CallData
}

export const PersonalIdentification: React.FC<PersonalIdentificationProps> = ({
    callerData,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    // Mock data based on CSV structure
    const additionalData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: callerData.callerId,
        type: 'Inbound',
        address: '-',
        billed: 'No',
        latestPayout: '-',
        totalCost: callerData.lifetimeRevenue,
        ringbaCost: Math.round(callerData.lifetimeRevenue * 0.76 * 100) / 100,
        adCost: Math.round(callerData.lifetimeRevenue * 0.24 * 100) / 100,
    }

    // Config array for personal info
    const personalInfo = [
        { label: 'First Name', value: additionalData.firstName },
        { label: 'Last Name', value: additionalData.lastName },
        { label: 'Email', value: additionalData.email },
        { label: 'Phone Number', value: additionalData.phoneNumber },
        { label: 'Type', value: additionalData.type },
        { label: 'Address', value: additionalData.address },
        { label: 'Billed', value: additionalData.billed },
        { label: 'Latest Payout', value: additionalData.latestPayout },
    ]

    const revenueInfo = [
        {
            label: 'TOTAL COST',
            value: `$${additionalData.totalCost.toFixed(2)}`,
        },
        {
            label: 'RINGBA COST',
            value: `$${additionalData.ringbaCost.toFixed(2)}`,
        },
        { label: 'AD COST', value: `$${additionalData.adCost.toFixed(2)}` },
    ]

    // Styles
    const labelClass = clsx(
        'text-sm w-full max-w-[25%]',
        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    )
    const valueClass = clsx(
        'text-sm',
        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    )

    return (
        <div className="w-full">
            <h2
                className={clsx(
                    'text-md font-semibold mb-6',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                Personal Identification
            </h2>

            {/* Personal Info + Revenue */}
            <div className="flex flex-col rounded-sm border border-[#1B456F] mb-6">
                {personalInfo.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex p-3.5 border-b border-[#1B456F] items-start gap-x-[32px]"
                    >
                        <p className={labelClass}>{item.label}</p>
                        <p className={valueClass}>{item.value}</p>
                    </div>
                ))}

                {/* Lifetime Revenue Section inside */}
                <div className="flex p-3.5 border-b border-[#1B456F] items-start gap-x-[32px]">
                    <p className={labelClass}>Lifetime Revenue</p>
                    {revenueInfo.map((count, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-start gap-x-[24px] mb-1"
                        >
                            <p
                                className={clsx(
                                    'text-sm',
                                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                )}
                            >
                                {count.label}
                            </p>
                            <p className={clsx('font-bold', valueClass)}>
                                {count.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Status Section */}
                {/* Highest Priority */}
                <div className="flex flex-col border-b border-[#1B456F]">
                    <div className="flex p-3.5 items-start gap-x-[32px]">
                        <p className={labelClass}>Highest Priority</p>
                        <div className="flex-1">
                            <Status
                                status={callerData.status.filter(
                                    (status) =>
                                        status ===
                                            'High-Quality Un-billed (Critical)' ||
                                        status === 'Chargeback Risk (Critical)'
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* High Priority */}
                <div className="flex flex-col border-b border-[#1B456F]">
                    <div className="flex p-3.5 items-start gap-x-[32px]">
                        <p className={labelClass}>High Priority</p>
                        <div className="flex-1">
                            <Status
                                status={callerData.status.filter(
                                    (status) =>
                                        status === 'Wrong Appliance Category' ||
                                        status ===
                                            'Wrong Pest Control Category' ||
                                        status === 'Short Call (<90s)' ||
                                        status === 'Buyer Hung Up' ||
                                        status === 'Immediate Hangup (<10s)' ||
                                        status === 'No Coverage (ZIP)'
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Medium Priority */}
                <div className="flex flex-col border-b border-[#1B456F]">
                    <div className="flex p-3.5 items-start gap-x-[32px]">
                        <p className={labelClass}>Medium Priority</p>
                        <div className="flex-1">
                            <Status
                                status={callerData.status.filter(
                                    (status) =>
                                        status === 'Competitor Mentioned' ||
                                        status === 'Booking Intent' ||
                                        status === 'Warranty/Status Inquiry'
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Low Priority */}
                <div className="flex flex-col rounded-sm">
                    <div className="flex p-3.5 items-start gap-x-[32px]">
                        <p className={labelClass}>Low Priority</p>
                        <div className="flex-1">
                            <Status
                                status={callerData.status.filter(
                                    (status) =>
                                        status === 'Positive Sentiment' ||
                                        status === 'Negative Sentiment' ||
                                        status === 'Repeat Customer' ||
                                        status === 'Technical Terms Used'
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
