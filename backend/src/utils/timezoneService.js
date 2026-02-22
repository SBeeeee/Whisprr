import moment from 'moment-timezone';

/**
 * Centralized Timezone Utility Service
 * Handles all time-related operations with consistent timezone support
 */

class TimezoneService {
  constructor(userTimezone = 'Asia/Kolkata') {
    // Support user-specific timezone or default to IST
    this.defaultTimezone = userTimezone || 'Asia/Kolkata';
    this.currentUserTimezone = userTimezone;
  }

  /**
   * Get current time in specified timezone
   */
  now(timezone = this.defaultTimezone) {
    return moment().tz(timezone);
  }

  /**
   * Convert a date to specific timezone
   */
  toTimezone(date, timezone = this.defaultTimezone) {
    return moment(date).tz(timezone);
  }

  /**
   * Get start of day in specified timezone
   */
  startOfDay(date = new Date(), timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).startOf('day');
  }

  /**
   * Get end of day in specified timezone
   */
  endOfDay(date = new Date(), timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).endOf('day');
  }

  /**
   * Get UTC date range for database queries
   * Returns { start, end } in UTC for given timezone day
   */
  getDayRangeUTC(date = new Date(), timezone = this.defaultTimezone) {
    const localStart = this.startOfDay(date, timezone);
    const localEnd = this.endOfDay(date, timezone);
    
    return {
      start: localStart.utc().toDate(),
      end: localEnd.utc().toDate(),
      startISOString: localStart.utc().toISOString(),
      endISOString: localEnd.utc().toISOString()
    };
  }

  /**
   * Format date for display in user's timezone
   */
  formatForDisplay(date, format = 'DD/MM/YYYY HH:mm', timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).format(format);
  }

  /**
   * Parse date string and convert to UTC
   */
  parseToUTC(dateString, timezone = this.defaultTimezone) {
    return moment.tz(dateString, timezone).utc().toDate();
  }

  /**
   * Add days to a date in specific timezone
   */
  addDays(date, days, timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).add(days, 'days').toDate();
  }

  /**
   * Check if date is today in specified timezone
   */
  isToday(date, timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).isSame(moment().tz(timezone), 'day');
  }

  /**
   * Check if date is overdue in specified timezone
   */
  isOverdue(date, timezone = this.defaultTimezone) {
    return moment(date).tz(timezone).isBefore(moment().tz(timezone));
  }

  /**
   * Get timezone offset in minutes
   */
  getTimezoneOffset(timezone = this.defaultTimezone) {
    return moment().tz(timezone).utcOffset();
  }

  /**
   * Validate if timezone is valid
   */
  isValidTimezone(timezone) {
    return moment.tz.zone(timezone) !== null;
  }

  /**
   * Create timezone service for specific user
   */
  static forUser(userTimezone) {
    return new TimezoneService(userTimezone);
  }

  /**
   * Get list of supported timezones
   */
  static getSupportedTimezones() {
    return [
      // Asia
      'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Shanghai',
      'Asia/Hong_Kong', 'Asia/Seoul', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Manila',
      
      // Europe  
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow', 'Europe/Rome',
      'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Warsaw',
      
      // Americas
      'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Toronto',
      'America/Mexico_City', 'America/Sao_Paulo', 'America/Buenos_Aires',
      
      // Africa
      'Africa/Cairo', 'Africa/Lagos', 'Africa/Johannesburg', 'Africa/Nairobi',
      
      // Oceania
      'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
    ];
  }

  /**
   * Convert database UTC date to user's local timezone for API responses
   */
  formatForAPI(date, userTimezone = this.defaultTimezone) {
    return {
      utc: moment(date).toISOString(),
      local: moment(date).tz(userTimezone).toISOString(),
      formatted: this.formatForDisplay(date, 'DD/MM/YYYY HH:mm', userTimezone),
      dateOnly: this.formatForDisplay(date, 'DD/MM/YYYY', userTimezone),
      timeOnly: this.formatForDisplay(date, 'HH:mm', userTimezone)
    };
  }
}

// Export singleton instance
export default new TimezoneService();

// Also export the class for testing
export { TimezoneService };
