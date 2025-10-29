/**
 * usePermissions Hook
 * Extracts user permissions from Auth0 token
 */

import { useAuth0 } from '@auth0/auth0-react';
import { UserRole } from '../types/auth';

export interface UserPermissions {
  role: UserRole | null;
  org_id: string | null;
  campaign_ids: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function usePermissions(): UserPermissions {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (!isAuthenticated || !user) {
    return {
      role: null,
      org_id: null,
      campaign_ids: [],
      isAuthenticated: false,
      isLoading,
    };
  }

  // Extract custom claims from user object
  // Custom claims are typically namespaced by audience or directly on user object
  // Adjust this based on your Auth0 Action configuration
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';
  const claimPrefix = audience ? `${audience}/` : '';

  const role = (user[`${claimPrefix}role`] as UserRole) ||
    (user.role as UserRole) ||
    null;
  const org_id = (user[`${claimPrefix}org_id`] as string | null) ||
    (user.org_id as string | null) ||
    null;
  const campaign_ids = (user[`${claimPrefix}campaign_ids`] as string[]) ||
    (user.campaign_ids as string[]) ||
    [];

  return {
    role,
    org_id,
    campaign_ids,
    isAuthenticated: true,
    isLoading,
  };
}

