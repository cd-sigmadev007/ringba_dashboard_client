import React from 'react'
import clsx from 'clsx'
import { useCallerAnalysis, useTableColumns } from '../hooks'
import { PersonalIdentification } from '../components/PersonalIdentification'
import { StatusModal } from '../components/StatusModal'
import { CallTranscriptModal } from '../components/CallTranscriptModal'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import { AudioPlayer, Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { RefreshButton } from '@/components/ui/RefreshButton'
import { FilterPills, FiltersSection } from '@/modules'

export const CallerAnalysisContainer: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()
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

    const {
        filters,
        filteredData,
        updateFilters,
        removeFilters,
        clearAllFilters,
        hasActiveFilters,
        isLoading,
        totalRecords,
        refetch,
        lastUpdated,
    } = useCallerAnalysis()

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
        isPlaying
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
                <div className="mb-6 grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Records
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalRecords.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {/* Filter Controls */}
                    <FiltersSection
                        filters={filters}
                        onFiltersChange={updateFilters}
                    />

                    {/* Applied Filters Pills */}
                    <FilterPills
                        filters={filters}
                        onRemoveFilter={removeFilters}
                    />

                    {/* Filter Summary */}
                    <div
                        className={clsx(
                            'text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2',
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                        )}
                    >
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearAllFilters}
                                className="text-xs sm:text-sm"
                            >
                                Clear all filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Table */}
                <div className="w-full overflow-x-auto">
                    <Table
                        data={filteredData}
                        columns={columns}
                        showHeader={true}
                        pagination={true}
                        clickableRows={true}
                        onRowClick={handleRowClick}
                        size="medium"
                        loading={isLoading}
                        className="w-full"
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
                        isMobile ? 'max-w-full max-h-[80vh]' : 'max-w-[40%]'
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

                {/* Call Transcript Modal */}
                {selectedCaller && (
                    <CallTranscriptModal
                        callerData={selectedCaller}
                        isOpen={openTranscriptModal}
                        onClose={handleCloseTranscriptModal}
                    />
                )}

                {/* Audio Player */}
                {audioPlayerVisible && (
                    <AudioPlayer
                        audioUrl={currentAudioUrl}
                        isVisible={audioPlayerVisible}
                        onClose={handleCloseAudioPlayer}
                        onPlayPause={handleAudioPlayPause}
                        isPlaying={isPlaying}
                    />
                )}
            </div>
        </div>
    )
}
