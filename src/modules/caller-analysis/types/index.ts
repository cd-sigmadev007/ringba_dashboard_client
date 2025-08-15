/**
 * Types for Caller Analysis module
 */

export interface CallData {
  id: string;
  callerId: string;
  lastCall: string;
  duration: string;
  lifetimeRevenue: number;
  campaign: string;
  action: string;
  status: Array<string>;
}

export interface FilterState {
  dateRange: { from?: Date; to?: Date };
  campaignFilter: Array<string>;
  statusFilter: Array<string>;
  durationFilter: string;
  durationRange: { min?: number; max?: number };
  searchQuery: string;
}
