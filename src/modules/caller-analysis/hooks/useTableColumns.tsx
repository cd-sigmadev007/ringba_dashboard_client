import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore';
import Button from '../../../components/ui/Button';
import { Status, Campaign } from '../components';
import type { CallData } from '../types';
import { CopyIcon, PlayIcon, PauseIcon, DocumentIcon, WarningIcon } from '@/assets/svg';

export const useTableColumns = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    
    // State to track which rows are playing
    const [playingRows, setPlayingRows] = useState<Set<string>>(new Set());
    
    const togglePlayPause = (rowId: string) => {
        setPlayingRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    const columns = useMemo<ColumnDef<CallData>[]>(
        () => [
            {
                header: 'CALLER ID',
                accessorKey: 'callerId',
                meta: { sticky: true } as any,
                cell: ({ getValue }) => (
                    <div className="flex items-center gap-[10px]">
                        <span className="font-mono text-sm">{getValue() as string}</span>
                        <Button variant="ghost" className="p-1 min-w-0 h-auto">
                            <CopyIcon />
                        </Button>
                    </div>
                ),
            },
            {
                header: 'LAST CALL',
                accessorKey: 'lastCall',
                cell: ({ getValue }) => (
                    <span className="text-sm whitespace-nowrap">{getValue() as string}</span>
                ),
            },
            {
                header: 'DURATION',
                accessorKey: 'duration',
                cell: ({ getValue }) => (
                    <span className="text-sm font-mono">{getValue() as string}</span>
                ),
            },
            {
                header: 'LTR',
                accessorKey: 'lifetimeRevenue',
                cell: ({ getValue }) => {
                    const value = getValue() as number;
                    return (
                        <div className="text-sm">
                            <div className={clsx('font-semibold', value > 0 ? 'text-green-500' : 'text-gray-500')}>
                                ${value.toFixed(2)}
                            </div>
                            <div className="w-16 h-1 bg-gray-200 rounded mt-1">
                                <div
                                    className="h-full bg-blue-500 rounded"
                                    style={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                },
            },
            {
                header: 'CAMPAIGN',
                accessorKey: 'campaign',
                cell: ({ getValue }) => (
                    <Campaign campaign={getValue() as string} />
                ),
            },
            {
                header: 'ACTION',
                accessorKey: 'action',
                cell: ({ row }) => {
                    const isPlaying = playingRows.has(row.id);
                    
                    return (
                        <div className="flex items-center gap-[5px]">
                            {/* Play/Pause Button */}
                            <Button 
                                variant="ghost" 
                                className={clsx(
                                    'p-1 flex items-center justify-center h-auto w-[24px] h-[25px]',
                                    isPlaying && 'bg-[#1B456F] text-[#F5F8FA]'
                                )}
                                onClick={() => togglePlayPause(row.id)}
                                title={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <PauseIcon />
                                ) : (
                                    <PlayIcon />
                                )}
                            </Button>
                            
                            {/* Document Button */}
                            <Button 
                                variant="ghost" 
                                className="p-1 flex items-center justify-center w-[24px] h-[25px]"
                                title="View Document"
                            >
                                <DocumentIcon />
                            </Button>
                            
                            {/* Warning Button */}
                            <Button 
                                variant="ghost" 
                                className="p-1 flex items-center justify-center w-[24px] h-[25px]"
                                title="Warning"
                            >
                                <WarningIcon />
                            </Button>
                        </div>
                    );
                },
            },
            {
                header: 'STATUS',
                accessorKey: 'status',
                cell: ({ getValue, row }) => (
                    <div className="flex items-center gap-2">
                        <Status status={getValue() as string} />
                        <span className={clsx(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                            'bg-blue-500'
                        )}>
                            +{parseInt(row.id) + 3}
                        </span>
                    </div>
                ),
            },
        ],
        [isDark, playingRows, togglePlayPause]
    );

    return columns;
};
