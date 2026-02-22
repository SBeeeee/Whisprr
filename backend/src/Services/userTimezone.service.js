/**
 * User Timezone Management API
 * Handles timezone preferences for global users
 */

import TimezoneService, { forUser } from '../utils/timezoneService.js';

/**
 * Get or create user timezone preference
 */
export async function getUserTimezone(userId) {
  // This would typically come from your user database
  // For now, return default or stored preference
  
  const userTimezoneMap = {
    // Example: Store user preferences in database
    // 'user123': 'America/New_York',
    // 'user456': 'Europe/London', 
    // 'user789': 'Asia/Tokyo',
  };
  
  return userTimezoneMap[userId] || 'Asia/Kolkata'; // Default to IST
}

/**
 * Create timezone-aware service instance for user
 */
export async function createTimezoneServiceForUser(userId) {
  const userTimezone = await getUserTimezone(userId);
  return forUser(userTimezone);
}

/**
 * Update user timezone preference
 */
export async function updateUserTimezone(userId, timezone) {
  // Save to database
  console.log(`Updating user ${userId} timezone to: ${timezone}`);
  
  // Example database update:
  // await User.findByIdAndUpdate(userId, { timezone });
  
  return true;
}

/**
 * Get timezone info for user
 */
export async function getUserTimezoneInfo(userId) {
  const userTimezone = await getUserTimezone(userId);
  const tzService = forUser(userTimezone);
  
  return {
    timezone: userTimezone,
    currentTime: tzService.now().format('YYYY-MM-DD HH:mm:ss'),
    utcOffset: tzService.getTimezoneOffset(),
    supportedTimezones: TimezoneService.getSupportedTimezones()
  };
}

/**
 * Auto-detect timezone from request (for API endpoints)
 */
export function detectTimezoneFromRequest(req) {
  // Method 1: From user preference (database)
  if (req.user?.timezone) {
    return req.user.timezone;
  }
  
  // Method 2: From client headers
  const clientTimezone = req.headers['x-user-timezone'];
  if (clientTimezone && TimezoneService.isValidTimezone(clientTimezone)) {
    return clientTimezone;
  }
  
  // Method 3: From Accept-Language header (approximate)
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    // Map common languages to timezones
    const languageToTimezone = {
      'en-US': 'America/New_York',
      'en-GB': 'Europe/London',
      'en-AU': 'Australia/Sydney',
      'fr-FR': 'Europe/Paris',
      'de-DE': 'Europe/Berlin',
      'ja-JP': 'Asia/Tokyo',
      'zh-CN': 'Asia/Shanghai',
      'ar-AE': 'Asia/Dubai',
      'hi-IN': 'Asia/Kolkata',
    };
    
    const lang = acceptLanguage.split(',')[0].split(';')[0];
    return languageToTimezone[lang] || 'Asia/Kolkata';
  }
  
  // Method 4: Default fallback
  return 'Asia/Kolkata';
}
