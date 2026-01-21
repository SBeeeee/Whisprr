export function parseVoiceCommand(voiceText) {
  const normalized = voiceText.toLowerCase().trim();
  
  // Detect intent
  const intent = detectIntent(normalized);
  
  // Extract entities based on intent
  const entities = extractEntities(normalized, intent);
  
  // Extract keywords for task matching
  const keywords = extractKeywords(normalized, intent);
  
  return {
    intent,
    entities,
    keywords,
    originalText: voiceText,
  };
}

// ============================================
// INTENT DETECTION
// ============================================

const INTENT_PATTERNS = {
  // TASK OPERATIONS
  CREATE_TASK: [
    /^(create|add|make|new)\s+(a\s+)?(task|todo)/i,
    /^(remind|remember)\s+me\s+to/i,
    /^i\s+need\s+to/i,
    /^(schedule|plan)\s+(a\s+)?task/i,
  ],
  
  MARK_DONE: [
    /^(mark|complete|finish|done|check|tick)\s+(the\s+)?(task|todo)?/i,
    /^(i\s+)?(completed|finished|did)\s+(the\s+)?/i,
    /^(set|mark)\s+.*\s+(as\s+)?(complete|done)/i,
  ],
  
  SHIFT_TOMORROW: [
    /^(shift|move|postpone|reschedule|push)\s+.*\s+to\s+tomorrow/i,
    /^(move|shift)\s+tomorrow/i,
    /^postpone\s+(the\s+)?/i,
    /^(do|complete)\s+.*\s+tomorrow/i,
  ],
  
  // SCHEDULE OPERATIONS
  CREATE_SCHEDULE: [
    /^(create|add|make|schedule)\s+(a\s+)?(meeting|event|appointment|schedule)/i,
    /^schedule\s+me\s+(for|a)/i,
    /^(book|set)\s+(a\s+)?(meeting|appointment)/i,
  ],
  
  MARK_SCHEDULE_DONE: [
    /^(complete|finish|done)\s+(the\s+)?(meeting|event|schedule)/i,
    /^mark\s+.*\s+(meeting|event|schedule)\s+(as\s+)?done/i,
  ],
  
  // TEAM OPERATIONS
  CREATE_TEAM: [
    /^(create|make|start|form|setup)\s+(a\s+)?(new\s+)?(team|group)/i,
    /^(i\s+want\s+to\s+)?(create|make)\s+team/i,
  ],
  
  ADD_TEAM_MEMBER: [
    /^(add|include|invite)\s+.*\s+(to|in)\s+(the\s+)?(team|group)/i,
    /^(make|assign)\s+.*\s+(a\s+)?(member|part)/i,
  ],
  
  // SCRATCHPAD OPERATIONS
  UPDATE_SCRATCHPAD: [
    /^(write|add|update|note|save)\s+(to|in)\s+(my\s+)?(scratchpad|notes)/i,
    /^(quick\s+)?note\s+(down)?/i,
  ],
  
  // QUERY OPERATIONS
  GET_TASKS: [
    /^(show|list|get|fetch|display|what\s+are)\s+(my\s+)?(all\s+)?(tasks|todos)/i,
    /^what\s+(do\s+i\s+have|tasks)/i,
  ],
  
  GET_SCHEDULES: [
    /^(show|list|get|what)\s+(my\s+)?(meetings|events|schedules|calendar)/i,
    /^what('s|\s+is)\s+on\s+my\s+(calendar|schedule)/i,
  ],
  
  GET_ANALYSIS: [
    /^(show|give|get)\s+(me\s+)?(my\s+)?(analysis|stats|statistics|dashboard|overview)/i,
    /^(how\s+am\s+i\s+doing|my\s+progress)/i,
  ],
  
  GET_TEAMS: [
    /^(show|list|get)\s+(my\s+)?(all\s+)?(teams|groups)/i,
    /^what\s+teams\s+(do\s+i\s+have|am\s+i\s+in)/i,
  ],
};

function detectIntent(text) {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(text))) {
      return intent;
    }
  }
  
  return "UNKNOWN";
}

function extractEntities(text, intent) {
  const entities = {};
  
  // Extract common entities
  entities.title = extractTitle(text, intent);
  entities.dueDate = extractDate(text);
  entities.priority = extractPriority(text);
  entities.status = extractStatus(text);
  entities.label = extractLabel(text);
  entities.teamName = extractTeamName(text);
  entities.memberPhone = extractPhone(text);
  entities.role = extractRole(text);
  entities.content = extractContent(text, intent);
  
  // Time extraction for schedules
  if (intent.includes("SCHEDULE")) {
    entities.startTime = extractTime(text, "start");
    entities.endTime = extractTime(text, "end");
    entities.duration = extractDuration(text);
  }
  
  // Clean up null values
  Object.keys(entities).forEach(key => {
    if (entities[key] === null || entities[key] === undefined) {
      delete entities[key];
    }
  });
  
  return entities;
}
function extractTitle(text, intent) {
  // For CREATE_TASK
  if (intent === "CREATE_TASK") {
    // Remove common prefixes
    let title = text
      .replace(/^(create|add|make|new)\s+(a\s+)?(task|todo)\s+(to\s+)?/i, "")
      .replace(/^(remind|remember)\s+me\s+to\s+/i, "")
      .replace(/^i\s+need\s+to\s+/i, "")
      .replace(/^(schedule|plan)\s+(a\s+)?task\s+(to\s+)?/i, "");
    
    // Remove date/time/priority suffixes
    title = title
      .replace(/\s+(by|on|at|before|until)\s+.*/i, "")
      .replace(/\s+(tomorrow|today|tonight|this\s+week)/i, "")
      .replace(/\s+with\s+(high|medium|low)\s+priority/i, "")
      .replace(/\s+(high|medium|low)\s+priority/i, "");
    
    return title.trim() || null;
  }
  
  // For CREATE_SCHEDULE
  if (intent === "CREATE_SCHEDULE") {
    let title = text
      .replace(/^(create|add|make|schedule)\s+(a\s+)?(meeting|event|appointment|schedule)\s+(for\s+)?/i, "")
      .replace(/^schedule\s+me\s+(for|a)\s+/i, "")
      .replace(/^(book|set)\s+(a\s+)?(meeting|appointment)\s+(for\s+)?/i, "");
    
    title = title
      .replace(/\s+(at|on|from|starting)\s+.*/i, "")
      .replace(/\s+(tomorrow|today)/i, "");
    
    return title.trim() || null;
  }
  
  // For MARK_DONE or SHIFT_TOMORROW - extract task name
  if (intent === "MARK_DONE" || intent === "SHIFT_TOMORROW") {
    let title = text
      .replace(/^(mark|complete|finish|done|check|tick)\s+(the\s+)?(task|todo)?\s+/i, "")
      .replace(/^(i\s+)?(completed|finished|did)\s+(the\s+)?/i, "")
      .replace(/^(shift|move|postpone|reschedule|push)\s+/i, "")
      .replace(/\s+(to\s+)?tomorrow/i, "")
      .replace(/\s+(as\s+)?(complete|done)/i, "");
    
    return title.trim() || null;
  }
  
  // For CREATE_TEAM
  if (intent === "CREATE_TEAM") {
    let title = text
      .replace(/^(create|make|start|form|setup)\s+(a\s+)?(new\s+)?(team|group)\s+(called|named)?/i, "");
    
    return title.trim() || null;
  }
  
  return null;
}

function extractDate(text) {
  const now = new Date();
  
  // Today
  if (/\btoday\b/i.test(text)) {
    return now.toISOString();
  }
  
  // Tomorrow
  if (/\btomorrow\b/i.test(text)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }
  
  // Day after tomorrow
  if (/\bday\s+after\s+tomorrow\b/i.test(text)) {
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString();
  }
  
  // This week
  if (/\bthis\s+week\b/i.test(text)) {
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    return endOfWeek.toISOString();
  }
  
  // Next week
  if (/\bnext\s+week\b/i.test(text)) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString();
  }
  
  // Specific days
  const dayMatch = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (dayMatch) {
    const targetDay = dayMatch[1].toLowerCase();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const targetIndex = days.indexOf(targetDay);
    const currentIndex = now.getDay();
    
    let daysToAdd = targetIndex - currentIndex;
    if (daysToAdd <= 0) daysToAdd += 7; // Next occurrence
    
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate.toISOString();
  }
  
  // Date patterns (DD/MM, DD-MM, DD.MM)
  const dateMatch = text.match(/\b(\d{1,2})[\/\-\.](\d{1,2})\b/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]) - 1; // JS months are 0-indexed
    const year = now.getFullYear();
    
    const date = new Date(year, month, day);
    if (date < now) {
      date.setFullYear(year + 1); // Next year if date has passed
    }
    return date.toISOString();
  }
  
  // Relative days (in X days)
  const relativeMatch = text.match(/\bin\s+(\d+)\s+days?\b/i);
  if (relativeMatch) {
    const days = parseInt(relativeMatch[1]);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString();
  }
  
  return null;
}

function extractPriority(text) {
  if (/\b(urgent|critical|asap|important|high)\b/i.test(text)) {
    return "high";
  }
  if (/\blow\s+priority\b/i.test(text)) {
    return "low";
  }
  if (/\bmedium\s+priority\b/i.test(text)) {
    return "medium";
  }
  return null;
}

function extractStatus(text) {
  if (/\bpending\b/i.test(text)) return "pending";
  if (/\b(in\s+progress|ongoing|started)\b/i.test(text)) return "in-progress";
  if (/\b(completed|done|finished)\b/i.test(text)) return "completed";
  return null;
}

function extractLabel(text) {
  const labelMatch = text.match(/\b(work|personal|urgent|home|study|health|shopping|finance)\b/i);
  return labelMatch ? labelMatch[1].toLowerCase() : null;
}

function extractTime(text, type = "start") {
  // 24-hour format (14:30, 09:00)
  const time24Match = text.match(/\b([0-2]?\d):([0-5]\d)\b/);
  if (time24Match) {
    return `${time24Match[1].padStart(2, '0')}:${time24Match[2]}`;
  }
  
  // 12-hour format (2pm, 9:30am)
  const time12Match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (time12Match) {
    let hours = parseInt(time12Match[1]);
    const minutes = time12Match[2] || "00";
    const meridiem = time12Match[3].toLowerCase();
    
    if (meridiem === "pm" && hours !== 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // Named times
  if (type === "start") {
    if (/\bmorning\b/i.test(text)) return "09:00";
    if (/\bnoon\b/i.test(text)) return "12:00";
    if (/\bafternoon\b/i.test(text)) return "14:00";
    if (/\bevening\b/i.test(text)) return "18:00";
    if (/\bnight\b/i.test(text)) return "20:00";
  }
  
  return null;
}

function extractDuration(text) {
  // "for X hours/minutes"
  const durationMatch = text.match(/\bfor\s+(\d+)\s+(hour|minute|hr|min)s?\b/i);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    
    if (unit.startsWith("hour") || unit === "hr") {
      return value * 60; // Return in minutes
    }
    return value;
  }
  
  return null;
}

function extractTeamName(text) {
  const teamMatch = text.match(/\bteam\s+(?:called|named)?\s*["']?([^"']+)["']?/i);
  return teamMatch ? teamMatch[1].trim() : null;
}

function extractPhone(text) {
  // Match 10-digit phone numbers
  const phoneMatch = text.match(/\b(\d{10})\b/);
  return phoneMatch ? phoneMatch[1] : null;
}

function extractRole(text) {
  if (/\b(admin|administrator)\b/i.test(text)) return "admin";
  if (/\b(manager|lead)\b/i.test(text)) return "manager";
  if (/\bmember\b/i.test(text)) return "member";
  return "member"; // Default
}

function extractContent(text, intent) {
  if (intent === "UPDATE_SCRATCHPAD") {
    let content = text
      .replace(/^(write|add|update|note|save)\s+(to|in)\s+(my\s+)?(scratchpad|notes)\s+/i, "")
      .replace(/^(quick\s+)?note\s+(down)?\s+/i, "");
    
    return content.trim() || null;
  }
  return null;
}

// ============================================
// KEYWORD EXTRACTION (for task matching)
// ============================================

function extractKeywords(text, intent) {
  // Remove common words and extract meaningful keywords
  const stopWords = [
    "the", "a", "an", "to", "from", "in", "on", "at", "by", "for",
    "mark", "complete", "finish", "done", "task", "todo", "shift",
    "move", "tomorrow", "as", "i", "my", "me"
  ];
  
  let keywords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .join(" ");
  
  return keywords.trim() || text;
}

// ============================================
// VALIDATION
// ============================================

export function validateCommand(parsedCommand) {
  const { intent, entities } = parsedCommand;
  const errors = [];
  
  // Validate based on intent
  switch (intent) {
    case "CREATE_TASK":
      if (!entities.title) {
        errors.push("Task title is required");
      }
      break;
      
    case "CREATE_SCHEDULE":
      if (!entities.title) {
        errors.push("Schedule title is required");
      }
      break;
      
    case "CREATE_TEAM":
      if (!entities.title && !entities.teamName) {
        errors.push("Team name is required");
      }
      break;
      
    case "ADD_TEAM_MEMBER":
      if (!entities.memberPhone) {
        errors.push("Member phone number is required");
      }
      break;
      
    case "UPDATE_SCRATCHPAD":
      if (!entities.content) {
        errors.push("Content is required");
      }
      break;
      
    case "UNKNOWN":
      errors.push("Could not understand the command");
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}