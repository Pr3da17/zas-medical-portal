/**
 * ZAS Antwerpen - Simulated communication service
 */

export const notificationService = {
  activeCodes: new Map(),
  lastSentCode: null,
  lastSentTarget: null,

  getRecipientKey(type, value) {
    return `${type}:${value}`;
  },

  /**
   * Simulates sending an SMS verification code
   */
  async sendSMSVerification(phone) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeCodes.set(this.getRecipientKey("phone", phone), code);
    this.lastSentCode = code;
    this.lastSentTarget = phone;

    console.log(`%c [SMS SENT to ${phone}] Code: ${code} `, "background: #00A5AD; color: white; font-weight: bold;");

    return new Promise((resolve) => setTimeout(() => resolve({ success: true, code }), 1500));
  },

  /**
   * Simulates sending an email verification code
   */
  async sendEmailVerification(email) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.activeCodes.set(this.getRecipientKey("email", email), code);
    this.lastSentCode = code;
    this.lastSentTarget = email;

    console.log(`%c [EMAIL VERIFICATION SENT to ${email}] Code: ${code} `, "background: #7C3AED; color: white; font-weight: bold;");

    return new Promise((resolve) => setTimeout(() => resolve({ success: true, code }), 1500));
  },

  /**
   * Simulates sending an email to the companion
   */
  async sendCompanionInvitation(email, appointmentDetails) {
    console.log(`%c [EMAIL SENT to ${email}] Invitation for: ${appointmentDetails.doctor.name} `, "background: #FF6B6B; color: white; font-weight: bold;");

    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  },

  /**
   * Verifies whether the input code matches the recipient
   */
  verifyCode(type, value, inputCode) {
    return this.activeCodes.get(this.getRecipientKey(type, value)) === inputCode;
  },

  getLastCode() {
    return this.lastSentCode;
  },

  getLastTarget() {
    return this.lastSentTarget;
  }
};
