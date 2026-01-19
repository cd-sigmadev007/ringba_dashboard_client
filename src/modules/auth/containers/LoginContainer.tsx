import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LoginForm } from '../components'
import { useAuth } from '@/contexts/AuthContext'

export const LoginContainer: React.FC = () => {
    const navigate = useNavigate()
    const { login, error, clearError } = useAuth()

    const handleSubmit = async (data: {
        email: string
        password: string
        remember: boolean
    }) => {
        const res = await login({ email: data.email, password: data.password })
        if (res.requiresOtp) {
            try {
                sessionStorage.setItem('loginOtpEmail', data.email)
                sessionStorage.setItem('loginRemember', String(data.remember))
            } catch (_) {}
            navigate({ to: '/login-otp', search: { email: data.email } })
            return
        }
        navigate({ to: '/caller-analysis' })
    }

    return (
        <LoginForm
            onSubmit={handleSubmit}
            error={error}
            clearError={clearError}
        />
    )
}
