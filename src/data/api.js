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
        // Filtrage précis par identifiant technique
        const filtered = db.doctors.filter(d => d.specialtyId === specialtyId);
        resolve(filtered);
      }, 1000);
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
