import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, X, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";

// Card Component
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

// Modal Component
function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-[95%] max-w-lg max-h-[90vh] overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-72px)]">
          {children}
        </div>
      </Card>
    </div>
  );
}

// Main Voice Command Component
export default function VoiceCommandInterface() {
  const [inputMode, setInputMode] = useState("voice"); // "voice" or "text"
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  const textInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Focus text input when switching to text mode
  useEffect(() => {
    if (inputMode === "text" && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [inputMode]);

  const callVoiceAPI = async (commandText) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/voice/command", {
        transcript: commandText,
      });

      const data = response.data;

      if (!data || data.success === false) {
        throw new Error(data?.message || "Something went wrong");
      }

      // Check if confirmation is needed
      if (data.needsConfirmation) {
        setConfirmationData(data);
        setShowConfirmation(true);
      } else {
        // Success
        toast.success(data.message);
        console.log("VOICE RESULT:", data);
        setTranscript("");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message;
      toast.error("❌ Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation using axiosInstance
  const handleConfirmation = async (selectedItem) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/voice/confirm", {
        itemId: selectedItem.id,
        action: confirmationData.action,
      });

      const data = response.data;

      if (!data || data.success === false) {
        throw new Error(data?.message || "Confirmation failed");
      }

      toast.error(`✅ ${data.message}`);
      setShowConfirmation(false);
      setConfirmationData(null);
      setTranscript("");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message;
      toast.error("❌ Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  

  // Start voice recognition
  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Speech Recognition not supported in your browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      const finalText = event.results[0][0].transcript;
      setTranscript(finalText);
      callVoiceAPI(finalText);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
      toast.error("Voice recognition error. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    if (transcript.trim()) {
      callVoiceAPI(transcript.trim());
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎤 Voice Command Assistant
          </h1>
          <p className="text-gray-600">
            Speak or type your command to manage tasks
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 inline-flex">
            <button
              onClick={() => setInputMode("voice")}
              disabled={loading || listening}
              className={`px-6 py-2 rounded-full transition-all ${
                inputMode === "voice"
                  ? "bg-white shadow-md text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Voice
            </button>
            <button
              onClick={() => setInputMode("text")}
              disabled={loading || listening}
              className={`px-6 py-2 rounded-full transition-all ${
                inputMode === "text"
                  ? "bg-white shadow-md text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              ✍️ Type
            </button>
          </div>
        </div>

        {/* Voice Mode */}
        {inputMode === "voice" && (
          <div className="text-center">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={loading}
              className={`mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                listening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : loading
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } shadow-lg`}
            >
              {loading ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : listening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>

            <p className="text-sm text-gray-600 mb-4">
              {listening
                ? "Listening... Speak now"
                : loading
                ? "Processing your command..."
                : "Click the mic to start speaking"}
            </p>

            {transcript && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-500 mb-1">You said:</p>
                <p className="text-gray-800 font-medium">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {/* Text Mode */}
        {inputMode === "text" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                ref={textInputRef}
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleTextSubmit();
                  }
                }}
                placeholder="Type your command here..."
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleTextSubmit}
                disabled={loading || !transcript.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Example commands:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Create a task to review code by tomorrow</li>
                <li>Mark testing as done</li>
                <li>Show my tasks</li>
                <li>Schedule meeting at 3pm</li>
              </ul>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <Modal
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title={confirmationData?.message || "Please Confirm"}
        >
          <div className="space-y-3">
            {confirmationData?.options?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleConfirmation(item)}
                disabled={loading}
                className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h4>
                    <div className="flex gap-3 text-xs text-gray-500">
                      {item.dueDate && (
                        <span>📅 {formatDate(item.dueDate)}</span>
                      )}
                      {item.priority && (
                        <span
                          className={`px-2 py-1 rounded ${
                            item.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : item.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.priority}
                        </span>
                      )}
                      {item.start && (
                        <span>
                          🕐 {new Date(item.start).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      </Card>
    </div>
  );
}
