# Caller Analysis Module

A comprehensive call tracking and analysis dashboard module with advanced filtering capabilities.

## 📋 Overview

The Caller Analysis module provides a data-driven interface for analyzing call patterns, tracking caller behavior, and monitoring call performance metrics. It features real-time filtering, responsive design, and comprehensive data visualization.

## 🏗️ Module Structure

```
caller-analysis/
├── components/           # Reusable UI components
│   ├── Status.tsx           # Call status indicator with color coding
│   ├── Campaign.tsx         # Campaign type visual indicators (H, P, ⚠️)
│   ├── FilterPills.tsx      # Applied filter pills with removal
│   ├── FiltersSection.tsx   # Filter controls container
│   └── index.ts             # Component exports
├── containers/           # Business logic containers
│   ├── CallerAnalysisContainer.tsx  # Main container component
│   └── index.ts                     # Container exports
├── hooks/               # Custom hooks
│   ├── useCallerAnalysis.ts    # State management & filtering logic
│   ├── useTableColumns.tsx     # Table column definitions
│   └── index.ts                # Hook exports
├── pages/               # Page components
│   ├── CallerAnalysisPage.tsx  # Route-level page component
│   └── index.ts                # Page exports
├── data/                # Data layer
│   └── mockData.ts             # Call data & filter options
├── utils/               # Utility functions
│   └── filterUtils.ts          # Filtering logic functions
├── types/               # Type definitions
│   └── index.ts                # Module types
├── index.ts             # Main module exports
└── README.md           # This file
```

## 🧩 Components

### Status

**Purpose**: Visual status indicator for call outcomes
**Props**: `status: string`
**Features**:

- Color-coded status display
- Theme-aware styling
- Support for multiple status types

```tsx
<Status status="High Quality" />
```

### Campaign

**Purpose**: Display campaign type indicators
**Props**: `campaign: string`
**Features**:

- Visual icons for H, P, ⚠️ campaign types
- Theme-aware colors
- Flexible campaign combinations

```tsx
<Campaign campaign="H ⚠ P" />
```

### FilterPills

**Purpose**: Show applied filters with removal capability
**Props**: `filters: FilterState`, `onRemoveFilter: RemoveFilterCallbacks`
**Features**:

- Individual filter removal
- Formatted display text
- Theme-consistent styling

```tsx
<FilterPills filters={filters} onRemoveFilter={removeFilters} />
```

### FiltersSection

**Purpose**: Container for all filter controls
**Props**: `filters: FilterState`, `onFiltersChange: FilterChangeCallbacks`
**Features**:

- Multiple filter types
- Responsive layout
- Real-time filtering

```tsx
<FiltersSection filters={filters} onFiltersChange={updateFilters} />
```

## 🎣 Custom Hooks

### useCallerAnalysis

**Purpose**: Centralized state management and filtering logic
**Returns**:

- `filters`: Current filter state
- `filteredData`: Filtered call data
- `updateFilters`: Filter update functions
- `removeFilters`: Filter removal functions
- `clearAllFilters`: Reset all filters
- `hasActiveFilters`: Boolean for filter state
- `totalRecords`: Total data count

**Features**:

- Real-time data filtering
- Multiple filter types support
- Optimized re-renders with useMemo
- Clean state management API

```tsx
const {
    filters,
    filteredData,
    updateFilters,
    removeFilters,
    clearAllFilters,
    hasActiveFilters,
    totalRecords,
} = useCallerAnalysis()
```

### useTableColumns

**Purpose**: Table column definitions and cell renderers
**Returns**: `ColumnDef<CallData>[]`
**Features**:

- Responsive column layouts
- Custom cell renderers
- Theme-aware styling
- Action button integration

```tsx
const columns = useTableColumns()
```

## 📊 Data Types

### CallData

```typescript
interface CallData {
    id: string
    callerId: string
    lastCall: string
    duration: string
    lifetimeRevenue: number
    campaign: string
    action: string
    status: string
}
```

### FilterState

```typescript
interface FilterState {
    dateRange: { from?: Date; to?: Date }
    campaignFilter: string[]
    statusFilter: string[]
    durationFilter: string
    durationRange: { min?: number; max?: number }
    searchQuery: string
}
```

## 🔧 Utilities

### Filter Functions

- `parseDuration(duration: string): number` - Convert duration string to seconds
- `matchesCampaignFilter(campaign, filters)` - Campaign filter logic
- `matchesStatusFilter(status, filters)` - Status filter logic
- `matchesDurationRange(duration, range)` - Duration range filtering
- `matchesSearchQuery(callerId, query)` - Client-side caller ID partial search (primary search is done on backend for performance)

## 🎯 Features

### Advanced Filtering

- **Multiple Selection**: Campaign and Status filters support multiple values
- **Date Range**: Calendar-based date filtering
- **Duration Range**: Min/max duration filtering with custom input
- **Search**: Regex-based caller ID search with flexible matching
- **Real-time**: Instant filtering as users interact

### Filter Pills

- **Visual Feedback**: Applied filters shown as removable pills
- **Individual Removal**: Click X to remove specific filters
- **Formatted Display**: Human-readable filter descriptions
- **Theme Integration**: Consistent with design system

### Data Visualization

- **Status Badges**: Color-coded call status indicators
- **Campaign Icons**: Visual campaign type representation
- **Revenue Charts**: Lifetime revenue progress bars
- **Action Buttons**: Quick access to call actions

### Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Large touch targets for mobile
- **Accessibility**: Screen reader friendly

## 🚀 Usage

### Basic Implementation

```tsx
import { CallerAnalysisPage } from '@/modules/caller-analysis'

// Use in routing
const routes = [
    {
        path: '/caller-analysis',
        component: CallerAnalysisPage,
    },
]
```

### Custom Implementation

```tsx
import {
    CallerAnalysisContainer,
    useCallerAnalysis,
    Status,
} from '@/modules/caller-analysis'

// Use components individually
function CustomAnalysis() {
    const { filteredData } = useCallerAnalysis()

    return (
        <div>
            {filteredData.map((call) => (
                <Status key={call.id} status={call.status} />
            ))}
        </div>
    )
}
```

## 🧪 Testing

### Component Tests

```bash
# Test individual components
npm test Status
npm test FilterPills
```

### Hook Tests

```bash
# Test custom hooks
npm test useCallerAnalysis
npm test useTableColumns
```

### Integration Tests

```bash
# Test full module
npm test caller-analysis
```

## 📈 Performance

- **Memoized Filtering**: useMemo for expensive filter operations
- **Optimized Re-renders**: Selective component updates
- **Lazy Loading**: Code splitting at route level
- **Efficient State**: Minimal state updates

## 🔄 State Flow

```
User Interaction
      ↓
Filter Update (useCallerAnalysis)
      ↓
Data Filtering (useMemo)
      ↓
Component Re-render
      ↓
UI Update
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **Theme Support**: Dark/light mode compatibility
- **Responsive**: Mobile-first breakpoints
- **Consistent**: Design system adherence

## 🚦 Best Practices

1. **Component Separation**: Keep components focused and reusable
2. **Hook Extraction**: Move complex logic to custom hooks
3. **Type Safety**: Use TypeScript throughout
4. **Performance**: Memoize expensive operations
5. **Testing**: Maintain high test coverage
6. **Documentation**: Keep README updated

## 🔮 Future Enhancements

- [ ] Real-time data updates
- [ ] Export functionality
- [ ] Advanced analytics
- [ ] Custom filter creation
- [ ] Saved filter presets
- [ ] Performance metrics
- [ ] Call recording integration

## 📝 Changelog

### v1.0.0

- Initial modular implementation
- Advanced filtering system
- Responsive design
- Filter pills functionality
- Multiple selection support
- Duration range filtering
- Regex search implementation

---

**Module maintained by the Ringba development team**
