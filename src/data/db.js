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
    { id: 'cardio', key: 'spec_cardio', icon: '❤️' },
    { id: 'geriatrie', key: 'spec_geriatrie', icon: '👵' },
    { id: 'gynaeco', key: 'spec_gynaeco', icon: '👶' },
    { id: 'nko', key: 'spec_nko', icon: '👂' },
    { id: 'ophtalmo', key: 'spec_ophtalmo', icon: '👁️' },
    { id: 'ortho', key: 'spec_ortho', icon: '🦴' },
    { id: 'dermato', key: 'spec_dermato', icon: '✨' },
    { id: 'spoed', key: 'spec_spoed', icon: '🚨' },
    { id: 'fysio', key: 'spec_fysio', icon: '🚶' }
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
