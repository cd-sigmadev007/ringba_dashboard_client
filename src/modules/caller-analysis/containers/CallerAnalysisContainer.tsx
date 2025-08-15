import React from 'react'
import clsx from 'clsx'
import { useCallerAnalysis, useTableColumns } from '../hooks'
import { PersonalIdentification } from '../components/PersonalIdentification'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FilterPills, FiltersSection } from '@/modules'

export const CallerAnalysisContainer: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [openModal, setOpenModal] = React.useState(false)
    const [selectedCaller, setSelectedCaller] = React.useState<CallData | null>(
        null
    )

    const {
        filters,
        filteredData,
        updateFilters,
        removeFilters,
        clearAllFilters,
        hasActiveFilters,
        totalRecords,
        isLoading,
    } = useCallerAnalysis()

    const columns = useTableColumns()

    const handleRowClick = (row: CallData) => {
        setSelectedCaller(row)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedCaller(null)
    }

    return (
        <div className="min-h-screen content">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
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
                        Comprehensive call tracking and analysis dashboard
                    </p>
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
                <div className="table-overflow-container">
                    <Table
                        data={filteredData}
                        columns={columns}
                        showHeader={true}
                        pagination={true}
                        pageSize={20}
                        clickableRows={true}
                        onRowClick={handleRowClick}
                        size="medium"
                        loading={isLoading}
                        className="w-full min-w-[600px] max-w-full"
                    />
                </div>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    position={'right'}
                    title="Caller Details"
                    size="full"
                    className={'max-w-[40%]'}
                >
                    <div>
                        {selectedCaller && (
                            <PersonalIdentification
                                callerData={selectedCaller}
                            />
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    )
}
