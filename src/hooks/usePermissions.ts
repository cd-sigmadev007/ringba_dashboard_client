/**
 * usePermissions Hook
 * Extracts user permissions from Auth0 ID token claims
 */

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { UserRole } from '../types/auth';

export interface UserPermissions {
  role: UserRole | null;
  org_id: string | null;
  campaign_ids: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function usePermissions(): UserPermissions {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [claims, setClaims] = useState<any>(null);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    const getClaims = async () => {
      if (isAuthenticated) {
        try {
          const tokenClaims = await getIdTokenClaims();
          // Debug: Log all claims to help troubleshoot
          console.log('🔍 Auth0 ID Token Claims:', tokenClaims);
          console.log('🔍 Looking for role in:', {
            'claims.role': tokenClaims?.role,
            'claims.org_id': tokenClaims?.org_id,
            'claims.campaign_ids': tokenClaims?.campaign_ids,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            namespacedRole: tokenClaims?.[`${import.meta.env.VITE_AUTH0_AUDIENCE || ''}/role`],
          });
          setClaims(tokenClaims);
        } catch (error) {
          console.error('Error getting ID token claims:', error);
          setClaims(null);
        }
      } else {
        setClaims(null);
      }
      setClaimsLoading(false);
    };

    getClaims();
  }, [isAuthenticated, getIdTokenClaims]);

  if (isLoading || claimsLoading) {
    return {
      role: null,
      org_id: null,
      campaign_ids: [],
      isAuthenticated: false,
      isLoading: true,
    };
  }

  if (!isAuthenticated || !claims) {
    return {
      role: null,
      org_id: null,
      campaign_ids: [],
      isAuthenticated: false,
      isLoading: false,
    };
  }

  // Extract custom claims from ID token
  // Auth0 namespaces custom claims by audience URL when using an API
  // Try multiple possible claim locations:
  // 1. Namespaced by full audience URL: "https://ringba.api/role"
  // 2. Namespaced by audience path: "/role" (if audience is just path)
  // 3. Direct claims: "role"
  
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';
  
  // Try namespaced claims first (Auth0 default behavior with API/audience)
  const namespacedRole = audience ? claims[`${audience}/role`] : null;
  const namespacedOrgId = audience ? claims[`${audience}/org_id`] : null;
  const namespacedCampaignIds = audience ? claims[`${audience}/campaign_ids`] : null;
  
  // Fallback to direct claims (in case namespacing is disabled)
  const role = (namespacedRole || claims.role || null) as UserRole | null;
  const org_id = (namespacedOrgId || claims.org_id || null) as string | null;
  const campaign_ids = (namespacedCampaignIds || claims.campaign_ids || []) as string[];

  // Debug output
  if (role) {
    console.log('✅ Found role:', role);
  } else {
    console.warn('⚠️ No role found in claims. Available keys:', Object.keys(claims || {}));
  }

  return {
    role,
    org_id,
    campaign_ids,
    isAuthenticated: true,
    isLoading: false,
  };
}

