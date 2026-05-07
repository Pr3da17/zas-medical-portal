export class VoiceAssistant {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = true;
    this.currentLanguage = "en-GB";
    this.isListening = false;
    this.recognition = null;
    this.supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    
    if (this.synth) {
      // Warm up voices
      this.synth.getVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          console.log("Voix chargées :", this.synth.getVoices().length);
        };
      }
    }
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

    // Chrome has a bug where calling cancel() and speak() synchronously cancels the new utterance too.
    this.synth.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.currentLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = this.currentLanguage.split('-')[0];
        const preferredVoice = voices.find(v => v.lang === this.currentLanguage) || 
                               voices.find(v => v.lang.startsWith(langPrefix)) ||
                               voices[0]; // Fallback to any voice if language doesn't match
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => console.log("Début de la synthèse vocale...");
      utterance.onerror = (e) => {
        if (e.error !== 'canceled') {
          console.error("Erreur de la synthèse vocale :", e.error || e);
        }
      };
      
      // Workaround for Chrome/Safari garbage collection bug
      window.speechUtterances = window.speechUtterances || [];
      window.speechUtterances.push(utterance);
      // Keep array small to avoid memory leaks
      if (window.speechUtterances.length > 10) window.speechUtterances.shift();

      this.synth.speak(utterance);
    }, 50);
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
