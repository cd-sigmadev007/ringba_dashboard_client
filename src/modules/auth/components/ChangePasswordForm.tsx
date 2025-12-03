/**
 * ChangePasswordForm Component
 * Form to change password with token from reset email
 */

import React, { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { Input } from '@/components/ui/Input'
import { EyeIcon } from '@/assets/svg'
import { usePasswordChange } from '../hooks/usePasswordChange'
import { PasswordValidator } from './PasswordValidator'

export const ChangePasswordForm: React.FC = () => {
    const search = useSearch({ from: '/change-password' })
    const { changePassword, isLoading, error } = usePasswordChange()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const token = (search as { token?: string })?.token || ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            return
        }

        if (!token) {
            return
        }

        try {
            await changePassword({ token, password: newPassword })
        } catch (err) {
            // Error is handled by the hook
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
            {/* New Password Input */}
            <div className="relative w-full">
                <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-[#002b57] border-none text-[#a1a5b7] placeholder:text-[#a1a5b7] p-[15px] pr-[45px] rounded-[7px] focus:bg-[#002b57] focus:border-[#007fff] h-auto"
                    containerClassName="w-full"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#a1a5b7] hover:text-[#ececec] transition-colors cursor-pointer"
                >
                    <EyeIcon className="w-[20px] h-[20px]" />
                </button>
            </div>

            {/* Password Validator */}
            {newPassword && (
                <PasswordValidator password={newPassword} />
            )}

            {/* Re-enter Password Input */}
            <div className="relative w-full">
                <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#002b57] border-none text-[#a1a5b7] placeholder:text-[#a1a5b7] p-[15px] pr-[45px] rounded-[7px] focus:bg-[#002b57] focus:border-[#007fff] h-auto"
                    containerClassName="w-full"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#a1a5b7] hover:text-[#ececec] transition-colors cursor-pointer"
                >
                    <EyeIcon className="w-[20px] h-[20px]" />
                </button>
            </div>

            {/* Password Mismatch Error */}
            {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Continue Button */}
            <button
                type="submit"
                disabled={isLoading || !token || newPassword !== confirmPassword}
                className="bg-[#007fff] hover:bg-[#0254A5] active:bg-[#0254A5] text-[#F5F8FA] py-[15px] px-[25px] rounded-[7px] transition-all duration-300 ease-in-out text-[16px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:!bg-[#132F4C] disabled:text-[#7E8299] w-full flex items-center justify-center"
            >
                <span className="font-['Poppins',sans-serif] font-medium">
                    Continue
                </span>
            </button>
        </form>
    )
}

