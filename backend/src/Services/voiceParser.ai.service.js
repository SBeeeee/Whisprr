// ============================================
// VOICE PARSER - AI Fallback (Groq - FREE)
// ============================================

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const VALID_INTENTS = [
  "CREATE_TASK",
  "MARK_DONE",
  "SHIFT_TOMORROW",
  "GET_TASKS",
  "CREATE_SCHEDULE",
  "MARK_SCHEDULE_DONE",
  "GET_SCHEDULES",
  "CREATE_TEAM",
  "ADD_TEAM_MEMBER",
  "GET_TEAMS",
  "UPDATE_SCRATCHPAD",
  "GET_ANALYSIS",
  "UNKNOWN",
];

const SYSTEM_PROMPT = `
You are a voice command parser for a task and schedule app that handles mixed Hindi/English language.

Return ONLY a valid JSON object.
No markdown. No explanation. No extra text.

JSON schema:
{
  "intent": "CREATE_TASK | MARK_DONE | SHIFT_TOMORROW | GET_TASKS | CREATE_SCHEDULE | MARK_SCHEDULE_DONE | GET_SCHEDULES | CREATE_TEAM | ADD_TEAM_MEMBER | GET_TEAMS | UPDATE_SCRATCHPAD | GET_ANALYSIS | UNKNOWN",
  "entities": {
    "title": string | null,
    "dueDate": string | null,
    "priority": "high" | "medium" | "low" | null,
    "teamName": string | null,
    "memberPhone": string | null,
    "role": "admin" | "manager" | "member" | null,
    "content": string | null,
    "startTime": string | null,
    "endTime": string | null,
    "duration": number | null
  },
  "keywords": string
}

Language Handling:
- Understand mixed Hindi/English commands (e.g., "aj ke liye ek task bana de", "kal meeting schedule karo")
- Extract clean titles without command words (remove "bana de", "banao", "schedule karo", etc.)
- Convert Hindi date references: "aj" = today, "kal" = tomorrow, "parso" = day after tomorrow

Date Extraction Rules:
- Convert all dates to ISO format (YYYY-MM-DD)
- Handle formats: "17th of February 2026", "Feb 17 2026", "17/02/2026", "17-02-2026"
- Handle relative dates: "today", "tomorrow", "day after tomorrow", "next week"
- Handle Hindi date words: "aj", "kal", "parso", "is week", "next week"

Title Extraction Rules:
- Remove command words: "task bana de", "task banao", "create task", "make task", "schedule karo", "meeting banao"
- Extract only the actual task/event title
- Keep titles clean and concise

Priority Rules:
- "urgent", "jaldi", "high priority" → high
- "medium priority", "normal" → medium  
- "low priority", "later" → low

Examples:
Input: "aj ke liye ek task bana de shatad"
Output: {"intent": "CREATE_TASK", "entities": {"title": "shatad", "dueDate": "2026-02-08"}, "keywords": "aj ke liye ek task bana de shatad"}

Input: "Ek task bnao cat on 17th of February 2026"  
Output: {"intent": "CREATE_TASK", "entities": {"title": "cat", "dueDate": "2026-02-17"}, "keywords": "Ek task bnao cat on 17th of February 2026"}

If unclear, intent MUST be UNKNOWN.
Phone number must be digits only.
`;

function extractJson(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function normalize(parsed, originalText) {
  if (!parsed || typeof parsed !== "object") return null;

  const intent = VALID_INTENTS.includes(parsed.intent)
    ? parsed.intent
    : "UNKNOWN";

  const entities =
    parsed.entities && typeof parsed.entities === "object"
      ? Object.fromEntries(
          Object.entries(parsed.entities).filter(
            ([, v]) => v !== null && v !== ""
          )
        )
      : {};

  return {
    intent,
    entities,
    keywords:
      typeof parsed.keywords === "string" && parsed.keywords.trim()
        ? parsed.keywords.trim()
        : originalText,
    originalText,
  };
}

export async function parseVoiceCommandWithAI(voiceText) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[Voice AI Parser] GROQ_API_KEY missing");
    return null;
  }

  try {
    const res = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        max_tokens: 300,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `User said: "${voiceText}"\nReturn ONLY JSON.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("[Voice AI Parser] Groq error:", res.status, err);
      return null;
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      console.warn("[Voice AI Parser] Empty response");
      return null;
    }

    const parsed = extractJson(text);
    if (!parsed) {
      console.warn("[Voice AI Parser] JSON parse failed:", text);
      return null;
    }

    return normalize(parsed, voiceText);
  } catch (err) {
    console.warn("[Voice AI Parser] Request failed:", err.message);
    return null;
  }
}
