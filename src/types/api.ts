// API Response types matching the backend
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Frontend compatible types (mapping phNumber to callerId)
export interface FrontendCallerData {
  id: string;
  callerId: string; // maps from phNumber
  lastCall: string;
  duration: string; // formatted duration
  lifetimeRevenue: number;
  campaign: string;
  action: string;
  status: string[];
  transcript?: string;
  audioUrl?: string;
  revenue?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  type?: string | null;
  address?: string | null;
  billed?: string | null;
  latestPayout?: string | null;
  ringbaCost?: number | null;
  adCost?: number | null;
}

// Query parameters for filtering
export interface CallerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  campaign?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  durationMin?: number;
  durationMax?: number;
}
