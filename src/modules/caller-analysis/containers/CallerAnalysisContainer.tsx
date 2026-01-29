import React from 'react'
import clsx from 'clsx'
import { useCallerAnalysisGraphQL, useTableColumns } from '../hooks'
import { PersonalIdentification } from '../components/PersonalIdentification'
import { StatusModal } from '../components/StatusModal'
import { CallDetailsModal } from '../components/CallDetailsModal'
import { TableHeader } from '../components/TableHeader'
import { ColumnsDropdown } from '../components/ColumnsDropdown'
import { FilterDropdown } from '../components/FilterDropdown'
import { useColumnStore } from '../store/columnStore'
import { useFilterStore } from '../store/filterStore'
import { MultiSelectActionBar } from '../components/MultiSelectActionBar'
import { callerApiService } from '../services/api'
import { exportToCSV } from '../utils/csvExport'
import type { ColumnOption } from '../components/ColumnsDropdown'
import type { CallData } from '../types'
import type { ColumnVisibility } from '../hooks/useTableColumns'
import type { RowSelectionState } from '@tanstack/react-table'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import { Modal, Table } from '@/components/ui'
import { WaveformAudioPlayer } from '@/components/ui/WaveformAudioPlayer'
import { RefreshButton } from '@/components/ui/RefreshButton'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { apiClient } from '@/services/api'
// Using GraphQL for caller analysis

export const CallerAnalysisContainer: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user
    const { fetchCampaigns, campaigns } = useCampaignStore()
    const [openModal, setOpenModal] = React.useState(false)
    const [openStatusModal, setOpenStatusModal] = React.useState(false)
    const [openTranscriptModal, setOpenTranscriptModal] = React.useState(false)
    const [selectedCaller, setSelectedCaller] = React.useState<CallData | null>(
        null
    )

    // Audio player state
    const [audioPlayerVisible, setAudioPlayerVisible] = React.useState(false)
    const [currentAudioUrl, setCurrentAudioUrl] = React.useState<string>('')
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentPlayingRow, setCurrentPlayingRow] = React.useState<
        string | null
    >(null)

    // Table header state
    const [filterDropdownOpen, setFilterDropdownOpen] = React.useState(false)
    const [columnsDropdownOpen, setColumnsDropdownOpen] = React.useState(false)
    const [selectAllChecked, setSelectAllChecked] = React.useState(false)
    const [selectedFilterType, setSelectedFilterType] = React.useState<
        'campaigns' | 'duration' | 'date' | 'status' | undefined
    >(undefined)
    const filterButtonRef = React.useRef<HTMLButtonElement | null>(null)
    const columnsButtonRef = React.useRef<HTMLButtonElement | null>(null)

    // Row selection state
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {}
    )
    const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(
        new Set()
    )

    // Column visibility state from Zustand store
    const {
        columnVisibility,
        toggleColumn,
        setColumnVisibility,
    } = useColumnStore()

    // Column options for dropdown
    // Includes all CallerFilter fields for filtering
    const columnOptions: Array<ColumnOption> = React.useMemo(
        () => [
            {
                id: 'callerId',
                label: 'Caller ID',
                category: 'applied',
                visible: columnVisibility.callerId ?? true,
            },
            {
                id: 'lastCall',
                label: 'Last Call',
                category: 'applied',
                visible: columnVisibility.lastCall ?? true,
            },
            {
                id: 'duration',
                label: 'Duration',
                category: 'applied',
                visible: columnVisibility.duration ?? true,
            },
            {
                id: 'lifetimeRevenue',
                label: 'LTR',
                category: 'applied',
                visible: columnVisibility.lifetimeRevenue ?? true,
            },
            {
                id: 'revenue',
                label: 'Revenue',
                category: 'caller',
                visible: columnVisibility.revenue ?? false,
            },
            {
                id: 'ringbaCost',
                label: 'Ringba Cost',
                category: 'caller',
                visible: columnVisibility.ringbaCost ?? false,
            },
            {
                id: 'adCost',
                label: 'Ad Cost',
                category: 'caller',
                visible: columnVisibility.adCost ?? false,
            },
            {
                id: 'targetName',
                label: 'Target Name',
                category: 'caller',
                visible: columnVisibility.targetName ?? false,
            },
            {
                id: 'publisherName',
                label: 'Publisher',
                category: 'caller',
                visible: columnVisibility.publisherName ?? false,
            },
            {
                id: 'campaign',
                label: 'Campaign',
                category: 'applied',
                visible: columnVisibility.campaign ?? true,
            },
            {
                id: 'status',
                label: 'Status',
                category: 'applied',
                visible: columnVisibility.status ?? true,
            },
            {
                id: 'action',
                label: 'Action',
                category: 'applied',
                visible: columnVisibility.action ?? true,
            },
            // CallerFilter fields - these can be used for filtering
            {
                id: 'phoneNumber',
                label: 'Phone Number',
                category: 'caller',
                visible: columnVisibility.phoneNumber ?? false,
            },
            {
                id: 'callTimestamp',
                label: 'Call Timestamp',
                category: 'caller',
                visible: columnVisibility.callTimestamp ?? false,
            },
            {
                id: 'callLengthInSeconds',
                label: 'Call Length (seconds)',
                category: 'caller',
                visible: columnVisibility.callLengthInSeconds ?? false,
            },
            // Custom fields from caller data
            {
                id: 'firstName',
                label: 'First Name',
                category: 'caller',
                visible: columnVisibility.firstName ?? false,
            },
            {
                id: 'lastName',
                label: 'Last Name',
                category: 'caller',
                visible: columnVisibility.lastName ?? false,
            },
            {
                id: 'email',
                label: 'Email',
                category: 'caller',
                visible: columnVisibility.email ?? false,
            },
            {
                id: 'type',
                label: 'Type',
                category: 'caller',
                visible: columnVisibility.type ?? false,
            },
            {
                id: 'address',
                label: 'Address',
                category: 'caller',
                visible: columnVisibility.address ?? false,
            },
            {
                id: 'streetNumber',
                label: 'Street Number',
                category: 'caller',
                visible: columnVisibility.streetNumber ?? false,
            },
            {
                id: 'streetName',
                label: 'Street Name',
                category: 'caller',
                visible: columnVisibility.streetName ?? false,
            },
            {
                id: 'streetType',
                label: 'Street Type',
                category: 'caller',
                visible: columnVisibility.streetType ?? false,
            },
            {
                id: 'city',
                label: 'City',
                category: 'caller',
                visible: columnVisibility.city ?? false,
            },
            {
                id: 'state',
                label: 'State',
                category: 'caller',
                visible: columnVisibility.state ?? false,
            },
            {
                id: 'g_zip',
                label: 'ZIP Code',
                category: 'caller',
                visible: columnVisibility.g_zip ?? false,
            },
            // Note: dateFrom, dateTo, durationMin, durationMax, and search are filter parameters only,
            // not displayable columns, so they are not included in columnOptions
        ],
        [columnVisibility]
    )

    // Use GraphQL hook for caller analysis
    const graphqlHook = useCallerAnalysisGraphQL()

    const filters = graphqlHook.filters
    const filteredData = graphqlHook.data
    const isLoading = graphqlHook.isLoading
    const isLoadingBatch = false
    const totalRecords = graphqlHook.totalRecords

    // Wrap refetch to match expected signature
    const refetch = React.useCallback(() => {
        graphqlHook.refetch().catch((err) => {
            console.error('Error refetching:', err)
        })
    }, [graphqlHook.refetch])

    const lastUpdated = new Date()

    // Wrap removeFilters to match expected interface
    const removeFilters = React.useMemo(
        () => ({
            campaign: (_filter: string) => {
                graphqlHook.removeFilters('campaignFilter')
            },
            status: (_filter: string) => {
                graphqlHook.removeFilters('statusFilter')
            },
            durationRange: () => {
                graphqlHook.removeFilters('durationRange')
            },
            search: () => {
                graphqlHook.removeFilters('searchQuery')
            },
            dateRange: () => {
                graphqlHook.removeFilters('dateRange')
            },
        }),
        [graphqlHook.removeFilters]
    )

    // Wrap updateFilters to match expected interface
    const updateFilters = React.useMemo(
        () => ({
            dateRange: (range: { from?: Date; to?: Date }) => {
                graphqlHook.updateFilters({ dateRange: range })
            },
            campaign: (value: string | Array<string>) => {
                graphqlHook.updateFilters({
                    campaignFilter: Array.isArray(value) ? value : [value],
                })
            },
            status: (value: string | Array<string>) => {
                graphqlHook.updateFilters({
                    statusFilter: Array.isArray(value) ? value : [value],
                })
            },
            durationRange: (range: { min?: number; max?: number }) => {
                graphqlHook.updateFilters({ durationRange: range })
            },
            search: (query: string) => {
                graphqlHook.updateFilters({ searchQuery: query })
            },
        }),
        [graphqlHook.updateFilters]
    )

    const clearAllFilters = graphqlHook.clearAllFilters

    // Sync filter store with hook's filter state
    const { setFilters: setStoreFilters } = useFilterStore()
    React.useEffect(() => {
        setStoreFilters(filters)
    }, [filters, setStoreFilters])

    // Fetch campaigns on mount to ensure logos are available
    React.useEffect(() => {
        if (!authLoading && isAuthenticated && apiClient.isAuthInitialized()) {
            // Only fetch if campaigns are empty
            if (campaigns.length === 0) {
                fetchCampaigns().catch((error) => {
                    console.error('Failed to fetch campaigns for logos:', error)
                })
            }
        }
    }, [authLoading, isAuthenticated, campaigns.length, fetchCampaigns])

    const handleRowClick = (row: CallData) => {
        setSelectedCaller(row)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedCaller(null)
    }

    const handleStatusClick = (callerData: CallData) => {
        setSelectedCaller(callerData)
        setOpenStatusModal(true)
    }

    const handleCloseStatusModal = () => {
        setOpenStatusModal(false)
        setSelectedCaller(null)
    }

    const handleTranscriptClick = (callerData: CallData) => {
        setSelectedCaller(callerData)
        setOpenTranscriptModal(true)
    }

    const handleCloseTranscriptModal = () => {
        setOpenTranscriptModal(false)
        setSelectedCaller(null)
    }

    // Audio player handlers
    const handlePlayAudio = (audioUrl: string, rowId: string) => {
        if (currentPlayingRow === rowId) {
            // Same row clicked - toggle play/pause
            setIsPlaying(!isPlaying)
        } else {
            // Different row clicked - start playing new audio
            setCurrentAudioUrl(audioUrl)
            setCurrentPlayingRow(rowId)
            setIsPlaying(true)
            setAudioPlayerVisible(true)
        }
    }

    const handleCloseAudioPlayer = () => {
        setAudioPlayerVisible(false)
        setCurrentAudioUrl('')
        setIsPlaying(false)
        setCurrentPlayingRow(null)
    }

    const handleAudioPlayPause = (playing: boolean) => {
        setIsPlaying(playing)
    }

    // Row selection handlers
    const handleRowSelectionChange = React.useCallback(
        (selectedIds: Set<string>) => {
            setSelectedRowIds(selectedIds)
        },
        []
    )

    // Handle select all
    const handleSelectAll = React.useCallback(
        (checked: boolean) => {
            setSelectAllChecked(checked)
            if (checked) {
                // Select all visible rows
                const allRowIds: RowSelectionState = {}
                filteredData.forEach((row) => {
                    allRowIds[row.id] = true
                })
                setRowSelection(allRowIds)
            } else {
                // Deselect all
                setRowSelection({})
            }
        },
        [filteredData]
    )

    // Sync selectAllChecked with actual selection state
    React.useEffect(() => {
        const allSelected =
            filteredData.length > 0 &&
            filteredData.every((row) => selectedRowIds.has(row.id))
        setSelectAllChecked(allSelected)
    }, [selectedRowIds, filteredData])

    // Delete handler
    const handleDelete = React.useCallback(async () => {
        if (selectedRowIds.size === 0) return

        const confirmMessage = `Are you sure you want to delete ${selectedRowIds.size} item${selectedRowIds.size !== 1 ? 's' : ''}? This action cannot be undone.`
        if (!window.confirm(confirmMessage)) {
            return
        }

        try {
            const idsArray = Array.from(selectedRowIds)
            const response = await callerApiService.deleteCallers(idsArray)

            if (response.success && response.data) {
                // Refresh data
                await refetch()
                // Clear selection
                setRowSelection({})
                setSelectedRowIds(new Set())
                setSelectAllChecked(false)
            } else {
                alert(`Failed to delete: ${response.error || 'Unknown error'}`)
            }
        } catch (error: any) {
            console.error('Error deleting callers:', error)
            alert(
                `Failed to delete callers: ${error.message || 'Unknown error'}`
            )
        }
    }, [selectedRowIds, refetch])

    // CSV export handler
    const handleDownloadCSV = React.useCallback(() => {
        if (selectedRowIds.size === 0) return

        const selectedData = filteredData.filter((row) =>
            selectedRowIds.has(row.id)
        )
        exportToCSV(selectedData)
    }, [selectedRowIds, filteredData])

    // Raise dispute handler (UI only)
    const handleRaiseDispute = React.useCallback(() => {
        if (selectedRowIds.size === 0) return
        console.log('Raise dispute for items:', Array.from(selectedRowIds))
        // TODO: Implement raise dispute functionality when backend is ready
        alert(
            `Raise dispute functionality for ${selectedRowIds.size} item${selectedRowIds.size !== 1 ? 's' : ''} will be implemented soon.`
        )
    }, [selectedRowIds])

    const columns = useTableColumns(
        handleStatusClick,
        handleTranscriptClick,
        handlePlayAudio,
        currentPlayingRow,
        isPlaying,
        columnVisibility,
        true // enableRowSelection
    )

    // Handle column toggle
    const handleColumnToggle = (columnId: string) => {
        toggleColumn(columnId as keyof ColumnVisibility)
    }

    // Handle pagination changes - GraphQL uses server-side pagination, no batch loading needed
    const handlePaginationChange = React.useCallback(
        (pageIndex: number, _pageSize: number, totalPages: number) => {
            // GraphQL pagination: just update the page in the hook
            const requestedPage = pageIndex + 1 // pageIndex is 0-based, GraphQL uses 1-based

            console.log(`[Pagination] Page change requested:`, {
                pageIndex,
                requestedPage,
                totalPages,
                graphqlTotalPages: graphqlHook.totalPages,
                totalRecords,
            })

            // Validate page bounds only - let the GraphQL hook handle duplicate prevention
            if (requestedPage >= 1 && requestedPage <= totalPages) {
                console.log(
                    `[Pagination] Changing to page ${requestedPage} (total: ${totalPages})`
                )
                graphqlHook.setPage(requestedPage)
            } else {
                console.log(
                    `[Pagination] Invalid page: ${requestedPage} (total: ${totalPages})`
                )
            }
        },
        [graphqlHook, totalRecords]
    )

    return (
        <div className="min-h-screen content relative">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1
                                className={clsx(
                                    'text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2',
                                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                )}
                            >
                                Caller Analysis
                            </h1>
                            <p
                                className={clsx(
                                    'text-xs sm:text-sm',
                                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                )}
                            >
                                Real-time caller data from your database
                            </p>
                        </div>
                        <RefreshButton
                            onRefresh={refetch}
                            lastUpdated={lastUpdated}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Data Summary */}
                {/* <div className="mb-6 grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Records
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalRecords.toLocaleString()}
                        </div>
                    </div>
                </div> */}

                {/* Main Table with integrated header */}
                <div className="w-full overflow-x-auto relative">
                    <Table
                        data={filteredData}
                        columns={columns}
                        showHeader={true}
                        pagination={true}
                        clickableRows={true}
                        onRowClick={handleRowClick}
                        size="medium"
                        loading={isLoading || isLoadingBatch}
                        className="w-full"
                        onPaginationChange={handlePaginationChange}
                        enableRowSelection={true}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        onSelectionChange={handleRowSelectionChange}
                        getRowId={(row) => row.id}
                        pageSize={50}
                        totalPages={graphqlHook.totalPages}
                        totalRecords={totalRecords}
                        pageIndex={graphqlHook.page - 1}
                        customHeader={
                            <div className="relative">
                                <TableHeader
                                    filters={filters}
                                    onRemoveFilter={removeFilters}
                                    onFilterClick={() => {
                                        setSelectedFilterType(undefined)
                                        setFilterDropdownOpen(
                                            !filterDropdownOpen
                                        )
                                    }}
                                    onFilterPillClick={(filterType) => {
                                        setSelectedFilterType(filterType)
                                        setFilterDropdownOpen(true)
                                    }}
                                    onColumnsClick={() =>
                                        setColumnsDropdownOpen(
                                            !columnsDropdownOpen
                                        )
                                    }
                                    onSelectAll={handleSelectAll}
                                    selectAllChecked={selectAllChecked}
                                />
                                {filterDropdownOpen && (
                                    <FilterDropdown
                                        filters={filters}
                                        onFiltersChange={updateFilters}
                                        onClearAll={clearAllFilters}
                                        onClose={() =>
                                            setFilterDropdownOpen(false)
                                        }
                                        isOpen={filterDropdownOpen}
                                        triggerRef={filterButtonRef}
                                        filterType={selectedFilterType}
                                    />
                                )}
                                {columnsDropdownOpen && (
                                    <ColumnsDropdown
                                        columns={columnOptions}
                                        onColumnToggle={handleColumnToggle}
                                        onClose={() =>
                                            setColumnsDropdownOpen(false)
                                        }
                                        isOpen={columnsDropdownOpen}
                                        triggerRef={
                                            isMobile
                                                ? undefined
                                                : columnsButtonRef
                                        }
                                        isMobile={isMobile}
                                        onApply={(visibility) => {
                                            setColumnVisibility({
                                                ...columnVisibility,
                                                ...visibility,
                                            })
                                            refetch()
                                            setColumnsDropdownOpen(false)
                                        }}
                                    />
                                )}
                            </div>
                        }
                    />
                </div>

                {/* Personal Identification Modal */}
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    position={isMobile ? 'bottom' : 'right'}
                    title="Caller Details"
                    size={isMobile ? 'full' : 'full'}
                    className={
                        isMobile ? 'max-w-full max-h-[80vh]' : 'w-[600px]'
                    }
                    animation={isMobile ? 'slide' : 'fade'}
                >
                    <div className="h-full overflow-y-auto custom-scroll">
                        {selectedCaller && (
                            <PersonalIdentification
                                callerData={selectedCaller}
                                isOpen={openModal}
                            />
                        )}
                    </div>
                </Modal>

                {/* Status Modal */}
                {selectedCaller && (
                    <StatusModal
                        callerData={selectedCaller}
                        isOpen={openStatusModal}
                        onClose={handleCloseStatusModal}
                    />
                )}

                {/* Call Details Modal */}
                {selectedCaller && (
                    <CallDetailsModal
                        callerData={selectedCaller}
                        isOpen={openTranscriptModal}
                        onClose={handleCloseTranscriptModal}
                    />
                )}

                {/* Audio Player */}
                {audioPlayerVisible && selectedRowIds.size === 0 && (
                    <div className="fixed bottom-6 w-[70vw] md:w-[40vw] left-1/2 transform -translate-x-1/2 z-50">
                        <WaveformAudioPlayer
                            audioUrl={currentAudioUrl}
                            isVisible={audioPlayerVisible}
                            onClose={handleCloseAudioPlayer}
                            onPlayPause={handleAudioPlayPause}
                            isPlaying={isPlaying}
                            showBorder={true}
                            variant="floating"
                        />
                    </div>
                )}

                {/* Multi-select Action Bar */}
                <MultiSelectActionBar
                    selectedCount={selectedRowIds.size}
                    onRaiseDispute={handleRaiseDispute}
                    onDelete={handleDelete}
                    onDownloadCSV={handleDownloadCSV}
                />
            </div>
        </div>
    )
}
