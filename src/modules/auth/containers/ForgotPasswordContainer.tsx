import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../services/authApi'
import { ForgotPasswordForm } from '../components'

export const ForgotPasswordContainer: React.FC = () => {
    const navigate = useNavigate()

    const handleSubmit = async (email: string) => {
        await authApi.forgotPassword(email)
        try {
            sessionStorage.setItem('forgotPasswordEmail', email)
        } catch (_) {}
        navigate({ to: '/check-email' })
    }

    return <ForgotPasswordForm onSubmit={handleSubmit} />
}
