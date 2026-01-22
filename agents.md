# Ringba Frontend Client - Architecture & Patterns Guide

This document provides a comprehensive analysis of the Ringba frontend client architecture, patterns, and conventions. Use this as a reference for understanding how the codebase is structured and how to work with it effectively.

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Module Architecture](#module-architecture)
4. [API & Service Layer](#api--service-layer)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [Component Organization](#component-organization)
8. [Hooks Patterns](#hooks-patterns)
9. [TypeScript Patterns](#typescript-patterns)
10. [Styling & Theming](#styling--theming)
11. [Development Workflow](#development-workflow)

---

## Technology Stack

### Core Dependencies

- **React 19** - UI library with latest features
- **TypeScript 5.9+** - Type safety with strict mode
- **Vite 6** - Build tool and dev server
- **TanStack Router** - Type-safe routing with file-based routes
- **TanStack Query** - Server state management and data fetching
- **TanStack Table** - Table component library
- **Zustand** - Lightweight client state management
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Supporting Libraries

- **class-variance-authority** - Type-safe component variants
- **clsx** + **tailwind-merge** - Conditional class name utilities
- **react-hot-toast** - Toast notifications
- **dayjs** - Date manipulation
- **zod** - Schema validation
- **zustand/middleware/persist** - State persistence

---

## Project Structure

```
client/
├── src/
│   ├── assets/              # Static assets (SVG icons, PNG images)
│   │   ├── svg/            # SVG icons converted to React components
│   │   └── png/            # Image files
│   │
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Base UI components (Button, Input, Modal, Table, etc.)
│   │   ├── common/         # Shared/common components (Search, Tooltip)
│   │   ├── logo/           # Logo components
│   │   ├── debug/          # Debug components
│   │   └── index.ts        # Barrel exports
│   │
│   ├── modules/            # Feature modules (domain-driven structure)
│   │   ├── {module-name}/
│   │   │   ├── components/ # Module-specific components
│   │   │   ├── containers/ # Container components (smart components)
│   │   │   ├── hooks/      # Custom hooks for this module
│   │   │   ├── pages/      # Page components (route-level)
│   │   │   ├── services/   # API service functions
│   │   │   ├── store/      # Zustand stores (if needed)
│   │   │   ├── types/      # TypeScript types
│   │   │   ├── utils/      # Module-specific utilities
│   │   │   ├── constants/  # Module constants
│   │   │   ├── validation/ # Validation schemas
│   │   │   └── index.ts    # Module barrel exports
│   │   └── index.ts        # All modules barrel export
│   │
│   ├── routes/             # TanStack Router route definitions
│   │   └── *.tsx           # Individual route files
│   │
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Aside.tsx
│   │   └── Index.tsx
│   │
│   ├── lib/                # Shared utilities and helpers
│   │   ├── hooks/          # Global custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # Shared TypeScript types
│   │   ├── constants/     # Application constants
│   │   └── index.ts        # Barrel exports
│   │
│   ├── services/           # API client setup and configuration
│   │   └── api/            # API service files
│   │       ├── index.ts   # ApiClient class
│   │       ├── setupApiClient.tsx
│   │       └── callerAnalysis.ts
│   │
│   ├── store/              # Global Zustand stores
│   │   └── themeStore.ts
│   │
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx
│   │
│   ├── integrations/       # Third-party integrations
│   │   └── tanstack-query/ # TanStack Query setup
│   │       ├── root-provider.tsx
│   │       └── layout.tsx
│   │
│   ├── styles/             # CSS files and global styles
│   │   ├── main.css
│   │   ├── buttons.css
│   │   ├── table.css
│   │   └── ...
│   │
│   ├── types/              # Global TypeScript types
│   │   └── api.ts          # API response types
│   │
│   ├── hooks/              # Global hooks (not module-specific)
│   │   ├── usePermissions.ts
│   │   └── useSmartPagination.ts
│   │
│   ├── data/               # Static/mock data
│   │   ├── demo-table-data.ts
│   │   └── caller-tabs-data.ts
│   │
│   └── main.tsx           # Application entry point
│
├── public/                 # Static public assets
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

---

## Module Architecture

### Overview

The codebase follows a **feature module pattern** where each business domain is encapsulated in its own module. Modules are self-contained with their own components, hooks, services, types, and state management.

### Module Structure

Each module follows this standard structure:

```
modules/{module-name}/
├── components/        # Module-specific UI components
├── containers/        # Container components (smart components with logic)
├── hooks/            # Custom hooks (data fetching, business logic)
├── pages/            # Page components (route-level components)
├── services/         # API service functions
├── store/            # Zustand stores (optional, for complex state)
├── types/            # TypeScript interfaces and types
├── utils/            # Module-specific utility functions
├── constants/        # Module constants
├── validation/       # Validation schemas (Zod/Yup)
└── index.ts          # Public API exports
```

### Module Examples

#### Example: `billing` Module

```typescript
// modules/billing/index.ts - Barrel export
export { default as InvoicesPage } from './pages/InvoicesPage'
export { InvoicesTable } from './components/InvoicesTable'
export * from './hooks/useInvoices'
export * from './services/invoicesApi'
export type { Invoice, CreateInvoiceRequest } from './types'
```

**Key Characteristics:**
- Clean public API via `index.ts`
- Self-contained with minimal cross-module dependencies
- Clear separation of concerns (components, hooks, services, types)

#### Example: `caller-analysis` Module

This module demonstrates a more complex structure with:
- Multiple stores (`filterStore`, `columnStore`)
- Container components (`CallerAnalysisContainer`)
- Complex hooks (`useCallerAnalysis`, `useCallerAnalysisApi`)
- Utility functions for data transformation
- Tab-based components

### Module Principles

1. **Self-Containment**: Modules should be independent and reusable
2. **Public API**: Only export what's needed via `index.ts`
3. **Separation of Concerns**: Clear boundaries between components, hooks, services
4. **Type Safety**: All module APIs should be fully typed
5. **Barrel Exports**: Use `index.ts` files for clean imports

---

## API & Service Layer

### API Client Architecture

The application uses a centralized `ApiClient` class that wraps Axios:

```typescript
// services/api/index.ts
export class ApiClient {
    private instance: AxiosInstance
    private getAccessToken?: () => string | null
    private refresh?: () => Promise<void>

    // Initialize auth callbacks
    initializeAuth({ getAccessToken, refresh }: AuthConfig): void

    // HTTP methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
}
```

**Features:**
- Automatic token injection via interceptors
- 401 retry logic with token refresh
- Centralized error handling
- Request/response interceptors
- Type-safe responses

### Service Layer Pattern

API calls are abstracted into service functions within modules:

```typescript
// modules/billing/services/invoicesApi.ts
import { apiClient } from '@/services/api'

export async function fetchInvoices(): Promise<Array<Invoice>> {
    const response = await apiClient.get<InvoicesResponse>(
        '/api/admin/invoices'
    )
    return response.data
}

export async function createInvoice(
    data: CreateInvoiceRequest,
    logoFile?: File
): Promise<Invoice> {
    const formData = new FormData()
    // ... form data preparation
    
    const response = await apiClient.post<InvoiceResponse>(
        '/api/admin/invoices',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
    return response.data
}
```

**Service Function Guidelines:**
- One service file per resource/domain
- Functions are pure and typed
- Handle data transformation (FormData, query params)
- Return typed responses
- Errors bubble up to hooks/components

### API Response Types

Standard API response structure:

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
    timestamp: string
}

export interface PaginatedApiResponse<T = any> {
    success: boolean
    data: Array<T>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext?: boolean
        hasPrev?: boolean
    }
}
```

### API Client Setup

The API client is initialized with auth callbacks:

```typescript
// services/api/setupApiClient.tsx
export function ApiClientSetup({ children }: { children: React.ReactNode }) {
    const { getAccessToken, refresh } = useAuth()

    useEffect(() => {
        apiClient.initializeAuth({
            getAccessToken,
            refresh,
        })
    }, [getAccessToken, refresh])

    return <>{children}</>
}
```

This component wraps the app in `main.tsx` to ensure auth is initialized before API calls.

---

## State Management

The application uses a **hybrid state management approach**:

### 1. Server State: TanStack Query

All server data is managed by TanStack Query:

```typescript
// modules/billing/hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useInvoices() {
    return useQuery({
        queryKey: ['billing', 'invoices'],
        queryFn: fetchInvoices,
        retry: 1,
    })
}

export function useCreateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, logoFile }) => createInvoice(data, logoFile),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            toast.success('Invoice created successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create invoice')
        },
    })
}
```

**Query Key Conventions:**
- Use hierarchical keys: `['module', 'resource', 'id']`
- Examples: `['billing', 'invoices']`, `['caller', id]`, `['org', 'campaigns']`
- Include filters/params in keys for proper caching

**Best Practices:**
- Use `useQuery` for reads
- Use `useMutation` for writes
- Invalidate related queries on mutations
- Handle loading/error states
- Use `staleTime` and `gcTime` for caching strategy

### 2. Client State: Zustand

Client-side state is managed with Zustand stores:

#### Global Stores

```typescript
// store/themeStore.ts
export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
    })),
    setTheme: (theme) => set({ theme }),
}))
```

#### Module Stores

```typescript
// modules/caller-analysis/store/filterStore.ts
export const useFilterStore = create<FilterStore>()(
    persist(
        (set) => ({
            filters: initialFilterState,
            tempFilters: initialFilterState,
            setFilters: (filters) => set({ filters }),
            applyTempFilters: () => 
                set((state) => ({ filters: state.tempFilters })),
        }),
        {
            name: 'ringba-caller-filters',
            partialize: (state) => ({ filters: state.filters }),
        }
    )
)
```

**Store Patterns:**
- Use Zustand for UI state, filters, preferences
- Use `persist` middleware for localStorage persistence
- Keep stores focused and single-purpose
- Type all store state and actions

#### Store with API Calls

Some stores combine Zustand with API calls:

```typescript
// modules/org/store/orgStore.ts
export const useOrgStore = create<OrgState>((set, get) => ({
    org: null,
    loading: false,
    error: null,

    fetchOrg: async () => {
        try {
            set({ loading: true, error: null })
            const res = await fetch('/api/org')
            const data = await res.json()
            set({ org: data, loading: false })
        } catch (e: any) {
            set({ loading: false, error: e?.message })
        }
    },
}))
```

**Note:** Prefer TanStack Query hooks over API calls in stores when possible.

### 3. Local State: React useState

Component-local state uses React's `useState`:

```typescript
const [isOpen, setIsOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
```

**When to Use:**
- UI-only state (modals, dropdowns, form inputs)
- Temporary state that doesn't need persistence
- State that doesn't need to be shared

---

## Routing

### TanStack Router Setup

Routes are defined in `src/routes/` and registered in `main.tsx`:

```typescript
// routes/billingInvoices.tsx
import { createRoute } from '@tanstack/react-router'
import InvoicesPage from '../modules/billing/pages/InvoicesPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/billing/invoices',
        component: InvoicesPage,
        getParentRoute: () => parentRoute,
    })
```

```typescript
// main.tsx
const routeTree = rootRoute.addChildren([
    DashboardRoute(rootRoute),
    BillingInvoicesRoute(rootRoute),
    // ... other routes
])

const router = createRouter({
    routeTree,
    context: { ...TanStackQueryProviderContext },
    defaultPreload: 'intent',
    scrollRestoration: true,
})
```

### Route Patterns

- **File-based routes**: Each route is a separate file in `routes/`
- **Type-safe**: Routes are fully typed
- **Code splitting**: Routes are automatically code-split
- **Preloading**: Uses `defaultPreload: 'intent'` for better UX

### Route Structure

```
routes/
├── dashboard.tsx
├── billingInvoices.tsx
├── billingInvoiceCreate.tsx
├── organization.tsx
├── organizationCampaigns.tsx
└── ...
```

---

## Component Organization

### Component Hierarchy

1. **UI Components** (`components/ui/`)
   - Base, reusable components
   - Examples: `Button`, `Input`, `Modal`, `Table`, `Select`
   - Use `class-variance-authority` for variants
   - Fully typed with TypeScript

2. **Common Components** (`components/common/`)
   - Shared components used across modules
   - Examples: `Search`, `Tooltip`
   - Combine multiple UI components

3. **Module Components** (`modules/{module}/components/`)
   - Feature-specific components
   - Examples: `InvoicesTable`, `CallerAnalysisContainer`
   - Use module hooks and services

4. **Page Components** (`modules/{module}/pages/`)
   - Route-level components
   - Examples: `InvoicesPage`, `DashboardPage`
   - Compose module components and hooks

5. **Container Components** (`modules/{module}/containers/`)
   - Smart components with business logic
   - Examples: `CallerAnalysisContainer`, `OnboardingModalContainer`
   - Bridge between pages and presentational components

### Component Patterns

#### UI Component Example

```typescript
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    'base-classes',
    {
        variants: {
            variant: {
                primary: 'primary-classes',
                secondary: 'secondary-classes',
            },
            size: {
                sm: 'small-classes',
                md: 'medium-classes',
            },
        },
    }
)

interface ButtonProps 
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean
}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    )
}
```

#### Module Component Example

```typescript
// modules/billing/components/InvoicesTable.tsx
import { useInvoices } from '../hooks/useInvoices'
import { Button } from '@/components/ui/Button'

export function InvoicesTable() {
    const { data: invoices, isLoading } = useInvoices()
    
    if (isLoading) return <div>Loading...</div>
    
    return (
        <table>
            {/* table content */}
        </table>
    )
}
```

---

## Hooks Patterns

### Custom Hooks Structure

Hooks encapsulate business logic and data fetching:

```typescript
// modules/billing/hooks/useInvoices.ts
export function useInvoices() {
    return useQuery({
        queryKey: ['billing', 'invoices'],
        queryFn: fetchInvoices,
    })
}

export function useCreateInvoice() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: createInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
        },
    })
}
```

### Hook Patterns

1. **Query Hooks**: Use `useQuery` for data fetching
2. **Mutation Hooks**: Use `useMutation` for data mutations
3. **Composite Hooks**: Combine multiple queries/mutations
4. **Business Logic Hooks**: Encapsulate complex logic

### Hook Examples

#### Simple Query Hook

```typescript
export function useInvoice(id: string | null) {
    return useQuery({
        queryKey: ['billing', 'invoices', id],
        queryFn: () => (id ? getInvoiceById(id) : Promise.resolve(null)),
        enabled: !!id,
    })
}
```

#### Mutation Hook with Optimistic Updates

```typescript
export function useUpdateInvoice() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: ({ id, data }) => updateInvoice(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ 
                queryKey: ['billing', 'invoices', id] 
            })
            
            // Snapshot previous value
            const previous = queryClient.getQueryData(['billing', 'invoices', id])
            
            // Optimistically update
            queryClient.setQueryData(['billing', 'invoices', id], (old) => ({
                ...old,
                ...data,
            }))
            
            return { previous }
        },
        onError: (err, variables, context) => {
            // Rollback on error
            queryClient.setQueryData(
                ['billing', 'invoices', variables.id],
                context.previous
            )
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices', variables.id],
            })
        },
    })
}
```

#### Composite Hook

```typescript
// modules/caller-analysis/hooks/useCallerAnalysisApi.ts
export const useCallerAnalysisApi = () => {
    const queryClient = useQueryClient()
    
    const getCallersQueryKey = (params: CallerQueryParams = {}) => [
        'callers',
        params,
    ]
    
    const useGetAllCallers = (filters: FilterState, page: number, limit: number) => {
        const queryParams = callerApiService.convertFilterStateToQueryParams(filters)
        queryParams.page = page
        queryParams.limit = limit
        
        return useQuery({
            queryKey: getCallersQueryKey(queryParams),
            queryFn: () => callerApiService.getAllCallers(queryParams),
            staleTime: 5 * 60 * 1000,
        })
    }
    
    return {
        useGetAllCallers,
        // ... other hooks
    }
}
```

---

## TypeScript Patterns

### Type Organization

Types are organized hierarchically:

1. **Global Types** (`types/`): Shared across modules
2. **Module Types** (`modules/{module}/types/`): Module-specific types
3. **Component Props**: Defined inline or in component files

### Type Patterns

#### API Types

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
    timestamp: string
}

export interface PaginatedApiResponse<T = any> {
    success: boolean
    data: Array<T>
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
```

#### Module Types

```typescript
// modules/billing/types/index.ts
export interface Invoice {
    id: string
    invoiceNumber: string
    customerId: string
    // ... other fields
}

export interface CreateInvoiceRequest {
    customerId: string
    items: Array<InvoiceItem>
    // ... other fields
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
    id: string
}
```

#### Component Props

```typescript
// Prefer interfaces for component props
export interface InvoicesTableProps {
    invoices: Array<Invoice>
    onInvoiceClick?: (invoice: Invoice) => void
    isLoading?: boolean
}

// Use type for unions, intersections, computed types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled'
```

### Type Safety Best Practices

1. **Strict Mode**: TypeScript strict mode is enabled
2. **Explicit Returns**: Functions should have explicit return types
3. **No `any`**: Avoid `any`, use `unknown` if needed
4. **Type Exports**: Use `export type` for type-only exports
5. **Generic Types**: Use generics for reusable types

---

## Styling & Theming

### Tailwind CSS Configuration

- **Tailwind 4** with Vite plugin
- Custom color system with dark mode support
- Path alias `@/` for imports
- Safelist for dynamic color classes

### Theme System

The application uses a CSS custom properties-based theme system:

```typescript
// store/themeStore.ts
export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'dark',
    toggleTheme: () => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.remove('theme-dark', 'theme-light')
        document.documentElement.classList.add(
            newTheme === 'dark' ? 'theme-dark' : 'theme-light'
        )
        localStorage.setItem('theme', newTheme)
        set({ theme: newTheme })
    },
}))
```

**Theme Classes:**
- `theme-dark`: Applied to `html` element for dark mode
- `theme-light`: Applied to `html` element for light mode
- CSS custom properties defined in `styles/main.css`

### Component Styling

1. **Tailwind Utilities**: Primary styling method
2. **Component Variants**: Use `class-variance-authority` for variants
3. **Class Merging**: Use `cn()` utility (combines `clsx` + `tailwind-merge`)
4. **CSS Modules**: Avoid unless necessary (use Tailwind instead)

### Styling Example

```typescript
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
    'px-4 py-2 rounded-md font-medium transition-colors',
    {
        variants: {
            variant: {
                primary: 'bg-blue-600 text-white hover:bg-blue-700',
                secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
            },
        },
    }
)

export function Button({ className, variant, ...props }) {
    return (
        <button
            className={cn(buttonVariants({ variant }), className)}
            {...props}
        />
    )
}
```

---

## Development Workflow

### Path Aliases

```typescript
// tsconfig.json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}

// Usage
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'
```

### Import Conventions

1. **External libraries** first
2. **Internal imports** using `@/` alias
3. **Relative imports** for same-module files
4. **Barrel exports** preferred for clean imports

```typescript
// Good
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { useInvoices } from '../hooks/useInvoices'
import type { Invoice } from '../types'

// Avoid
import { Button } from '../../../components/ui/Button'
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `InvoiceTable.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useInvoices.ts`)
- **Services**: camelCase (e.g., `invoicesApi.ts`)
- **Types**: PascalCase (e.g., `Invoice.ts` or `index.ts` with exports)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Pages**: PascalCase with `Page` suffix (e.g., `InvoicesPage.tsx`)
- **Stores**: camelCase with `Store` suffix (e.g., `themeStore.ts`)

### Code Style

- **ESLint**: TanStack config with strict rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled
- **Functional Components**: Use functional components only
- **Explicit Types**: Prefer explicit return types

### Scripts

```json
{
    "dev": "vite --port 3000 --host",
    "build": "vite build && tsc",
    "lint": "eslint",
    "format": "prettier .",
    "check": "prettier --write . && eslint --fix"
}
```

---

## Best Practices Summary

### Architecture

1. ✅ **Module Independence**: Modules should be self-contained
2. ✅ **Clear Boundaries**: Separation between components, hooks, services
3. ✅ **Type Safety**: Everything should be typed
4. ✅ **Barrel Exports**: Use `index.ts` for clean public APIs

### State Management

1. ✅ **Server State**: Use TanStack Query for all API data
2. ✅ **Client State**: Use Zustand for UI state and preferences
3. ✅ **Local State**: Use `useState` for component-only state
4. ✅ **Query Keys**: Use hierarchical, consistent query keys

### Components

1. ✅ **Composition**: Compose smaller components
2. ✅ **Props Interface**: Use TypeScript interfaces for props
3. ✅ **Variants**: Use `class-variance-authority` for styling variants
4. ✅ **Accessibility**: Use semantic HTML and ARIA attributes

### API & Services

1. ✅ **Service Layer**: Abstract API calls into service functions
2. ✅ **Error Handling**: Handle errors at service/hook level
3. ✅ **Type Safety**: Type all API requests and responses
4. ✅ **Centralized Client**: Use `apiClient` for all requests

### Performance

1. ✅ **Code Splitting**: Routes are automatically code-split
2. ✅ **Memoization**: Use `React.memo`, `useMemo`, `useCallback` appropriately
3. ✅ **Query Caching**: Leverage TanStack Query caching
4. ✅ **Lazy Loading**: Use dynamic imports for heavy components

---

## Common Patterns & Examples

### Creating a New Module

1. Create module directory: `modules/{module-name}/`
2. Set up structure: `components/`, `hooks/`, `pages/`, `services/`, `types/`
3. Create `index.ts` with barrel exports
4. Create route file in `routes/`
5. Register route in `main.tsx`

### Adding a New API Endpoint

1. Add service function in `modules/{module}/services/{resource}Api.ts`
2. Create hook in `modules/{module}/hooks/use{Resource}.ts`
3. Use hook in components/pages
4. Export hook from module `index.ts`

### Adding a New Store

1. Create store file: `modules/{module}/store/{name}Store.ts`
2. Define state interface
3. Create store with `create()`
4. Add persistence if needed with `persist()` middleware
5. Export from module `index.ts`

---

## Conclusion

This architecture provides:

- **Scalability**: Module-based structure scales well
- **Maintainability**: Clear separation of concerns
- **Type Safety**: Full TypeScript coverage
- **Developer Experience**: Clear patterns and conventions
- **Performance**: Optimized with code splitting and caching
- **Testability**: Isolated modules and pure functions

For more details, refer to:
- `CLIENT_ARCHITECTURE.md` - High-level architecture overview
- `STRUCTURE.md` - Project structure details
- Individual module `README.md` files for module-specific documentation
