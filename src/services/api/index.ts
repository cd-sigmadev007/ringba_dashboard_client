import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Configuration
// Normalize base URL: remove trailing slash and ensure it doesn't include /api
const normalizeBaseUrl = (url: string): string => {
    if (!url) return 'http://localhost:3001'
    // Remove trailing slash
    let normalized = url.replace(/\/+$/, '')
    // Remove /api suffix if present (routes already include /api)
    normalized = normalized.replace(/\/api$/, '')
    return normalized
}

const API_CONFIG = {
    BASE_URL: normalizeBaseUrl(
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
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

// Request Interceptor Factory
// Creates an interceptor that accepts getAccessToken function from Auth0
export const createAuthInterceptor = (
    getAccessToken: () => Promise<string | undefined>
) => {
    return async (config: any) => {
        // Get Auth0 access token
        try {
            const token = await getAccessToken()
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                }
            }
        } catch (error) {
            console.error('Failed to get access token:', error)
        }

        // Add request timestamp
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

// Error Interceptor
const errorInterceptor = async (error: any) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true

        console.error('🔒 Authentication failed:', {
            url: originalRequest.url,
            status: error.response?.status,
            message: error.response?.data?.message || 'Unauthorized',
        })

        // Auth0 will handle redirect via useAuth0 hook
        // Just reject the error
        return Promise.reject(error)
    }

    // Handle 403 Forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
        console.error('🚫 Access forbidden:', {
            url: originalRequest.url,
            message: error.response?.data?.message || 'Forbidden',
        })
    }

    // Handle other errors
    if (error.response) {
        console.error('❌ API Error:', {
            url: originalRequest.url,
            status: error.response.status,
            message: error.response.data?.message || 'Request failed',
        })
    } else if (error.request) {
        console.error('🌐 Network Error:', {
            url: originalRequest.url,
            message: 'No response received from server',
        })
    }

    return Promise.reject(error)
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    })

    // Add interceptors
    instance.interceptors.request.use(requestInterceptor)
    instance.interceptors.response.use(responseInterceptor, errorInterceptor)

    return instance
}

// API Client Class
export class ApiClient {
    private instance: AxiosInstance
    private authInitialized = false

    constructor() {
        this.instance = createApiInstance()
    }

    /**
     * Initialize authentication interceptor
     * Must be called after Auth0Provider is mounted
     * @param getAccessToken Function to get Auth0 access token
     */
    initializeAuth(getAccessToken: () => Promise<string | undefined>): void {
        if (this.authInitialized) {
            console.warn('ApiClient auth already initialized')
            return
        }

        // Remove default request interceptor
        this.instance.interceptors.request.clear()

        // Add auth interceptor
        const authInterceptor = createAuthInterceptor(getAccessToken)
        this.instance.interceptors.request.use(authInterceptor)

        // Add response interceptor
        this.instance.interceptors.response.use(
            responseInterceptor,
            errorInterceptor
        )

        this.authInitialized = true
        console.log('✅ ApiClient authentication initialized')
    }

    // Generic GET request
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.instance.get<T>(url, config)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Generic POST request
    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
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
