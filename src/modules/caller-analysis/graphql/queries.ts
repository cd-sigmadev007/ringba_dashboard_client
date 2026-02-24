import { gql } from 'graphql-request'

// Query to get all callers with filtering and pagination
export const GET_CALLERS_QUERY = gql`
    query GetCallers(
        $filter: CallerFilter
        $orderBy: CallerOrderBy
        $page: Int
        $limit: Int
    ) {
        callers(
            filter: $filter
            orderBy: $orderBy
            page: $page
            limit: $limit
        ) {
            data {
                id
                ringbaRowId
                callerId
                lastCall
                duration
                lifetimeRevenue
                campaign
                action
                status
                audioUrl
                transcript
                phoneNumber
                callTimestamp
                callLengthInSeconds
                attributes
                firstName
                lastName
                email
                type
                address
                street_number
                street_name
                street_type
                city
                state
                g_zip
                revenue
                ringbaCost
                adCost
                latestPayout
                targetName
                publisherName
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                currentPage
                totalPages
                totalCount
            }
            totalCount
        }
    }
`

// Query to get available fields (fixed + dynamic)
export const GET_AVAILABLE_FIELDS_QUERY = gql`
    query GetAvailableFields {
        availableFields {
            name
            type
            source
            filterable
        }
    }
`

// Query to get distinct values for a field
export const GET_FIELD_VALUES_QUERY = gql`
    query GetFieldValues(
        $fieldName: String!
        $filter: CallerFilter
        $page: Int
        $limit: Int
    ) {
        fieldValues(
            fieldName: $fieldName
            filter: $filter
            page: $page
            limit: $limit
        ) {
            data {
                value
                count
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                currentPage
                totalPages
                totalCount
            }
        }
    }
`

// Query to get a single caller by ID
export const GET_CALLER_BY_ID_QUERY = gql`
    query GetCallerById($id: ID!) {
        caller(id: $id) {
            id
            ringbaRowId
            callerId
            lastCall
            duration
            lifetimeRevenue
            campaign
            action
            status
            audioUrl
            transcript
            phoneNumber
            callTimestamp
            callLengthInSeconds
            attributes
            firstName
            lastName
            email
            type
            address
            street_number
            street_name
            street_type
            city
            state
            g_zip
            revenue
            ringbaCost
            adCost
            targetName
            publisherName
        }
    }
`

// Call analysis v2 and tags
export const GET_CALL_ANALYSIS_V2_QUERY = gql`
    query GetCallAnalysisV2($ringbaRowId: ID!) {
        callAnalysisV2(ringbaRowId: $ringbaRowId) {
            ringbaRowId
            callSummary
            disputeRecommendation
            disputeRecommendationReason
            confidenceScore
            currentRevenue
            currentBilledStatus
            systemDuplicate
            tier1Data
            tier2Data
            tier3Data
            tier4Data
            tier5Data
            tier6Data
            tier7Data
            tier8Data
            tier9Data
            tier10Data
        }
    }
`

export const GET_CALL_TAGS_FOR_CALL_QUERY = gql`
    query GetCallTagsForCall($ringbaRowId: ID!) {
        callTagsForCall(ringbaRowId: $ringbaRowId) {
            tagId
            tagName
            tagValue
            priority
            tierNumber
            colorCode
            confidence
        }
    }
`

// Tagging dashboard
export const GET_TAG_USAGE_STATS_QUERY = gql`
    query GetTagUsageStats($dateFrom: DateTime, $dateTo: DateTime) {
        tagUsageStats(dateFrom: $dateFrom, dateTo: $dateTo) {
            totalTaggedCalls
            tagCounts {
                tagId
                tagName
                tagValue
                tierNumber
                priority
                count
                percentOfTotal
            }
        }
    }
`

export const GET_TAG_COUNT_BY_TIER_QUERY = gql`
    query GetTagCountByTier($dateFrom: DateTime, $dateTo: DateTime) {
        tagCountByTier(dateFrom: $dateFrom, dateTo: $dateTo) {
            tierNumber
            tagCounts {
                tagId
                tagName
                tagValue
                tierNumber
                priority
                count
                percentOfTotal
            }
        }
    }
`

export const GET_TAG_COUNT_BY_PRIORITY_QUERY = gql`
    query GetTagCountByPriority($dateFrom: DateTime, $dateTo: DateTime) {
        tagCountByPriority(dateFrom: $dateFrom, dateTo: $dateTo) {
            priority
            tagCounts {
                tagId
                tagName
                tagValue
                tierNumber
                priority
                count
                percentOfTotal
            }
        }
    }
`

/** Unified tagging dashboard - single query, no N+1, tag names resolved */
export const GET_TAGGING_DASHBOARD_QUERY = gql`
    query GetTaggingDashboard($dateFrom: DateTime, $dateTo: DateTime) {
        taggingDashboard(dateFrom: $dateFrom, dateTo: $dateTo) {
            totalTaggedCalls
            tagCounts {
                tagId
                tagName
                tagValue
                tierNumber
                priority
                count
                percentOfTotal
            }
            tagCountByTier {
                tierNumber
                tagCounts {
                    tagId
                    tagName
                    tagValue
                    tierNumber
                    priority
                    count
                    percentOfTotal
                }
            }
            tagCountByPriority {
                priority
                tagCounts {
                    tagId
                    tagName
                    tagValue
                    tierNumber
                    priority
                    count
                    percentOfTotal
                }
            }
        }
    }
`

// Query to get caller by phone number
export const GET_CALLER_BY_PHONE_QUERY = gql`
    query GetCallerByPhone($phoneNumber: String!) {
        callerByPhone(phoneNumber: $phoneNumber) {
            id
            ringbaRowId
            callerId
            lastCall
            duration
            lifetimeRevenue
            campaign
            action
            status
            audioUrl
            transcript
            phoneNumber
            callTimestamp
            callLengthInSeconds
            attributes
            firstName
            lastName
            email
            type
            address
            street_number
            street_name
            street_type
            city
            state
            g_zip
            revenue
            ringbaCost
            adCost
            targetName
            publisherName
        }
    }
`
