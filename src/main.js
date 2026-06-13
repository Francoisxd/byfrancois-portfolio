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

// UI DOM References
const acClockDisplay = document.getElementById('acClockDisplay');
const acCardList = document.getElementById('acCardList');
const acLogBox = document.getElementById('acLogBox');
const acStatAsis = document.getElementById('acStatAsis');
const acStatRetr = document.getElementById('acStatRetr');
const acStatOmit = document.getElementById('acStatOmit');
const acVacationBanner = document.getElementById('acVacationBanner');

// Forms fields references
const acFormCourse = document.getElementById('acFormCourse');
const acInNombre = document.getElementById('acInNombre');
const acInUrl = document.getElementById('acInUrl');
const acInHora = document.getElementById('acInHora');
const acInMin = document.getElementById('acInMin');
const acBtnAdd = document.getElementById('acBtnAdd');

// Settings Fields
const acSetVacation = document.getElementById('acSetVacation');
const acSetTolerancia = document.getElementById('acSetTolerancia');
const acSetAnticipacion = document.getElementById('acSetAnticipacion');
const acSetSonido = document.getElementById('acSetSonido');
const acSetBrowser = document.getElementById('acSetBrowser');

// Notification Toast References
const winToast = document.getElementById('winToast');
const winToastTitle = document.getElementById('winToastTitle');
const winToastMsg = document.getElementById('winToastMsg');

// Switch tabs handler
document.querySelectorAll('.ac-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');
    document.querySelectorAll('.ac-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ac-tab-pane').forEach(p => p.classList.remove('active'));
    
    tab.classList.add('active');
    const pane = document.getElementById(`acTab-${targetTab}`);
    if (pane) pane.classList.add('active');
  });
});

// Windows Toast popup trigger
const triggerToast = (title, message) => {
  if (!winToast) return;
  winToastTitle.innerText = title;
  winToastMsg.innerText = message;
  winToast.classList.add('show');
  playNotifySound(acSettings.notif_sonido);
  
  setTimeout(() => {
    winToast.classList.remove('show');
  }, 4000);
};

const renderAcCourses = () => {
  if (!acCardList) return;
  acCardList.innerHTML = '';
  
  acCourses.forEach(c => {
    const card = document.createElement('div');
    card.className = 'ac-card';
    
    // Day display formatting
    const daysArr = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const daysStr = c.dias.map(d => daysArr[d]).join(', ');
    
    let urlClean = c.url;
    if (urlClean.length > 30) urlClean = urlClean.substring(0, 27) + '...';
    
    let badgeClass = 'ac-badge';
    let badgeText = 'Web';
    if (c.url.toLowerCase().includes('zoom')) { badgeClass += ' green'; badgeText = 'Zoom'; }
    if (c.url.toLowerCase().includes('teams')) { badgeClass += ' orange'; badgeText = 'Teams'; }
    
    card.innerHTML = `
      <div class="ac-card-left">
        <div class="ac-card-title">${c.nombre} <span class="ac-app-clock" style="margin-left: 8px;">${c.hora}:${c.minuto}</span></div>
        <div class="ac-card-meta">${daysStr} • <span class="${badgeClass}">${badgeText}</span> ${urlClean}</div>
      </div>
      <div class="ac-card-right">
        <button class="ctk-btn green js-ac-open" type="button" data-course-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 10px;">${currentLang === 'es' ? 'Abrir' : 'Open'}</button>
        <button class="ctk-btn red js-ac-delete" type="button" data-course-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 10px;">${currentLang === 'es' ? 'Borrar' : 'Delete'}</button>
      </div>
    `;
    acCardList.appendChild(card);
  });

  acCardList.querySelectorAll('.js-ac-open').forEach(btn => {
    btn.addEventListener('click', () => acTriggerManualOpen(btn.dataset.courseId));
  });
  acCardList.querySelectorAll('.js-ac-delete').forEach(btn => {
    btn.addEventListener('click', () => acTriggerDeleteCourse(btn.dataset.courseId));
  });
  
  if (window.updateCursorHoverHandlers) window.updateCursorHoverHandlers();
};

const addAcLog = (text) => {
  if (!acLogBox) return;
  acLogBox.textContent += `[${new Date().toLocaleTimeString()}] ${text}\n`;
  acLogBox.scrollTop = acLogBox.scrollHeight;
};

const updateAcStatsUI = () => {
  if (acStatAsis) acStatAsis.innerText = acStats.asistencias;
  if (acStatRetr) acStatRetr.innerText = acStats.retrasos;
  if (acStatOmit) acStatOmit.innerText = acStats.omitidos;
};

// Virtual Scheduler check loop
const runAcSchedulerCheck = () => {
  const hh = String(simDate.getHours()).padStart(2, '0');
  const mm = String(simDate.getMinutes()).padStart(2, '0');
  const weekday = simDate.getDay(); // 0 = Dom, 1 = Lun, etc.
  const todayKey = `${simDate.getFullYear()}-${simDate.getMonth()}-${simDate.getDate()}`;
  
  const currentTotalMin = simDate.getHours() * 60 + simDate.getMinutes();
  
  acCourses.forEach(c => {
    if (!c.activo) return;
    if (!c.dias.includes(weekday)) return;
    
    const courseTotalMin = parseInt(c.hora) * 60 + parseInt(c.minuto);
    const diff = currentTotalMin - courseTotalMin;
    const fireKey = `${c.id}-${todayKey}-${c.hora}:${c.minuto}`;
    
    // 1. Notification anticipacion check
    if (acSettings.notif_anticipacion > 0 && diff === -acSettings.notif_anticipacion && !notifiedEventsToday[fireKey] && !acSettings.vacaciones) {
      notifiedEventsToday[fireKey] = true;
      triggerToast(
        currentLang === 'es' ? `Clase en ${acSettings.notif_anticipacion} minutos` : `Class in ${acSettings.notif_anticipacion} mins`,
        currentLang === 'es' ? `Prepárate, tu curso '${c.nombre}' empezará pronto.` : `Get ready, your class '${c.nombre}' starts soon.`
      );
    }
    
    // 2. Class opening trigger
    if (diff >= 0 && diff <= acSettings.tolerancia_min) {
      if (firedEventsToday[fireKey]) return;
      firedEventsToday[fireKey] = true;
      
      if (acSettings.vacaciones) {
        acStats.omitidos++;
        addAcLog(currentLang === 'es' ? `Omitido (Modo Vacaciones): ${c.nombre}` : `Omitted (Vacation Mode): ${c.nombre}`);
        updateAcStatsUI();
        return;
      }
      
      // Simulate launching window
      if (diff > 0) {
        acStats.retrasos++;
        addAcLog(
          currentLang === 'es' ? 
            `Abierto: ${c.nombre} (con ${diff} min de retraso) usando ${acSettings.browser}` : 
            `Opened: ${c.nombre} (with ${diff} min delay) using ${acSettings.browser}`
        );
        triggerToast(
          currentLang === 'es' ? "Clase abierta con retraso" : "Class opened with delay",
          currentLang === 'es' ? `Abriendo '${c.nombre}' en ${acSettings.browser}` : `Opening '${c.nombre}' in ${acSettings.browser}`
        );
      } else {
        acStats.asistencias++;
        addAcLog(
          currentLang === 'es' ? 
            `Abierto: ${c.nombre} usando ${acSettings.browser}` : 
            `Opened: ${c.nombre} using ${acSettings.browser}`
        );
        triggerToast(
          currentLang === 'es' ? "Clase abierta" : "Class opened",
          currentLang === 'es' ? `Abriendo '${c.nombre}' en ${acSettings.browser}` : `Opening '${c.nombre}' in ${acSettings.browser}`
        );
      }
      updateAcStatsUI();
      
      // Open simulated modal window in web
      const zoomOrTeams = c.url.toLowerCase().includes('zoom') || c.url.toLowerCase().includes('teams');
      window.open(zoomOrTeams ? c.url : 'https://canvas.upn.edu.pe/', '_blank', 'noopener,noreferrer');
    }
  });
};

// Tick Virtual clock
const tickAcClock = (advanceMinutes = 1) => {
  simDate.setMinutes(simDate.getMinutes() + advanceMinutes);
  
  // Format simulated time
  const daysName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const daysNameEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const dayStr = currentLang === 'es' ? daysName[simDate.getDay()] : daysNameEn[simDate.getDay()];
  const hh = String(simDate.getHours()).padStart(2, '0');
  const mm = String(simDate.getMinutes()).padStart(2, '0');
  
  if (acClockDisplay) {
    acClockDisplay.innerText = `${dayStr} ${hh}:${mm}`;
  }
  
  runAcSchedulerCheck();
};

// Simulated time advancement controls
const projectAbrecursosAdvance1Btn = document.getElementById('project-abrecursos-advance-1-btn');
const projectAbrecursosAdvance10Btn = document.getElementById('project-abrecursos-advance-10-btn');
const projectAbrecursosJumpBtn = document.getElementById('project-abrecursos-jump-btn');

if (projectAbrecursosAdvance1Btn) {
  projectAbrecursosAdvance1Btn.addEventListener('click', () => {
    tickAcClock(1);
  });
}
if (projectAbrecursosAdvance10Btn) {
  projectAbrecursosAdvance10Btn.addEventListener('click', () => {
    tickAcClock(10);
  });
}
if (projectAbrecursosJumpBtn) {
  projectAbrecursosJumpBtn.addEventListener('click', () => {
    // Jump time to Sunday 19:29 (one minute before Probabilidad class starts)
    simDate.setHours(19, 29, 0);
    // Sunday is Day 0
    const currentDay = simDate.getDay();
    if (currentDay !== 1) { // Set to Monday (1)
      const diff = 1 - currentDay;
      simDate.setDate(simDate.getDate() + diff);
    }
    tickAcClock(0); // update clock text immediately
    addAcLog(currentLang === 'es' ? "Tiempo saltado al Lunes 19:29 (Previo a Clase)" : "Time jumped to Monday 19:29 (Pre-Class)");
  });
}

// Adjustments settings inputs binding
if (acSetVacation) {
  acSetVacation.addEventListener('change', () => {
    acSettings.vacaciones = acSetVacation.checked;
    if (acVacationBanner) {
      acVacationBanner.style.display = acSettings.vacaciones ? 'block' : 'none';
    }
    addAcLog(
      acSettings.vacaciones ? 
        (currentLang === 'es' ? "Ajuste: Modo Vacaciones ACTIVADO." : "Setting: Vacation Mode ENABLED.") : 
        (currentLang === 'es' ? "Ajuste: Modo Vacaciones DESACTIVADO." : "Setting: Vacation Mode DISABLED.")
    );
  });
}
if (acSetTolerancia) {
  acSetTolerancia.addEventListener('change', () => {
    acSettings.tolerancia_min = parseInt(acSetTolerancia.value);
    addAcLog(currentLang === 'es' ? `Ajuste: Tolerancia cambiada a ${acSettings.tolerancia_min} min.` : `Setting: Tolerance changed to ${acSettings.tolerancia_min} min.`);
  });
}
if (acSetAnticipacion) {
  acSetAnticipacion.addEventListener('change', () => {
    acSettings.notif_anticipacion = parseInt(acSetAnticipacion.value);
    addAcLog(currentLang === 'es' ? `Ajuste: Anticipación cambiada a ${acSettings.notif_anticipacion} min.` : `Setting: Pre-notification changed to ${acSettings.notif_anticipacion} min.`);
  });
}
if (acSetSonido) {
  acSetSonido.addEventListener('change', () => {
    acSettings.notif_sonido = acSetSonido.value;
    addAcLog(currentLang === 'es' ? `Ajuste: Sonido cambiado a ${acSettings.notif_sonido}.` : `Setting: Sound tone changed to ${acSettings.notif_sonido}.`);
    playNotifySound(acSettings.notif_sonido);
  });
}
if (acSetBrowser) {
  acSetBrowser.addEventListener('change', () => {
    acSettings.browser = acSetBrowser.value;
    addAcLog(currentLang === 'es' ? `Ajuste: Navegador cambiado a ${acSettings.browser}.` : `Setting: Browser changed to ${acSettings.browser}.`);
  });
}

// Form Course adding handler
if (acFormCourse) {
  acFormCourse.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = acInNombre.value.trim().toUpperCase();
    const url = acInUrl.value.trim();
    const hora = acInHora.value;
    const min = acInMin.value;
    
    // Get checked days
    const checkedDays = [];
    document.querySelectorAll('.ac-day-check').forEach(chk => {
      if (chk.checked) checkedDays.push(parseInt(chk.value));
    });
    
    if (checkedDays.length === 0) {
      alert(currentLang === 'es' ? "Selecciona al menos un día." : "Select at least one day.");
      return;
    }
    
    const newCourse = {
      id: Math.random().toString(36).substr(2, 8),
      nombre,
      url,
      hora,
      minuto: min,
      dias: checkedDays,
      activo: true
    };
    
    acCourses.push(newCourse);
    renderAcCourses();
    addAcLog(currentLang === 'es' ? `Curso agregado: ${nombre} (${hora}:${min})` : `Course added: ${nombre} (${hora}:${min})`);
    
    // Reset form
    acFormCourse.reset();
  });
}

// Global hook triggers exposed for card actions
const acTriggerManualOpen = (cId) => {
  const c = acCourses.find(x => x.id === cId);
  if (!c) return;
  acStats.asistencias++;
  addAcLog(currentLang === 'es' ? `Abierto manualmente: ${c.nombre}` : `Manually opened: ${c.nombre}`);
  updateAcStatsUI();
  triggerToast(
    currentLang === 'es' ? "Clase abierta manualmente" : "Class manually opened", 
    currentLang === 'es' ? `Abriendo enlace de '${c.nombre}'` : `Opening link for '${c.nombre}'`
  );
  window.open(c.url, '_blank', 'noopener,noreferrer');
};

const acTriggerDeleteCourse = (cId) => {
  const c = acCourses.find(x => x.id === cId);
  if (!c) return;
  acCourses = acCourses.filter(x => x.id !== cId);
  renderAcCourses();
  addAcLog(currentLang === 'es' ? `Curso eliminado: ${c.nombre}` : `Course deleted: ${c.nombre}`);
};

const updateAcSimulatorText = () => {
  if (acBtnAdd) acBtnAdd.innerText = currentLang === 'es' ? "Agregar Curso" : "Add Course";
  // Reset logs box text
  renderAcCourses();
};

// Initial triggers
tickAcClock(0);
renderAcCourses();
updateAcStatsUI();
addAcLog("Abre-Cursos Pro inicializado correctamente.");


// --- Contact Form Submission ---
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    formStatus.className = 'form-status';
    formStatus.style.display = 'block';
    formStatus.innerText = translations[currentLang]['contact_form_sending'];
    
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });
      
      const result = await response.json();
      
      if (response.status === 200) {
        formStatus.className = 'form-status success';
        formStatus.innerText = translations[currentLang]['contact_form_success'];
        contactForm.reset();
      } else {
        formStatus.className = 'form-status error';
        formStatus.innerText = result.message || translations[currentLang]['contact_form_error'];
      }
    } catch (error) {
      formStatus.className = 'form-status error';
      formStatus.innerText = translations[currentLang]['contact_form_net_error'];
      console.error(error);
    }
  });
}

// --- Project Modal Controller (Smart Office & Abre Cursos Pro) ---
let activeProjectId = null;
let activeModalTab = 'desc';

const modalOverlay = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalProjectTitle');
const modalBody = document.getElementById('modalBodyContent');
const btnTabDesc = document.getElementById('btnModalTabDesc');
const btnTabExtra = document.getElementById('btnModalTabExtra');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Github API Releases dynamic cache
let latestRelease = {
  tag_name: 'v2.1.9',
  download_url: 'https://github.com/Francoisxd/abre-cursos/releases'
};

const fetchLatestRelease = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/Francoisxd/abre-cursos/releases/latest');
    if (response.ok) {
      const data = await response.json();
      latestRelease.tag_name = data.tag_name;
      const exeAsset = data.assets && data.assets.find(asset => asset.name.endsWith('.exe'));
      latestRelease.download_url = exeAsset ? exeAsset.browser_download_url : data.html_url;

    }
  } catch (err) {
    console.error("Failed to fetch latest GitHub release for Abre Cursos Pro:", err);
  }
};
// Trigger GitHub API Fetch
fetchLatestRelease();



const renderModalContent = () => {
  if (!activeProjectId) return;
  const project = modalData[activeProjectId];
  if (!project) return;
  
  modalTitle.innerText = project.title[currentLang] || project.title['es'];
  
  let html = project[activeModalTab][currentLang] || project[activeModalTab]['es'];
  
  // Inject GitHub release link dynamically
  if (activeProjectId === 'cursos' && activeModalTab === 'extra') {
    const downloadLabel = currentLang === 'es' ? 'Descargar Ejecutable .EXE' : 'Download Executable .EXE';
    const releaseText = currentLang === 'es' ? `Versión oficial disponible: <strong>${latestRelease.tag_name}</strong>` : `Official version available: <strong>${latestRelease.tag_name}</strong>`;
    
    const dynamicBtnHtml = `
      <div style="background: rgba(26, 106, 255, 0.05); border: 1px solid rgba(26, 106, 255, 0.2); padding: 1.25rem; border-radius: 6px; margin-bottom: 2rem; text-align: center;">
        <p style="margin-bottom: 0.75rem; font-size: 13px; font-family: 'Space Mono', monospace;">${releaseText}</p>
        <a href="${latestRelease.download_url}" target="_blank" rel="noopener noreferrer" class="ctk-btn green" style="display: inline-block; text-decoration: none; text-align: center; font-family: 'Space Mono', monospace; font-size: 11px;">${downloadLabel}</a>
      </div>
    `;
    html = html.replace('<!-- {{GITHUB_RELEASE_DOWNLOAD_PLACEHOLDER}} -->', dynamicBtnHtml);
  }

  modalBody.innerHTML = html;
  
  // Update tabs UI active states
  btnTabDesc.classList.toggle('active', activeModalTab === 'desc');
  btnTabExtra.classList.toggle('active', activeModalTab === 'extra');
  
  // Custom headers localization inside the modal tabs
  if (activeProjectId === 'office') {
    btnTabDesc.innerText = currentLang === 'es' ? 'INFORMACIÓN GENERAL' : 'GENERAL INFO';
    btnTabExtra.innerText = currentLang === 'es' ? 'PRESUPUESTO Y PLANOS' : 'BUDGET & PLANS';
  } else if (activeProjectId === 'cursos') {
    btnTabDesc.innerText = currentLang === 'es' ? 'INFORMACIÓN GENERAL' : 'GENERAL INFO';
    btnTabExtra.innerText = currentLang === 'es' ? 'GUÍA DE INSTALACIÓN' : 'INSTALLATION GUIDE';
  }
};

const openModal = (projectId) => {
  activeProjectId = projectId;
  activeModalTab = 'desc';
  renderModalContent();
  modalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden'; // Disable scroll under overlay
};

const closeModal = () => {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = '';
  activeProjectId = null;
};

// Expose update language modal render hook
window.updateModalTranslation = () => {
  if (activeProjectId) {
    renderModalContent();
  }
};

// Bind Modal Open triggers
const projectOfficeModalBtn = document.getElementById('project-office-modal-btn');
const projectAbrecursosModalBtn = document.getElementById('project-abrecursos-modal-btn');

if (projectOfficeModalBtn) {
  projectOfficeModalBtn.addEventListener('click', () => openModal('office'));
}
if (projectAbrecursosModalBtn) {
  projectAbrecursosModalBtn.addEventListener('click', () => openModal('cursos'));
}

// Bind Modal Tab buttons
if (btnTabDesc) {
  btnTabDesc.addEventListener('click', () => {
    activeModalTab = 'desc';
    renderModalContent();
  });
}
if (btnTabExtra) {
  btnTabExtra.addEventListener('click', () => {
    activeModalTab = 'extra';
    renderModalContent();
  });
}

// Bind Modal Close triggers
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
// Support escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
    closeModal();
  }
});


// --- Interactive Skills Matrix Highlight Glow ---
const skillTags = document.querySelectorAll('.skill-tag');
const projectCards = document.querySelectorAll('.project-card');

// Map tag names to specific projects
// The first card is Smart Office, the second card is Abre Cursos Pro
let cardOffice = null;
let cardCursos = null;

if (projectCards.length >= 2) {
  // Locate by presence of the unique buttons
  projectCards.forEach(card => {
    if (card.querySelector('#project-office-modal-btn')) {
      cardOffice = card;
    }
    if (card.querySelector('#project-abrecursos-modal-btn')) {
      cardCursos = card;
    }
  });
}

const highlightProjectBySkill = (tagText) => {
  const normalized = tagText.toLowerCase();
  
  // Smart Office associated tags
  const officeKeywords = [
    'iot', 'raspberry', 'home assistant', 'sonoff', 'wifi', 
    'telecomunicaciones', 'redes', 'electrónica', 'automatización'
  ];
  
  // Abre Cursos Pro associated tags
  const cursosKeywords = [
    'python', 'windows', 'desktop', 'zoom', 'teams', 'canvas', 'open source'
  ];

  let matchesOffice = officeKeywords.some(kw => normalized.includes(kw));
  let matchesCursos = cursosKeywords.some(kw => normalized.includes(kw));

  if (matchesOffice && cardOffice) {
    cardOffice.classList.add('highlight-glow');
  }
  if (matchesCursos && cardCursos) {
    cardCursos.classList.add('highlight-glow');
  }
};

const clearHighlights = () => {
  if (cardOffice) cardOffice.classList.remove('highlight-glow');
  if (cardCursos) cardCursos.classList.remove('highlight-glow');
};

skillTags.forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    highlightProjectBySkill(tag.innerText);
  });
  tag.addEventListener('mouseleave', clearHighlights);
});


// --- Scrollspy Navigation Highlighter ---
const toastClose = document.getElementById('winToastClose');
if (toastClose && winToast) {
  toastClose.addEventListener('click', () => winToast.classList.remove('show'));
}

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const scrollspyOptions = {
  root: null,
  threshold: 0.35, // Adjust visible threshold to trigger navigation active switch
  rootMargin: "-80px 0px 0px 0px" // Account for fixed header navbar height
};

const scrollspyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activeId = entry.target.getAttribute('id');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, scrollspyOptions);

sections.forEach(section => scrollspyObserver.observe(section));


// --- 3D Hover Tilt & Spotlight Glow Effect for Project Cards ---
if (projectCards) {
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // 3D Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5; // Max 2.5 degrees tilt
      const rotateY = ((x - centerX) / centerX) * 2.5;  // Max 2.5 degrees tilt
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}


// --- Constellation Particles Background for Hero Canvas ---
const initParticlesCanvas = () => {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });
  
  const particles = [];
  const maxParticles = 40;
  
  
// Mouse position
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * pCanvas.width;
    this.y = Math.random() * pCanvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > pCanvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > pCanvas.height) this.vy *= -1;

    // Interactive Repulsion
    if (mouse.x != null && mouse.y != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = 150;
      let force = (maxDistance - distance) / maxDistance;
      
      if (distance < maxDistance) {
        this.x -= forceDirectionX * force * 5;
        this.y -= forceDirectionY * force * 5;
      }
    }
  }
  draw() {
    pCtx.fillStyle = "rgba(74, 158, 255, 0.4)";
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fill();
  }
}

  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections (constellation lines)
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(26, 106, 255, ${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
};

initParticlesCanvas();


// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', currentTheme);
themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
});


// GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
  // Hero Logo Scrubbing
  gsap.to(".spin-slow", {
    rotation: 360,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
  });
  gsap.to(".spin-reverse", {
    rotation: -360,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
  });

  // Reveal Staggering
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section.querySelectorAll('.reveal'), {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%" }
    });
  });
});

// Download Permission Logic
const btnDownloadAC = document.getElementById('btnDownloadAC');
if (btnDownloadAC) {
  btnDownloadAC.addEventListener('click', (e) => {
    e.preventDefault();
    const password = prompt("El ejecutable está protegido. Ingrese la clave de autorización:");
    if (password === "francois2026") {
      alert("Acceso concedido. Iniciando descarga...");
      const link = document.createElement('a');
      link.href = "/downloads/Instalador_AbreCursos_v2.5.4.exe";
      link.download = "Instalador_AbreCursos_v2.5.4.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (password !== null) {
      alert("Clave incorrecta. Acceso denegado.");
    }
  });
}

// Abre Cursos Pro Full JS Engine
const initAbreCursosLogic = () => {
  const container = document.getElementById('abreCursosContainer');
  if (!container) return;

  // 1. Initial State (Obfuscated URLs for privacy)
  let courses = [
    { id: "73d991d1", nombre: "PROBABILIDAD Y ESTADÍSTICA", url: "https://upn.class.com/class/2b048859-7fa2-444b-8a0d-bd541a033f6a", hora: "19", minuto: "30", dias: [1], activo: true },
    { id: "41fd1bfa", nombre: "CÁLCULO 1", url: "https://upn.class.com/class/578cbf4b-8068-4b94-aadf-e0a767c4704f", hora: "19", minuto: "30", dias: [2], activo: true },
    { id: "9a118daf", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", url: "https://upn.class.com/class/acacca56-481d-4253-8405-10c1b08a676d", hora: "19", minuto: "30", dias: [3], activo: true },
    { id: "5171c36b", nombre: "PROGRAMACIÓN ORIENTADA A OBJETOS", url: "https://upn.class.com/class/acacca56-481d-4253-8405-10c1b08a676d", hora: "21", minuto: "10", dias: [5], activo: true },
    { id: "95036a59", nombre: "PROYECTO SOCIAL", url: "https://upn.class.com/class/8499fc46-cddb-4f57-8d59-bcbb45f6230b", hora: "17", minuto: "50", dias: [6], activo: true }
  ];

  const daysMap = {1: 'Lun', 2: 'Mar', 3: 'Mie', 4: 'Jue', 5: 'Vie', 6: 'Sab', 7: 'Dom'};
  let lastOpenedId = null;

  const cardList = container.querySelector('#acCardList');
  const clockEl = container.querySelector('#acClock');
  const badgeNext = container.querySelector('#acNextClassBadge');

  // Helper: Show Toast
  const showSimToast = (msg) => {
    const toast = document.getElementById('winToast');
    const toastMsg = document.getElementById('winToastMsg');
    if (toast && toastMsg) {
      toastMsg.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
      alert(msg);
    }
  };

  // 2. Render Engine
  const renderCourses = () => {
    if (!cardList) return;
    cardList.innerHTML = '';

    if (courses.length === 0) {
      cardList.innerHTML = '<div class="ctk-empty">Sin cursos programados.</div>';
      return;
    }

    courses.forEach(c => {
      const daysMap2 = {1:'Lun',2:'Mar',3:'Mie',4:'Jue',5:'Vie',6:'Sab',7:'Dom'};
      const daysStr = c.dias.map(d => daysMap2[d]).join(', ');

      let platform = 'Web', tagColor = '#1f6aa5';
      if (c.url.includes('zoom.us'))           { platform = 'Zoom';  tagColor = '#198754'; }
      else if (c.url.includes('teams'))        { platform = 'Teams'; tagColor = '#e06c00'; }
      else if (c.url.includes('canvas'))       { platform = 'Canvas'; tagColor = '#7c3aed'; }

      let displayUrl = c.url.length > 38 ? c.url.substring(0, 38) + '...' : c.url;

      const card = document.createElement('div');
      card.className = 'ctk-course-row' + (c.activo ? '' : ' inactive');
      card.innerHTML = `
        <div class="ctk-row-left">
          <div class="ctk-row-name">${c.nombre} <span class="ctk-time-pill">${c.hora}:${c.minuto}</span></div>
          <div class="ctk-row-meta">
            <span class="ctk-days-text">${daysStr} •</span>
            <span class="ctk-platform-tag" style="background:${tagColor}">${platform}</span>
            <span class="ctk-url-text">${displayUrl}</span>
          </div>
        </div>
        <div class="ctk-row-actions">
          <label class="ctk-switch-wrap" title="${c.activo ? 'Activo' : 'Inactivo'}">
            <input type="checkbox" class="ctk-toggle-input" data-id="${c.id}" ${c.activo ? 'checked' : ''}>
            <span class="ctk-switch-slider"></span>
          </label>
          <button class="ctk-action-btn open btn-abrir" data-id="${c.id}">▶ Abrir</button>
          <button class="ctk-action-btn del btn-borrar" data-id="${c.id}">✕ Borrar</button>
        </div>
      `;
      cardList.appendChild(card);
    });

    calculateNextClass();
  };

  // 3. Next Class Algorithm
  const calculateNextClass = () => {
    if (!badgeNext) return;
    const now = new Date();
    // In JS, getDay() returns 0=Sunday, 1=Monday. The python uses 1=Monday...7=Sunday.
    let currentDayPython = now.getDay() === 0 ? 7 : now.getDay();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let upcoming = [];
    
    courses.filter(c => c.activo).forEach(c => {
      const cTime = parseInt(c.hora) * 60 + parseInt(c.minuto);
      c.dias.forEach(d => {
        let dayDiff = d - currentDayPython;
        if (dayDiff < 0 || (dayDiff === 0 && cTime <= currentMins)) {
          dayDiff += 7; // Next week
        }
        const totalWaitMins = (dayDiff * 24 * 60) + (cTime - currentMins);
        upcoming.push({ ...c, waitMins: totalWaitMins, dayDiff });
      });
    });

    if (upcoming.length === 0) {
      badgeNext.innerText = "No hay clases programadas activas";
      return;
    }

    upcoming.sort((a, b) => a.waitMins - b.waitMins);
    const next = upcoming[0];
    
    const h = Math.floor(next.waitMins / 60);
    const m = next.waitMins % 60;
    
    if (next.dayDiff === 0) {
       badgeNext.innerText = `Próxima: ${next.nombre} (en ${h}h ${m}m)`;
    } else {
       badgeNext.innerText = `Próxima: ${next.nombre} (en ${next.dayDiff} días)`;
    }
  };

  // 4. Background Clock & Auto-Launcher
  if (clockEl) {
    setInterval(() => {
      const now = new Date();
      const daysStr = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });
      clockEl.innerText = `${daysStr[now.getDay()]} ${timeStr}`;

      // Simulate automatic opening
      let currentDayPython = now.getDay() === 0 ? 7 : now.getDay();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = now.getSeconds();

      if (ss === 0) { // Check every minute start
        courses.forEach(c => {
          if (c.activo && c.hora === hh && c.minuto === mm && c.dias.includes(currentDayPython)) {
            // Prevent multiple opens for the same class
            if (lastOpenedId !== c.id) {
              lastOpenedId = c.id;
              showSimToast(`Abre Cursos: Es hora! Abriendo automáticamente ${c.nombre}...`);
              window.open(c.url, '_blank');
            }
          }
        });
        calculateNextClass(); // Update countdown every minute
      }

    }, 1000);
  }

  // 5. Form Submit (Add)
  const form = container.querySelector('#acForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = container.querySelector('#acInNombre').value;
      const url = container.querySelector('#acInUrl').value;
      const hora = container.querySelector('#acInHora').value.slice(0, 2);
      const minuto = container.querySelector('#acInMin').value.slice(0, 2);
      
      const dayChecks = container.querySelectorAll('.ac-day-check:checked');
      let dias = [];
      dayChecks.forEach(cb => dias.push(parseInt(cb.value)));

      if (dias.length === 0) {
        showSimToast("Error: Seleccione al menos un día");
        return;
      }

      const newCourse = {
        id: Math.random().toString(36).substring(2, 10),
        nombre: nombre.toUpperCase(),
        url: url,
        hora: hora,
        minuto: minuto,
        dias: dias,
        activo: true
      };

      courses.push(newCourse);
      renderCourses();
      form.reset();
      showSimToast(`Curso agregado: ${newCourse.nombre}`);
    });
  }

  // 6. Delegated Event Listeners (Toggles & Action Buttons)
  if (cardList) {
    cardList.addEventListener('click', (e) => {
      // Toggle switch
      if (e.target.classList.contains('ctk-toggle-input')) {
        const id = e.target.getAttribute('data-id');
        const course = courses.find(c => c.id === id);
        if (course) {
          course.activo = e.target.checked;
          renderCourses();
          showSimToast(course.activo ? `${course.nombre}: Activado` : `${course.nombre}: Desactivado`);
        }
      }
      // Borrar
      if (e.target.classList.contains('btn-borrar')) {
        const id = e.target.getAttribute('data-id');
        courses = courses.filter(c => c.id !== id);
        renderCourses();
        showSimToast("Curso eliminado del registro.");
      }
      // Abrir
      if (e.target.classList.contains('btn-abrir')) {
        const id = e.target.getAttribute('data-id');
        const course = courses.find(c => c.id === id);
        if (course) {
          showSimToast(`Abre Cursos: Abriendo ${course.nombre} en una nueva pestaña...`);
          window.open(course.url, '_blank');
        }
      }
      // Editar
      if (e.target.classList.contains('btn-editar')) {
        showSimToast(`Simulación: Panel de edición no implementado en la maqueta web.`);
      }
    });
  }

  // 7. Tabs logic
  const tabs = container.querySelectorAll('.ctk-nav-btn');
  const tabContents = container.querySelectorAll('.ctk-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      tabContents.forEach(tc => {
        tc.style.display = tc.id === targetId ? 'block' : 'none';
      });
    });
  });

  // Initial render
  renderCourses();
};
// Call logic safely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAbreCursosLogic, 500);
  });
} else {
  setTimeout(initAbreCursosLogic, 500);
}
