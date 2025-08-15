/**
 * Common type definitions used across the application
 */

export interface BaseComponent {
    className?: string
    children?: React.ReactNode
}

export interface BaseProps extends BaseComponent {
    id?: string
    testId?: string
}

// Theme related types
export type Theme = 'light' | 'dark'

export interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

// Button variants and sizes
export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'outline'
    | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

// Input variants and states
export type InputVariant = 'default' | 'error' | 'success'
export type InputSize = 'sm' | 'md' | 'lg'

// Modal animations
export type ModalAnimation = 'slideUp' | 'fadeIn' | 'slideDown'

// Navigation types
export interface NavItem {
    id: string | number
    title: string
    path: string
    icon?: React.ReactNode
    disabled?: boolean
    children?: Array<NavItem>
}

// Search related types
export interface SearchItem {
    type: 'wallet' | 'protocol' | 'nft'
    id: string
    name?: string
    address?: string
    logo?: string
    description?: string
}

export interface SearchSuggestions {
    wallets: Array<SearchItem>
    protocols: Array<SearchItem>
    nfts: Array<SearchItem>
}

// API Response types
export interface ApiResponse<T = any> {
    data: T
    message?: string
    status: 'success' | 'error'
    error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<Array<T>> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = any> {
    data: T | null
    loading: boolean
    error: string | null
    status: LoadingState
}

// Form types
export interface FormField {
    name: string
    label?: string
    placeholder?: string
    required?: boolean
    type?: string
    validation?: any
}

export interface FormState {
    isValid: boolean
    isSubmitting: boolean
    errors: Record<string, string>
    touched: Record<string, boolean>
}

// Event handler types
export type EventHandler<T = any> = (event: T) => void
export type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>
export type ClickHandler = EventHandler<React.MouseEvent>
export type SubmitHandler = EventHandler<React.FormEvent>

// Utility types
export type Optional<T, TKey extends keyof T> = Omit<T, TKey> &
    Partial<Pick<T, TKey>>
export type RequiredBy<T, TKey extends keyof T> = T & Required<Pick<T, TKey>>
export type Nullable<T> = T | null
export type Maybe<T> = T | undefined

// Component prop types with proper forwarding
export type ComponentPropsWithoutRef<T extends React.ElementType> =
    React.ComponentPropsWithoutRef<T>
export type ComponentPropsWithRef<T extends React.ElementType> =
    React.ComponentPropsWithRef<T>
