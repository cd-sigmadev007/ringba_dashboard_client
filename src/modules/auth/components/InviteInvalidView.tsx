import React from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'

export const InviteInvalidView: React.FC = () => {
    const linkClr = 'text-[#007FFF] hover:underline'

    return (
        <AuthCard>
            <div className="p-6 sm:p-8 text-center">
                <p className="text-[#F64E60]">
                    Invitation not found, expired, or already used.
                </p>
                <Link to="/login" className={`mt-4 inline-block ${linkClr}`}>
                    Back to Login
                </Link>
            </div>
        </AuthCard>
    )
}
