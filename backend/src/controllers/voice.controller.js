import { executeVoiceAction } from "../Services/voiceAction.service.js";
import { parseVoiceCommandWithFallback, validateCommand } from "../Services/voiceParcer.services.js";
import { executeConfirmedAction } from "../Services/voiceAction.service.js";
/**
 * Main voice command controller
 * Handles voice text parsing and action execution
 */
export async function voiceCommandController(req, res) {
  try {
    const { transcript } = req.body;
    const userId = req.id; // from auth middleware

    // ✅ Validate input
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid transcript is required",
      });
    }

    if (transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Transcript cannot be empty",
      });
    }

    // ✅ Log for debugging (optional - remove in production)
    console.log(`[Voice Command] User: ${userId} | Input: "${transcript}"`);

    // 1️⃣ Parse voice text → intent + entities (regex first, then AI fallback for UNKNOWN)
    const parsed = await parseVoiceCommandWithFallback(transcript);

    // ✅ Log parsed result
    console.log(`[Voice Command] Parsed:`, {
      intent: parsed.intent,
      entities: parsed.entities,
      keywords: parsed.keywords,
    });

    // 2️⃣ Validate parsed command
    const validation = validateCommand(parsed);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(", "),
        intent: parsed.intent, // Send back for frontend debugging
        suggestion: getSuggestionForIntent(parsed.intent),
      });
    }

    // 3️⃣ Execute action
    const result = await executeVoiceAction({
      intent: parsed.intent,
      keywords: parsed.keywords,
      entities: parsed.entities,
      userId,
    });

    // 4️⃣ Handle confirmation case (ambiguous commands)
    if (result?.needsConfirmation) {
      return res.status(200).json({
        success: true,
        needsConfirmation: true,
        action: result.action,
        message: result.message || "Multiple items found. Please confirm.",
        options: result.tasks || result.schedules || [],
        // Keep parsed data for confirmation
        parsedCommand: {
          intent: parsed.intent,
          keywords: parsed.keywords,
        },
      });
    }

    // 5️⃣ Success response
    return res.status(200).json({
      success: true,
      message: result.message || "Command executed successfully",
      action: result.action,
      data: result.data,
      // Optional: include parsed command for transparency
      debug: {
        intent: parsed.intent,
        entities: parsed.entities,
      },
    });

  } catch (error) {
    console.error("[Voice Command Error]", {
      error: error.message,
      stack: error.stack,
      userId: req.id,
      transcript: req.body.transcript,
    });
     const statusCode = error.isOperational ? 400 : 500;    
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to process voice command",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

/**
 * Handle confirmation for ambiguous commands
 * POST /api/voice/confirm
 */
export async function voiceConfirmationController(req, res) {
  try {
    const { itemId, action } = req.body;
    const userId = req.id;

    // ✅ Validate input
    if (!itemId || !action) {
      return res.status(400).json({
        success: false,
        message: "Item ID and action are required",
      });
    }

  
   
    const result = await executeConfirmedAction(itemId, action, userId);

    return res.status(200).json({
      success: true,
      message: `${action} completed successfully`,
      data: result,
    });

  } catch (error) {
    console.error("[Voice Confirmation Error]", {
      error: error.message,
      userId: req.id,
      itemId: req.body.itemId,
      action: req.body.action,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm action",
    });
  }
}


function getSuggestionForIntent(intent) {
  const suggestions = {
    CREATE_TASK: "Try: 'Create a task to [task name] [by date] [with priority]'",
    MARK_DONE: "Try: 'Mark [task name] as done'",
    SHIFT_TOMORROW: "Try: 'Shift [task name] to tomorrow'",
    CREATE_SCHEDULE: "Try: 'Schedule [event name] at [time] [on date]'",
    CREATE_TEAM: "Try: 'Create a team called [team name]'",
    ADD_TEAM_MEMBER: "Try: 'Add [phone number] to [team name]'",
    UPDATE_SCRATCHPAD: "Try: 'Write to scratchpad: [your note]'",
    GET_TASKS: "Try: 'Show my tasks' or 'Show today's tasks'",
    GET_SCHEDULES: "Try: 'Show my calendar' or 'What's on my schedule?'",
    GET_ANALYSIS: "Try: 'Show my analysis' or 'Give me my stats'",
    UNKNOWN: "I didn't understand that. Try commands like 'Create a task', 'Show my tasks', or 'Schedule a meeting'",
  };

  return suggestions[intent] || suggestions.UNKNOWN;
}
