import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import type {
    CreateInvoiceRequest,
    Invoice,
    UpdateInvoiceRequest,
} from '@/modules/billing/types'
import {
    createInvoice,
    deleteInvoice,
    downloadInvoicePDF,
    fetchInvoices,
    getInvoiceById,
    saveDraft,
    sendInvoice,
    updateInvoice,
} from '@/modules/billing/services/invoicesApi'
import { apiClient } from '@/services/api'

// Mock apiClient
vi.mock('@/services/api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

// Mock axios for downloadInvoicePDF
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}))

describe('invoicesApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('fetchInvoices', () => {
        it('should fetch all invoices', async () => {
            const mockInvoices: Array<Invoice> = [
                { id: '1', invoice_number: 'INV-001' } as Invoice,
                { id: '2', invoice_number: 'INV-002' } as Invoice,
            ]

            vi.mocked(apiClient.get).mockResolvedValueOnce({
                data: mockInvoices,
            } as any)

            const result = await fetchInvoices()

            expect(apiClient.get).toHaveBeenCalledWith('/api/admin/invoices')
            expect(result).toEqual(mockInvoices)
        })
    })

    describe('getInvoiceById', () => {
        it('should fetch invoice by ID', async () => {
            const mockInvoice: Invoice = {
                id: '1',
                invoice_number: 'INV-001',
            } as Invoice

            vi.mocked(apiClient.get).mockResolvedValueOnce({
                data: mockInvoice,
            } as any)

            const result = await getInvoiceById('1')

            expect(apiClient.get).toHaveBeenCalledWith('/api/admin/invoices/1')
            expect(result).toEqual(mockInvoice)
        })
    })

    describe('createInvoice', () => {
        it('should create invoice with FormData', async () => {
            const invoiceData: CreateInvoiceRequest = {
                invoice_date: '2025-01-01',
                due_date: '2025-01-31',
                billed_by_id: 'billed-by-1',
                billed_to_id: 'billed-to-1',
                billed_to_type: 'organization',
                currency_code: 'USD',
                currency_symbol: '$',
                items: [
                    {
                        description: 'Test Item',
                        quantity: 1,
                        unit_price: 1000,
                    },
                ],
            }

            const mockInvoice: Invoice = { id: '1', ...invoiceData } as Invoice

            vi.mocked(apiClient.post).mockResolvedValueOnce({
                data: mockInvoice,
            } as any)

            const result = await createInvoice(invoiceData)

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/admin/invoices',
                expect.any(FormData),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            )
            expect(result).toEqual(mockInvoice)
        })

        it('should include logo file in FormData when provided', async () => {
            const invoiceData: CreateInvoiceRequest = {
                invoice_date: '2025-01-01',
            } as CreateInvoiceRequest
            const logoFile = new File([''], 'logo.png', { type: 'image/png' })

            vi.mocked(apiClient.post).mockResolvedValueOnce({
                data: { id: '1' },
            } as any)

            await createInvoice(invoiceData, logoFile)

            const formDataCall = vi.mocked(apiClient.post).mock
                .calls[0][1] as FormData
            expect(formDataCall).toBeInstanceOf(FormData)
        })
    })

    describe('updateInvoice', () => {
        it('should update invoice', async () => {
            const updateData: UpdateInvoiceRequest = {
                invoice_number: 'INV-001-UPDATED',
            } as UpdateInvoiceRequest

            const mockInvoice: Invoice = { id: '1', ...updateData } as Invoice

            vi.mocked(apiClient.put).mockResolvedValueOnce({
                data: mockInvoice,
            } as any)

            const result = await updateInvoice('1', updateData)

            expect(apiClient.put).toHaveBeenCalledWith(
                '/api/admin/invoices/1',
                expect.any(FormData),
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            )
            expect(result).toEqual(mockInvoice)
        })
    })

    describe('deleteInvoice', () => {
        it('should delete invoice', async () => {
            vi.mocked(apiClient.delete).mockResolvedValueOnce({} as any)

            await deleteInvoice('1')

            expect(apiClient.delete).toHaveBeenCalledWith(
                '/api/admin/invoices/1'
            )
        })
    })

    describe('sendInvoice', () => {
        it('should send invoice', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await sendInvoice('1')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/admin/invoices/1/send'
            )
        })
    })

    describe('downloadInvoicePDF', () => {
        it('should download invoice PDF', async () => {
            const mockBlob = new Blob(['pdf content'], {
                type: 'application/pdf',
            })
            // downloadInvoicePDF uses axios directly, not apiClient
            vi.mocked(axios.get).mockResolvedValueOnce({
                data: mockBlob,
            } as any)

            const result = await downloadInvoicePDF('1')

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/invoices/1/pdf'),
                expect.objectContaining({
                    responseType: 'blob',
                })
            )
            expect(result).toBeInstanceOf(Blob)
        })
    })

    describe('saveDraft', () => {
        it('should save invoice as draft', async () => {
            const invoiceData: UpdateInvoiceRequest = {
                invoice_number: 'INV-001',
            } as UpdateInvoiceRequest

            const mockInvoice: Invoice = { id: '1', ...invoiceData } as Invoice

            vi.mocked(apiClient.post).mockResolvedValueOnce({
                data: mockInvoice,
            } as any)

            const result = await saveDraft('1', invoiceData)

            // saveDraft uses regular JSON, not FormData
            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/admin/invoices/1/save-draft',
                invoiceData
            )
            expect(result).toEqual(mockInvoice)
        })
    })
})
