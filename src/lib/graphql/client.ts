import { GraphQLClient } from 'graphql-request'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_BASE_URL = baseUrl.endsWith('/api')
    ? baseUrl
    : baseUrl.replace(/\/$/, '') + '/api'

// Create a base client that will be configured with auth headers dynamically
let getAccessToken: (() => string | null) | null = null

export function initializeGraphQLAuth(accessTokenGetter: () => string | null) {
    getAccessToken = accessTokenGetter
}

// Create a request function that adds auth headers
async function createAuthenticatedRequest<T = any, V = any>(
    query: any, // Can be string or DocumentNode from gql tag
    variables?: V
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    
    // Add Bearer token if available (fallback - cookies should be primary)
    // Note: We use cookies as primary auth method, Bearer token is just a fallback
    const token = getAccessToken?.()
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    // Cookies are sent automatically via credentials: 'include'
    
    const client = new GraphQLClient(`${API_BASE_URL}/graphql`, {
        credentials: 'include', // Required for cookies to be sent
        headers,
    })
    
    try {
        const result = await client.request<T>(query, variables)
        return result
    } catch (error: any) {
        console.error('[GraphQL] Request failed:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
        })
        throw error
    }
}

// Export a client-like object that uses the authenticated request function
export const graphqlClient = {
    request: <T = any, V = any>(query: string, variables?: V): Promise<T> => {
        return createAuthenticatedRequest<T, V>(query, variables)
    },
}
