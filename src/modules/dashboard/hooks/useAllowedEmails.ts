/**
 * TanStack Query Hooks for Allowed Emails Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import {
  getAllowedEmails,
  addAllowedEmail,
  removeAllowedEmail,
} from '../services/adminApi'

export function useAllowedEmails() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['allowed-emails'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/allowed-emails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Failed to fetch allowed emails: ${response.status}`
        )
      }

      return response.json()
    },
    enabled: isAuthenticated,
    retry: 1,
  })
}

export function useAddAllowedEmail() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      email,
      notes,
    }: {
      email: string
      notes?: string
    }) => {
      const token = await getAccessTokenSilently()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/allowed-emails`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, notes }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add email to allowlist')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-emails'] })
    },
  })
}

export function useRemoveAllowedEmail() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ emailId }: { emailId: string }) => {
      const token = await getAccessTokenSilently()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/allowed-emails/${emailId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to remove email from allowlist')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-emails'] })
    },
  })
}

