import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
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
        try {
            const res = await login({
                email: data.email,
                password: data.password,
            })
            if (res.requiresOtp) {
                try {
                    sessionStorage.setItem('loginOtpEmail', data.email)
                    sessionStorage.setItem(
                        'loginRemember',
                        String(data.remember)
                    )
                } catch (_) {}
                navigate({ to: '/login-otp', search: { email: data.email } })
                return
            }
            toast.success('Login successful')
            navigate({ to: '/caller-analysis' })
        } catch (err: any) {
            // Error is already set in AuthContext, show toast
            const errorMessage =
                error || err?.message || 'Login failed. Please try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <LoginForm
            onSubmit={handleSubmit}
            error={error}
            clearError={clearError}
        />
    )
}
