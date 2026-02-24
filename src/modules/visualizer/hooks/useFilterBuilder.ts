/**
 * useFilterBuilder.ts
 * Manages the filter rule tree state.
 * No JSX. Pure state hook.
 */
import { useCallback, useState } from 'react'
import type { FilterGroup, FilterRule } from '../types'

let _idCounter = 0
const uid = () => `f_${++_idCounter}_${Math.random().toString(36).slice(2, 7)}`

function makeEmptyGroup(): FilterGroup {
    return { id: uid(), type: 'group', logic: 'AND', rules: [] }
}

function makeEmptyRule(): FilterRule {
    return { id: uid(), type: 'rule', field: '', operator: 'eq', value: '' }
}

// Deep-clone the tree and apply a mutation at the node with matchId
function mutateTree(
    node: FilterGroup,
    matchId: string,
    mutateFn: (group: FilterGroup) => FilterGroup,
): FilterGroup {
    if (node.id === matchId) return mutateFn({ ...node, rules: [...node.rules] })
    return {
        ...node,
        rules: node.rules.map((r) =>
            r.type === 'group' ? mutateTree(r as FilterGroup, matchId, mutateFn) : r,
        ),
    }
}

// Remove a rule/group by id anywhere in the tree
function removeNode(root: FilterGroup, targetId: string): FilterGroup {
    return {
        ...root,
        rules: root.rules
            .filter((r) => r.id !== targetId)
            .map((r) =>
                r.type === 'group' ? removeNode(r as FilterGroup, targetId) : r,
            ),
    }
}

// Update a specific rule anywhere in the tree
function updateRule(root: FilterGroup, id: string, patch: Partial<FilterRule>): FilterGroup {
    return {
        ...root,
        rules: root.rules.map((r) => {
            if (r.id === id && r.type === 'rule') return { ...r, ...patch }
            if (r.type === 'group') return updateRule(r as FilterGroup, id, patch)
            return r
        }),
    }
}

export function useFilterBuilder(initial?: FilterGroup) {
    const [root, setRoot] = useState<FilterGroup>(initial ?? makeEmptyGroup())

    const addRule = useCallback((groupId: string) => {
        setRoot((prev) =>
            mutateTree(prev, groupId, (g) => ({ ...g, rules: [...g.rules, makeEmptyRule()] }))
        )
    }, [])

    const addGroup = useCallback((groupId: string) => {
        setRoot((prev) =>
            mutateTree(prev, groupId, (g) => ({ ...g, rules: [...g.rules, makeEmptyGroup()] }))
        )
    }, [])

    const removeNode_ = useCallback((nodeId: string) => {
        setRoot((prev) => removeNode(prev, nodeId))
    }, [])

    const updateRule_ = useCallback((id: string, patch: Partial<Omit<FilterRule, 'id' | 'type'>>) => {
        setRoot((prev) => updateRule(prev, id, patch))
    }, [])

    const toggleLogic = useCallback((groupId: string) => {
        setRoot((prev) =>
            mutateTree(prev, groupId, (g) => ({ ...g, logic: g.logic === 'AND' ? 'OR' : 'AND' }))
        )
    }, [])

    const reset = useCallback(() => setRoot(makeEmptyGroup()), [])

    const isEmpty = root.rules.length === 0

    return {
        root,
        addRule,
        addGroup,
        removeNode: removeNode_,
        updateRule: updateRule_,
        toggleLogic,
        reset,
        isEmpty,
    }
}
