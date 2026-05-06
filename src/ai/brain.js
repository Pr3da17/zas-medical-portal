const SPECIALTIES = {
  cardio: {
    fr: "cardiologie",
    nl: "cardiologie",
    en: "cardiology",
    keywords: ["cardio", "heart", "hart", "coeur", "heartbeat", "palpitations", "chest", "borst", "tension"]
  },
  geriatrie: {
    fr: "geriatrie",
    nl: "geriatrie",
    en: "geriatrics",
    keywords: ["geriatrie", "geriatrics", "elderly", "senior", "oudere", "older", "grandparent", "ageing"]
  },
  gynaeco: {
    fr: "gynecologie",
    nl: "gynaecologie",
    en: "gynecology",
    keywords: ["gynaecologie", "gynecology", "pregnancy", "zwanger", "maternity", "women", "vrouw", "baby"]
  },
  nko: {
    fr: "orl",
    nl: "nko",
    en: "ent",
    keywords: ["ent", "orl", "nko", "ear", "ears", "nose", "throat", "oor", "keel", "neus", "sinus"]
  },
  ophtalmo: {
    fr: "ophtalmologie",
    nl: "oogheelkunde",
    en: "ophthalmology",
    keywords: ["eye", "eyes", "vision", "sight", "oog", "ogen", "ophtalmo", "ophthalmology", "glasses"]
  },
  ortho: {
    fr: "orthopedie",
    nl: "orthopedie",
    en: "orthopedics",
    keywords: ["bone", "bones", "joint", "joints", "knee", "back", "ortho", "orthopedics", "bot", "gewricht"]
  },
  dermato: {
    fr: "dermatologie",
    nl: "dermatologie",
    en: "dermatology",
    keywords: ["skin", "huid", "rash", "eczema", "eczema", "allergy", "allergie", "dermato", "dermatology"]
  },
  spoed: {
    fr: "urgences",
    nl: "spoed",
    en: "emergency care",
    keywords: ["urgent", "urgence", "emergency", "spoed", "pain", "douleur", "dringend"]
  },
  fysio: {
    fr: "medecine physique",
    nl: "fysische geneeskunde",
    en: "physical medicine",
    keywords: ["physio", "revalidation", "rehabilitation", "movement", "move", "mouvement", "fysio", "kine"]
  }
};

const STEP_BY_REQUEST = {
  appointment: "specialty",
  doctor: "doctor",
  date: "schedule",
  time: "schedule",
  contact: "contact"
};

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function detectIntent(query) {
  if (includesAny(query, ["appointment", "rendez", "afspraak", "book", "make appointment", "prendre rendez-vous"])) {
    return "appointment";
  }
  if (includesAny(query, ["doctor", "arts", "medecin", "specialist", "specialiste"])) {
    return "doctor";
  }
  if (includesAny(query, ["date", "day", "datum", "jour"])) {
    return "date";
  }
  if (includesAny(query, ["time", "hour", "uur", "heure"])) {
    return "time";
  }
  if (includesAny(query, ["phone", "telephone", "gsm", "contact", "telefoon"])) {
    return "contact";
  }
  if (includesAny(query, ["help", "aide", "help me", "hoe", "comment", "how"])) {
    return "help";
  }
  return null;
}

function detectSpecialty(query) {
  return Object.entries(SPECIALTIES).find(([, config]) => includesAny(query, config.keywords))?.[0] || null;
}

function specialtyLabel(id, lang) {
  const config = SPECIALTIES[id];
  if (!config) return id;
  return config[lang] || config.en;
}

function responseByLang(lang, options) {
  return options[lang] || options.en;
}

export const botBrain = {
  async process(input, currentStep, lang) {
    const query = input.toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const specialtyId = detectSpecialty(query);
    if (specialtyId) {
      const label = specialtyLabel(specialtyId, lang);
      return {
        text: responseByLang(lang, {
          fr: `Je pense que le service de ${label} correspond le mieux a votre besoin. Je vous y emmene maintenant.`,
          nl: `Ik denk dat ${label} het best past bij uw vraag. Ik breng u daar nu naartoe.`,
          en: `I think ${label} fits your need best. I will take you there now.`
        }),
        action: "navigate-and-highlight",
        targetStep: "specialty",
        targetId: `spec-${specialtyId}`
      };
    }

    const intent = detectIntent(query);
    if (intent && STEP_BY_REQUEST[intent]) {
      const step = STEP_BY_REQUEST[intent];
      return {
        text: responseByLang(lang, {
          fr: `Bien sur. Je vous guide vers l'etape suivante pour continuer votre rendez-vous.`,
          nl: `Natuurlijk. Ik breng u naar de juiste stap om uw afspraak verder te zetten.`,
          en: `Of course. I will guide you to the right step to continue your appointment.`
        }),
        action: "navigate",
        targetStep: step
      };
    }

    if (intent === "help") {
      const helpTextByStep = {
        profile: responseByLang(lang, {
          fr: "Commencez par choisir votre langue, puis le niveau d'accompagnement qui vous convient.",
          nl: "Kies eerst uw taal en daarna het begeleidingsniveau dat het best bij u past.",
          en: "Start by choosing your language, then select the guidance level that suits you best."
        }),
        specialty: responseByLang(lang, {
          fr: "Choisissez la specialite medicale qui correspond a votre besoin. Je peux aussi vous aider si vous decrivez votre symptome.",
          nl: "Kies het medisch specialisme dat bij uw vraag past. Ik kan ook helpen als u uw symptoom beschrijft.",
          en: "Choose the medical specialty that matches your need. I can also help if you describe your symptom."
        }),
        doctor: responseByLang(lang, {
          fr: "Choisissez ensuite le praticien qui vous convient.",
          nl: "Kies daarna de arts die u wilt bezoeken.",
          en: "Next, choose the doctor you would like to see."
        }),
        schedule: responseByLang(lang, {
          fr: "Selectionnez un horaire disponible dans le planning.",
          nl: "Selecteer een beschikbaar tijdslot in het schema.",
          en: "Select an available time slot in the schedule."
        }),
        contact: responseByLang(lang, {
          fr: "Entrez votre numero de telephone pour recevoir le code de verification.",
          nl: "Vul uw telefoonnummer in om een verificatiecode te ontvangen.",
          en: "Enter your phone number to receive the verification code."
        }),
        verification: responseByLang(lang, {
          fr: "Saisissez le code recu par SMS pour confirmer.",
          nl: "Vul de code uit de sms in om te bevestigen.",
          en: "Enter the code from the SMS to confirm."
        }),
        confirm: responseByLang(lang, {
          fr: "Verifiez le recapitulatif puis confirmez le rendez-vous.",
          nl: "Controleer het overzicht en bevestig daarna de afspraak.",
          en: "Review the summary and then confirm the appointment."
        })
      };

      return { text: helpTextByStep[currentStep] || helpTextByStep.profile };
    }

    return {
      text: responseByLang(lang, {
        fr: "Je peux vous aider a prendre rendez-vous, trouver la bonne specialite ou vous guider vers l'etape suivante.",
        nl: "Ik kan u helpen met een afspraak, het juiste specialisme of de volgende stap op de website.",
        en: "I can help you book an appointment, find the right specialty, or move to the next step on the website."
      })
    };
  }
};
