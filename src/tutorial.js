import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { translations } from './i18n.js';

export function startTutorialForStep(step, lang) {
  const t = (key) => translations[lang][key] || key;

  let stepsConfig = [];

  switch (step) {
    case 'profile':
      stepsConfig = [
        { popover: { title: t('tuto_welcome_title'), description: t('tuto_welcome_desc'), side: "left", align: 'start' } },
        { element: '.lang-btn[data-lang="fr"]', popover: { title: t('tuto_lang_title'), description: t('tuto_lang_desc'), side: "bottom", align: 'center' } },
        { element: '.profile-option[data-mode="beginner"]', popover: { title: t('tuto_profile_title'), description: t('tuto_profile_desc'), side: "top", align: 'center' } }
      ];
      break;
    case 'specialty':
      stepsConfig = [
        { element: '.specialty-btn', popover: { title: t('tuto_spec_title'), description: t('tuto_spec_desc'), side: "bottom", align: 'start' } }
      ];
      break;
    case 'doctor':
      stepsConfig = [
        { element: '.doctor-btn', popover: { title: t('tuto_doc_title'), description: t('tuto_doc_desc'), side: "bottom", align: 'start' } }
      ];
      break;
    case 'schedule':
      stepsConfig = [
        { element: '.time-slot-btn', popover: { title: t('tuto_sched_title'), description: t('tuto_sched_desc'), side: "top", align: 'center' } }
      ];
      break;
    case 'contact':
      stepsConfig = [
        { element: '#input-phone', popover: { title: t('tuto_contact_title'), description: t('tuto_contact_desc'), side: "bottom", align: 'center' } },
        { element: '#check-companion', popover: { title: t('tuto_companion_title'), description: t('tuto_companion_desc'), side: "top", align: 'center' } }
      ];
      break;
    case 'verification':
      stepsConfig = [
        { element: '.code-input', popover: { title: t('tuto_verif_title'), description: t('tuto_verif_desc'), side: "bottom", align: 'center' } }
      ];
      break;
    case 'confirm':
      stepsConfig = [
        { element: '#btn-confirm-final', popover: { title: t('tuto_confirm_title'), description: t('tuto_confirm_desc'), side: "top", align: 'center' } }
      ];
      break;
    default:
      return;
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    nextBtnText: t('tuto_next'),
    prevBtnText: t('tuto_prev'),
    doneBtnText: t('tuto_done'),
    steps: stepsConfig
  });

  setTimeout(() => { driverObj.drive(); }, 300);
}
