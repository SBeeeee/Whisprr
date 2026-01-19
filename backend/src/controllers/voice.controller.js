import { executeVoiceAction } from "../Services/voiceAction.service.js";
import { parseVoiceText } from "../Services/voiceParcer.services.js";

export async function voiceCommandController(req, res) {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    // 1️⃣ Parse voice text → intent + entities
    const parsed = parseVoiceText(transcript);

    
    const result = await executeVoiceAction({
      intent: parsed.intent,
      keywords: parsed.keywords,
      entities: parsed.entities,
      userId: req.id, // from auth middleware
    });

    // 3️⃣ Handle confirmation case
    if (result?.needsConfirmation) {
      return res.json({
        success: true,
        needsConfirmation: true,
        tasks: result.tasks,
        message: "Multiple tasks found. Please confirm.",
      });
    }

    // 4️⃣ Success
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

