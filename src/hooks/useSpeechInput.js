import { useState, useRef } from "react";

export function useSpeechInput(initialValue = "") {
  const [text, setText] = useState(initialValue);
  const [listening, setListening] = useState(false);
  const ref = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      if (ref.current) ref.current.value = spokenText;
    };

    recognition.start();
  };

  return { text, setText, listening, startListening, ref };
}
