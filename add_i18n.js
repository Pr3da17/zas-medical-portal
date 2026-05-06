import fs from 'fs';

const translations = {
  cat_urgent_lab: { fr: "🚨 Urgences & Examens Rapides", nl: "🚨 Spoed & Onderzoeken", en: "🚨 ER & Rapid Tests" },
  cat_organs: { fr: "🫀 Organes & Médecine Interne", nl: "🫀 Organen & Interne Geneeskunde", en: "🫀 Organs & Internal Medicine" },
  cat_movement: { fr: "🦴 Mouvement & Squelette", nl: "🦴 Beweging & Skelet", en: "🦴 Movement & Skeleton" },
  cat_family: { fr: "👶 Femme, Enfant & Famille", nl: "👶 Vrouw, Kind & Gezin", en: "👶 Women, Child & Family" },
  cat_brain: { fr: "🧠 Cerveau & Bien-être", nl: "🧠 Hersenen & Welzijn", en: "🧠 Brain & Wellbeing" },
  cat_surgery: { fr: "🏥 Soins Spécifiques & Chirurgie", nl: "🏥 Specifieke Zorg & Heelkunde", en: "🏥 Specific Care & Surgery" },

  spec_spoed: { fr: "Urgences sur RDV", nl: "SPOED op AFSPRAAK", en: "ER by Appointment" },
  spec_labo: { fr: "Laboratoire / Prise de sang", nl: "Laboratorium / Bloedafname", en: "Laboratory / Blood test" },
  spec_radio: { fr: "Imagerie / Radiologie", nl: "Medische beeldvorming / Radiologie", en: "Medical Imaging / Radiology" },
  spec_nuc: { fr: "Médecine Nucléaire", nl: "Nucleaire geneeskunde", en: "Nuclear Medicine" },
  spec_zorg: { fr: "Planification / Questionnaire", nl: "Zorgtrajectplanning / POS", en: "Care Planning / POS" },

  spec_inwendige: { fr: "Médecine interne", nl: "Algemene inwendige geneeskunde", en: "Internal Medicine" },
  spec_hema: { fr: "Hématologie (Maladies du sang)", nl: "Bloedziekten / Hematologie", en: "Hematology" },
  spec_cardio: { fr: "Cardiologie", nl: "Hart- en vaatziekten / Cardiologie", en: "Cardiology" },
  spec_endo: { fr: "Endocrinologie (Hormones)", nl: "Hormoonziekten / Endocrinologie", en: "Endocrinology" },
  spec_dermato: { fr: "Dermatologie (Peau)", nl: "Huidziekten / Dermatologie", en: "Dermatology" },
  spec_pneumo: { fr: "Pneumologie (Poumons)", nl: "Longziekten / Pneumologie", en: "Pneumology" },
  spec_gastro: { fr: "Gastro-entérologie", nl: "Maag-, Darm- en Leverziekten", en: "Gastroenterology" },
  spec_nefro: { fr: "Néphrologie (Reins)", nl: "Nierziekten / Nefrologie", en: "Nephrology" },
  spec_nko_euro: { fr: "ORL (Institut Européen)", nl: "NKO - European Institute for ORL", en: "ENT - European Institute" },
  spec_nko: { fr: "ORL (Nez, Gorge, Oreilles)", nl: "NKO - Neus-, Keel en Oorziekten", en: "ENT" },
  spec_ophtalmo: { fr: "Ophtalmologie (Yeux)", nl: "Oogheelkunde / Oftalmologie", en: "Ophthalmology" },
  spec_uro: { fr: "Urologie", nl: "Urologie", en: "Urology" },

  spec_fysio: { fr: "Médecine physique / Rééducation", nl: "Fysische geneeskunde / Revalidatie", en: "Physical Medicine / Rehab" },
  spec_hand: { fr: "Centre de la Main", nl: "Handcentrum", en: "Hand Center" },
  spec_ortho: { fr: "Orthopédie", nl: "Orthopedie", en: "Orthopedics" },
  spec_podo: { fr: "Podologie", nl: "Podologie", en: "Podiatry" },
  spec_reuma: { fr: "Rhumatologie", nl: "Reumatologie", en: "Rheumatology" },

  spec_gender: { fr: "Centre Transgenre", nl: "Centrum voor Genderzorg", en: "Center for Gender Care" },
  spec_genetica: { fr: "Génétique", nl: "Genetica / Erfelijkheid", en: "Genetics" },
  spec_gynaeco: { fr: "Gynécologie / Obstétrique", nl: "Gynaecologie / Verloskunde", en: "Gynecology / Obstetrics" },
  spec_pediatrie: { fr: "Pédiatrie", nl: "Kindergeneeskunde / Pediatrie", en: "Pediatrics" },
  spec_vroed: { fr: "Sages-femmes / Grossesse", nl: "Vroedvrouwen / Zwangerschap", en: "Midwives / Pregnancy" },
  spec_fertiliteit: { fr: "Fertilité", nl: "Vruchtbaarheid / Fertiliteit", en: "Fertility" },

  spec_neuro: { fr: "Neurologie", nl: "Neurologie / Zenuwziekten", en: "Neurology" },
  spec_geriatrie: { fr: "Gériatrie", nl: "Ouderenzorg / Geriatrie", en: "Geriatrics" },
  spec_pijn: { fr: "Clinique de la douleur", nl: "Pijngeneeskunde", en: "Pain Medicine" },
  spec_psy: { fr: "Psychiatrie Adultes", nl: "Psychiatrie Volwassenen", en: "Adult Psychiatry" },
  spec_stress: { fr: "Clinique du Stress", nl: "Stresskliniek", en: "Stress Clinic" },

  spec_thoracale: { fr: "Chirurgie Thoracale", nl: "Algemene & Thoracale heelkunde", en: "Thoracic Surgery" },
  spec_heelkunde: { fr: "Chirurgie Générale", nl: "Algemene Heelkunde", en: "General Surgery" },
  spec_brand: { fr: "Centre des Brûlés", nl: "Brandwondencentrum", en: "Burn Center" },
  spec_hartchir: { fr: "Chirurgie Cardiaque", nl: "Hartchirurgie / Cardiochirurgie", en: "Cardiac Surgery" },
  spec_mka: { fr: "Stomatologie / Maxillo-faciale", nl: "Mond-, Kaak- en Aangezichtsheelkunde", en: "Maxillofacial Surgery" },
  spec_neurochir: { fr: "Neurochirurgie", nl: "Neurochirurgie", en: "Neurosurgery" },
  spec_obesitas: { fr: "Centre de l'Obésité", nl: "Obesitascentrum", en: "Obesity Center" },
  spec_onco: { fr: "Oncologie (Cancer)", nl: "Oncologisch Centrum", en: "Oncology Center" },
  spec_plastische: { fr: "Chirurgie Plastique", nl: "Plastische heelkunde", en: "Plastic Surgery" },
  spec_vaat: { fr: "Chirurgie Vasculaire", nl: "Vaatheelkunde", en: "Vascular Surgery" },
  spec_wond: { fr: "Soins des plaies", nl: "Wondzorg / Stomazorg", en: "Wound Care" }
};

let content = fs.readFileSync('src/i18n.js', 'utf8');

for (const lang of ['fr', 'nl', 'en']) {
  let toInject = "";
  for (const key in translations) {
    toInject += `    ${key}: "${translations[key][lang]}",\n`;
  }
  
  // Find where to inject (at the end of each language object, before the closing '},')
  // We can look for 'menu_news: "Nouveautés"' for fr, 'menu_news: "Nieuws"' for nl...
  // Or simply replace the line containing menu_news: "..." with menu_news: "...", \n + toInject
  
  const regex = new RegExp(`(menu_news: ".*?")`);
  content = content.replace(regex, (match) => {
    // Only replace the first match for the corresponding language block
    return `${match},\n${toInject}`;
  });
}

// Since JS string replace only replaces the first occurrence, the first call replaces fr, then nl, then en.
// Actually, it's better to do a global replace carefully, or just parse properly.

// Let's do it safer:
let newContent = fs.readFileSync('src/i18n.js', 'utf8');
const lines = newContent.split('\n');
const result = [];
for(let i=0; i<lines.length; i++) {
  result.push(lines[i]);
  if(lines[i].includes('menu_news:')) {
    let lang = 'en';
    if(lines[i].includes('Nouveautés')) lang = 'fr';
    if(lines[i].includes('Nieuws')) lang = 'nl';
    
    let toInject = "";
    for (const key in translations) {
      toInject += `    ${key}: "${translations[key][lang]}",\n`;
    }
    result[result.length - 1] += ','; // add comma to previous line
    result.push(toInject.trimEnd());
  }
}

fs.writeFileSync('src/i18n.js', result.join('\n'));
console.log("i18n.js updated successfully!");
