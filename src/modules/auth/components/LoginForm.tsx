/**
 * LoginForm Component
 * Email/password login form
 */

import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '../hooks/useLogin'
import { Input } from '@/components/ui/Input'
import { EyeIcon } from '@/assets/svg'

export const LoginForm: React.FC = () => {
    const navigate = useNavigate()
    const { login, isLoading, error } = useLogin()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login({ email, password })
        } catch (err) {
            // Error is handled by the hook
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
            {/* Email Input */}
            <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#002b57] border-none text-[#a1a5b7] placeholder:text-[#a1a5b7] p-[15px] rounded-[7px] focus:bg-[#002b57] focus:border-[#007fff] h-auto"
                containerClassName="w-full"
            />

            {/* Password Input */}
            <div className="flex flex-col gap-[14px]">
                <div className="relative w-full">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[#002b57] border-none text-[#a1a5b7] placeholder:text-[#a1a5b7] p-[15px] pr-[45px] rounded-[7px] focus:bg-[#002b57] focus:border-[#007fff] h-auto"
                        containerClassName="w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#a1a5b7] hover:text-[#ececec] transition-colors cursor-pointer"
                    >
                        <EyeIcon className="w-[20px] h-[20px]" />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => navigate({ to: '/forgot-password' })}
                    className="font-['Poppins',sans-serif] text-[14px] text-[#f5f8fa] text-left hover:underline self-start"
                >
                    Forgot Password?
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Continue Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-[#007fff] hover:bg-[#0254A5] active:bg-[#0254A5] text-[#F5F8FA] py-[15px] px-[25px] rounded-[7px] transition-all duration-300 ease-in-out text-[16px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:!bg-[#132F4C] disabled:text-[#7E8299] w-full flex items-center justify-center"
            >
                <span className="font-['Poppins',sans-serif] font-medium">
                    Continue
                </span>
            </button>
        </form>
    )
}
