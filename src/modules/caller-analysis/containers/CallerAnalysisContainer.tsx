import React from 'react'
import clsx from 'clsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useCallerAnalysis, useTableColumns } from '../hooks'
import { PersonalIdentification } from '../components/PersonalIdentification'
import { StatusModal } from '../components/StatusModal'
import { CallDetailsModal } from '../components/CallDetailsModal'
import { TableHeader } from '../components/TableHeader'
import { ColumnsDropdown } from '../components/ColumnsDropdown'
import { FilterDropdown } from '../components/FilterDropdown'
import { useColumnStore } from '../store/columnStore'
import { useFilterStore } from '../store/filterStore'
import type { ColumnOption } from '../components/ColumnsDropdown'
import type { CallData } from '../types'
import type { ColumnVisibility } from '../hooks/useTableColumns'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import { Modal, Table } from '@/components/ui'
import { WaveformAudioPlayer } from '@/components/ui/WaveformAudioPlayer'
import { RefreshButton } from '@/components/ui/RefreshButton'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { apiClient } from '@/services/api'

export const CallerAnalysisContainer: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()
    const { isAuthenticated, isLoading: authLoading } = useAuth0()
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

    // Column visibility state from Zustand store
    const { columnVisibility, toggleColumn } = useColumnStore()

    // Column options for dropdown
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
        ],
        [columnVisibility]
    )

    const {
        filters,
        filteredData,
        updateFilters,
        removeFilters,
        clearAllFilters,
        isLoading,
        isLoadingBatch,
        refetch,
        lastUpdated,
        loadNextBatch,
        BATCH_SIZE,
        totalRecords,
    } = useCallerAnalysis()

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

    const columns = useTableColumns(
        handleStatusClick,
        handleTranscriptClick,
        handlePlayAudio,
        currentPlayingRow,
        isPlaying,
        columnVisibility
    )

    // Handle column toggle
    const handleColumnToggle = (columnId: string) => {
        toggleColumn(columnId as keyof ColumnVisibility)
    }

    // Handle pagination changes - load next batch when user reaches last page
    const handlePaginationChange = React.useCallback(
        (pageIndex: number, _pageSize: number, totalPages: number) => {
            // Check if user is on the last page
            const isLastPage = pageIndex + 1 === totalPages

            if (isLastPage) {
                // Calculate current batch based on loaded data
                const currentBatch = Math.ceil(filteredData.length / BATCH_SIZE)
                const totalBatches = Math.ceil(totalRecords / BATCH_SIZE)

                // If we have more batches to load, load the next one
                // Only load if we're actually on the last page and have more data
                if (currentBatch < totalBatches && !isLoadingBatch) {
                    console.log(
                        `📄 User reached last page (${pageIndex + 1}/${totalPages}), loading batch ${currentBatch + 1}`
                    )
                    loadNextBatch()
                    // Note: Don't change page index - let the table stay on the current page
                    // The new data will be added, increasing total pages, but we stay on the same page number
                }
            }
        },
        [
            filteredData.length,
            BATCH_SIZE,
            totalRecords,
            isLoadingBatch,
            loadNextBatch,
        ]
    )

    return (
        <div className="min-h-screen content">
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
                                    onSelectAll={(checked) =>
                                        setSelectAllChecked(checked)
                                    }
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
                                        triggerRef={isMobile ? undefined : columnsButtonRef}
                                        isMobile={isMobile}
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
                {audioPlayerVisible && (
                    <div className="fixed bottom-6 w-[40%] left-1/2 transform -translate-x-1/2 z-50">
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
            </div>
        </div>
    )
}
