/**
 * ChangePasswordPage Component
 * Page for changing password with token from reset email
 */

import React from 'react'
import Logo from '@/components/logo'
import { ChangePasswordForm } from '../components'

export const ChangePasswordPage: React.FC = () => {
    return (
        <div className="bg-[#050c14] min-h-[calc(100vh-110px)] flex items-center justify-center px-[10px] py-[120px]">
            <div className="bg-[#091625] border border-[#1b456f] rounded-[10px] p-[40px] w-full max-w-[500px] flex flex-col gap-[24px]">
                {/* Logo */}
                <div className="flex flex-col gap-[10px] items-center justify-center w-full">
                    <Logo />
                </div>

                {/* Title */}
                <h1 className="font-['Poppins',sans-serif] font-semibold text-[32px] leading-[1.2] text-[#ececec] text-center tracking-[-0.96px]">
                    Change Your Password
                </h1>

                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    Enter a new password below to change your password.
                </p>

                {/* Form */}
                <ChangePasswordForm />
            </div>
        </div>
    )
}

