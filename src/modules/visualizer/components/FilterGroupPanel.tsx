/**
 * FilterGroupPanel.tsx
 * Recursive AND/OR group renderer.
 */
import React from 'react'
import clsx from 'clsx'
import { FilterRuleRow } from './FilterRuleRow'
import type {
    FieldDef,
    FilterGroup,
    FilterNode,
    FilterRule,
    VisualizerSchema,
} from '../types'
import { useThemeStore } from '@/store/themeStore'

interface Props {
    group: FilterGroup
    fields: Array<FieldDef>
    schema: VisualizerSchema | undefined
    depth?: number
    onAddRule: (groupId: string) => void
    onAddGroup: (groupId: string) => void
    onRemoveNode: (nodeId: string) => void
    onUpdateRule: (
        id: string,
        patch: Partial<Omit<FilterRule, 'id' | 'type'>>
    ) => void
    onToggleLogic: (groupId: string) => void
    onRemoveSelf?: () => void
}

const DEPTH_COLORS = [
    'border-l-blue-500/50',
    'border-l-purple-500/50',
    'border-l-teal-500/50',
    'border-l-amber-500/50',
]

function isFilterGroup(node: FilterNode): node is FilterGroup {
    return node.type === 'group'
}

export const FilterGroupPanel: React.FC<Props> = ({
    group,
    fields,
    schema,
    depth = 0,
    onAddRule,
    onAddGroup,
    onRemoveNode,
    onUpdateRule,
    onToggleLogic,
    onRemoveSelf,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]

    const btnBase = clsx(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
        isDark
            ? 'border-[#1E3A5F] text-[#B0C4DE] hover:bg-[#1E3A5F]'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
    )

    return (
        <div
            className={clsx('pl-3 border-l-2', depthColor, depth > 0 && 'mt-3')}
        >
            {/* Group header */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    type="button"
                    onClick={() => onToggleLogic(group.id)}
                    className={clsx(
                        'px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors',
                        group.logic === 'AND'
                            ? isDark
                                ? 'bg-blue-900/40 border-blue-700 text-blue-300'
                                : 'bg-blue-50 border-blue-300 text-blue-700'
                            : isDark
                              ? 'bg-amber-900/40 border-amber-700 text-amber-300'
                              : 'bg-amber-50 border-amber-300 text-amber-600'
                    )}
                    title="Toggle AND / OR"
                >
                    {group.logic}
                </button>
                <span
                    className={clsx(
                        'text-xs',
                        isDark ? 'text-[#4A6080]' : 'text-gray-400'
                    )}
                >
                    {group.rules.length}{' '}
                    {group.rules.length === 1 ? 'condition' : 'conditions'}
                </span>
                {onRemoveSelf && (
                    <button
                        type="button"
                        onClick={onRemoveSelf}
                        className={clsx(
                            'ml-auto text-xs px-2 py-1 rounded-lg border transition-colors',
                            isDark
                                ? 'border-red-800 text-red-400 hover:bg-red-900/20'
                                : 'border-red-200 text-red-500 hover:bg-red-50'
                        )}
                    >
                        Remove group
                    </button>
                )}
            </div>

            {/* Rules */}
            <div className="space-y-2">
                {group.rules.map((node) =>
                    isFilterGroup(node) ? (
                        <FilterGroupPanel
                            key={node.id}
                            group={node}
                            fields={fields}
                            schema={schema}
                            depth={depth + 1}
                            onAddRule={onAddRule}
                            onAddGroup={onAddGroup}
                            onRemoveNode={onRemoveNode}
                            onUpdateRule={onUpdateRule}
                            onToggleLogic={onToggleLogic}
                            onRemoveSelf={() => onRemoveNode(node.id)}
                        />
                    ) : (
                        <FilterRuleRow
                            key={node.id}
                            rule={node}
                            fields={fields}
                            schema={schema}
                            onUpdate={(patch) => onUpdateRule(node.id, patch)}
                            onRemove={() => onRemoveNode(node.id)}
                        />
                    )
                )}
            </div>

            {/* Empty state */}
            {group.rules.length === 0 && (
                <p
                    className={clsx(
                        'text-xs py-2',
                        isDark ? 'text-[#4A6080]' : 'text-gray-400'
                    )}
                >
                    No conditions yet
                </p>
            )}

            {/* Add row */}
            <div className="flex items-center gap-2 mt-3">
                <button
                    type="button"
                    onClick={() => onAddRule(group.id)}
                    className={btnBase}
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add condition
                </button>
                {depth < 3 && (
                    <button
                        type="button"
                        onClick={() => onAddGroup(group.id)}
                        className={btnBase}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                        Add group
                    </button>
                )}
            </div>
        </div>
    )
}
