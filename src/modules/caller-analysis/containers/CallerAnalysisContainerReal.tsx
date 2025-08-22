import React from 'react'
import clsx from 'clsx'
import { useCallerAnalysisReal, useTableColumns } from '../hooks'
import { PersonalIdentification } from '../components/PersonalIdentification'
import { StatusModal } from '../components/StatusModal'
import { CallTranscriptModal } from '../components/CallTranscriptModal'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { Modal, Table, AudioPlayer, TableLoader } from '@/components/ui'
import Button from '@/components/ui/Button'
// import { FilterPills, FiltersSection } from '@/modules'

export const CallerAnalysisContainerReal: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
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
    const [currentPlayingRow, setCurrentPlayingRow] = React.useState<string | null>(null)

    const {
        filteredData,
        isLoading,
        error,
        isError,
        currentPage,
        pageSize,
        totalPages,
        totalRecords,
        handlePageChange,
        handlePageSizeChange,
        refetch,
    } = useCallerAnalysisReal()

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

    const columns = useTableColumns(handleStatusClick, handleTranscriptClick, handlePlayAudio, currentPlayingRow, isPlaying)

    // Show loading state
    if (isLoading) {
        return <TableLoader />
    }

    // Show error state
    if (isError) {
        return (
            <div className="min-h-screen content">
                <div className="p-3 sm:p-4 lg:p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            API Connection Error
                        </h3>
                        <p className="text-red-700 dark:text-red-300">
                            {error?.message || 'Failed to connect to the backend API'}
                        </p>
                        <div className="mt-4">
                            <Button onClick={() => refetch()}>
                                Retry Connection
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen content">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Caller Analysis
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Real-time caller data from your database
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => refetch()}>
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Data Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalRecords.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Page</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentPage} of {totalPages}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Size</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{pageSize}</div>
                    </div>
                </div>

                {/* Filters Section */}
                {/* Filters Section - Commented out for now until we implement real filtering */}
                {/* <FiltersSection
                    filters={filters}
                    onUpdateFilters={updateFilters}
                    onRemoveFilters={removeFilters}
                    onClearAllFilters={clearAllFilters}
                    hasActiveFilters={hasActiveFilters}
                /> */}

                {/* Filter Pills - Commented out for now until we implement real filtering */}
                {/* {hasActiveFilters && (
                    <FilterPills
                        filters={filters}
                        onRemoveFilter={removeFilters}
                        onClearAll={clearAllFilters}
                    />
                )} */}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table
                        data={filteredData}
                        columns={columns}
                        className={clsx(
                            'w-full',
                            isDark ? 'dark' : ''
                        )}
                        onRowClick={handleRowClick}
                        clickableRows
                        pagination
                        pageSize={pageSize}
                        loading={isLoading}
                        emptyMessage="No caller data available"
                    />
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Page Size Selector */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
                </div>
            </div>

            {/* Modals */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                title="Caller Details"
                size="lg"
            >
                {selectedCaller && <PersonalIdentification callerData={selectedCaller} />}
            </Modal>

            {selectedCaller && (
                <>
                    <StatusModal
                        isOpen={openStatusModal}
                        onClose={handleCloseStatusModal}
                        callerData={selectedCaller}
                    />

                    <CallTranscriptModal
                        isOpen={openTranscriptModal}
                        onClose={handleCloseTranscriptModal}
                        callerData={selectedCaller}
                    />
                </>
            )}

            {/* Audio Player */}
            {audioPlayerVisible && (
                <AudioPlayer
                    audioUrl={currentAudioUrl}
                    isPlaying={isPlaying}
                    onPlayPause={handleAudioPlayPause}
                    onClose={handleCloseAudioPlayer}
                    isVisible={audioPlayerVisible}
                />
            )}
        </div>
    )
}
