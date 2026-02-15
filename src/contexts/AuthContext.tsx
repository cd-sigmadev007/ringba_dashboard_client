/**
 * AuthProvider - self-hosted auth (login, invite set-password, refresh, logout)
 * Replaces Auth0. Uses /api/auth/me, /login, /verify-login-otp, /request-invite-otp, /set-password, /refresh, /logout.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { apiClient } from '@/services/api'
import { authApi } from '@/modules/auth/services/authApi'

export interface AuthUser {
    id: string
    email: string
    role: string
    orgId: string | null
    campaignIds: Array<string>
    firstName?: string | null
    lastName?: string | null
    profilePictureUrl?: string | null
    /** When set, onboarding modal is not shown. Null = show onboarding. */
    onboardingCompletedAt?: string | null
}

interface AuthState {
    user: AuthUser | null
    accessToken: string | null
    loading: boolean
    error: string | null
    pendingLogin: { email: string } | null
}

interface AuthContextValue extends AuthState {
    login: (params: {
        email: string
        password: string
    }) => Promise<{ requiresOtp?: boolean }>
    verifyLoginOtp: (params: {
        email: string
        otp: string
        remember?: boolean
    }) => Promise<void>
    requestInviteOtp: (invitationToken: string) => Promise<void>
    setPassword: (params: {
        invitationToken: string
        password: string
        otp: string
    }) => Promise<void>
    logout: () => Promise<void>
    getAccessToken: () => string | null
    refresh: () => Promise<string | null>
    /** Refetch /me and update user (e.g. onboardingCompletedAt). */
    refetchMe: () => Promise<void>
    /** Update user profile (name and/or picture). */
    updateProfile: (data: {
        first_name?: string
        last_name?: string
        profile_picture?: File
    }) => Promise<void>
    clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const AUTH_TOKEN_KEY = 'ringba_access_token'

/**
 * Categorize and format error messages for user display
 */
function getErrorMessage(error: any): string {
    // Network error (no response from server)
    if (error.request && !error.response) {
        return 'Network error. Please check your connection and try again.'
    }

    // Timeout error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Request timed out. Please try again.'
    }

    // HTTP error responses
    if (error.response) {
        const status = error.response.status
        const message =
            error.response.data?.message || error.response.data?.error

        switch (status) {
            case 401:
                return message || 'Invalid email or password'
            case 403:
                return message || 'Too many attempts. Please try again later.'
            case 404:
                return message || 'Resource not found'
            case 429:
                return 'Too many requests. Please try again later.'
            case 500:
            case 502:
            case 503:
            case 504:
                return 'Server error. Please try again later.'
            default:
                return message || 'An error occurred. Please try again.'
        }
    }

    // Generic error
    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred. Please try again.'
}

function getStoredToken(): string | null {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY)
    } catch {
        return null
    }
}

function setStoredToken(token: string | null): void {
    try {
        if (token) {
            localStorage.setItem(AUTH_TOKEN_KEY, token)
        } else {
            localStorage.removeItem(AUTH_TOKEN_KEY)
        }
    } catch (_) {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: getStoredToken(),
        loading: true,
        error: null,
        pendingLogin: null,
    })

    const accessTokenRef = useRef<string | null>(null)
    useEffect(() => {
        accessTokenRef.current = state.accessToken
    }, [state.accessToken])
    const getAccessToken = useCallback(() => accessTokenRef.current, [])

    const refresh = useCallback(async (): Promise<string | null> => {
        try {
            const res = await apiClient.post<{
                accessToken?: string
                refreshToken?: string
            }>('/api/auth/refresh', {}, { withCredentials: true })
            const token =
                (res as any)?.accessToken ??
                (res as any)?.data?.accessToken ??
                null
            if (token) {
                setStoredToken(token)
                setState((s) => ({ ...s, accessToken: token }))
                return token
            }
            return null
        } catch {
            setStoredToken(null)
            setState((s) => ({ ...s, accessToken: null, user: null }))
            return null
        }
    }, [])

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const res = await apiClient.get<{
                    data?: { user?: AuthUser; accessToken?: string }
                }>('/api/auth/me')
                const d = (res as any)?.data ?? res
                const u = d?.user
                const token = d?.accessToken ?? null
                if (cancelled) return
                if (u) {
                    if (token) setStoredToken(token)
                    setState((s) => ({
                        ...s,
                        user: {
                            id: u.id,
                            email: u.email,
                            role: u.role,
                            orgId: u.orgId ?? null,
                            campaignIds: Array.isArray(u.campaignIds)
                                ? u.campaignIds
                                : [],
                            firstName: u.firstName ?? null,
                            lastName: u.lastName ?? null,
                            profilePictureUrl: u.profilePictureUrl ?? null,
                            onboardingCompletedAt:
                                u.onboardingCompletedAt ?? null,
                        },
                        accessToken: token ?? s.accessToken,
                        loading: false,
                        error: null,
                    }))
                } else {
                    setStoredToken(null)
                    setState((s) => ({
                        ...s,
                        user: null,
                        accessToken: null,
                        loading: false,
                    }))
                }
            } catch {
                if (!cancelled) {
                    setStoredToken(null)
                    setState((s) => ({
                        ...s,
                        user: null,
                        accessToken: null,
                        loading: false,
                    }))
                }
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const refetchMe = useCallback(async () => {
        try {
            const res = await apiClient.get<{
                data?: { user?: AuthUser; accessToken?: string }
            }>('/api/auth/me')
            const d = (res as any)?.data ?? res
            const u = d?.user
            const token = d?.accessToken ?? null
            if (u) {
                if (token) setStoredToken(token)
                setState((s) => ({
                    ...s,
                    user: {
                        id: u.id,
                        email: u.email,
                        role: u.role,
                        orgId: u.orgId ?? null,
                        campaignIds: Array.isArray(u.campaignIds)
                            ? u.campaignIds
                            : [],
                        firstName: u.firstName ?? null,
                        lastName: u.lastName ?? null,
                        profilePictureUrl: u.profilePictureUrl ?? null,
                        onboardingCompletedAt: u.onboardingCompletedAt ?? null,
                    },
                    ...(token ? { accessToken: token } : {}),
                }))
            }
        } catch (_) {}
    }, [])

    const login = useCallback(
        async (params: {
            email: string
            password: string
        }): Promise<{ requiresOtp?: boolean }> => {
            setState((s) => ({ ...s, error: null }))
            try {
                const res = await apiClient.post<{
                    requiresOtp?: boolean
                    accessToken?: string
                    user?: AuthUser
                }>('/api/auth/login', params)
                const d = (res as any)?.data ?? res
                if (d?.requiresOtp) {
                    setState((s) => ({
                        ...s,
                        pendingLogin: { email: params.email },
                        loading: false,
                        error: null,
                    }))
                    return { requiresOtp: true }
                }
                if (d?.accessToken && d?.user) {
                    setStoredToken(d.accessToken)
                    setState((s) => ({
                        ...s,
                        user: d.user,
                        accessToken: d.accessToken,
                        pendingLogin: null,
                        error: null,
                    }))
                    return {}
                }
                return {}
            } catch (error: any) {
                const errorMessage = getErrorMessage(error)
                setState((s) => ({
                    ...s,
                    error: errorMessage,
                    loading: false,
                }))
                throw error
            }
        },
        []
    )

    const verifyLoginOtp = useCallback(
        async (params: { email: string; otp: string; remember?: boolean }) => {
            setState((s) => ({ ...s, error: null }))
            const res = await apiClient.post<{
                accessToken?: string
                user?: AuthUser
            }>('/api/auth/verify-login-otp', {
                email: params.email,
                otp: params.otp,
                remember: params.remember,
            })
            const data = (res as any)?.data ?? res
            const u = data?.user
            const token = data?.accessToken
            if (u && token) {
                setStoredToken(token)
                setState((s) => ({
                    ...s,
                    user: u,
                    accessToken: token,
                    pendingLogin: null,
                    error: null,
                }))
                // Refetch /me to get onboardingCompletedAt (verify-login-otp response is minimal)
                await refetchMe()
            } else {
                setState((s) => ({ ...s, error: 'Login failed' }))
                throw new Error('Login failed')
            }
        },
        [refetchMe]
    )

    const requestInviteOtp = useCallback(async (invitationToken: string) => {
        setState((s) => ({ ...s, error: null }))
        try {
            await apiClient.post('/api/auth/request-invite-otp', {
                invitationToken,
            })
        } catch (error: any) {
            const errorMessage = getErrorMessage(error)
            setState((s) => ({
                ...s,
                error: errorMessage,
            }))
            throw error
        }
    }, [])

    const setPassword = useCallback(
        async (params: {
            invitationToken: string
            password: string
            otp: string
        }) => {
            setState((s) => ({ ...s, error: null }))
            try {
                const res = await apiClient.post<{
                    accessToken?: string
                    user?: AuthUser
                }>('/api/auth/set-password', params)
                const data = (res as any)?.data ?? res
                const u = data?.user
                const token = data?.accessToken
                if (u && token) {
                    setStoredToken(token)
                    setState((s) => ({
                        ...s,
                        user: u,
                        accessToken: token,
                        error: null,
                    }))
                } else {
                    const errorMessage =
                        'Failed to set password. Please try again.'
                    setState((s) => ({ ...s, error: errorMessage }))
                    throw new Error(errorMessage)
                }
            } catch (error: any) {
                const errorMessage = getErrorMessage(error)
                setState((s) => ({
                    ...s,
                    error: errorMessage,
                }))
                throw error
            }
        },
        []
    )

    const logout = useCallback(async () => {
        try {
            await apiClient.post(
                '/api/auth/logout',
                {},
                { withCredentials: true }
            )
        } catch (_) {}
        setStoredToken(null)
        setState({
            user: null,
            accessToken: null,
            loading: false,
            error: null,
            pendingLogin: null,
        })
    }, [])

    const updateProfile = useCallback(
        async (data: {
            first_name?: string
            last_name?: string
            profile_picture?: File
        }) => {
            try {
                await authApi.updateProfile(data)
                // Refetch /me to get updated user data
                await refetchMe()
            } catch (error) {
                setState((s) => ({
                    ...s,
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Failed to update profile',
                }))
                throw error
            }
        },
        [refetchMe]
    )

    const clearError = useCallback(
        () => setState((s) => ({ ...s, error: null })),
        []
    )

    const value: AuthContextValue = {
        ...state,
        login,
        verifyLoginOtp,
        requestInviteOtp,
        setPassword,
        logout,
        getAccessToken,
        refresh,
        refetchMe,
        updateProfile,
        clearError,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
