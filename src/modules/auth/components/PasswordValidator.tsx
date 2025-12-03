/**
 * PasswordValidator Component
 * Displays password validation rules as user types
 */

import React from 'react'
import { usePasswordValidation } from '../hooks/usePasswordValidation'

interface PasswordValidatorProps {
    password: string
    className?: string
}

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({
    password,
    className = '',
}) => {
    const validation = usePasswordValidation(password)

    const rules = [
        {
            label: 'At least 8 characters',
            met: validation.checks.minLength,
        },
        {
            label: 'One lowercase letter',
            met: validation.checks.hasLowercase,
        },
        {
            label: 'One uppercase letter',
            met: validation.checks.hasUppercase,
        },
        {
            label: 'One number',
            met: validation.checks.hasNumber,
        },
        {
            label: 'One special character',
            met: validation.checks.hasSpecialChar,
        },
    ]

    if (!password) {
        return null
    }

    return (
        <div className={`flex flex-col gap-[4px] ${className}`}>
            {rules.map((rule, index) => (
                <div
                    key={index}
                    className={`flex items-center gap-[8px] text-[14px] ${
                        rule.met ? 'text-green-500' : 'text-[#a1a5b7]'
                    }`}
                >
                    {rule.met ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13.3333 4L6 11.3333L2.66667 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>{rule.label}</span>
                </div>
            ))}
        </div>
    )
}
