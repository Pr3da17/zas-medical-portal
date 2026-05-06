/**
 * ZAS Antwerpen - Base de données étendue
 */

export const db = {
  hospitals: [
    { id: 'nord', name: 'ZAS Campus Nord' },
    { id: 'cadix', name: 'ZAS Cadix' },
    { id: 'middelheim', name: 'ZAS Middelheim' },
    { id: 'vincentius', name: 'ZAS Sint-Vincentius' }
  ],
  
  specialties: [
    { id: 'spoed', key: 'spec_spoed', category: 'cat_urgent_lab' },
    { id: 'labo', key: 'spec_labo', category: 'cat_urgent_lab' },
    { id: 'radio', key: 'spec_radio', category: 'cat_urgent_lab' },
    { id: 'nuc', key: 'spec_nuc', category: 'cat_urgent_lab' },
    { id: 'zorg', key: 'spec_zorg', category: 'cat_urgent_lab' },
    
    { id: 'inwendige', key: 'spec_inwendige', category: 'cat_organs' },
    { id: 'hema', key: 'spec_hema', category: 'cat_organs' },
    { id: 'cardio', key: 'spec_cardio', category: 'cat_organs' },
    { id: 'endo', key: 'spec_endo', category: 'cat_organs' },
    { id: 'dermato', key: 'spec_dermato', category: 'cat_organs' },
    { id: 'pneumo', key: 'spec_pneumo', category: 'cat_organs' },
    { id: 'gastro', key: 'spec_gastro', category: 'cat_organs' },
    { id: 'nefro', key: 'spec_nefro', category: 'cat_organs' },
    { id: 'nko_euro', key: 'spec_nko_euro', category: 'cat_organs' },
    { id: 'nko', key: 'spec_nko', category: 'cat_organs' },
    { id: 'ophtalmo', key: 'spec_ophtalmo', category: 'cat_organs' },
    { id: 'uro', key: 'spec_uro', category: 'cat_organs' },
    
    { id: 'fysio', key: 'spec_fysio', category: 'cat_movement' },
    { id: 'hand', key: 'spec_hand', category: 'cat_movement' },
    { id: 'ortho', key: 'spec_ortho', category: 'cat_movement' },
    { id: 'podo', key: 'spec_podo', category: 'cat_movement' },
    { id: 'reuma', key: 'spec_reuma', category: 'cat_movement' },
    
    { id: 'gender', key: 'spec_gender', category: 'cat_family' },
    { id: 'genetica', key: 'spec_genetica', category: 'cat_family' },
    { id: 'gynaeco', key: 'spec_gynaeco', category: 'cat_family' },
    { id: 'pediatrie', key: 'spec_pediatrie', category: 'cat_family' },
    { id: 'vroed', key: 'spec_vroed', category: 'cat_family' },
    { id: 'fertiliteit', key: 'spec_fertiliteit', category: 'cat_family' },
    
    { id: 'neuro', key: 'spec_neuro', category: 'cat_brain' },
    { id: 'geriatrie', key: 'spec_geriatrie', category: 'cat_brain' },
    { id: 'pijn', key: 'spec_pijn', category: 'cat_brain' },
    { id: 'psy', key: 'spec_psy', category: 'cat_brain' },
    { id: 'stress', key: 'spec_stress', category: 'cat_brain' },
    
    { id: 'thoracale', key: 'spec_thoracale', category: 'cat_surgery' },
    { id: 'heelkunde', key: 'spec_heelkunde', category: 'cat_surgery' },
    { id: 'brand', key: 'spec_brand', category: 'cat_surgery' },
    { id: 'hartchir', key: 'spec_hartchir', category: 'cat_surgery' },
    { id: 'mka', key: 'spec_mka', category: 'cat_surgery' },
    { id: 'neurochir', key: 'spec_neurochir', category: 'cat_surgery' },
    { id: 'obesitas', key: 'spec_obesitas', category: 'cat_surgery' },
    { id: 'onco', key: 'spec_onco', category: 'cat_surgery' },
    { id: 'plastische', key: 'spec_plastische', category: 'cat_surgery' },
    { id: 'vaat', key: 'spec_vaat', category: 'cat_surgery' },
    { id: 'wond', key: 'spec_wond', category: 'cat_surgery' }
  ],

  doctors: [
    { id: 1, name: 'Dr. Jan Peeters', specialtyId: 'cardio', hospitalId: 'nord', image: 'https://i.pravatar.cc/150?u=zas1' },
    { id: 2, name: 'Dr. An Verhelst', specialtyId: 'ophtalmo', hospitalId: 'cadix', image: 'https://i.pravatar.cc/150?u=zas2' },
    { id: 3, name: 'Dr. Luc De Smet', specialtyId: 'geriatrie', hospitalId: 'middelheim', image: 'https://i.pravatar.cc/150?u=zas3' },
    { id: 4, name: 'Dr. Sophie Willems', specialtyId: 'dermato', hospitalId: 'cadix', image: 'https://i.pravatar.cc/150?u=zas4' },
    { id: 5, name: 'Dr. Bart Smets', specialtyId: 'nko', hospitalId: 'nord', image: 'https://i.pravatar.cc/150?u=zas5' },
    { id: 6, name: 'Dr. Ellen Mertens', specialtyId: 'gynaeco', hospitalId: 'middelheim', image: 'https://i.pravatar.cc/150?u=zas6' },
    { id: 7, name: 'Dr. Tom Verhoeven', specialtyId: 'ortho', hospitalId: 'vincentius', image: 'https://i.pravatar.cc/150?u=zas7' },
    { id: 8, name: 'Dr. Sarah Maes', specialtyId: 'cardio', hospitalId: 'cadix', image: 'https://i.pravatar.cc/150?u=zas8' },
    { id: 9, name: 'Dr. Dirk Wauters', specialtyId: 'fysio', hospitalId: 'nord', image: 'https://i.pravatar.cc/150?u=zas9' },
    { id: 10, name: 'Dr. Petra Janssens', specialtyId: 'geriatrie', hospitalId: 'vincentius', image: 'https://i.pravatar.cc/150?u=zas10' }
  ],

  slots: [
    // Dr. Jan Peeters
    { doctorId: 1, date: '12-05-2026', times: ['09:00', '10:30', '14:00', '16:00'] },
    { doctorId: 1, date: '13-05-2026', times: ['08:00', '11:00', '15:30'] },
    // Dr. An Verhelst
    { doctorId: 2, date: '12-05-2026', times: ['08:30', '14:30', '15:30'] },
    { doctorId: 2, date: '14-05-2026', times: ['09:00', '10:00', '11:00'] },
    // Dr. Luc De Smet
    { doctorId: 3, date: '14-05-2026', times: ['09:00', '11:00', '14:00'] },
    { doctorId: 3, date: '15-05-2026', times: ['10:30', '15:00'] },
    // Dr. Sophie Willems
    { doctorId: 4, date: '12-05-2026', times: ['10:30', '13:00', '16:00'] },
    // Dr. Bart Smets
    { doctorId: 5, date: '12-05-2026', times: ['09:15', '11:45', '14:15'] },
    { doctorId: 5, date: '15-05-2026', times: ['08:45', '10:45'] },
    // Dr. Ellen Mertens
    { doctorId: 6, date: '13-05-2026', times: ['09:00', '11:30', '14:00', '15:30'] },
    // Dr. Tom Verhoeven
    { doctorId: 7, date: '14-05-2026', times: ['08:00', '10:00', '13:00', '15:00', '16:00'] },
    // Dr. Sarah Maes
    { doctorId: 8, date: '12-05-2026', times: ['10:00', '11:00', '15:00'] },
    // Dr. Dirk Wauters
    { doctorId: 9, date: '15-05-2026', times: ['09:00', '10:00', '11:00', '13:00', '14:00'] },
    // Dr. Petra Janssens
    { doctorId: 10, date: '13-05-2026', times: ['08:30', '10:30', '13:30', '15:30'] }
  ]
};
