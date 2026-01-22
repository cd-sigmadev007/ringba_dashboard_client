import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useInvoices, useInvoice } from '@/modules/billing/hooks/useInvoices'
import * as invoicesApi from '@/modules/billing/services/invoicesApi'

vi.mock('@/modules/billing/services/invoicesApi', () => ({
    fetchInvoices: vi.fn(),
    getInvoiceById: vi.fn(),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
}

describe('useInvoices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should fetch invoices', async () => {
        const mockInvoices = [
            { id: '1', invoice_number: 'INV-001' },
            { id: '2', invoice_number: 'INV-002' },
        ]

        vi.mocked(invoicesApi.fetchInvoices).mockResolvedValueOnce(mockInvoices as any)

        const { result } = renderHook(() => useInvoices(), {
            wrapper: createWrapper(),
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual(mockInvoices)
    })

    it('should handle fetch error', async () => {
        vi.mocked(invoicesApi.fetchInvoices).mockRejectedValueOnce(new Error('Failed'))

        const { result } = renderHook(() => useInvoices(), {
            wrapper: createWrapper(),
        })

        await waitFor(
            () => {
                expect(result.current.isError).toBe(true)
            },
            { timeout: 3000 }
        )
    })
})

describe('useInvoice', () => {
    it('should fetch single invoice', async () => {
        const mockInvoice = { id: '1', invoice_number: 'INV-001' }

        vi.mocked(invoicesApi.getInvoiceById).mockResolvedValueOnce(mockInvoice as any)

        const { result } = renderHook(() => useInvoice('1'), {
            wrapper: createWrapper(),
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual(mockInvoice)
    })

    it('should not fetch when id is null', () => {
        const { result } = renderHook(() => useInvoice(null), {
            wrapper: createWrapper(),
        })

        expect(result.current.isFetching).toBe(false)
    })
})
