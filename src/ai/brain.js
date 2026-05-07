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

const FAQ_TOPICS = {
  location: {
    step: "contact_page",
    keywords: ["cadix", "address", "adres", "location", "where", "waar", "ou", "route", "campus"]
  },
  bring: {
    step: "documents",
    keywords: ["bring", "meebrengen", "meenemen", "apporter", "need to bring", "what do i need", "what should i bring", "what do i bring", "take with me", "wat breng ik mee", "wat moet ik meenemen", "qu est ce que je dois apporter", "documents", "documenten", "id card", "identiteitskaart", "medication list", "medicatielijst"]
  },
  change: {
    step: "faq",
    keywords: ["change", "edit", "modify", "reschedule", "wijzigen", "aanpassen", "modifier", "deplacer"]
  },
  cancel: {
    step: "faq",
    keywords: ["cancel", "annuleren", "annuler", "delete appointment", "remove appointment"]
  },
  verification: {
    step: "contact",
    keywords: ["verification", "verify", "code", "sms", "email verification", "verification email", "verificatie", "verifier"]
  },
  hours: {
    step: "contact_page",
    keywords: ["hours", "opening", "open", "opening hours", "openingstijden", "uren", "heures", "when can i call"]
  }
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsKeyword(text, keyword) {
  if (keyword.includes(" ")) {
    return text.includes(keyword);
  }

  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return pattern.test(text);
}

function includesAny(text, words) {
  return words.some((word) => containsKeyword(text, word));
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

function detectFaqTopic(query) {
  return Object.entries(FAQ_TOPICS).find(([, config]) => includesAny(query, config.keywords))?.[0] || null;
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

function faqResponse(topic, lang) {
  const responses = {
    location: responseByLang(lang, {
      fr: "ZAS Cadix se trouve a Kattendijkdok-Oostkaai 21, 2000 Anvers. Je vous montre aussi la page Contact avec les coordonnees principales.",
      nl: "ZAS Cadix bevindt zich op Kattendijkdok-Oostkaai 21, 2000 Antwerpen. Ik toon u ook meteen de contactpagina met de belangrijkste gegevens.",
      en: "ZAS Cadix is located at Kattendijkdok-Oostkaai 21, 2000 Antwerp. I will also show you the contact page with the key details."
    }),
    bring: responseByLang(lang, {
      fr: "Pour votre rendez-vous, prevoyez surtout votre carte d'identite, votre confirmation, vos documents medicaux utiles et votre liste de medicaments si necessaire. Je vous montre la page Documents avec la checklist essentielle.",
      nl: "Breng voor uw afspraak vooral uw identiteitskaart, uw bevestiging, relevante medische documenten en indien nodig uw medicatielijst mee. Ik toon u de pagina Documenten met de belangrijkste checklist.",
      en: "For your appointment, please bring your ID card, your confirmation, any relevant medical documents, and your medication list if needed. I will show you the Documents page with the essential checklist."
    }),
    change: responseByLang(lang, {
      fr: "Oui, vous pouvez modifier un rendez-vous depuis l'accueil via le bouton Modifier. Je vous montre aussi la FAQ ou cela est explique clairement.",
      nl: "Ja, u kunt een afspraak wijzigen vanaf de startpagina via de knop Wijzigen. Ik toon u ook de FAQ waar dit duidelijk uitgelegd staat.",
      en: "Yes, you can change an appointment from the home screen with the Edit button. I will also show you the FAQ where this is explained clearly."
    }),
    cancel: responseByLang(lang, {
      fr: "Oui, vous pouvez annuler un rendez-vous depuis l'accueil avec le bouton Annuler. Je vous dirige aussi vers la FAQ pour cette information.",
      nl: "Ja, u kunt een afspraak annuleren vanaf de startpagina met de knop Annuleren. Ik stuur u ook naar de FAQ voor deze uitleg.",
      en: "Yes, you can cancel an appointment from the home screen with the Cancel button. I will also take you to the FAQ for this information."
    }),
    verification: responseByLang(lang, {
      fr: "Vous pouvez maintenant verifier par telephone ou par e-mail. Sur l'etape Contact, vous choisissez la methode qui vous convient.",
      nl: "U kunt nu verifieren via telefoon of via e-mail. In de stap Contact kiest u de methode die voor u het best werkt.",
      en: "You can now verify by phone or by email. In the Contact step, you can choose the method that works best for you."
    }),
    hours: responseByLang(lang, {
      fr: "Le support de ZAS Cadix est disponible du lundi au vendredi de 08:00 a 18:00. Je vous montre aussi la page Contact.",
      nl: "De ondersteuning van ZAS Cadix is beschikbaar van maandag tot vrijdag van 08:00 tot 18:00. Ik toon u ook meteen de contactpagina.",
      en: "ZAS Cadix support is available from Monday to Friday, 08:00 to 18:00. I will also show you the Contact page."
    })
  };

  return responses[topic];
}

export const botBrain = {
  async process(input, currentStep, lang) {
    const query = input.toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const faqTopic = detectFaqTopic(query);
    if (faqTopic) {
      return {
        text: faqResponse(faqTopic, lang),
        action: "navigate",
        targetStep: FAQ_TOPICS[faqTopic].step
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
          fr: "Entrez votre numero de telephone ou votre adresse e-mail pour recevoir le code de verification.",
          nl: "Vul uw telefoonnummer of e-mailadres in om een verificatiecode te ontvangen.",
          en: "Enter your phone number or email address to receive the verification code."
        }),
        verification: responseByLang(lang, {
          fr: "Saisissez le code recu par SMS ou par e-mail pour confirmer.",
          nl: "Vul de code uit de sms of e-mail in om te bevestigen.",
          en: "Enter the code from the SMS or email to confirm."
        }),
        confirm: responseByLang(lang, {
          fr: "Verifiez le recapitulatif puis confirmez le rendez-vous.",
          nl: "Controleer het overzicht en bevestig daarna de afspraak.",
          en: "Review the summary and then confirm the appointment."
        }),
        documents: responseByLang(lang, {
          fr: "Sur cette page, vous voyez les documents essentiels, votre prochaine visite et ce qu'il faut preparer avant de venir.",
          nl: "Op deze pagina ziet u de belangrijkste documenten, uw volgende bezoek en wat u best voorbereidt voor u komt.",
          en: "On this page, you can review the essential documents, your next visit, and what to prepare before you come."
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
