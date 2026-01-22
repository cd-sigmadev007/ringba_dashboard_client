import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    createCustomer,
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '@/modules/billing/services/customersApi'
import { apiClient } from '@/services/api'

vi.mock('@/services/api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

describe('customersApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should fetch all customers', async () => {
        const mockCustomers = [{ id: '1', name: 'Customer 1' }]
        const mockResponse = { data: mockCustomers }
        vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse as any)

        const result = await getCustomers()
        expect(apiClient.get).toHaveBeenCalledWith('/api/admin/customers')
        // getCustomers returns the full response object (CustomersResponse)
        expect(result).toEqual(mockResponse)
    })

    it('should get customer by ID', async () => {
        const mockCustomer = { id: '1', name: 'Customer 1' }
        const mockResponse = { data: mockCustomer }
        vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse as any)

        const result = await getCustomerById('1')
        expect(apiClient.get).toHaveBeenCalledWith('/api/admin/customers/1')
        // getCustomerById returns the full response object (CustomerResponse)
        expect(result).toEqual(mockResponse)
    })

    it('should create customer', async () => {
        const customerData = { name: 'New Customer', email: 'test@example.com' }
        const mockCustomer = { id: '1', ...customerData }
        const mockResponse = { data: mockCustomer }
        vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any)

        const result = await createCustomer(customerData)
        expect(apiClient.post).toHaveBeenCalledWith(
            '/api/admin/customers',
            customerData
        )
        // createCustomer returns the full response object
        expect(result).toEqual(mockResponse)
    })

    it('should update customer', async () => {
        const updateData = { name: 'Updated Customer' }
        const mockCustomer = { id: '1', ...updateData }
        const mockResponse = { data: mockCustomer }
        vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse as any)

        const result = await updateCustomer('1', updateData)
        expect(apiClient.put).toHaveBeenCalledWith(
            '/api/admin/customers/1',
            updateData
        )
        // updateCustomer returns the full response object
        expect(result).toEqual(mockResponse)
    })

    it('should delete customer', async () => {
        vi.mocked(apiClient.delete).mockResolvedValueOnce({} as any)

        await deleteCustomer('1')
        expect(apiClient.delete).toHaveBeenCalledWith('/api/admin/customers/1')
    })
})
