/**
 * Invitation Route
 * Handles invitation validation and displays confirmation page
 */

import { useEffect, useState } from 'react'
import { createRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { apiClient } from '../services/api'
import type { RootRoute } from '@tanstack/react-router'

interface InvitationData {
    email: string
    role: string
    expiresAt: string
}

function Invitation() {
    const params = useParams({ strict: false })
    const token = (params as any).token
    const navigate = useNavigate()
    const { loginWithRedirect } = useAuth0()
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const validateInvitation = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get<{
                    success: boolean
                    data: InvitationData
                }>(`/invitations/validate/${token}`)

                // eslint-disable-next-line
                if (response.success && response.data) {
                    setInvitation(response.data)
                } else {
                    setError('Invalid invitation')
                }
            } catch (err: any) {
                console.error('Failed to validate invitation:', err)
                setError(err?.message || 'Invalid or expired invitation')
            } finally {
                setLoading(false)
            }
        }

        if (token) {
            validateInvitation()
        } else {
            setError('Invitation token is missing')
            setLoading(false)
        }
    }, [token])

    const handleContinueToLogin = () => {
        // Redirect to Auth0 login
        loginWithRedirect({
            authorizationParams: {
                screen_hint: 'signup', // Suggest signup for new users
            },
        })
    }

    const getRoleLabel = (role: string): string => {
        const labels: Record<string, string> = {
            super_admin: 'Super Admin',
            org_admin: 'Organization Admin',
            user: 'User',
        }
        return labels[role] || role
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Validating invitation...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !invitation) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Invalid Invitation
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error ||
                            'This invitation link is invalid, expired, or has already been used.'}
                    </p>
                    <button
                        onClick={() => navigate({ to: '/' })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="mb-6">
                    <svg
                        className="mx-auto h-16 w-16 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    You're Invited to InsideFi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You have been invited to join InsideFi with the role of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {getRoleLabel(invitation.role)}
                    </span>
                    .
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Click the button below to accept your invitation and create
                    your account.
                </p>
                <button
                    onClick={handleContinueToLogin}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Continue to Login
                </button>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    This invitation will expire in 7 days.
                </p>
            </div>
        </div>
    )
}

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/invite/$token',
        component: Invitation,
        getParentRoute: () => parentRoute,
    })
