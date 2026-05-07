import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { translations } from "./i18n.js";

function firstExistingSelector(selectors) {
  return selectors.find((selector) => document.querySelector(selector)) || null;
}

function createStep(selectors, title, description, side = "bottom", align = "center") {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  const element = firstExistingSelector(selectorList);
  if (!element) return null;

  return {
    element,
    popover: { title, description, side, align }
  };
}

function buildSteps(step, t) {
  const pageSteps = {
    profile: [
      { popover: { title: t("tuto_welcome_title"), description: t("tuto_welcome_desc"), side: "left", align: "start" } },
      createStep('.lang-btn[data-lang="nl"]', t("tuto_lang_title"), t("tuto_lang_desc")),
      createStep('.profile-option[data-mode="beginner"]', t("tuto_profile_title"), t("tuto_profile_desc"), "top")
    ],
    specialty: [
      createStep("#specialty-search", t("tuto_spec_title"), t("tuto_spec_desc")),
      createStep(".category-toggle", t("tuto_spec_title"), t("tuto_spec_desc"), "bottom", "start"),
      createStep("#julien-btn", t("tuto_bot_title"), t("tuto_bot_desc"), "left")
    ],
    campus: [
      createStep(".campus-btn", t("tuto_campus_title"), t("tuto_campus_desc"), "bottom", "start"),
      createStep("#voice-toggle", t("tuto_voice_title"), t("tuto_voice_desc"), "left")
    ],
    doctor: [
      createStep(".doctor-btn", t("tuto_doc_title"), t("tuto_doc_desc"), "bottom", "start"),
      createStep("#julien-btn", t("tuto_bot_title"), t("tuto_bot_desc"), "left")
    ],
    schedule: [
      createStep(".time-slot-btn", t("tuto_sched_title"), t("tuto_sched_desc"), "top", "center"),
      createStep("#btn-confirm-schedule", t("tuto_sched_title"), t("tuto_sched_desc"), "top", "center")
    ],
    contact: [
      createStep(".verification-method-btn", t("tuto_contact_title"), t("tuto_contact_desc"), "bottom", "start"),
      createStep(["#input-phone", "#input-email"], t("tuto_contact_title"), t("tuto_contact_desc"), "bottom", "center"),
      createStep("#check-companion", t("tuto_companion_title"), t("tuto_companion_desc"), "top", "center")
    ],
    verification: [
      createStep(".code-input", t("tuto_verif_title"), t("tuto_verif_desc"), "bottom", "center"),
      createStep("#btn-verify-code", t("tuto_verif_title"), t("tuto_verif_desc"), "top", "center")
    ],
    confirm: [
      createStep("#btn-confirm-final", t("tuto_confirm_title"), t("tuto_confirm_desc"), "top", "center")
    ],
    questionnaire: [
      createStep("textarea", t("tuto_questionnaire_title"), t("tuto_questionnaire_desc"), "bottom", "center"),
      createStep("#btn-submit-questionnaire", t("tuto_questionnaire_title"), t("tuto_questionnaire_desc"), "top", "center")
    ],
    documents: [
      createStep(".card-zas", t("tuto_documents_title"), t("tuto_documents_desc"), "bottom", "center"),
      createStep("#tuto-btn", t("tuto_more_help_title"), t("tuto_more_help_desc"), "bottom", "center")
    ],
    faq: [
      createStep(".card-zas", t("tuto_faq_title"), t("tuto_faq_desc"), "bottom", "center"),
      createStep("#julien-btn", t("tuto_bot_title"), t("tuto_bot_desc"), "left")
    ],
    contact_page: [
      createStep(".card-zas", t("tuto_contact_page_title"), t("tuto_contact_page_desc"), "bottom", "center"),
      createStep("#voice-toggle", t("tuto_voice_title"), t("tuto_voice_desc"), "left")
    ],
    success: [
      createStep("#btn-restart", t("tuto_success_title"), t("tuto_success_desc"), "top", "center"),
      createStep("#tuto-btn", t("tuto_more_help_title"), t("tuto_more_help_desc"), "bottom", "center")
    ]
  };

  return (pageSteps[step] || []).filter(Boolean);
}

export function startTutorialForStep(step, lang) {
  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key;
  const steps = buildSteps(step, t);

  if (steps.length === 0) return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    popoverClass: "zas-driver-popover",
    nextBtnText: t("tuto_next"),
    prevBtnText: t("tuto_prev"),
    doneBtnText: t("tuto_done"),
    steps
  });

  setTimeout(() => {
    driverObj.drive();
  }, 250);
}
