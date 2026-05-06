import './style.css';
import { translations } from './i18n.js';
import { voice } from './voice.js';
import { getJulienExplanation } from './assistant.js';
import { api } from './data/api.js';
import { notificationService } from './data/notifications.js';
import { botBrain } from './ai/brain.js';
import { startTutorialForStep } from './tutorial.js';

// --- State ---
const state = {
  lang: 'fr', mode: 'beginner', step: 'profile', data: { specialties: [], doctors: [], slots: [] },
  selections: { specialtyId: null, specialtyKey: null, doctor: null, date: null, time: null, phone: '', companionEmail: '' },
  isLoading: false, history: [], chatHistory: [], isBotTyping: false, isSidebarOpen: false, specialtySearchQuery: '', openCategory: null
};

// --- Utils ---
function t(key) { return translations[state.lang][key] || key; }
function navigateTo(nextStep) { state.history.push(state.step); state.step = nextStep; updateUI(); }
function goBack() { if (state.history.length > 0) { state.step = state.history.pop(); updateUI(); } else { state.step = 'profile'; updateUI(); } }
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

async function updateUI() {
  const app = document.getElementById('app');
  app.className = `flex flex-col min-h-screen mode-${state.mode} ${state.isSidebarOpen ? 'overflow-hidden' : ''}`;
  app.innerHTML = `${renderHeader()}${renderSidebar()}<main class="flex-grow container mx-auto px-4 py-12 max-w-7xl w-full">${state.isLoading ? renderLoader() : renderStep()}</main>${renderFooter()}${renderZasBot()}`;
  attachEventListeners();
}

function renderLoader() { return `<div class="flex flex-col items-center justify-center py-40 space-y-12 reveal"><div class="relative w-32 h-32"><div class="absolute inset-0 border-[12px] border-hospital-secondary rounded-full"></div><div class="absolute inset-0 border-[12px] border-hospital-primary border-t-transparent rounded-full animate-spin"></div></div><p class="text-3xl font-black text-hospital-primary uppercase tracking-tighter">${t('title').toUpperCase()}...</p></div>`; }

function renderHeader() {
  if (state.step === 'profile') return '';
  const stepsOrder = ['profile', 'specialty', 'doctor', 'schedule', 'contact', 'verification', 'confirm'];
  const currentIdx = stepsOrder.indexOf(state.step);
  const isBeginner = state.mode === 'beginner';
  const tutoBtnClasses = isBeginner 
    ? "px-8 py-6 rounded-[32px] text-xl bg-slate-100 text-hospital-primary font-black uppercase border-4 border-slate-200 hover:bg-slate-200 transition-all shadow-md"
    : "px-6 py-4 rounded-[24px] bg-slate-100 text-hospital-primary font-black uppercase text-sm border-2 border-slate-200 hover:bg-slate-200 transition-all";

  return `
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-6">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-5">
          <button id="btn-open-sidebar" class="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-hospital-primary text-3xl border-2 border-slate-100 hover:bg-slate-100 transition-all shadow-sm">☰</button>
          <div class="flex items-center gap-5 cursor-pointer" onclick="location.reload()">
            <div class="w-16 h-16 bg-hospital-primary rounded-[22px] flex items-center justify-center text-white font-black text-3xl shadow-xl hidden sm:flex">Z</div>
            <div class="hidden sm:block"><h1 class="text-2xl font-black text-hospital-primary tracking-tighter leading-none">${t('title').toUpperCase()}</h1><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ZNA Antwerpen</p></div>
          </div>
        </div>
        <div class="flex items-center gap-8">
          <div class="hidden md:flex items-center gap-3">${stepsOrder.map((s, i) => `<div class="progress-segment ${state.mode === 'beginner' ? 'w-8 h-3' : 'w-12 h-2'} ${i <= currentIdx ? 'active' : ''}"></div>`).join('')}</div>
          <button id="tuto-btn" class="${tutoBtnClasses}">${t('tuto_btn')}</button>
          <button id="voice-toggle" class="w-16 h-16 rounded-[24px] bg-hospital-secondary text-hospital-primary flex items-center justify-center border-2 border-hospital-primary/10 transition-all"><span class="text-3xl">${voice.enabled ? '🔊' : '🔇'}</span></button>
        </div>
      </div>
    </header>
  `;
}

function renderSidebar() {
  if (!state.isSidebarOpen) return '';

  let links = [];
  if (state.mode === 'beginner') {
    links = [
      { id: 'menu-book', icon: '📅', key: 'menu_book', step: 'specialty', color: 'bg-hospital-primary text-white' },
      { id: 'menu-contact', icon: '📞', key: 'menu_contact', step: 'contact_page', color: 'bg-zas-coral text-white' }
    ];
  } else if (state.mode === 'intermediate') {
    links = [
      { id: 'menu-book', icon: '📅', key: 'menu_book', step: 'specialty', color: 'bg-hospital-primary text-white' },
      { id: 'menu-docs', icon: '📄', key: 'menu_docs', step: 'documents', color: 'bg-white border-4 border-slate-100 text-slate-800' },
      { id: 'menu-faq', icon: '❓', key: 'menu_faq', step: 'faq', color: 'bg-white border-4 border-slate-100 text-slate-800' },
      { id: 'menu-contact', icon: '📞', key: 'menu_contact', step: 'contact_page', color: 'bg-white border-4 border-slate-100 text-slate-800' }
    ];
  } else {
    links = [
      { id: 'menu-book', icon: '📅', key: 'menu_book', step: 'specialty', color: 'bg-hospital-primary text-white' },
      { id: 'menu-docs', icon: '🗂️', key: 'menu_docs', step: 'documents', color: 'bg-white border-4 border-slate-100 text-slate-800' },
      { id: 'menu-news', icon: '📰', key: 'menu_news', step: 'news', color: 'bg-white border-4 border-slate-100 text-slate-800' },
      { id: 'menu-faq', icon: '❓', key: 'menu_faq', step: 'faq', color: 'bg-white border-4 border-slate-100 text-slate-800' },
      { id: 'menu-contact', icon: '📞', key: 'menu_contact', step: 'contact_page', color: 'bg-white border-4 border-slate-100 text-slate-800' }
    ];
  }

  return `
    <div class="fixed inset-0 z-[100] flex">
      <div id="sidebar-overlay" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
      <div class="relative w-4/5 max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-left">
        <div class="p-8 border-b-4 border-slate-50 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-hospital-primary rounded-[18px] flex items-center justify-center text-white font-black text-2xl shadow-xl">Z</div>
            <span class="font-black text-2xl tracking-tighter text-slate-800">MENU</span>
          </div>
          <button id="btn-close-sidebar" class="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-2xl hover:text-zas-coral transition-colors font-black">✕</button>
        </div>
        <div class="p-8 flex-grow overflow-y-auto space-y-6">
          ${links.map(l => `
            <button class="sidebar-link w-full text-left flex items-center gap-8 p-8 rounded-[32px] transition-all hover:scale-[1.02] shadow-sm ${l.color}" data-step="${l.step}">
              <span class="text-5xl">${l.icon}</span>
              <span class="font-black text-2xl tracking-tighter uppercase">${t(l.key)}</span>
            </button>
          `).join('')}
        </div>
        <div class="p-8 bg-slate-50 border-t-4 border-slate-100">
           <div class="flex items-center gap-4 text-slate-500 font-bold uppercase text-xs tracking-widest">
             <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             Système ZAS Connecté
           </div>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  if (state.step === 'profile' || state.step === 'success') return '';
  return `
    <footer class="bg-white border-t border-gray-100 p-8 mt-auto sticky bottom-0 z-40">
      <div class="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <button id="btn-back" class="btn-outline min-w-[220px] text-2xl py-6 px-10 rounded-[32px]">⬅️ ${t('back')}</button>
        <button id="btn-undo" class="${state.mode === 'beginner' ? 'flex' : 'hidden'} btn-outline border-zas-coral text-zas-coral bg-red-50 py-6 px-10 rounded-[32px] text-2xl">↩️ ${t('undo')}</button>
        <div class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-3"><span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>${t('help_fallback')}</div>
      </div>
    </footer>
  `;
}

function renderZasBot() {
  if (state.step === 'profile') return '';
  return `
    <div class="fixed bottom-10 right-10 z-50 flex flex-col items-end">
       <div id="julien-window" class="hidden card-zas w-80 md:w-96 mb-6 border-4 border-hospital-primary shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
         <div class="bg-hospital-primary p-4 flex items-center gap-4 text-white"><span class="text-3xl">🤖</span><div class="font-black uppercase text-xs tracking-widest">Assistant IA ZAS</div></div>
         <div id="chat-content" class="flex-grow overflow-y-auto p-6 bg-slate-50 min-h-[250px] space-y-4">
            <div class="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-slate-100 font-bold text-slate-700">${t('julien_help')}</div>
            ${state.chatHistory.map(msg => `<div class="${msg.type === 'user' ? 'bg-hospital-primary text-white ml-8 rounded-tr-none' : 'bg-white text-slate-700 mr-8 rounded-tl-none border-2 border-slate-100'} p-4 rounded-2xl font-bold shadow-sm reveal mb-4">${msg.text}</div>`).join('')}
            <div id="bot-typing" class="hidden flex gap-1 p-4 bg-white rounded-2xl w-20 border-2 border-slate-100"><div class="w-2 h-2 bg-hospital-primary rounded-full animate-bounce"></div><div class="w-2 h-2 bg-hospital-primary rounded-full animate-bounce [animation-delay:0.2s]"></div><div class="w-2 h-2 bg-hospital-primary rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
         </div>
         <div class="p-4 bg-white border-t-2 border-slate-100 flex gap-2"><input type="text" id="chat-input" placeholder="Parlez-moi..." class="flex-grow p-4 bg-slate-50 rounded-xl font-bold outline-none" /><button id="chat-send" class="bg-hospital-primary text-white w-12 h-12 rounded-xl flex items-center justify-center font-black">🚀</button></div>
       </div>
       <button id="julien-btn" class="w-24 h-24 rounded-[32px] bg-hospital-primary text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all"><span class="text-5xl">🤖</span></button>
    </div>
  `;
}

function renderStep() {
  switch (state.step) {
    case 'profile': return renderProfileSelection();
    case 'specialty': return renderSpecialtySelection();
    case 'doctor': return renderDoctorSelection();
    case 'schedule': return renderScheduleSelection();
    case 'contact': return renderContactInfo();
    case 'verification': return renderSmsVerification();
    case 'confirm': return renderConfirmation();
    case 'success': return renderSuccess();
    case 'faq': return renderPlaceholder('FAQ', 'Questions fréquentes');
    case 'documents': return renderPlaceholder('Documents', 'Vos résultats médicaux');
    case 'news': return renderPlaceholder('Nouveautés', 'Actualités de l\'hôpital');
    case 'contact_page': return renderPlaceholder('Contact', 'Nous joindre');
    default: return 'Error';
  }
}

function renderPlaceholder(title, subtitle) {
  return `
    <div class="max-w-4xl mx-auto text-center space-y-12 py-20 reveal">
      <div class="text-[120px] leading-none mb-8 animate-bounce">🚧</div>
      <h1 class="text-6xl font-black text-hospital-primary uppercase tracking-tighter">${title}</h1>
      <p class="text-3xl text-slate-400 font-bold">${subtitle}</p>
      <div class="p-12 bg-white rounded-[40px] border-8 border-slate-50 shadow-xl mt-12 max-w-2xl mx-auto">
        <p class="text-2xl text-slate-400 font-black uppercase tracking-widest">Cette fonctionnalité est en cours de développement.</p>
      </div>
    </div>
  `;
}

function renderProfileSelection() {
  return `
    <div class="max-w-6xl mx-auto space-y-20 py-12 reveal relative">
      <button id="tuto-btn-profile" class="absolute top-0 right-4 md:right-0 px-10 py-6 rounded-[32px] text-xl bg-white text-hospital-primary font-black uppercase border-4 border-slate-100 hover:bg-slate-50 transition-all shadow-lg hover:scale-105">${t('tuto_btn')}</button>
      <div class="text-center space-y-8">
        <div class="flex justify-center mb-8"><div class="w-24 h-24 bg-hospital-primary text-white rounded-[28px] flex items-center justify-center font-black text-5xl shadow-2xl">Z</div></div>
        <h1 class="text-5xl md:text-8xl font-black text-hospital-primary tracking-tighter leading-none uppercase">${t('title')}</h1>
        <p class="text-2xl text-slate-400 font-bold max-w-2xl mx-auto">${t('profiling_question')}</p>
      </div>
      <div class="flex justify-center gap-4">
        ${['fr', 'nl', 'en'].map(l => `<button class="lang-btn px-10 py-5 rounded-[24px] border-4 font-black text-xl transition-all ${state.lang === l ? 'bg-hospital-primary text-white border-hospital-primary shadow-xl' : 'bg-white text-slate-300 border-gray-100'}" data-lang="${l}">${l.toUpperCase()}</button>`).join('')}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        ${['beginner', 'intermediate', 'advanced'].map((m, i) => `
          <div class="profile-option group reveal" style="animation-delay: ${i * 0.1}s" data-mode="${m}">
            <div class="text-8xl mb-8 group-hover:scale-110 transition-transform">${m === 'beginner' ? '🐢' : (m === 'intermediate' ? '🚶' : '🚀')}</div>
            <h3 class="text-3xl font-black text-hospital-primary uppercase tracking-tighter mb-4">${t(m)}</h3><p class="text-slate-400 font-bold leading-tight text-lg">${t(m + '_desc')}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSpecialtySelection() {
  const isBeginner = state.mode === 'beginner';
  
  // Group by category
  const categories = {};
  state.data.specialties.forEach(s => {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });

  return `
    <div class="space-y-16 reveal max-w-5xl mx-auto">
      <div class="text-center space-y-4">
        <h1 class="${isBeginner ? 'text-7xl' : 'text-5xl'} font-black text-hospital-primary uppercase tracking-tighter">${t('select_specialty')}</h1>
      </div>
      
      <div class="relative max-w-2xl mx-auto">
        <span class="absolute left-6 top-1/2 -translate-y-1/2 text-3xl">🔍</span>
        <input type="text" id="specialty-search" placeholder="Rechercher une spécialité..." 
               class="w-full pl-20 pr-8 py-6 rounded-[32px] bg-white border-4 border-slate-100 text-2xl font-black text-slate-800 shadow-sm focus:border-hospital-primary outline-none transition-all">
      </div>

      <div class="space-y-6" id="categories-list">
        ${Object.keys(categories).map(catKey => {
          return `
            <div class="category-container bg-white rounded-[32px] border-4 border-slate-100 shadow-sm overflow-hidden transition-all duration-300" data-catkey="${catKey}">
              <button class="category-toggle w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors">
                <div class="font-black text-3xl text-slate-800 tracking-tighter">${t(catKey)}</div>
                <div class="category-icon text-4xl text-hospital-primary transform transition-transform duration-300">▼</div>
              </button>
              <div class="category-content hidden p-8 bg-slate-50 border-t-4 border-slate-100">
                <div class="${isBeginner ? 'flex flex-col gap-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}">
                  ${categories[catKey].map(s => `
                    <button class="specialty-btn w-full text-left p-6 rounded-[24px] border-4 border-white bg-white hover:border-hospital-primary hover:bg-hospital-secondary transition-all group flex items-center justify-between shadow-sm" data-id="${s.id}" data-key="${s.key}">
                      <span class="font-black text-xl text-slate-700 group-hover:text-hospital-primary transition-colors">${t(s.key)}</span>
                      <span class="opacity-0 group-hover:opacity-100 transition-opacity text-2xl font-black text-hospital-primary">→</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderDoctorSelection() {
  const isBeginner = state.mode === 'beginner';
  return `
    <div class="space-y-16 reveal">
      <div class="text-center space-y-4"><h1 class="${isBeginner ? 'text-7xl' : 'text-5xl'} font-black text-hospital-primary uppercase tracking-tighter">${t('select_doctor')}</h1><span class="bg-hospital-secondary text-hospital-primary px-6 py-2 rounded-full font-black uppercase text-sm">${t(state.selections.specialtyKey)}</span></div>
      <div class="${isBeginner ? 'flex flex-col gap-12 max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}">
        ${state.data.doctors.map((d, i) => `<button id="doc-${d.id}" class="doctor-btn card-zas group flex flex-col items-center text-center" data-id="${d.id}"><img src="${d.image}" alt="" class="w-48 h-48 rounded-[56px] border-[12px] border-hospital-secondary shadow-2xl mb-8 group-hover:scale-105 transition-transform" /><h3 class="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-2">${d.name}</h3><div class="btn-primary w-full py-4 text-xs uppercase tracking-widest">${t('choose_practitioner')}</div></button>`).join('')}
      </div>
    </div>
  `;
}

function renderScheduleSelection() {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dates = ['12-05-2026', '13-05-2026', '14-05-2026', '15-05-2026', '16-05-2026', '17-05-2026', '18-05-2026'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const firstDateParts = dates[0].split('-');
  const weekNumber = getWeekNumber(new Date(firstDateParts[2], firstDateParts[1]-1, firstDateParts[0]));

  return `
    <div class="space-y-6 reveal">
      <!-- TITRE PRINCIPAL -->
      <div class="text-center">
        <h1 class="text-5xl font-black text-hospital-primary uppercase tracking-tighter">${t('select_date')}</h1>
        <p class="text-xl font-bold text-slate-400 mt-2">${t(state.selections.specialtyKey)} — ${state.selections.doctor.name}</p>
      </div>

      <!-- NUMERO DE SEMAINE (Repositionné sous le texte et au-dessus de l'EDT) -->
      <div class="flex justify-center items-center gap-6 py-4">
         <div class="h-1 bg-slate-100 flex-grow rounded-full max-w-[100px]"></div>
         <div class="bg-hospital-primary text-white px-8 py-2 rounded-[20px] font-black text-sm shadow-xl tracking-[0.2em]">
            SEMAINE ${weekNumber}
         </div>
         <div class="h-1 bg-slate-100 flex-grow rounded-full max-w-[100px]"></div>
      </div>
      
      <div class="card-zas p-0 overflow-hidden border-2 border-slate-100 shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-100">
                <th class="w-24 p-6 bg-slate-100 border-r-2 border-slate-200 sticky left-0 z-20">
                  <div class="text-[10px] font-black text-slate-400 uppercase italic">HEURES</div>
                </th>
                ${daysOfWeek.map((day, i) => `
                  <th class="p-6 text-center border-r border-slate-100">
                    <div class="text-[11px] font-black text-hospital-primary uppercase tracking-widest mb-1">${day}</div>
                    <div class="text-3xl font-black text-slate-800">${dates[i].split('-')[0]}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${times.map(time => `
                <tr class="group hover:bg-slate-50/50 transition-colors">
                  <td class="p-6 text-center bg-slate-50 border-r-2 border-slate-200 sticky left-0 z-10 font-black text-slate-500 text-lg">${time}</td>
                  ${dates.map(date => {
                    const daySlots = state.data.slots.find(s => s.date === date);
                    const isAvailable = daySlots && daySlots.times.some(t => t.startsWith(time.split(':')[0]));
                    const actualTime = daySlots ? daySlots.times.find(t => t.startsWith(time.split(':')[0])) : null;
                    return `
                      <td class="p-3 border-r border-slate-100/50 align-middle">
                        ${isAvailable ? `<button class="time-slot-btn w-full py-4 rounded-[18px] text-lg font-black transition-all border-4 ${state.selections.date === date && state.selections.time === actualTime ? 'bg-hospital-primary text-white border-hospital-primary shadow-lg scale-105' : 'bg-white text-slate-800 border-slate-50 hover:border-hospital-primary hover:bg-hospital-secondary'}" data-date="${date}" data-time="${actualTime}">${actualTime}</button>` : `<div class="w-full h-14 rounded-[18px] bg-slate-50/30 border-2 border-dashed border-slate-100/50 group-hover:bg-slate-100 transition-colors"></div>`}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button id="btn-confirm-schedule" class="btn-primary min-w-[320px] text-3xl py-8 ${state.selections.time ? '' : 'opacity-20 pointer-events-none'}">
          ${t('next').toUpperCase()} ➡️
        </button>
      </div>
    </div>
  `;
}

function renderContactInfo() {
  return `<div class="space-y-16 reveal"><h1 class="text-5xl font-black text-hospital-primary uppercase tracking-tighter text-center">${t('patient_info')}</h1><div class="card-zas max-w-3xl mx-auto space-y-12"><div class="space-y-6"><label class="block font-black text-2xl text-slate-400 uppercase tracking-tighter">${t('phone')}</label><input type="tel" id="input-phone" value="${state.selections.phone}" placeholder="04XX XX XX XX" class="w-full bg-slate-50 border-4 border-gray-100 p-8 rounded-[40px] text-5xl font-black outline-none focus:border-hospital-primary shadow-inner" /><p id="phone-error" class="hidden text-zas-coral font-bold mt-4 text-xl bg-red-50 p-6 rounded-2xl"></p></div><div class="pt-10 border-t-4 border-dashed border-gray-100"><label class="flex items-center gap-8 cursor-pointer group"><div class="relative w-14 h-14"><input type="checkbox" id="check-companion" class="peer absolute inset-0 opacity-0 cursor-pointer" ${state.selections.companionEmail ? 'checked' : ''} /><div class="w-full h-full border-4 border-hospital-primary rounded-2xl peer-checked:bg-hospital-primary transition-all"></div></div><div><span class="font-black text-3xl text-hospital-primary block uppercase tracking-tighter">${t('companion_mode')}</span><p class="text-xl text-slate-400 font-bold leading-tight">${t('companion_desc')}</p></div></label><div id="companion-field" class="${state.selections.companionEmail ? '' : 'hidden'} mt-10"><input type="email" id="input-companion" class="w-full p-8 border-4 border-slate-100 rounded-[32px] text-3xl font-black shadow-inner" placeholder="${t('email')}" value="${state.selections.companionEmail}" /></div></div><button id="btn-submit-contact" class="btn-primary w-full text-4xl py-10 uppercase tracking-widest font-black">${t('next')} ➡️</button></div></div>`;
}
function renderSmsVerification() { return `<div class="space-y-16 reveal text-center max-w-2xl mx-auto"><div class="space-y-6"><h1 class="text-6xl font-black text-hospital-primary uppercase tracking-tighter">${t('magic_link_sent')}</h1><p class="text-2xl font-bold text-slate-400">Code envoyé au <span class="text-hospital-primary">${state.selections.phone}</span></p></div><div class="card-zas space-y-12"><div class="flex justify-center gap-4">${[1,2,3,4].map(i => `<input type="text" maxlength="1" class="code-input w-24 h-32 text-center text-6xl font-black bg-slate-50 border-4 border-gray-100 rounded-[24px] outline-none" />`).join('')}</div><button id="btn-verify-code" class="btn-primary w-full text-3xl py-8">Vérifier ✅</button></div></div>`; }
function renderConfirmation() { const { doctor, date, time, specialtyKey } = state.selections; return `<div class="space-y-16 reveal text-center max-w-4xl mx-auto"><h1 class="text-6xl font-black text-hospital-primary uppercase tracking-tighter">${t('confirm_title')}</h1><div class="card-zas space-y-12 p-16 border-t-[24px] border-hospital-primary shadow-2xl"><div class="flex flex-col md:flex-row items-center gap-12 text-left"><img src="${doctor.image}" class="w-56 h-56 rounded-[64px] border-[12px] border-hospital-secondary shadow-2xl" /><div class="space-y-2"><span class="bg-hospital-primary/10 text-hospital-primary px-4 py-1 rounded-full text-xs font-black uppercase">${t('doctor')}</span><h2 class="text-6xl font-black text-slate-800 tracking-tighter leading-none">${doctor.name}</h2><div class="text-4xl font-black text-hospital-primary uppercase mt-4">${date} à ${time}</div><div class="text-xl font-bold text-slate-400">${t(specialtyKey)}</div></div></div><button id="btn-confirm-final" class="btn-primary w-full text-5xl py-12 shadow-2xl">${t('success').toUpperCase()} ✅</button></div></div>`; }
function renderSuccess() { return `<div class="text-center space-y-20 py-20 reveal max-w-4xl mx-auto"><div class="text-[180px] leading-none animate-bounce">🎊</div><h1 class="text-7xl font-black text-hospital-primary uppercase tracking-tighter leading-none">${t('success')}</h1><button id="btn-restart" class="btn-outline mx-auto text-4xl px-20 py-10 border-[8px] rounded-[48px] shadow-2xl">${t('home').toUpperCase()} 🏠</button></div>`; }

function attachEventListeners() {
  document.querySelectorAll('.lang-btn').forEach(btn => { btn.onclick = () => { state.lang = btn.dataset.lang; voice.setLanguage(state.lang); updateUI(); }; });
  document.querySelectorAll('.profile-option').forEach(btn => { btn.onclick = async () => { state.mode = btn.dataset.mode; state.isLoading = true; updateUI(); state.data.specialties = await api.getSpecialties(); state.isLoading = false; if (state.mode === 'beginner') voice.enabled = true; navigateTo('specialty'); }; });
  document.querySelectorAll('.specialty-btn').forEach(btn => { btn.onclick = async () => { state.selections.specialtyId = btn.dataset.id; state.selections.specialtyKey = btn.dataset.key; state.isLoading = true; updateUI(); state.data.doctors = await api.getDoctorsBySpecialty(btn.dataset.id); state.isLoading = false; navigateTo('doctor'); }; });
  document.querySelectorAll('.doctor-btn').forEach(btn => { btn.onclick = async () => { state.selections.doctor = state.data.doctors.find(d => d.id == btn.dataset.id); state.isLoading = true; updateUI(); state.data.slots = await api.getSlotsByDoctor(btn.dataset.id); state.isLoading = false; navigateTo('schedule'); }; });
  document.querySelectorAll('.time-slot-btn').forEach(btn => { btn.onclick = () => { state.selections.date = btn.dataset.date; state.selections.time = btn.dataset.time; updateUI(); }; });
  const btnConfirmSchedule = document.getElementById('btn-confirm-schedule'); if (btnConfirmSchedule) btnConfirmSchedule.onclick = () => navigateTo('contact');
  const btnSubmitContact = document.getElementById('btn-submit-contact'); if (btnSubmitContact) btnSubmitContact.onclick = async () => { const phone = document.getElementById('input-phone').value; if (phone.length < 10) return; state.selections.phone = phone; state.isLoading = true; updateUI(); await notificationService.sendSMSVerification(phone); state.isLoading = false; navigateTo('verification'); };
  const btnVerifyCode = document.getElementById('btn-verify-code'); if (btnVerifyCode) { btnVerifyCode.onclick = () => { const code = Array.from(document.querySelectorAll('.code-input')).map(i => i.value).join(''); if (notificationService.verifyCode(state.selections.phone, code)) navigateTo('confirm'); }; }
  const btnBack = document.getElementById('btn-back'); if (btnBack) btnBack.onclick = goBack;
  const btnUndo = document.getElementById('btn-undo'); if (btnUndo) btnUndo.onclick = goBack;
  const btnConfirmFinal = document.getElementById('btn-confirm-final'); if (btnConfirmFinal) btnConfirmFinal.onclick = async () => { state.isLoading = true; updateUI(); await api.bookAppointment(state.selections); state.isLoading = false; state.step = 'success'; updateUI(); };
  const btnRestart = document.getElementById('btn-restart'); if (btnRestart) btnRestart.onclick = () => location.reload();
  const julienBtn = document.getElementById('julien-btn'); if (julienBtn) { julienBtn.onclick = () => { document.getElementById('julien-window').classList.toggle('hidden'); }; }
  const chatSend = document.getElementById('chat-send'); if (chatSend) { chatSend.onclick = async () => { const input = document.getElementById('chat-input'); const text = input.value.trim(); if (!text) return; addBotMessage(text, 'user'); input.value = ''; const typing = document.getElementById('bot-typing'); typing?.classList.remove('hidden'); const response = await botBrain.process(text, state.step, state.lang); typing?.classList.add('hidden'); addBotMessage(response.text, 'bot'); if (response.action === 'highlight') highlightElement(`#${response.targetId}`); }; }
  const tutoBtn = document.getElementById('tuto-btn'); if (tutoBtn) tutoBtn.onclick = () => startTutorialForStep(state.step, state.lang);
  const tutoBtnProfile = document.getElementById('tuto-btn-profile'); if (tutoBtnProfile) tutoBtnProfile.onclick = () => startTutorialForStep('profile', state.lang);
  
  const btnOpenSidebar = document.getElementById('btn-open-sidebar'); if (btnOpenSidebar) btnOpenSidebar.onclick = () => { state.isSidebarOpen = true; updateUI(); };
  const btnCloseSidebar = document.getElementById('btn-close-sidebar'); if (btnCloseSidebar) btnCloseSidebar.onclick = () => { state.isSidebarOpen = false; updateUI(); };
  const sidebarOverlay = document.getElementById('sidebar-overlay'); if (sidebarOverlay) sidebarOverlay.onclick = () => { state.isSidebarOpen = false; updateUI(); };
  
  document.querySelectorAll('.sidebar-link').forEach(btn => { 
    btn.onclick = () => { 
      state.isSidebarOpen = false; 
      navigateTo(btn.dataset.step); 
    }; 
  });
  
  const searchInput = document.getElementById('specialty-search');
  if (searchInput) {
    searchInput.oninput = (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.category-container').forEach(catDiv => {
        const catKey = catDiv.dataset.catkey;
        const catTitleStr = t(catKey).toLowerCase();
        let hasVisibleSpecialty = false;
        
        catDiv.querySelectorAll('.specialty-btn').forEach(btn => {
          const specStr = t(btn.dataset.key).toLowerCase();
          if (specStr.includes(query) || catTitleStr.includes(query)) {
            btn.style.display = '';
            hasVisibleSpecialty = true;
          } else {
            btn.style.display = 'none';
          }
        });
        
        const contentDiv = catDiv.querySelector('.category-content');
        const iconDiv = catDiv.querySelector('.category-icon');
        
        if (hasVisibleSpecialty) {
          catDiv.style.display = '';
          if (query.length > 0) {
            contentDiv.classList.remove('hidden');
            contentDiv.classList.add('block');
            iconDiv.classList.add('rotate-180');
            catDiv.classList.add('border-hospital-primary', 'shadow-xl');
            catDiv.classList.remove('border-slate-100', 'shadow-sm');
          } else {
            contentDiv.classList.add('hidden');
            contentDiv.classList.remove('block');
            iconDiv.classList.remove('rotate-180');
            catDiv.classList.remove('border-hospital-primary', 'shadow-xl');
            catDiv.classList.add('border-slate-100', 'shadow-sm');
          }
        } else {
          catDiv.style.display = 'none';
        }
      });
    };
  }

  document.querySelectorAll('.category-toggle').forEach(btn => {
    btn.onclick = () => {
      const catDiv = btn.closest('.category-container');
      const contentDiv = catDiv.querySelector('.category-content');
      const iconDiv = catDiv.querySelector('.category-icon');
      const isHidden = contentDiv.classList.contains('hidden');
      
      if (isHidden) {
        contentDiv.classList.remove('hidden');
        contentDiv.classList.add('block');
        iconDiv.classList.add('rotate-180');
        catDiv.classList.add('border-hospital-primary', 'shadow-xl');
        catDiv.classList.remove('border-slate-100', 'shadow-sm');
      } else {
        contentDiv.classList.add('hidden');
        contentDiv.classList.remove('block');
        iconDiv.classList.remove('rotate-180');
        catDiv.classList.remove('border-hospital-primary', 'shadow-xl');
        catDiv.classList.add('border-slate-100', 'shadow-sm');
      }
    };
  });
}

function addBotMessage(text, type) {
  state.chatHistory.push({ text, type });
  const content = document.getElementById('chat-content');
  if (content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `${type === 'user' ? 'bg-hospital-primary text-white ml-8 rounded-tr-none' : 'bg-white text-slate-700 mr-8 rounded-tl-none border-2 border-slate-100'} p-4 rounded-2xl font-bold shadow-sm reveal mb-4`;
    msgDiv.innerText = text; content.appendChild(msgDiv); content.scrollTop = content.scrollHeight;
    if (type === 'bot' && voice.enabled) voice.speak(text);
  }
}
updateUI();

if (!localStorage.getItem('zas_tutorial_completed')) {
  localStorage.setItem('zas_tutorial_completed', 'true');
  setTimeout(() => startTutorialForStep('profile', state.lang), 500);
}
