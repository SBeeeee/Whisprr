/**
 * Frontend Timezone Utility Service
 * Handles all time-related operations with consistent timezone support
 */

class FrontendTimezoneService {
  constructor() {
    // Default timezone - can be made user-specific later
    this.defaultTimezone = 'Asia/Kolkata'; // IST
    
    // Detect user's timezone from browser
    this.userTimezone = this.detectUserTimezone();
  }

  /**
   * Detect user's local timezone from browser
   */
  detectUserTimezone() {
    if (typeof window !== 'undefined' && window.Intl) {
      return window.Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return this.defaultTimezone;
  }

  /**
   * Get current time in specified timezone
   */
  now(timezone = this.userTimezone) {
    return new Date().toLocaleString('en-US', { timeZone: timezone });
  }

  /**
   * Format date for display in user's timezone
   */
  formatForDisplay(date, format = 'DD/MM/YYYY HH:mm', timezone = this.userTimezone) {
    const dateObj = new Date(date);
    
    // Basic formatting - can be enhanced with date-fns or moment
    switch (format) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB', { timeZone: timezone });
      case 'HH:mm':
        return dateObj.toLocaleTimeString('en-GB', { 
          timeZone: timezone, 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      case 'DD/MM/YYYY HH:mm':
        return dateObj.toLocaleString('en-GB', { 
          timeZone: timezone,
          hour12: false 
        });
      default:
        return dateObj.toLocaleString('en-GB', { timeZone: timezone });
    }
  }

  /**
   * Get date only part in user's timezone
   */
  getDateOnly(date, timezone = this.userTimezone) {
    return this.formatForDisplay(date, 'DD/MM/YYYY', timezone);
  }

  /**
   * Get time only part in user's timezone
   */
  getTimeOnly(date, timezone = this.userTimezone) {
    return this.formatForDisplay(date, 'HH:mm', timezone);
  }

  /**
   * Convert date to ISO string for API calls
   */
  toISOString(date) {
    return new Date(date).toISOString();
  }

  /**
   * Parse date string and return Date object
   */
  parse(dateString) {
    return new Date(dateString);
  }

  /**
   * Check if date is today in user's timezone
   */
  isToday(date, timezone = this.userTimezone) {
    const today = new Date();
    const checkDate = new Date(date);
    
    return today.toLocaleDateString('en-US', { timeZone: timezone }) === 
           checkDate.toLocaleDateString('en-US', { timeZone: timezone });
  }

  /**
   * Check if date is overdue in user's timezone
   */
  isOverdue(date, timezone = this.userTimezone) {
    return new Date(date) < new Date();
  }

  /**
   * Add days to a date
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Format date for API submission (YYYY-MM-DD format)
   */
  formatForAPI(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get timezone offset information
   */
  getTimezoneInfo(timezone = this.userTimezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value;
    
    return {
      timezone,
      name: timeZoneName,
      offset: now.getTimezoneOffset()
    };
  }

  /**
   * Convert UTC date from API to local timezone for display
   */
  formatAPIDateForDisplay(utcDate, format = 'DD/MM/YYYY HH:mm') {
    return this.formatForDisplay(utcDate, format, this.userTimezone);
  }

  /**
   * Get user's current timezone
   */
  getUserTimezone() {
    return this.userTimezone;
  }

  /**
   * Set user's timezone (for when user selects different timezone)
   */
  setUserTimezone(timezone) {
    this.userTimezone = timezone;
  }
}

// Export singleton instance
export default new FrontendTimezoneService();

// Also export the class for testing
export { FrontendTimezoneService };
