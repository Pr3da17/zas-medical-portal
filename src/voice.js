export class VoiceAssistant {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = true;
    this.currentLanguage = "en-GB";
    this.isListening = false;
    this.recognition = null;
    this.supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }

  setLanguage(lang) {
    const langMap = {
      fr: "fr-FR",
      nl: "nl-BE",
      en: "en-GB"
    };
    this.currentLanguage = langMap[lang] || "en-GB";
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  speak(text) {
    if (!this.enabled || !text || !this.synth) return;

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    this.synth.speak(utterance);
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  startListening({ onStart, onResult, onError, onEnd } = {}) {
    if (!this.supported) {
      onError?.(new Error("Speech recognition is not supported"));
      return false;
    }

    this.stopListening();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.currentLanguage;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      onStart?.();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        onResult?.(transcript);
      } else {
        onError?.(new Error("Empty transcript"));
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.start();
    return true;
  }
}

export const voice = new VoiceAssistant();
