import type { DurationRange } from '@/components';

// Helper function to parse duration string to seconds
export const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)m\s+(\d+)s/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
};

// Campaign filter matching logic
export const matchesCampaignFilter = (campaign: string, filters: string[]): boolean => {
  if (filters.length === 0) return true;

  // For multiple filters, check if campaign matches any of the selected filters
  return filters.some(filter => {
    // Handle special combinations
    if (filter.includes(',')) {
      const filterParts = filter.split(',').map(part => part.trim());
      // For combinations, check if campaign contains all specified parts
      return filterParts.every(part => campaign.includes(part));
    }

    // For single filters, check if campaign contains the part
    return campaign.includes(filter.trim());
  });
};

// Status filter matching logic
export const matchesStatusFilter = (status: string, filters: string[]): boolean => {
  if (filters.length === 0) return true;
  return filters.some(filter => status.includes(filter));
};

// Duration filter matching logic (legacy)
export const matchesDurationFilter = (duration: string, filter: string): boolean => {
  if (filter === 'all') return true;

  const seconds = parseDuration(duration);

  switch (filter) {
    case 'short':
      return seconds < 60;
    case 'medium':
      return seconds >= 60 && seconds < 180;
    case 'long':
      return seconds >= 180 && seconds < 300;
    case 'very-long':
      return seconds >= 300;
    default:
      return true;
  }
};

// Duration range filter matching logic
export const matchesDurationRange = (duration: string, range: DurationRange): boolean => {
  if (!range.min && !range.max) return true;

  const seconds = parseDuration(duration);

  if (range.min !== undefined && seconds < range.min) {
    return false;
  }

  if (range.max !== undefined && seconds > range.max) {
    return false;
  }

  return true;
};

// Search query matching logic with regex
export const matchesSearchQuery = (callerId: string, searchQuery: string): boolean => {
  if (!searchQuery.trim()) return true;

  try {
    // Create regex pattern - allow for flexible matching
    // Remove any existing + or special chars and create a flexible pattern
    const cleanQuery = searchQuery.replace(/[^\d\s]/g, '');
    const numbers = cleanQuery.split(/\s+/).filter(n => n.length > 0);

    if (numbers.length === 0) return true;

    // Create regex that matches numbers in sequence with optional separators
    const regexPattern = numbers.join('[\\s\\-\\(\\)\\.]*');
    const regex = new RegExp(regexPattern, 'i');

    // Test against caller ID (remove + prefix for matching)
    const cleanCallerId = callerId.replace(/^\+/, '');
    return regex.test(cleanCallerId) || regex.test(callerId);
  } catch (error) {
    // If regex fails, fall back to simple includes
    return callerId.toLowerCase().includes(searchQuery.toLowerCase());
  }
};
