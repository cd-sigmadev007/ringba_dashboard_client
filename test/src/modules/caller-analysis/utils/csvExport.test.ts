import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CallData } from '@/modules/caller-analysis/types'
import { exportToCSV } from '@/modules/caller-analysis/utils/csvExport'

/** Default visible columns for tests (matches default table visibility) */
const defaultColumnVisibility = {
    callerId: true,
    lastCall: true,
    duration: true,
    lifetimeRevenue: true,
    campaign: true,
    status: true,
    action: true,
    revenue: false,
    ringbaCost: false,
    adCost: false,
    targetName: false,
    publisherName: false,
    phoneNumber: false,
    callTimestamp: false,
    callLengthInSeconds: false,
    street_number: false,
    street_name: false,
    street_type: false,
    city: false,
    state: false,
    g_zip: false,
}

describe('csvExport', () => {
    let createElementSpy: any
    let appendChildSpy: any
    let removeChildSpy: any
    let clickSpy: any
    let mockLink: any

    beforeEach(() => {
        // Mock document.createElement
        mockLink = {
            setAttribute: vi.fn(),
            click: vi.fn(),
            style: {},
        }
        createElementSpy = vi
            .spyOn(document, 'createElement')
            .mockReturnValue(mockLink)
        appendChildSpy = vi
            .spyOn(document.body, 'appendChild')
            .mockImplementation(() => mockLink)
        removeChildSpy = vi
            .spyOn(document.body, 'removeChild')
            .mockImplementation(() => mockLink)
        clickSpy = mockLink.click

        // Mock URL.createObjectURL and revokeObjectURL
        global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
        global.URL.revokeObjectURL = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should warn and return early when data is empty', () => {
        const consoleWarnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {})
        exportToCSV([], defaultColumnVisibility)
        expect(consoleWarnSpy).toHaveBeenCalledWith('No data to export')
        expect(createElementSpy).not.toHaveBeenCalled()
        consoleWarnSpy.mockRestore()
    })

    it('should create CSV with headers and data', () => {
        const data: Array<CallData> = [
            {
                id: 'test-id',
                callerId: '+1234567890',
                lastCall: 'Nov 07, 2025, 08:08:30 PM ET',
                duration: '2m 30s',
                lifetimeRevenue: 100,
                campaign: 'Test Campaign',
                status: ['converted'],
                action: 'call',
                revenue: 50,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                g_zip: '10001',
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalledWith('a')
        expect(mockLink.setAttribute).toHaveBeenCalledWith(
            'href',
            'blob:mock-url'
        )
        expect(mockLink.setAttribute).toHaveBeenCalledWith(
            'download',
            expect.stringContaining('caller-analysis-')
        )
        expect(appendChildSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
        expect(removeChildSpy).toHaveBeenCalled()
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should handle multiple rows', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
                campaign: 'Campaign 1',
                status: ['converted'],
            } as CallData,
            {
                callerId: '+0987654321',
                campaign: 'Campaign 2',
                status: ['pending'],
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should handle empty values', () => {
        const data: Array<CallData> = [
            {
                id: '1',
                callerId: '',
                lastCall: '',
                duration: '',
                lifetimeRevenue: 0,
                campaign: '',
                action: '',
                status: [],
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should handle array status values', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
                status: ['converted', 'pending'],
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should use custom filename when provided', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility, 'custom-export.csv')

        expect(mockLink.setAttribute).toHaveBeenCalledWith(
            'download',
            'custom-export.csv'
        )
    })

    it('should escape CSV values with commas', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
                address: '123 Main St, Apt 4B',
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should escape CSV values with quotes', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
                address: '123 "Main" St',
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should handle numeric revenue values', () => {
        const data: Array<CallData> = [
            {
                callerId: '+1234567890',
                revenue: 100,
                lifetimeRevenue: 500,
            } as CallData,
        ]

        exportToCSV(data, defaultColumnVisibility)

        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })

    it('should export only visible columns', () => {
        const data: Array<CallData> = [
            {
                id: '1',
                callerId: '+1234567890',
                lastCall: 'Nov 07, 2025',
                duration: '2m 30s',
                lifetimeRevenue: 100,
                campaign: 'Test',
                status: ['converted'],
                action: 'call',
                revenue: 50,
                city: 'New York',
                g_zip: '10001',
            } as CallData,
        ]
        const visibility = {
            ...defaultColumnVisibility,
            callerId: true,
            lastCall: true,
            campaign: true,
            status: true,
            city: true,
            g_zip: true,
            revenue: false,
            duration: false,
            lifetimeRevenue: false,
        }
        exportToCSV(data, visibility)
        expect(createElementSpy).toHaveBeenCalled()
        expect(clickSpy).toHaveBeenCalled()
    })
})
