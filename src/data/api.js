import { db } from './db.js';

/**
 * ZAS Antwerpen - Service API simulé
 */
export const api = {
  /**
   * Récupère toutes les spécialités
   */
  async getSpecialties() {
    return new Promise(resolve => {
      setTimeout(() => resolve(db.specialties), 800);
    });
  },

  /**
   * Récupère les médecins filtrés par ID de spécialité
   */
  async getDoctorsBySpecialty(specialtyId) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = db.doctors.filter(d => d.specialtyId === specialtyId);
        // Fallback: si aucun médecin n'est trouvé pour cette spécialité, on crée des médecins fictifs pour la démo
        if (filtered.length === 0) {
          filtered = [
            { id: 901, name: 'Dr. Anna Peeters', specialtyId: specialtyId, hospitalId: 'nord', image: 'https://i.pravatar.cc/150?u=zas11' },
            { id: 902, name: 'Dr. Marc Dubois', specialtyId: specialtyId, hospitalId: 'cadix', image: 'https://i.pravatar.cc/150?u=zas12' }
          ];
        }
        resolve(filtered);
      }, 800);
    });
  },

  /**
   * Récupère les créneaux pour un médecin spécifique
   */
  async getSlotsByDoctor(doctorId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const slots = db.slots.filter(s => s.doctorId == doctorId);
        resolve(slots);
      }, 600);
    });
  },

  /**
   * Simule la réservation finale
   */
  async bookAppointment(appointmentData) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Appointment Booked:", appointmentData);
        resolve({ success: true, id: Math.random().toString(36).substr(2, 9) });
      }, 2000);
    });
  }
};
