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
  const assistantIcon = "🤖";
  const pTitle = (key) => `${assistantIcon} ${t(key)}`;

  const pageSteps = {
    profile: [
      { popover: { title: pTitle("tuto_welcome_title"), description: t("tuto_welcome_desc"), side: "left", align: "start" } },
      createStep('.lang-btn[data-lang="nl"]', pTitle("tuto_lang_title"), t("tuto_lang_desc")),
      createStep('.profile-option[data-mode="beginner"]', pTitle("tuto_profile_title"), t("tuto_profile_desc"), "top")
    ],
    specialty: [
      createStep("#tuto-btn", pTitle("tuto_btn"), t("tuto_btn_desc")),
      createStep("#btn-open-sidebar", pTitle("tuto_menu_title"), t("tuto_menu_desc"), "bottom", "start"),
      createStep("#reader-toggle", pTitle("tuto_reader_title"), t("tuto_reader_desc")),
      createStep("#dyslexic-toggle", pTitle("tuto_dyslexic_title"), t("tuto_dyslexic_desc")),
      createStep("#voice-toggle", pTitle("tuto_voice_title"), t("tuto_voice_desc"), "left"),
      createStep("#julien-btn", pTitle("tuto_bot_title"), t("tuto_bot_desc"), "left"),
      createStep("#progress-bar-container", pTitle("tuto_progress_title"), t("tuto_progress_desc")),
      createStep("#specialty-search", pTitle("search_specialty"), t("tuto_spec_desc")),
      createStep(".category-toggle", pTitle("tuto_spec_title"), t("tuto_spec_desc"), "bottom", "start")
    ],
    campus: [
      createStep(".campus-btn", pTitle("tuto_campus_title"), t("tuto_campus_desc"), "bottom", "start"),
      createStep("#voice-toggle", pTitle("tuto_voice_title"), t("tuto_voice_desc"), "left")
    ],
    doctor: [
      createStep(".doctor-btn", pTitle("tuto_doc_title"), t("tuto_doc_desc"), "bottom", "start"),
      createStep("#julien-btn", pTitle("tuto_bot_title"), t("tuto_bot_desc"), "left")
    ],
    schedule: [
      createStep(".time-slot-btn", pTitle("tuto_sched_title"), t("tuto_sched_desc"), "top", "center"),
      createStep("#btn-confirm-schedule", pTitle("tuto_sched_title"), t("tuto_sched_desc"), "top", "center")
    ],
    contact: [
      createStep(".verification-method-btn", pTitle("tuto_contact_title"), t("tuto_contact_desc"), "bottom", "start"),
      createStep(["#input-phone", "#input-email"], pTitle("tuto_contact_title"), t("tuto_contact_desc"), "bottom", "center"),
      createStep("#check-companion", pTitle("tuto_companion_title"), t("tuto_companion_desc"), "top", "center")
    ],
    verification: [
      createStep(".code-input", pTitle("tuto_verif_title"), t("tuto_verif_desc"), "bottom", "center"),
      createStep("#btn-verify-code", pTitle("tuto_verif_title"), t("tuto_verif_desc"), "top", "center")
    ],
    confirm: [
      createStep("#btn-confirm-final", pTitle("tuto_confirm_title"), t("tuto_confirm_desc"), "top", "center")
    ],
    questionnaire: [
      createStep("textarea", pTitle("tuto_questionnaire_title"), t("tuto_questionnaire_desc"), "bottom", "center"),
      createStep("#btn-submit-questionnaire", pTitle("tuto_questionnaire_title"), t("tuto_questionnaire_desc"), "top", "center")
    ],
    documents: [
      createStep(".card-zas", pTitle("tuto_documents_title"), t("tuto_documents_desc"), "bottom", "center"),
      createStep("#tuto-btn", pTitle("tuto_more_help_title"), t("tuto_more_help_desc"), "bottom", "center")
    ],
    faq: [
      createStep(".card-zas", pTitle("tuto_faq_title"), t("tuto_faq_desc"), "bottom", "center"),
      createStep("#julien-btn", pTitle("tuto_bot_title"), t("tuto_bot_desc"), "left")
    ],
    contact_page: [
      createStep(".card-zas", pTitle("tuto_contact_page_title"), t("tuto_contact_page_desc"), "bottom", "center"),
      createStep("#voice-toggle", pTitle("tuto_voice_title"), t("tuto_voice_desc"), "left")
    ],
    success: [
      createStep("#btn-restart", pTitle("tuto_success_title"), t("tuto_success_desc"), "top", "center"),
      createStep("#tuto-btn", pTitle("tuto_more_help_title"), t("tuto_more_help_desc"), "bottom", "center")
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
    overlayColor: 'rgba(15, 23, 42, 0.65)',
    popoverClass: "zas-driver-popover",
    nextBtnText: `<span>${t("tuto_next")}</span> ➔`,
    prevBtnText: `➔ <span>${t("tuto_prev")}</span>`,
    doneBtnText: `${t("tuto_done")} 🎉`,
    onHighlight: (element) => {
      if (element) {
        element.style.filter = 'none';
        element.style.backdropFilter = 'none';
      }
    },
    steps
  });

  setTimeout(() => {
    driverObj.drive();
  }, 250);
}
