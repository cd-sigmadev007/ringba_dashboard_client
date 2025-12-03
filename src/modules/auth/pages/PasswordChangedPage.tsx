/**
 * PasswordChangedPage Component
 * Success page after password change
 */

import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import Logo from '@/components/logo'
import Button from '@/components/ui/Button'

export const PasswordChangedPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-[#050c14] min-h-[calc(100vh-110px)] flex items-center justify-center px-[10px] py-[120px]">
            <div className="bg-[#091625] border border-[#1b456f] rounded-[10px] p-[40px] w-full max-w-[500px] flex flex-col gap-[24px] items-center">
                {/* Logo */}
                <div className="flex flex-col gap-[10px] items-center justify-center w-full">
                    <Logo />
                </div>

                {/* Success Icon */}
                <div className="w-[157px] h-[157px] flex items-center justify-center">
                    <svg
                        width="157"
                        height="157"
                        viewBox="0 0 157 157"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="78.5"
                            cy="78.5"
                            r="78.5"
                            fill="#007FFF"
                            fillOpacity="0.1"
                        />
                        <path
                            d="M78.5 39.25C56.5 39.25 38.5 57.25 38.5 79.25C38.5 101.25 56.5 119.25 78.5 119.25C100.5 119.25 118.5 101.25 118.5 79.25C118.5 57.25 100.5 39.25 78.5 39.25ZM65.5 94.25L47.5 76.25L52.5 71.25L65.5 84.25L104.5 45.25L109.5 50.25L65.5 94.25Z"
                            fill="#007FFF"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="font-['Poppins',sans-serif] font-semibold text-[32px] leading-[1.2] text-[#ececec] text-center tracking-[-0.96px]">
                    Password Changed
                </h1>

                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    Your password has been changed successfully.
                </p>

                {/* Back to Login Button */}
                <Button
                    onClick={() => navigate({ to: '/login' })}
                    className="w-full"
                >
                    Back to Login
                </Button>
            </div>
        </div>
    )
}

