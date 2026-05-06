export const medicalDictionary = {
  fr: {
    "Cardiologie": "Le spécialiste du cœur et des vaisseaux sanguins.",
    "Ophtalmologie": "Le spécialiste des yeux et de la vision.",
    "Dermatologie": "Le spécialiste de la peau, des cheveux et des ongles.",
    "Rhumatologie": "Le spécialiste des articulations et des os.",
    "Gériatrie": "Le spécialiste de la santé des personnes âgées.",
    "ORL": "Le spécialiste des oreilles, du nez et de la gorge."
  },
  nl: {
    "Cardiologie": "De specialist voor het hart en de bloedvaten.",
    "Oftalmologie": "De specialist voor de ogen en het gezichtsvermogen.",
    "Dermatologie": "De specialist voor de huid, het haar en de nagels.",
    "Reumatologie": "De specialist voor de gewrichten en botten.",
    "Geriatrie": "De specialist voor de gezondheid van ouderen.",
    "NKO": "De specialist voor oren, neus en keel."
  },
  en: {
    "Cardiology": "The specialist for the heart and blood vessels.",
    "Ophthalmology": "The specialist for the eyes and vision.",
    "Dermatology": "The specialist for skin, hair, and nails.",
    "Rheumatology": "The specialist for joints and bones.",
    "Geriatrics": "The specialist for the health of the elderly.",
    "ENT": "The specialist for the ears, nose, and throat."
  }
};

export function getJulienExplanation(term, lang) {
  const dictionary = medicalDictionary[lang] || medicalDictionary.fr;
  return dictionary[term] || null;
}
