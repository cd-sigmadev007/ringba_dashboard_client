/**
 * LoginPage Component
 * Main login page with Google OAuth and email/password login
 */

import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GoogleLoginButton, LoginForm } from '../components'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/logo'

export const LoginPage: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate({ to: '/caller-analysis' })
        }
    }, [isLoading, isAuthenticated, navigate])

    return (
        <div className="bg-[#050c14] min-h-[calc(100vh-110px)] flex items-center justify-center px-[10px] py-[120px]">
            <div className="bg-[#091625] border border-[#1b456f] rounded-[10px] p-[40px] w-full max-w-[500px] flex flex-col gap-[24px]">
                {/* Logo */}
                <div className="flex flex-col gap-[10px] items-center justify-center w-full">
                    <Logo />
                </div>

                {/* Welcome Text */}
                <h1 className="font-['Poppins',sans-serif] font-semibold text-[32px] leading-[1.2] text-[#ececec] text-center tracking-[-0.96px]">
                    Welcome
                </h1>

                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    Log in to continue to All Applications.
                </p>

                {/* Google Login Button */}
                <GoogleLoginButton disabled={isLoading} />

                {/* Divider */}
                <div className="flex items-center justify-center gap-[16px] w-full">
                    <div className="flex-1 h-px bg-[#1b456f]" />
                    <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] whitespace-nowrap">
                        or continue with
                    </p>
                    <div className="flex-1 h-px bg-[#1b456f]" />
                </div>

                {/* Email/Password Form */}
                <LoginForm />

                {/* Sign Up Link */}
                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    Don't have an account?{' '}
                    <button className="text-[#f5f8fa] hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    )
}
