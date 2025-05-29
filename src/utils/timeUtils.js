// src/utils/timeUtils.js

/**
 * Converts a date to a relative time string
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string (e.g., "Just now", "5 minutes ago", "2 days ago")
 */

export const formatRelativeTime = (date) => {
  // Convert to Date object if it's a string
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now - inputDate) / 1000);

  // Less than 1 minute
  if (seconds < 60) {
    return 'Just now';
  }

  // Less than 1 hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  // Less than 1 day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  // Less than 7 days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  // More than 7 days - show formatted date (DD/MMM)
  return inputDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short'
  }).replace(' ', '-');
};