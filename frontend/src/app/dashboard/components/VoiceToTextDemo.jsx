"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
export default function VoiceToTextDemo() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const callVoiceAPI = async (finalTranscript) => {
    try {
      setLoading(true);

     const res=await axiosInstance.post("/voice/command", {
        transcript: finalTranscript,
    });

        const data = res.data;
        if (!data || data.success === false) {
            throw new Error(data?.message || "Something went wrong");
          }
          

      // ✅ SUCCESS
      alert("✅ Kaam ho gaya! Task created 🎉");
      console.log("VOICE RESULT:", data);

    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech Recognition not supported");
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

      // 🔥 CALL BACKEND HERE
      callVoiceAPI(finalText);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #ddd",
      }}
    >
      <h2>🎤 Voice Task Creator</h2>

      <button
        onClick={startListening}
        disabled={listening || loading}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          background: listening ? "#f87171" : "#4f46e5",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {listening ? "Listening..." : loading ? "Processing..." : "Start Speaking"}
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          minHeight: "60px",
          background: "#f9fafb",
          borderRadius: "8px",
          fontSize: "16px",
        }}
      >
        {transcript || "Speak your task..."}
      </div>
    </div>
  );
}
