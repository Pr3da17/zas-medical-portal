/**
 * ZAS Antwerpen - Service de Communication Simulée
 */

export const notificationService = {
  activeCodes: new Map(),

  /**
   * Simule l'envoi d'un SMS au patient
   */
  async sendSMSVerification(phone) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeCodes.set(phone, code);
    
    console.log(`%c [SMS SENT to ${phone}] Code: ${code} `, 'background: #00A5AD; color: white; font-weight: bold;');
    
    // Simulation du délai réseau
    return new Promise(resolve => setTimeout(() => resolve({ success: true, code }), 1500));
  },

  /**
   * Simule l'envoi d'un Email à l'accompagnateur
   */
  async sendCompanionInvitation(email, appointmentDetails) {
    console.log(`%c [EMAIL SENT to ${email}] Invitation for: ${appointmentDetails.doctor.name} `, 'background: #FF6B6B; color: white; font-weight: bold;');
    
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },

  /**
   * Vérifie si le code saisi est correct
   */
  verifyCode(phone, inputCode) {
    return this.activeCodes.get(phone) === inputCode;
  }
};
