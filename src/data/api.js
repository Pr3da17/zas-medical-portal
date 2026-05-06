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
   * Récupère tous les hôpitaux (campus)
   */
  async getHospitals() {
    return new Promise(resolve => {
      setTimeout(() => resolve(db.hospitals), 400);
    });
  },

  /**
   * Récupère les médecins filtrés par ID de spécialité et optionnellement par campus
   */
  async getDoctorsBySpecialty(specialtyId, hospitalId = null) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = db.doctors.filter(d => d.specialtyId === specialtyId);
        
        if (hospitalId) {
          filtered = filtered.filter(d => d.hospitalId === hospitalId);
        }

        // Fallback: si aucun médecin n'est trouvé pour cette spécialité, on crée des médecins fictifs pour la démo
        if (filtered.length === 0) {
          filtered = [
            { id: Math.floor(Math.random() * 1000) + 900, name: 'Dr. Anna Peeters', specialtyId: specialtyId, hospitalId: hospitalId || 'nord', image: 'https://i.pravatar.cc/150?u=' + Math.floor(Math.random() * 1000) },
            { id: Math.floor(Math.random() * 1000) + 900, name: 'Dr. Marc Dubois', specialtyId: specialtyId, hospitalId: hospitalId || 'cadix', image: 'https://i.pravatar.cc/150?u=' + Math.floor(Math.random() * 1000) }
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
        // Générer dynamiquement des créneaux (beaucoup de dispos pour les tests)
        const dates = ["12-05-2026", "13-05-2026", "14-05-2026", "15-05-2026", "16-05-2026", "17-05-2026", "18-05-2026"];
        const allTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
        
        const slots = dates.map(date => {
          // Entre 4 et 9 créneaux par jour pour avoir un planning bien rempli
          const numSlots = Math.floor(Math.random() * 6) + 4;
          const shuffledTimes = [...allTimes].sort(() => 0.5 - Math.random());
          const selectedTimes = shuffledTimes.slice(0, numSlots).sort();
          return {
            doctorId,
            date,
            times: selectedTimes
          };
        });
        
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
