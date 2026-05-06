export class VoiceSynthesizer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = true;
    this.currentLanguage = 'fr-FR';
  }

  setLanguage(lang) {
    const langMap = {
      fr: 'fr-FR',
      nl: 'nl-BE',
      en: 'en-GB'
    };
    this.currentLanguage = langMap[lang] || 'fr-FR';
  }

  speak(text) {
    if (!this.enabled || !text) return;

    // Stop any current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.9; // Slightly slower for seniors
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  toggle(state) {
    this.enabled = state !== undefined ? state : !this.enabled;
  }
}

export const voice = new VoiceSynthesizer();
