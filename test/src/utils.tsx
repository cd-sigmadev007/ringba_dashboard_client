import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { AuthProvider, type AuthUser } from '@/contexts/AuthContext'

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
    user?: AuthUser | null
    initialRoute?: string
    queryClient?: QueryClient
}

/**
 * Render component with all necessary providers (React Query, Router, Auth)
 */
export function renderWithProviders(
    ui: React.ReactElement,
    {
        user = null,
        initialRoute = '/',
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        }),
        ...renderOptions
    }: RenderWithProvidersOptions = {}
) {
    // Create a memory router for testing
    const history = createMemoryHistory({
        initialEntries: [initialRoute],
    })

    const router = createRouter({
        routeTree: {} as any, // Simplified for testing
        history,
    })

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router}>
                        {children}
                    </RouterProvider>
                </AuthProvider>
            </QueryClientProvider>
        )
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        queryClient,
        router,
    }
}

/**
 * Create a mock user for testing
 */
export function createMockUser(overrides?: Partial<AuthUser>): AuthUser {
    return {
        id: 'user-1',
        email: 'test@example.com',
        role: 'media_buyer',
        orgId: 'org-1',
        campaignIds: ['campaign-1'],
        firstName: 'Test',
        lastName: 'User',
        onboardingCompletedAt: new Date().toISOString(),
        ...overrides,
    }
}

/**
 * Create a mock invoice for testing
 */
export function createMockInvoice(overrides?: any) {
    return {
        id: 'invoice-1',
        invoice_number: 'INV-001',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        subtotal: 1000,
        tax_rate: 10,
        total: 1100,
        currency_symbol: '$',
        ...overrides,
    }
}

/**
 * Create a mock customer for testing
 */
export function createMockCustomer(overrides?: any) {
    return {
        id: 'customer-1',
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '+1234567890',
        billing_address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postal_code: '12345',
        country: 'US',
        ...overrides,
    }
}

/**
 * Create a mock organization for testing
 */
export function createMockOrganization(overrides?: any) {
    return {
        id: 'org-1',
        name: 'Test Organization',
        email: 'org@example.com',
        phone: '+1234567890',
        billing_address: '123 Org St',
        city: 'Org City',
        state: 'OS',
        postal_code: '12345',
        country: 'US',
        ...overrides,
    }
}

/**
 * Create a mock caller data for testing
 */
export function createMockCaller(overrides?: any) {
    return {
        id: 'caller-1',
        phone_number: '+1234567890',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        campaign: 'Test Campaign',
        status: ['converted'],
        duration: 120,
        call_date: new Date().toISOString(),
        revenue: 100,
        ...overrides,
    }
}

/**
 * Wait for an API call to complete (for mocked APIs)
 */
export async function waitForApiCall() {
    await new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Create a mock API response
 */
export function createMockApiResponse<T>(data: T, success = true) {
    return {
        success,
        data,
        message: success ? 'Success' : 'Error',
    }
}

/**
 * Create a mock error response
 */
export function createMockErrorResponse(message: string, status = 400) {
    return {
        success: false,
        error: 'Error',
        message,
        status,
    }
}
