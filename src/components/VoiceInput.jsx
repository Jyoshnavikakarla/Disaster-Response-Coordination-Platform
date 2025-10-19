import React, { useState, useEffect } from "react";

export default function VoiceInput({ onResult }) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  let recognition;

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setText(result);
      if (onResult) onResult(result);
    };
  }, []);

  const startListening = () => recognition.start();

  return (
    <div className="voice-input">
      <button onClick={startListening} disabled={listening}>
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
      {text && (
        <p>
          <strong>You said:</strong> {text}
        </p>
      )}
    </div>
  );
}
