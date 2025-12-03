/**
 * ForgotPasswordPage Component
 * Page for requesting password reset
 */

import React from 'react'
import { ForgotPasswordForm } from '../components'
import Logo from '@/components/logo'

export const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="bg-[#050c14] min-h-[calc(100vh-110px)] flex items-center justify-center px-[10px] py-[120px]">
            <div className="bg-[#091625] border border-[#1b456f] rounded-[10px] p-[40px] w-full max-w-[500px] flex flex-col gap-[24px]">
                {/* Logo */}
                <div className="flex flex-col gap-[10px] items-center justify-center w-full">
                    <Logo />
                </div>

                {/* Title */}
                <h1 className="font-['Poppins',sans-serif] font-semibold text-[32px] leading-[1.2] text-[#ececec] text-center tracking-[-0.96px]">
                    Forgot Your Password?
                </h1>

                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    Enter your email address and we will send you instructions
                    to reset your password.
                </p>

                {/* Form */}
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
