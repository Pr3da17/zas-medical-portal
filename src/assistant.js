export const medicalDictionary = {
  fr: {
    Cardiologie: "Le specialiste du coeur et des vaisseaux sanguins.",
    Ophtalmologie: "Le specialiste des yeux et de la vision.",
    Dermatologie: "Le specialiste de la peau, des cheveux et des ongles.",
    Rhumatologie: "Le specialiste des articulations et des os.",
    Geriatrie: "Le specialiste de la sante des personnes agees.",
    ORL: "Le specialiste des oreilles, du nez et de la gorge."
  },
  nl: {
    Cardiologie: "De specialist voor het hart en de bloedvaten.",
    Oogheelkunde: "De specialist voor de ogen en het gezichtsvermogen.",
    Dermatologie: "De specialist voor de huid, het haar en de nagels.",
    Reumatologie: "De specialist voor de gewrichten en botten.",
    Geriatrie: "De specialist voor de gezondheid van ouderen.",
    NKO: "De specialist voor oren, neus en keel."
  },
  en: {
    Cardiology: "The specialist for the heart and blood vessels.",
    Ophthalmology: "The specialist for the eyes and vision.",
    Dermatology: "The specialist for the skin, hair, and nails.",
    Rheumatology: "The specialist for the joints and bones.",
    Geriatrics: "The specialist for the health of older adults.",
    ENT: "The specialist for the ears, nose, and throat."
  }
};

export function getJulienExplanation(term, lang) {
  const dictionary = medicalDictionary[lang] || medicalDictionary.en;
  return dictionary[term] || null;
}
