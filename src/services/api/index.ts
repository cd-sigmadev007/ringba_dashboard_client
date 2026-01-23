import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Configuration
// Normalize base URL: remove trailing slash and ensure it doesn't include /api
const normalizeBaseUrl = (url: string): string => {
    if (!url) {
        // In development, use relative URL to leverage Vite proxy (same-origin for cookies)
        // In production, use the provided URL or default
        return import.meta.env.DEV ? '' : 'http://localhost:3001'
    }
    // Remove trailing slash
    let normalized = url.replace(/\/+$/, '')
    // Remove /api suffix if present (routes already include /api)
    normalized = normalized.replace(/\/api$/, '')
    return normalized
}

const API_CONFIG = {
    BASE_URL: normalizeBaseUrl(
        import.meta.env.VITE_API_BASE_URL ||
            (import.meta.env.DEV ? '' : 'http://localhost:3001')
    ),
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} as const

// API Error Types
export interface ApiError {
    message: string
    status: number
    code?: string
    details?: any
}

// API Response Types
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
    timestamp: string
}

export interface PaginatedApiResponse<T = any> {
    success: boolean
    data: Array<T>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext?: boolean
        hasPrev?: boolean
    }
}

const AUTH_SKIP_BEARER = [
    '/api/auth/login',
    '/api/auth/forgot-password',
    '/api/auth/request-invite-otp',
    '/api/auth/set-password',
    '/api/auth/reset-password',
    '/api/auth/validate-reset-token',
]

const AUTH_SKIP_WAIT = [
    '/api/auth/me',
    '/api/auth/login',
    '/api/auth/forgot-password',
    '/api/auth/request-invite-otp',
    '/api/auth/set-password',
    '/api/auth/reset-password',
    '/api/auth/validate-reset-token',
    '/api/invitations/validate',
]

function isAuthRoute(url: string, list: Array<string>): boolean {
    return list.some((p) => url.includes(p))
}

// Request Interceptor: add Bearer when getAccessToken() is truthy; skip for auth routes. Always add timestamp.
export const createAuthInterceptor = (getAccessToken: () => string | null) => {
    return (config: any) => {
        if (!isAuthRoute(config.url || '', AUTH_SKIP_BEARER)) {
            const token = getAccessToken()
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                }
            }
        }
        config.headers = {
            ...config.headers,
            'X-Request-Timestamp': new Date().toISOString(),
        }
        return config
    }
}

// Default request interceptor (backward compatible)
const requestInterceptor = (config: any) => {
    // Add request timestamp
    config.headers = {
        ...config.headers,
        'X-Request-Timestamp': new Date().toISOString(),
    }
    return config
}

// Response Interceptor
const responseInterceptor = (response: AxiosResponse) => {
    return response
}

// Module-level refs for 401 retry (set by initializeAuth)
let _authRefresh: (() => Promise<string | null>) | null = null
let _authOnTokenRefreshed: ((t: string) => void) | null = null
// Serialize refresh: only one in-flight so concurrent 401s (e.g. /me + other on reload) don't
// each call refresh and cause "token already consumed" 401s for the 2nd+ request
let _authRefreshInFlight: Promise<string | null> | null = null

function createErrorInterceptor(
    instance: AxiosInstance
): (error: any) => Promise<never> {
    return async (error: any) => {
        const config = error.config

        // Never retry when the failed request was /api/auth/refresh itself (avoids infinite loop:
        // refresh 401 -> interceptor calls refresh again -> 401 -> ...)
        const url = config?.url ?? ''
        const isRefreshRequest =
            typeof url === 'string' && url.includes('/api/auth/refresh')
        if (
            error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
            isRefreshRequest
        ) {
            return Promise.reject(error)
        }

        // 401: try refresh and retry once (only for non-refresh requests).
        // Use a single in-flight refresh so concurrent 401s (e.g. on reload) wait and reuse the
        // same new token instead of each calling refresh (backend consumes the refresh token once).
        if (
            error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
            config &&
            !config._retry &&
            _authRefresh
        ) {
            config._retry = true
            try {
                if (!_authRefreshInFlight) {
                    _authRefreshInFlight = _authRefresh().finally(() => {
                        _authRefreshInFlight = null
                    })
                }
                const token = await _authRefreshInFlight
                if (token) {
                    _authOnTokenRefreshed?.(token)
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                    }
                    return instance.request(config)
                }
            } catch (_) {}
        }

        // Enhanced error logging with more details
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
            console.error('🔒 Authentication failed:', {
                url: config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || 'Unauthorized',
                data: error.response.data,
            })
        } else if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
            console.error('🚫 Access forbidden:', {
                url: config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || 'Forbidden',
                data: error.response.data,
            })
        } else if (error.response?.status === 429) {
            console.error('⏱️ Rate limit exceeded:', {
                url: config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || 'Too many requests',
            })
        } else if (error.response?.status >= 500) {
            console.error('🔴 Server error:', {
                url: config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || 'Server error',
            })
        } else if (error.response) {
            console.error('❌ API Error:', {
                url: config?.url,
                status: error.response.status,
                message: error.response.data?.message || 'Request failed',
                data: error.response.data,
            })
        } else if (error.request) {
            console.error('🌐 Network Error:', {
                url: config?.url,
                message: 'No response received from server',
                code: error.code,
            })
        } else {
            console.error('❓ Unknown error:', {
                url: config?.url,
                message: error.message || 'An unexpected error occurred',
            })
        }

        return Promise.reject(error)
    }
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    })
    instance.interceptors.request.use(requestInterceptor)
    instance.interceptors.response.use(
        responseInterceptor,
        createErrorInterceptor(instance)
    )
    return instance
}

// API Client Class
export class ApiClient {
    private instance: AxiosInstance
    private authInitialized = false
    private authReadyPromise: Promise<void>
    private resolveAuthReady: (() => void) | null = null
    private authCheckTimeout: NodeJS.Timeout | null = null

    constructor() {
        this.instance = createApiInstance()
        // Create a promise that will be resolved when auth is initialized
        this.authReadyPromise = new Promise((resolve) => {
            this.resolveAuthReady = resolve
        })

        // Set a timeout to resolve the promise after 10 seconds if auth is never initialized
        // This handles cases where the user might not be authenticated
        this.authCheckTimeout = setTimeout(() => {
            if (!this.authInitialized && this.resolveAuthReady) {
                console.warn(
                    'ApiClient: Auth not initialized after 10s, proceeding without auth'
                )
                this.resolveAuthReady()
            }
        }, 10000)
    }

    /**
     * Check if authentication is initialized
     */
    isAuthInitialized(): boolean {
        return this.authInitialized
    }

    /**
     * Wait for authentication to be initialized
     * This will wait for the authReadyPromise which resolves when:
     * 1. Auth is initialized via initializeAuth(), OR
     * 2. 10 seconds timeout (handles unauthenticated users)
     */
    private async waitForAuth(): Promise<void> {
        if (this.authInitialized) {
            return
        }

        // Wait for auth initialization (with built-in 10s timeout from constructor)
        try {
            await this.authReadyPromise
        } catch (error) {
            // If error, log warning but continue (for non-authenticated requests)
            console.warn(
                'ApiClient: Auth initialization error, proceeding without auth'
            )
        }
    }

    /**
     * Initialize auth: getAccessToken (sync), optional refresh and onTokenRefreshed for 401 retry.
     */
    initializeAuth(opts: {
        getAccessToken: () => string | null
        refresh?: () => Promise<string | null>
        onTokenRefreshed?: (t: string) => void
    }): void {
        if (this.authInitialized) {
            console.warn('ApiClient auth already initialized')
            return
        }
        _authRefresh = opts.refresh ?? null
        _authOnTokenRefreshed = opts.onTokenRefreshed ?? null

        this.instance.interceptors.request.clear()
        this.instance.interceptors.request.use(
            createAuthInterceptor(opts.getAccessToken)
        )

        this.authInitialized = true
        if (this.authCheckTimeout) {
            clearTimeout(this.authCheckTimeout)
            this.authCheckTimeout = null
        }
        if (this.resolveAuthReady) this.resolveAuthReady()
    }

    // Generic GET request
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            if (!isAuthRoute(url, AUTH_SKIP_WAIT)) await this.waitForAuth()
            const response = await this.instance.get<T>(url, config)
            return response.data
        } catch (error) {
            const apiError = this.handleError(error)
            console.error('ApiClient GET error:', {
                url,
                message: apiError.message,
                status: apiError.status,
                code: apiError.code,
            })
            throw apiError
        }
    }

    // Generic POST request
    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            if (!isAuthRoute(url, AUTH_SKIP_WAIT)) await this.waitForAuth()
            const response = await this.instance.post<T>(url, data, config)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Generic PUT request
    async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            // Wait for auth initialization before making request
            await this.waitForAuth()
            const response = await this.instance.put<T>(url, data, config)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Generic PATCH request
    async patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            // Wait for auth initialization before making request
            await this.waitForAuth()
            const response = await this.instance.patch<T>(url, data, config)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Generic DELETE request
    async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            // Wait for auth initialization before making request
            await this.waitForAuth()
            const response = await this.instance.delete<T>(url, config)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.get('/health')
    }

    // Private error handler
    private handleError(error: any): ApiError {
        if (error.response) {
            return {
                message: error.response.data?.message || 'Request failed',
                status: error.response.status,
                code: error.response.data?.code,
                details: error.response.data,
            }
        }

        if (error.request) {
            return {
                message: 'No response received from server',
                status: 0,
                code: 'NETWORK_ERROR',
            }
        }

        return {
            message: error.message || 'An unexpected error occurred',
            status: 0,
            code: 'UNKNOWN_ERROR',
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient()
