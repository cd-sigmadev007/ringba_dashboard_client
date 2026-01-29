/**
 * Feature flags for frontend
 * These should match backend feature flags
 */

export const FEATURE_FLAGS = {
    /**
     * Enable dynamic fields UI.
     * In production, default to true so call data fields show; set to 'false' to disable.
     */
    ENABLE_DYNAMIC_FIELDS_UI:
        import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_ENABLE_DYNAMIC_FIELDS_UI !== 'false'
            : import.meta.env.VITE_ENABLE_DYNAMIC_FIELDS_UI === 'true',

    /**
     * Enable GraphQL API usage (always enabled for caller analysis)
     */
    ENABLE_GRAPHQL: true, // Always enabled - GraphQL is the primary API for caller analysis
}

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
    return FEATURE_FLAGS[flag]
}
