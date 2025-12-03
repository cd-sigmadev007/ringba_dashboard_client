/**
 * ForgotPasswordForm Component
 * Form to request password reset email
 */

import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { usePasswordReset } from '../hooks/usePasswordReset'

export const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate()
    const { requestPasswordReset, isLoading, error, success } = usePasswordReset()
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await requestPasswordReset({ email })
        } catch (err) {
            // Error is handled by the hook
        }
    }

    if (success) {
        return (
            <div className="flex flex-col gap-[16px] items-center">
                <p className="font-['Poppins',sans-serif] text-[14px] text-[#a1a5b7] text-center">
                    If the email exists, a password reset link has been sent.
                </p>
                <button
                    type="button"
                    onClick={() => navigate({ to: '/login' })}
                    className="font-['Poppins',sans-serif] text-[14px] text-[#f5f8fa] hover:underline"
                >
                    Back to All Applications
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
            <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#002b57] border-none text-[#a1a5b7] placeholder:text-[#a1a5b7] p-[15px] rounded-[7px] focus:bg-[#002b57] focus:border-[#007fff] h-auto"
                containerClassName="w-full"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-[#007fff] hover:bg-[#0254A5] active:bg-[#0254A5] text-[#F5F8FA] py-[15px] px-[25px] rounded-[7px] transition-all duration-300 ease-in-out text-[16px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:!bg-[#132F4C] disabled:text-[#7E8299] w-full flex items-center justify-center"
            >
                <span className="font-['Poppins',sans-serif] font-medium">
                    Continue
                </span>
            </button>

            <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="font-['Poppins',sans-serif] text-[14px] text-[#f5f8fa] hover:underline"
            >
                Back to All Applications
            </button>
        </form>
    )
}

