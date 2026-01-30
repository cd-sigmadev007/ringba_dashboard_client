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

// Query to get caller by phone number
export const GET_CALLER_BY_PHONE_QUERY = gql`
    query GetCallerByPhone($phoneNumber: String!) {
        callerByPhone(phoneNumber: $phoneNumber) {
            id
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
