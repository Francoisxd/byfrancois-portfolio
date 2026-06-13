import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

import { getAbreCursosSimulatorHTML } from './components/AbreCursosSimulator.js';
import { modalData } from './data/modalData.js';
import { translations } from './translations.js';
// Inject Abre Cursos Simulator
const acContainer = document.getElementById('abreCursosContainer');
if (acContainer) {
  acContainer.innerHTML = getAbreCursosSimulatorHTML();
}


// Global variables for language state
let currentLang = 'es';
const CONTACT_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

// --- Preloader Simulation ---
const preloader = document.getElementById('preloader');
const loadBar = document.getElementById('loadBar');
const loadText = document.getElementById('loadText');

if (preloader && loadBar && loadText) {
  let progress = 0;
  const loadSteps = [
    { threshold: 30, textKey: 'preloader_text_1' },
    { threshold: 70, textKey: 'preloader_text_2' },
    { threshold: 100, textKey: 'preloader_text_3' }
  ];

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    
    loadBar.style.width = progress + '%';
    
    const activeStep = loadSteps.find(step => progress <= step.threshold);
    if (activeStep) {
      loadText.innerText = translations[currentLang][activeStep.textKey] || translations['es'][activeStep.textKey];
    }
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    }
  }, 100);
}

// --- Custom Cursor Trail ---
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice && cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }, 80);
  });

  const updateCursorHoverHandlers = () => {
    document.querySelectorAll('a, button, .contact-item, .project-link, .switch-btn, .lang-btn, .pir-btn, .ac-tab, .ctk-btn').forEach(el => {
      el.removeEventListener('mouseenter', onMouseEnterLink);
      el.removeEventListener('mouseleave', onMouseLeaveLink);
      
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });
  };

  const onMouseEnterLink = () => {
    ring.style.width = '48px';
    ring.style.height = '48px';
    ring.style.borderColor = 'rgba(74,158,255,0.8)';
  };

  const onMouseLeaveLink = () => {
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(74,158,255,0.5)';
  };
  
  updateCursorHoverHandlers();
  window.updateCursorHoverHandlers = updateCursorHoverHandlers;
} else {
  if (cursor) cursor.style.display = 'none';
  if (ring) ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}


// --- Language Switcher Logic ---
const changeLanguage = (lang) => {
  currentLang = lang;
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let translation = translations[lang][key] || translations['es'][key] || key;
    
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const placeholderKey = el.getAttribute('data-i18n-placeholder');
      if (placeholderKey) {
        el.setAttribute('placeholder', translations[lang][placeholderKey] || translations['es'][placeholderKey]);
      }
    } else {
      if (translation.includes('<')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  updateSimulatorText();
  updateAcSimulatorText();
  if (typeof window.updateModalTranslation === 'function') {
    window.updateModalTranslation();
  }
};

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedLang = btn.getAttribute('data-lang');
    changeLanguage(selectedLang);
  });
});


// --- Intersection Observer for Scroll Reveals ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// --- Smart Office Simulator Logic ---
let lightsOn = true;
let acOn = false;
let motionDetected = true;
let temperature = 24.5;
let humidity = 58;
let accumulatedSavings = 0.0;
let pirTimer = null;

const btnLights = document.getElementById('btnLights');
const btnAC = document.getElementById('btnAC');
const btnMotionYes = document.getElementById('btnMotionYes');
const btnMotionNo = document.getElementById('btnMotionNo');

const ledLights = document.getElementById('ledLights');
const ledAC = document.getElementById('ledAC');
const ledMotion = document.getElementById('ledMotion');

const valPower = document.getElementById('valPower');
const valDaily = document.getElementById('valDaily');
const valTemp = document.getElementById('valTemp');
const valHumidity = document.getElementById('valHumidity');
const valSavings = document.getElementById('valSavings');
const simAlert = document.getElementById('simAlert');

const BASE_POWER_W = 120;
const LIGHTS_POWER_W = 80;
const AC_POWER_W = 1200;

const updateSimulatorUI = () => {
  let currentPower = BASE_POWER_W;
  if (lightsOn) currentPower += LIGHTS_POWER_W;
  if (acOn) currentPower += AC_POWER_W;
  
  const dailyKwh = (currentPower * 24) / 1000;
  
  if (btnLights) btnLights.classList.toggle('active', lightsOn);
  if (btnAC) btnAC.classList.toggle('active', acOn);
  if (btnMotionYes) btnMotionYes.classList.toggle('active', motionDetected);
  if (btnMotionNo) btnMotionNo.classList.toggle('active', !motionDetected);
  
  if (ledLights) ledLights.className = `sim-led-indicator ${lightsOn ? 'active-blue' : ''}`;
  if (ledAC) ledAC.className = `sim-led-indicator ${acOn ? 'active-yellow' : ''}`;
  if (ledMotion) ledMotion.className = `sim-led-indicator ${motionDetected ? 'active-green' : ''}`;
  
  if (valPower) valPower.innerText = `${currentPower} W`;
  if (valDaily) valDaily.innerText = `${dailyKwh.toFixed(2)} kWh`;
  if (valTemp) valTemp.innerText = `${temperature.toFixed(1)} °C`;
  if (valHumidity) valHumidity.innerText = `${humidity.toFixed(0)} %`;
  if (valSavings) valSavings.innerText = `${accumulatedSavings.toFixed(3)} kWh`;
};

const updateSimulatorText = () => {
  if (btnLights) {
    btnLights.innerText = lightsOn ? (currentLang === 'es' ? 'ENCENDIDO' : 'ON') : (currentLang === 'es' ? 'APAGADO' : 'OFF');
  }
  if (btnAC) {
    btnAC.innerText = acOn ? (currentLang === 'es' ? 'ENCENDIDO' : 'ON') : (currentLang === 'es' ? 'APAGADO' : 'OFF');
  }
  if (btnMotionYes) btnMotionYes.innerText = currentLang === 'es' ? 'SÍ' : 'YES';
  if (btnMotionNo) btnMotionNo.innerText = currentLang === 'es' ? 'NO' : 'NO';
};

const runSimulatorPhysics = () => {
  setInterval(() => {
    const targetTemp = acOn ? 18.0 : 26.5;
    temperature += (targetTemp - temperature) * 0.05;
    
    const targetHumidity = acOn ? 42 : 58;
    humidity += (targetHumidity - humidity) * 0.05;
    
    let currentPower = BASE_POWER_W;
    if (lightsOn) currentPower += LIGHTS_POWER_W;
    if (acOn) currentPower += AC_POWER_W;
    
    const powerDifferenceW = Math.max(0, 1400 - currentPower);
    accumulatedSavings += (powerDifferenceW / 1000) * (1 / 3600);
    
    updateSimulatorUI();
  }, 1000);
};

if (btnLights) {
  btnLights.addEventListener('click', () => {
    lightsOn = !lightsOn;
    updateSimulatorUI();
    updateSimulatorText();
  });
}

if (btnAC) {
  btnAC.addEventListener('click', () => {
    acOn = !acOn;
    updateSimulatorUI();
    updateSimulatorText();
  });
}

const triggerAutomationTimeout = () => {
  if (pirTimer) clearTimeout(pirTimer);
  
  if (simAlert) {
    simAlert.style.display = 'block';
    simAlert.querySelector('.sim-alert-message').innerText = translations[currentLang]['sim_automation_active'];
  }
  
  pirTimer = setTimeout(() => {
    lightsOn = false;
    updateSimulatorUI();
    updateSimulatorText();
    
    if (simAlert) {
      simAlert.querySelector('.sim-alert-message').innerText = translations[currentLang]['sim_lights_auto_off'];
    }
  }, 5000);
};

if (btnMotionYes) {
  btnMotionYes.addEventListener('click', () => {
    motionDetected = true;
    lightsOn = true;
    if (pirTimer) {
      clearTimeout(pirTimer);
      pirTimer = null;
    }
    if (simAlert) simAlert.style.display = 'none';
    
    updateSimulatorUI();
    updateSimulatorText();
  });
}

if (btnMotionNo) {
  btnMotionNo.addEventListener('click', () => {
    motionDetected = false;
    updateSimulatorUI();
    updateSimulatorText();
    triggerAutomationTimeout();
  });
}

updateSimulatorUI();
updateSimulatorText();
runSimulatorPhysics();


// --- Abre-Cursos Pro CustomTkinter App Simulator ---
let acCourses = [
  { id: "73d991d1", nombre: "PROBABILIDAD Y ESTADÍSTICA", url: "https://zoom.us/j/123456789?pwd=abcd", hora: "19", minuto: "30", dias: [1, 3], activo: true },
  { id: "41fd1bfa", nombre: "CÁLCULO 1", url: "https://teams.microsoft.com/l/meetup-join/123", hora: "19", minuto: "30", dias: [2, 4], activo: true },
  { id: "9a118daf", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", url: "https://canvas.upn.edu.pe/courses/123", hora: "19", minuto: "30", dias: [3, 5], activo: true }
];

let acSettings = {
  vacaciones: false,
  tolerancia_min: 30,
  notif_anticipacion: 5,
  notif_sonido: "Reminder",
  browser: "Chrome"
};

let acStats = {
  asistencias: 0,
  retrasos: 0,
  omitidos: 0
};

// Simulated Virtual Clock: starts Sunday (Day 0) at 19:20
let simDate = new Date();
simDate.setHours(19, 20, 0);

let firedEventsToday = {};
let notifiedEventsToday = {};

// Synthesizer notification sounds using Web Audio API
const playNotifySound = (type) => {
  if (type === "Silencioso") return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq, duration, typeOsc = "sine", startTime = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = typeOsc;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    if (type === "SMS") {
      playTone(880, 0.15, "triangle");
      playTone(1760, 0.1, "sine", 0.05);
    } else if (type === "Mail") {
      playTone(523.25, 0.2, "sine");
      playTone(659.25, 0.2, "sine", 0.1);
      playTone(783.99, 0.3, "sine", 0.2);
    } else if (type === "Alarm") {
      playTone(600, 0.1, "square");
      playTone(600, 0.1, "square", 0.15);
      playTone(600, 0.1, "square", 0.3);
    } else { // Reminder / Default
      playTone(1000, 0.1, "sine");
      playTone(1000, 0.2, "sine", 0.12);
    }
  } catch (err) {
    console.error("Audio Context failed to start:", err);
  }
};

// Abre Cursos Pro Full JS Engine
const initAbreCursosLogic = () => {
  const root = document.getElementById('abreCursosContainer');
  if (!root) return;

  // ── State (from cursos.json) ─────────────────────────────────────────────
  let courses = [
    { id: "73d991d1", nombre: "PROBABILIDAD Y ESTADÍSTICA", url: "https://upn.class.com/class/2b048859-7fa2-444b-8a0d-bd541a033f6a", hora: "19", minuto: "30", dias: [1], activo: true },
    { id: "41fd1bfa", nombre: "CÁLCULO 1",                  url: "https://upn.class.com/class/578cbf4b-8068-4b94-aadf-e0a767c4704f", hora: "19", minuto: "30", dias: [2], activo: true },
    { id: "9a118daf", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", url: "https://upn.class.com/class/acacca56-481d-4253-8405-10c1b08a676d?is_lti=true", hora: "19", minuto: "30", dias: [3], activo: true },
    { id: "5171c36b", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", url: "https://upn.class.com/class/acacca56-481d-4253-8405-10c1b08a676d?is_lti=true", hora: "21", minuto: "10", dias: [5], activo: true },
    { id: "95036a59", nombre: "PROYECTO SOCIAL",            url: "https://upn.class.com/class/8499fc46-cddb-4f57-8d59-bcbb45f6230b", hora: "17", minuto: "50", dias: [6], activo: true }
  ];

  const dMap = {1:'Lun',2:'Mar',3:'Mié',4:'Jue',5:'Vie',6:'Sáb',7:'Dom'};
  let lastAuto = null;

  // ── Toast ────────────────────────────────────────────────────────────────
  const toast = (msg) => {
    let t = document.getElementById('winToast');
    let m = document.getElementById('winToastMsg');
    if (t && m) { m.innerText = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3500); }
  };

  // ── Refs ──────────────────────────────────────────────────────────────────
  const cardList  = root.querySelector('#acCardList');
  const clockEl   = root.querySelector('#acClock');
  const proxEl    = root.querySelector('#acProxima');
  const form      = root.querySelector('#acForm');
  const searchInp = root.querySelector('#acSearch');

  // ── Next class algorithm (same as Python) ────────────────────────────────
  const calcNext = () => {
    if (!proxEl) return;
    const now = new Date();
    const todayPy = now.getDay() === 0 ? 7 : now.getDay();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let best = null;
    courses.filter(c => c.activo).forEach(c => {
      const cMins = parseInt(c.hora) * 60 + parseInt(c.minuto);
      c.dias.forEach(d => {
        let diff = d - todayPy;
        if (diff < 0 || (diff === 0 && cMins <= nowMins)) diff += 7;
        const wait = diff * 1440 + (cMins - nowMins);
        if (!best || wait < best.wait) best = { ...c, wait, diff };
      });
    });
    if (!best) { proxEl.textContent = ''; return; }
    const h = Math.floor(best.wait / 60), m = best.wait % 60;
    proxEl.textContent = best.diff === 0
      ? `Próxima: ${best.nombre} (en ${h}h ${m}m)`
      : `Próxima: ${best.nombre} (en ${best.diff} día${best.diff > 1 ? 's' : ''})`;
  };

  // ── Render cards ─────────────────────────────────────────────────────────
  const render = (filter = '') => {
    if (!cardList) return;
    cardList.innerHTML = '';
    const filtered = filter
      ? courses.filter(c => c.nombre.toLowerCase().includes(filter.toLowerCase()))
      : courses;

    if (filtered.length === 0) {
      cardList.innerHTML = '<div class="acEmpty">Sin cursos programados.</div>';
      return;
    }

    filtered.forEach(c => {
      const days = c.dias.map(d => dMap[d]).join(', ');

      let plat = 'UPN', platBg = '#5c2d91';
      const u = c.url.toLowerCase();
      if (u.includes('zoom'))   { plat = 'Zoom';  platBg = '#1e7e34'; }
      else if (u.includes('teams')) { plat = 'Teams'; platBg = '#d9534f'; }
      else if (u.includes('web'))   { plat = 'Web';   platBg = '#0275d8'; }

      const maxUrl = c.url.length > 45 ? c.url.substring(0, 43) + '...' : c.url;

      const card = document.createElement('div');
      card.className = 'acCard' + (c.activo ? '' : ' acCardOff');
      card.innerHTML = `
        <div class="acCardLeft">
          <div class="acCardTop">
            <span class="acCardName">${c.nombre}</span>
            <span class="acCardTime">${c.hora}:${c.minuto}</span>
          </div>
          <div class="acCardBot">
            <span class="acCardDays">${days} •</span>
            <span class="acCardPlat" style="background:${c.activo ? platBg : '#333'}">${plat}</span>
            <span class="acCardUrl" data-url="${c.url}">${maxUrl}</span>
          </div>
        </div>
        <div class="acCardRight">
          <label class="acSwitch">
            <input type="checkbox" class="acToggle" data-id="${c.id}" ${c.activo ? 'checked' : ''}>
            <span class="acSlider"></span>
          </label>
          <button class="acBtn acBtnGreen acBtnOpen" data-id="${c.id}">Abrir</button>
          <button class="acBtn acBtnOrange acBtnEdit" data-id="${c.id}">Editar</button>
          <button class="acBtn acBtnRed acBtnDel" data-id="${c.id}">Borrar</button>
        </div>
      `;
      cardList.appendChild(card);
    });

    calcNext();
  };

  // ── Clock & auto-launch loop ─────────────────────────────────────────────
  if (clockEl) {
    setInterval(() => {
      const now = new Date();
      const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      clockEl.textContent = `${days[now.getDay()]} ${now.toLocaleTimeString('es-PE', { hour12: false })}`;

      if (now.getSeconds() === 0) {
        const todayPy = now.getDay() === 0 ? 7 : now.getDay();
        const hh = String(now.getHours()).padStart(2,'0');
        const mm = String(now.getMinutes()).padStart(2,'0');
        courses.forEach(c => {
          if (c.activo && c.hora === hh && c.minuto === mm && c.dias.includes(todayPy)) {
            if (lastAuto !== c.id) {
              lastAuto = c.id;
              toast(`⏰ Abre Cursos: Abriendo ${c.nombre}...`);
              window.open(c.url, '_blank');
            }
          }
        });
        calcNext();
      }
    }, 1000);
  }

  // ── Form submit ──────────────────────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nombre  = root.querySelector('#acInNombre').value.trim().toUpperCase();
      const url     = root.querySelector('#acInUrl').value.trim();
      const hora    = root.querySelector('#acInHora').value;
      const minuto  = root.querySelector('#acInMin').value;
      const checked = [...root.querySelectorAll('.ac-day-check:checked')].map(cb => parseInt(cb.value));
      if (!checked.length) { toast('Selecciona al menos un día'); return; }
      courses.push({ id: Math.random().toString(36).slice(2,10), nombre, url, hora, minuto, dias: checked, activo: true });
      render();
      form.reset();
      toast(`✅ Curso agregado: ${nombre}`);
    });
  }

  // ── Delegated events on card list ────────────────────────────────────────
  if (cardList) {
    cardList.addEventListener('click', e => {
      // Toggle
      if (e.target.classList.contains('acToggle')) {
        const c = courses.find(x => x.id === e.target.dataset.id);
        if (c) { c.activo = e.target.checked; render(searchInp ? searchInp.value : ''); }
      }
      // Open
      if (e.target.classList.contains('acBtnOpen')) {
        const c = courses.find(x => x.id === e.target.dataset.id);
        if (c) { toast(`🚀 Abriendo ${c.nombre}...`); window.open(c.url, '_blank'); }
      }
      // Edit
      if (e.target.classList.contains('acBtnEdit')) {
        const c = courses.find(x => x.id === e.target.dataset.id);
        if (c) {
          root.querySelector('#acInNombre').value = c.nombre;
          root.querySelector('#acInUrl').value    = c.url;
          root.querySelector('#acInHora').value   = c.hora;
          root.querySelector('#acInMin').value    = c.minuto;
          root.querySelectorAll('.ac-day-check').forEach(cb => { cb.checked = c.dias.includes(parseInt(cb.value)); });
          courses = courses.filter(x => x.id !== c.id);
          render();
          toast(`✏️ Editando: ${c.nombre}`);
        }
      }
      // Delete
      if (e.target.classList.contains('acBtnDel')) {
        const c = courses.find(x => x.id === e.target.dataset.id);
        if (c) { courses = courses.filter(x => x.id !== c.id); render(searchInp ? searchInp.value : ''); toast(`🗑️ Eliminado: ${c.nombre}`); }
      }
      // Click URL
      if (e.target.classList.contains('acCardUrl')) {
        const url = e.target.dataset.url;
        if (url) window.open(url, '_blank');
      }
    });
  }

  // ── Search ────────────────────────────────────────────────────────────────
  if (searchInp) {
    searchInp.addEventListener('input', () => render(searchInp.value));
  }

  // ── Tab switching ─────────────────────────────────────────────────────────
  root.querySelectorAll('.acTabBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.acTabBtn').forEach(b => b.classList.remove('acActive'));
      btn.classList.add('acActive');
      root.querySelectorAll('.acTabPane').forEach(p => {
        p.classList.toggle('acHidden', p.id !== btn.dataset.target);
      });
    });
  });

  // ── Init ─────────────────────────────────────────────────────────────────
  render();
};

// Safe init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initAbreCursosLogic, 300));
} else {
  setTimeout(initAbreCursosLogic, 300);
}


// Call logic safely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAbreCursosLogic, 500);
  });
} else {
  setTimeout(initAbreCursosLogic, 500);
}
