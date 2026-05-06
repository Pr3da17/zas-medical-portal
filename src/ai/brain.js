/**
 * ZAS Antwerpen - IA Sémantique Pro (Simulateur LLM)
 */

const MEDICAL_MAP = {
  cardio: ['cœur', 'coeur', 'tension', 'poitrine', 'palpitations', 'hart', 'cardiologue'],
  geriatrie: ['vieux', 'âgé', 'senior', 'grand-parent', 'vieillesse', 'ouder', 'geriatrie'],
  gynaeco: ['femme', 'enceinte', 'bébé', 'grossesse', 'maternité', 'vrouw', 'gynaecologie'],
  nko: ['oreille', 'gorge', 'nez', 'audition', 'sinus', 'oor', 'neus', 'keel', 'nko'],
  ophtalmo: ['yeux', 'vue', 'vision', 'lunettes', 'ophtalmo', 'oogheelkunde', 'oog'],
  ortho: ['os', 'fracture', 'genou', 'dos', 'articulation', 'botten', 'orthopedie'],
  dermato: ['peau', 'boutons', 'allergie', 'eczéma', 'huidziekten', 'dermato'],
  spoed: ['urgence', 'mal', 'douleur', 'vite', 'dringend', 'spoed'],
  fysio: ['rééducation', 'kiné', 'mouvement', 'physio', 'revalidatie']
};

export const botBrain = {
  async process(input, currentStep, lang) {
    const query = input.toLowerCase();
    
    // Simulation de réflexion IA
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 1. Recherche d'intention médicale (Moteur de synonymes)
    for (const [id, keywords] of Object.entries(MEDICAL_MAP)) {
      if (keywords.some(k => query.includes(k))) {
        return {
          text: this.getEmpathicResponse(id, lang),
          action: 'highlight',
          targetId: `spec-${id}`,
          specialtyId: id
        };
      }
    }

    // 2. Questions sur le fonctionnement
    if (query.includes('comment') || query.includes('aide') || query.includes('hoe')) {
      return {
        text: lang === 'nl' ? "Ik help u bij elke stap. Klik op de grote witte kaarten om uw keuze te maken." : "Je suis là pour vous guider. Cliquez simplement sur les grandes cartes blanches pour faire votre choix."
      };
    }

    // 3. Réponse par défaut (Empathique)
    return {
      text: lang === 'nl' ? "Ik heb uw vraag niet helemaal begrepen, maar ik ben er om u te helpen bij uw afspraak." : "Je n'ai pas tout à fait saisi, mais je suis là pour vous accompagner dans votre prise de rendez-vous."
    };
  },

  getEmpathicResponse(id, lang) {
    const responses = {
      fr: `Je comprends. Pour ce type de besoin, c'est le service de ${id.toUpperCase()} qui est le plus adapté. J'ai mis le bouton en évidence pour vous ci-dessous.`,
      nl: `Ik begrijp het. Voor dit type zorg is de afdeling ${id.toUpperCase()} het meest geschikt. Ik heb de knop hieronder voor u gemarkeerd.`
    };
    return responses[lang] || responses['fr'];
  }
};
