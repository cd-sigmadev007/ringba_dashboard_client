/**
 * GoogleLoginButton Component
 * Button for Google OAuth login
 */

import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { GoogleIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'

interface GoogleLoginButtonProps {
    disabled?: boolean
    className?: string
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    disabled = false,
    className = '',
}) => {
    const { loginWithRedirect, isLoading } = useAuth0()

    const handleGoogleLogin = async () => {
        try {
            await loginWithRedirect({
                authorizationParams: {
                    connection: 'google-oauth2',
                },
                appState: {
                    returnTo: '/caller-analysis',
                },
            })
        } catch (err) {
            console.error('Google login failed:', err)
        }
    }

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={disabled || isLoading}
            className={`border border-[#1b456f] h-[61px] rounded-[10px] flex items-center overflow-hidden hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-transparent w-full cursor-pointer ${className}`}
        >
            <div className="flex items-center justify-center p-[16px] h-full">
                <GoogleIcon className="w-[32px] h-[32px]" />
            </div>
            <div className="flex items-center justify-center px-[16px] py-[18px] h-full flex-1">
                <span className="font-['Roboto',sans-serif] font-medium text-[18px] text-white tracking-[0.09px]">
                    Continue with Google
                </span>
            </div>
        </button>
    )
}

