export function parseVoiceText(transcript) {
    const text = transcript.toLowerCase();
  
    let intent = null;
  
    if (text.includes("done") || text.includes("complete")) {
      intent = "MARK_DONE";
    } 
    else if (text.includes("shift") && text.includes("tomorrow")) {
      intent = "SHIFT_TOMORROW";
    } 
    else if (text.includes("add") || text.includes("create")) {
      intent = "CREATE_TASK";
    }
  
    // 🔹 Clean text
    const cleanedText = text.replace(
      /(mark|done|complete|task|add|create|shift|tomorrow)/g,
      ""
    ).trim();
  
    // 🔹 Basic dueDate logic
    let dueDate = null;
    if (text.includes("tomorrow")) {
      dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else {
      // default = today end
      dueDate = new Date();
    }
  
    return {
      intent,
      keywords: cleanedText, // used for resolveTaskFromVoice
      entities: {
        title: cleanedText || null,
        dueDate,
      },
      rawText: transcript,
    };
  }
  