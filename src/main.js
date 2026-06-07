import { translations } from './translations.js';

// Global variables for language state
let currentLang = 'es';

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
      el.innerHTML = translation;
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
        <button class="ctk-btn green" style="padding: 0.3rem 0.6rem; font-size: 10px;" onclick="window.acTriggerManualOpen('${c.id}')">${currentLang === 'es' ? 'Abrir' : 'Open'}</button>
        <button class="ctk-btn red" style="padding: 0.3rem 0.6rem; font-size: 10px;" onclick="window.acTriggerDeleteCourse('${c.id}')">${currentLang === 'es' ? 'Borrar' : 'Delete'}</button>
      </div>
    `;
    acCardList.appendChild(card);
  });
  
  if (window.updateCursorHoverHandlers) window.updateCursorHoverHandlers();
};

const addAcLog = (text) => {
  if (!acLogBox) return;
  acLogBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${text}\n`;
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
      window.open(zoomOrTeams ? c.url : 'https://canvas.upn.edu.pe/', '_blank');
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
const btnAcAdvance1 = document.getElementById('btnAcAdvance1');
const btnAcAdvance10 = document.getElementById('btnAcAdvance10');
const btnAcJumpClass = document.getElementById('btnAcJumpClass');

if (btnAcAdvance1) {
  btnAcAdvance1.addEventListener('click', () => {
    tickAcClock(1);
  });
}
if (btnAcAdvance10) {
  btnAcAdvance10.addEventListener('click', () => {
    tickAcClock(10);
  });
}
if (btnAcJumpClass) {
  btnAcJumpClass.addEventListener('click', () => {
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
window.acTriggerManualOpen = (cId) => {
  const c = acCourses.find(x => x.id === cId);
  if (!c) return;
  acStats.asistencias++;
  addAcLog(currentLang === 'es' ? `Abierto manualmente: ${c.nombre}` : `Manually opened: ${c.nombre}`);
  updateAcStatsUI();
  triggerToast(
    currentLang === 'es' ? "Clase abierta manualmente" : "Class manually opened", 
    currentLang === 'es' ? `Abriendo enlace de '${c.nombre}'` : `Opening link for '${c.nombre}'`
  );
  window.open(c.url, '_blank');
};

window.acTriggerDeleteCourse = (cId) => {
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
      console.log("Latest release fetched successfully from GitHub:", latestRelease);
    }
  } catch (err) {
    console.error("Failed to fetch latest GitHub release for Abre Cursos Pro:", err);
  }
};
// Trigger GitHub API Fetch
fetchLatestRelease();

const modalData = {
  office: {
    title: {
      es: "Smart Office — Nanotechnology SAC (Detalles)",
      en: "Smart Office — Nanotechnology SAC (Details)"
    },
    desc: {
      es: `
        <h4>Descripción del Proyecto</h4>
        <p>Este sistema fue diseñado para la empresa <strong>Nanotechnology SAC</strong> en la ciudad de Trujillo, Perú. El objetivo principal es la automatización del consumo eléctrico y control climático en un entorno corporativo dinámico, logrando un balance óptimo entre comodidad para los colaboradores y ahorro para la organización.</p>
        
        <h4>Arquitectura del Sistema</h4>
        <p>Se centralizó el ecosistema utilizando un servidor local de <strong>Home Assistant</strong> corriendo en una <strong>Raspberry Pi 4</strong> (4GB RAM). La comunicación con los dispositivos se realiza mediante protocolos locales (Wi-Fi/MQTT) para asegurar independencia y baja latencia.</p>
        
        <h4>Dispositivos Implementados</h4>
        <ul>
          <li><strong>Relés inteligentes Sonoff Basic R2:</strong> Con firmware libre <em>Tasmota</em>, instalados directamente en las luminarias de la oficina para permitir encendidos remotos, programados y vinculados a eventos.</li>
          <li><strong>Sonoff POW Elite:</strong> Interruptor de alta potencia instalado en el cuadro general para monitorear el consumo de kWh de la oficina en tiempo real.</li>
          <li><strong>Sensores de Movimiento PIR HC-SR501:</strong> Distribuidos estratégicamente por la oficina y conectados a las entradas GPIO.</li>
          <li><strong>Emisor IR Broadlink:</strong> Para el control de encendido, apagado e histéresis del aire acondicionado según las lecturas de los sensores DHT22.</li>
        </ul>
        
        <h4>Ahorro de Energía</h4>
        <p>Al programar el apagado automático tras 5 minutos de inactividad detectada por los sensores PIR y el corte general fuera del horario de oficina, se estimó una reducción del 30% en el desperdicio energético, amortizando rápidamente la inversión inicial.</p>
      `,
      en: `
        <h4>Project Description</h4>
        <p>This system was designed for <strong>Nanotechnology SAC</strong> in Trujillo, Peru. The main goal is the automation of electrical consumption and climate control in a dynamic corporate environment, achieving an optimal balance between employee comfort and operational savings.</p>
        
        <h4>System Architecture</h4>
        <p>The ecosystem was centralized using a local <strong>Home Assistant</strong> server running on a <strong>Raspberry Pi 4</strong> (4GB RAM). Communication with the devices is done via local protocols (Wi-Fi/MQTT) to ensure independence and low latency.</p>
        
        <h4>Implemented Devices</h4>
        <ul>
          <li><strong>Sonoff Basic R2 Smart Relays:</strong> Flashed with <em>Tasmota</em> open source firmware, installed directly on the office fixtures to enable remote, scheduled, and event-based triggers.</li>
          <li><strong>Sonoff POW Elite:</strong> A high-power switch installed in the distribution board to monitor real-time kWh consumption.</li>
          <li><strong>PIR Motion Sensors HC-SR501:</strong> Strategically distributed and wired to GPIO inputs to track presence.</li>
          <li><strong>Broadlink IR Blaster:</strong> Integrated to automate AC power toggling and hysteresis based on DHT22 temperature sensors.</li>
        </ul>
        
        <h4>Energy Savings</h4>
        <p>By scheduling automatic shut-offs after 5 minutes of inactivity (PIR) and implementing hard cut-offs outside working hours, an estimated 30% reduction in energy waste was achieved, quickly returning the initial project cost.</p>
      `
    },
    extra: {
      es: `
        <div style="background: rgba(26, 106, 255, 0.05); border: 1px solid rgba(26, 106, 255, 0.2); padding: 1.25rem; border-radius: 6px; margin-bottom: 2.5rem; text-align: center;">
          <p style="margin-bottom: 0.75rem; font-size: 13px; font-family: 'Space Mono', monospace; color: var(--white);">Esquema Completo del Sistema IoT en formato SVG (Vectorial)</p>
          <a href="/plano_smart_office_nanotechnology.svg" download="plano_smart_office_nanotechnology.svg" class="project-link" style="display: inline-block; text-decoration: none; text-align: center; font-family: 'Space Mono', monospace; font-size: 11px; padding: 10px 20px; background: var(--blue-light); color: var(--bg); border-radius: 4px; font-weight: bold; transition: all 0.3s;">📥 Descargar Plano de Planta (SVG)</a>
        </div>

        <h4 style="margin-top:2.5rem;">Plano de Distribución y Conectividad IoT (Nanotechnology SAC)</h4>
        <p>Diagrama de planta de la oficina inteligente con la distribución de dispositivos IoT y sus líneas de conexión:</p>
        <div style="margin: 1rem 0 2.5rem 0;">
          <svg viewBox="0 0 690 530" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
<title style="fill:rgb(0, 0, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">Plano Smart Office — Nanotechnology SAC</title>
<desc style="fill:rgb(0, 0, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">Plano de planta de la oficina inteligente con distribución de dispositivos IoT: Sonoff, cámaras, Raspberry Pi y router</desc>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
<mask id="imagine-text-gaps-o8e4t8" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="690" height="530" fill="white"/><rect x="39" y="461" width="90.921875" height="14" fill="black" rx="2"/><rect x="54" y="480" width="95.01318359375" height="14" fill="black" rx="2"/><rect x="156" y="480" width="56.609375" height="14" fill="black" rx="2"/><rect x="232" y="480" width="41.00439453125" height="14" fill="black" rx="2"/><rect x="312" y="480" width="68.0087890625" height="14" fill="black" rx="2"/><rect x="400" y="480" width="68.0087890625" height="14" fill="black" rx="2"/><rect x="478" y="480" width="94.421875" height="14" fill="black" rx="2"/><rect x="570" y="480" width="62.60791015625" height="14" fill="black" rx="2"/><rect x="73.2421875" y="244" width="76.515625" height="16" fill="black" rx="2"/><rect x="206.9921875" y="351" width="39.015625" height="16" fill="black" rx="2"/><rect x="291.9921875" y="351" width="39.015625" height="16" fill="black" rx="2"/><rect x="192.4921875" y="69" width="114.015625" height="16" fill="black" rx="2"/><rect x="349.7421875" y="70" width="60.515625" height="15" fill="black" rx="2"/><rect x="493.2421875" y="69" width="76.515625" height="16" fill="black" rx="2"/><rect x="468.4921875" y="220" width="53.015625" height="15" fill="black" rx="2"/><rect x="474.9921875" y="317" width="39.015625" height="16" fill="black" rx="2"/><rect x="430.4921875" y="387" width="114.015625" height="16" fill="black" rx="2"/><rect x="244.984375" y="201" width="139.818603515625" height="13" fill="black" rx="2"/><rect x="284.390625" y="239" width="40.003875732421875" height="13" fill="black" rx="2"/><rect x="512.1953125" y="109" width="50.4053955078125" height="13" fill="black" rx="2"/><rect x="506.9921875" y="118" width="60.8070068359375" height="13" fill="black" rx="2"/><rect x="208.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="202.9921875" y="121" width="34.015625" height="13" fill="black" rx="2"/><rect x="222.59375" y="113" width="54.8125" height="13" fill="black" rx="2"/><rect x="268.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="207.9921875" y="149" width="34.8031005859375" height="13" fill="black" rx="2"/><rect x="207.9921875" y="157" width="34.015625" height="13" fill="black" rx="2"/><rect x="252.9921875" y="149" width="34.015625" height="13" fill="black" rx="2"/><rect x="322.59375" y="113" width="54.8125" height="13" fill="black" rx="2"/><rect x="378.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="343.1953125" y="149" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="61" y="293" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="72.59375" y="317" width="54.8125" height="13" fill="black" rx="2"/><rect x="468" y="69" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="462.59375" y="127" width="54.8125" height="13" fill="black" rx="2"/><rect x="376" y="389" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="552.390625" y="389" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="306.1953125" y="273" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="447.9921875" y="231" width="34.015625" height="13" fill="black" rx="2"/><rect x="404.9921875" y="159" width="60.015625" height="13" fill="black" rx="2"/><rect x="158.9765625" y="19" width="361.046875" height="16" fill="black" rx="2"/><rect x="191.9765625" y="34" width="296.046875" height="13" fill="black" rx="2"/></mask></defs>



<rect width="680" height="520" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="10" y="10" width="660" height="500" fill="#060b18" stroke="rgba(26,106,255,0.15)" stroke-width="0.5" rx="4" style="fill:rgb(6, 11, 24);stroke:rgba(26, 106, 255, 0.15);color:rgb(0, 0, 0);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- ═══ PERÍMETRO EXTERIOR DE LA OFICINA ═══ -->
<rect x="40" y="50" width="580" height="390" rx="2" fill="none" stroke="#1a6aff" stroke-width="1.5" stroke-dasharray="6 3" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-dasharray:6px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- ═══ LEYENDA DE DISPOSITIVOS ═══ -->
<text x="44" y="470" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:700;text-anchor:start;dominant-baseline:auto">DISPOSITIVOS:</text>

<!-- Sonoff POW -->
<rect x="44" y="480" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="58" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Sonoff POW Elite</text>

<!-- Sonoff R2 -->
<circle cx="150" cy="485" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="150" cy="485" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="160" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Sonoff R2</text>

<!-- Cámara -->
<polygon points="225,482 231,479 231,491 225,488" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="218" y="482" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="236" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Cámara</text>

<!-- Power strip -->
<rect x="300" y="481" width="12" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="304" cy="485" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="308" cy="485" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="316" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Power Strip</text>

<!-- Router -->
<rect x="390" y="480" width="10" height="10" rx="1" fill="#1a6aff" opacity="0.6" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.6;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="393" y1="480" x2="391" y2="475" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="395" y1="480" x2="395" y2="474" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="397" y1="480" x2="399" y2="475" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="404" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Router WiFi</text>

<!-- Servidor RPi -->
<rect x="468" y="480" width="10" height="10" rx="1" fill="#1a6aff" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="470" y="482" width="6" height="6" rx="0.5" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="482" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Servidor (RPi 4)</text>

<!-- Gleco Plug -->
<circle cx="566" cy="485" r="5" fill="#2ecc71" opacity="0.8" style="fill:rgb(46, 204, 113);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.8;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="574" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Gleco Plug</text>

<!-- ═══ DIVISIONES INTERIORES ═══ -->

<!-- ALMACÉN 1 — izquierda grande -->
<rect x="40" y="230" width="145" height="210" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="112" y="255" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Almacén 1</text>

<!-- BAÑO 1 y BAÑO 2 — parte inferior izquierda -->
<rect x="185" y="340" width="85" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="227" y="362" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Baño</text>

<rect x="270" y="340" width="85" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="312" y="362" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Baño</text>

<!-- ADMINISTRACIÓN -->
<rect x="185" y="50" width="130" height="140" fill="rgba(26,106,255,0.05)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.05);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="250" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Administración</text>

<!-- SOPORTE -->
<rect x="315" y="50" width="130" height="140" fill="rgba(26,106,255,0.05)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.05);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="380" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Soporte</text>

<!-- ALMACÉN 2 — derecha superior -->
<rect x="445" y="50" width="175" height="155" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="532" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Almacén 2</text>

<!-- COCINA — derecha media -->
<rect x="445" y="205" width="100" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="495" y="230" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Cocina</text>

<!-- BAÑO 3 — derecha media -->
<rect x="445" y="305" width="100" height="65" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="495" y="328" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Baño</text>

<!-- ÁREA COMERCIAL — franja inferior -->
<rect x="355" y="370" width="265" height="70" fill="rgba(26,106,255,0.06)" stroke="#1a6aff" stroke-width="1" style="fill:rgba(26, 106, 255, 0.06);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="488" y="398" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Área Comercial</text>

<!-- PASILLO CENTRAL -->
<rect x="185" y="190" width="260" height="150" fill="rgba(26,106,255,0.02)" stroke="rgba(26,106,255,0.3)" stroke-width="0.5" stroke-dasharray="3 3" style="fill:rgba(26, 106, 255, 0.02);stroke:rgba(26, 106, 255, 0.3);color:rgb(0, 0, 0);stroke-width:0.5px;stroke-dasharray:3px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="315" y="210" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">— PASILLO / CIRCULACIÓN —</text>

<!-- ═══ DISPOSITIVOS ═══ -->

<!-- ROUTER WiFi — centro pasillo -->
<rect x="298" y="230" width="12" height="12" rx="1" fill="#1a6aff" opacity="0.6" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.6;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="302" y1="230" x2="300" y2="223" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="304" y2="222" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="306" y1="230" x2="308" y2="223" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="304" y="248" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">ROUTER</text>

<!-- SERVIDOR Raspberry Pi 4 — cerca almacén 2 -->
<rect x="530" y="95" width="14" height="12" rx="1" fill="#1a6aff" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="532" y="97" width="10" height="8" rx="0.5" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="533" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="536" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="539" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="537" y="118" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SERVIDOR</text>
<text x="537" y="127" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">RPi 4 + HA</text>

<!-- SONOFF POW ELITE — Administración -->
<rect x="215" y="100" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="220" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POW</text>
<text x="220" y="130" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">ELITE</text>

<!-- SONOFF R2 — Administración -->
<circle cx="250" cy="105" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="250" cy="105" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="250" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Administración -->
<polygon points="280,103 286,100 286,112 280,109" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="273" y="103" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="280" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">CAM</text>

<!-- POWER STRIP — Administración -->
<rect x="218" y="138" width="14" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="223" cy="142" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="228" cy="142" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="225" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POWER</text>
<text x="225" y="166" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">STRIP</text>

<!-- GLECO PLUG — Administración -->
<circle cx="270" cy="142" r="5" fill="#2ecc71" opacity="0.8" style="fill:rgb(46, 204, 113);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.8;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="270" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">GLECO</text>

<!-- SONOFF R2 — Soporte -->
<circle cx="350" cy="105" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="350" cy="105" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="350" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Soporte -->
<polygon points="390,103 396,100 396,112 390,109" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="383" y="103" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="390" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">CAM</text>

<!-- SONOFF POW — Soporte -->
<rect x="350" y="138" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="355" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POW</text>

<!-- CÁMARA Almacén 1 -->
<polygon points="55,290 61,287 61,299 55,296" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="48" y="290" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="65" y="302" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- SONOFF R2 — Almacén 1 -->
<circle cx="100" cy="310" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="100" cy="310" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="100" y="326" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Almacén 2 -->
<polygon points="455,65 461,62 461,74 455,71" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="448" y="65" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="472" y="78" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- SONOFF R2 — Almacén 2 -->
<circle cx="490" cy="120" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="490" cy="120" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="490" y="136" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Área Comercial izq -->
<polygon points="365,385 371,382 371,394 365,391" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="358" y="385" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="380" y="398" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- CÁMARA Área Comercial der -->
<polygon points="590,385 596,382 596,394 590,391" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="583" y="385" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="572" y="398" text-anchor="end" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:end;dominant-baseline:auto">CAM</text>

<!-- SENSOR PIR — pasillo central -->
<polygon points="312,268 318,260 324,268" fill="rgba(74,158,255,0.6)" stroke="#4a9eff" stroke-width="0.8" style="fill:rgba(74, 158, 255, 0.6);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="318" y="282" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">PIR</text>

<!-- IR Transceiver (AC) — Cocina -->
<rect x="460" y="220" width="10" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="463" y2="214" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="465" y2="213" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="467" y2="214" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="465" y="240" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">IR/AC</text>

<!-- ═══ LÍNEAS WIFI DASHED AL ROUTER ═══ -->
<line x1="304" y1="230" x2="250" y2="145" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="355" y2="145" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="490" y2="130" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="100" y2="318" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="465" y2="226" marker-end="url(#arrow)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- Línea Servidor → Router -->
<line x1="530" y1="101" x2="314" y2="230" stroke="#4a9eff" stroke-width="1" stroke-dasharray="5 3" opacity="0.7" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-dasharray:5px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.7;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="435" y="168" text-anchor="middle" transform="rotate(-25, 435, 168)" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">LAN / WiFi</text>

<!-- TÍTULO -->
<text x="340" y="30" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="700" fill="#4a9eff" letter-spacing="0.2em" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:11px;font-weight:700;text-anchor:middle;dominant-baseline:auto">NANOTECHNOLOGY SAC — SMART OFFICE LAYOUT</text>
<text x="340" y="43" text-anchor="middle" font-family="'Courier New', monospace" font-size="8" fill="#4a5a7a" letter-spacing="0.15em" style="fill:rgb(74, 90, 122);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">TRUJILLO, PERÚ — HOME ASSISTANT + RASPBERRY PI 4</text>

</svg>
        </div>
    
        <h4>Presupuesto y Lista de Materiales (SENATI)</h4>
        <p>El presupuesto oficial extraído de las especificaciones del proyecto de innovación es el siguiente:</p>
        <table class="modal-table">
          <thead>
            <tr>
              <th>Componente / Ítem</th>
              <th>Cant.</th>
              <th>Costo Unitario</th>
              <th>Total (S/.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Servidor Raspberry Pi 4 Model B (4GB) + Fuente y Case</td>
              <td>1</td>
              <td>S/. 495.00</td>
              <td>S/. 495.00</td>
            </tr>
            <tr>
              <td>Interruptor inteligente SONOFF Basic R3 (Tasmota)</td>
              <td>6</td>
              <td>S/. 25.00</td>
              <td>S/. 150.00</td>
            </tr>
            <tr>
              <td>Interruptor con Monitoreo SONOFF POW Elite (20A)</td>
              <td>1</td>
              <td>S/. 85.00</td>
              <td>S/. 85.00</td>
            </tr>
            <tr>
              <td>Sensor de Movimiento PIR HC-SR501 (GPIO)</td>
              <td>3</td>
              <td>S/. 20.00</td>
              <td>S/. 60.00</td>
            </tr>
            <tr>
              <td>Canaletas plásticas, cables eléctricos y accesorios</td>
              <td>-</td>
              <td>S/. 120.00</td>
              <td>S/. 120.00</td>
            </tr>
            <tr>
              <td>Herramientas menores, fijaciones y fusibles</td>
              <td>-</td>
              <td>S/. 80.00</td>
              <td>S/. 80.00</td>
            </tr>
            <tr>
              <td>Paneles de Iluminación LED de alta eficiencia</td>
              <td>4</td>
              <td>S/. 95.00</td>
              <td>S/. 380.00</td>
            </tr>
            <tr>
              <td>Control de Aire Acondicionado IR Broadlink RM4 Mini</td>
              <td>1</td>
              <td>S/. 150.00</td>
              <td>S/. 150.00</td>
            </tr>
            <tr>
              <td>Regletas Inteligentes Wi-Fi (Protección de sobretensión)</td>
              <td>2</td>
              <td>S/. 180.00</td>
              <td>S/. 360.00</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid var(--border);">
              <td>Subtotal de Materiales y Equipos</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,720.00</td>
            </tr>
            <tr>
              <td>Mano de Obra Calificada (Técnico TI, Electricista, Supervisor)</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,030.00</td>
            </tr>
            <tr style="font-weight: bold; background: var(--bg3); color: var(--blue-light);">
              <td>TOTAL GENERAL DE INVERSIÓN</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 2,870.00</td>
            </tr>
          </tbody>
        </table>
        
        <h4>Análisis de Retorno de Inversión (ROI)</h4>
        <ul>
          <li><strong>Consumo Eléctrico Inicial:</strong> 357 kWh mensuales (Equivalente aproximado a <strong>S/. 400.00</strong> al mes).</li>
          <li><strong>Ahorro Estimado:</strong> Reducción de <strong>S/. 120.00 mensuales</strong> (Ahorro del 30% en consumo innecesario).</li>
          <li><strong>Tiempo de Recuperación:</strong> ~24 meses de retorno de inversión por completo.</li>
        </ul>

        <h4 style="margin-top:2.5rem;">Plano de Distribución de Dispositivos (SENATI)</h4>
        <p>Distribución física de sensores de movimiento (PIR), climatizador y actuadores en la planta de la oficina:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
              </linearGradient>
              <linearGradient id="acAirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <style>
              @keyframes ledBlink {
                0%, 100% { fill: #00ff66; filter: drop-shadow(0 0 3px #00ff66); }
                50% { fill: #004411; filter: none; }
              }
              @keyframes ledBlinkRed {
                0%, 100% { fill: #ff0055; filter: drop-shadow(0 0 3px #ff0055); }
                50% { fill: #550011; filter: none; }
              }
              @keyframes radarPulse {
                0% { r: 6; opacity: 1; stroke-width: 1.5; }
                50% { opacity: 0.5; }
                100% { r: 45; opacity: 0; stroke-width: 0.5; }
              }
              @keyframes fanRotation {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes airDrift {
                0% { stroke-dashoffset: 0; opacity: 0; transform: translateY(0); }
                30% { opacity: 0.8; }
                100% { stroke-dashoffset: 24; opacity: 0; transform: translateY(25px); }
              }
              @keyframes lineFlow {
                to { stroke-dashoffset: -20; }
              }
              .led-blink { animation: ledBlink 1s infinite steps(1); }
              .led-blink-red { animation: ledBlinkRed 1.5s infinite steps(1); }
              .radar-wave { animation: radarPulse 2s infinite cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: center; }
              .fan-spin { animation: fanRotation 0.8s infinite linear; transform-origin: 380px 340px; }
              .air-flow { animation: airDrift 2s infinite linear; stroke-dasharray: 6, 6; }
              .office-wall { stroke: #1e40af; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; fill: url(#wallGrad); }
              .office-wall-inner { stroke: #3b82f6; stroke-width: 1.5; stroke-opacity: 0.7; }
              .door-arc { stroke: #3b82f6; stroke-width: 1; stroke-dasharray: 3 3; fill: none; }
              .furniture { fill: #0b1329; stroke: #1e293b; stroke-width: 1.5; }
              .label-room { font-family: "Outfit", sans-serif; font-size: 11px; font-weight: 700; fill: #60a5fa; letter-spacing: 1.5px; opacity: 0.85; }
              .glow-node { filter: drop-shadow(0 0 4px #00e5ff); }
            </style>

            <!-- Grid Background -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid)" />

            <!-- Room Furniture (Desks) -->
            <rect x="70" y="80" width="40" height="70" rx="3" class="furniture" />
            <path d="M 110,95 A 15,15 0 0,1 110,135" stroke="#1e293b" stroke-width="1.5" fill="none"/>
            <rect x="70" y="240" width="30" height="30" rx="4" class="furniture" />
            <rect x="70" y="290" width="30" height="30" rx="4" class="furniture" />
            <rect x="70" y="340" width="30" height="30" rx="4" class="furniture" />
            <rect x="340" y="80" width="100" height="40" rx="3" class="furniture" />
            <rect x="340" y="160" width="100" height="40" rx="3" class="furniture" />
            <path d="M 640,60 L 710,60 L 710,130 L 680,130 L 680,90 L 640,90 Z" class="furniture" />
            <rect x="580" y="270" width="120" height="60" rx="30" class="furniture" />

            <!-- Main Office Walls (Outer) -->
            <rect x="50" y="40" width="700" height="370" class="office-wall" stroke-width="4" stroke="#1e3a8a"/>

            <!-- Inner Walls -->
            <line x1="50" y1="200" x2="210" y2="200" class="office-wall" />
            <line x1="50" y1="200" x2="210" y2="200" class="office-wall-inner" />
            <line x1="280" y1="40" x2="280" y2="130" class="office-wall" />
            <line x1="280" y1="40" x2="280" y2="130" class="office-wall-inner" />
            <line x1="280" y1="190" x2="280" y2="410" class="office-wall" />
            <line x1="280" y1="190" x2="280" y2="410" class="office-wall-inner" />
            
            <line x1="520" y1="40" x2="520" y2="150" class="office-wall" />
            <line x1="520" y1="40" x2="520" y2="150" class="office-wall-inner" />
            <line x1="520" y1="210" x2="520" y2="410" class="office-wall" />
            <line x1="520" y1="210" x2="520" y2="410" class="office-wall-inner" />
            <line x1="520" y1="220" x2="750" y2="220" class="office-wall" />
            <line x1="520" y1="220" x2="750" y2="220" class="office-wall-inner" />

            <!-- Doors arcs -->
            <path d="M 280,130 A 60,60 0 0,1 220,190" class="door-arc" />
            <line x1="280" y1="130" x2="220" y2="130" stroke="#3b82f6" stroke-width="2" />
            <path d="M 280,190 A 60,60 0 0,0 220,130" class="door-arc" />
            <line x1="280" y1="190" x2="220" y2="190" stroke="#3b82f6" stroke-width="2" />
            <path d="M 520,150 A 60,60 0 0,1 580,210" class="door-arc" />
            <line x1="520" y1="150" x2="520" y2="210" stroke="#3b82f6" stroke-width="2" />
            <path d="M 520,210 A 60,60 0 0,0 580,150" class="door-arc" />
            <line x1="520" y1="210" x2="520" y2="150" stroke="#3b82f6" stroke-width="2" />

            <!-- Room Labels -->
            <text x="165" y="115" class="label-room" text-anchor="middle">RECEPCIÓN</text>
            <text x="165" y="315" class="label-room" text-anchor="middle">SALA DE ESPERA</text>
            <text x="400" y="225" class="label-room" text-anchor="middle" font-size="13">OFICINA CENTRAL</text>
            <text x="635" y="150" class="label-room" text-anchor="middle">TI / SOPORTE</text>
            <text x="635" y="360" class="label-room" text-anchor="middle">SALA REUNIONES</text>

            <!-- Raspberry Pi 4 Model B -->
            <g transform="translate(635, 95) scale(0.95)">
              <rect x="-22" y="-30" width="44" height="60" rx="5" fill="#0d4e24" stroke="#10b981" stroke-width="1.5" />
              <rect x="-12" y="-12" width="15" height="15" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
              <rect x="-8" y="-8" width="7" height="7" fill="#0f172a" />
              <line x1="-18" y1="-26" x2="18" y2="-26" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="1.8 1" />
              <rect x="5" y="-18" width="12" height="10" rx="0.5" fill="#111" />
              <rect x="-18" y="25" width="8" height="8" fill="#475569" rx="1" />
              <rect x="-5" y="25" width="8" height="8" fill="#475569" rx="1" />
              <rect x="8" y="23" width="9" height="10" fill="#334155" rx="1" />
              <rect x="-24" y="-15" width="3" height="7" fill="#334155" />
              <circle cx="17" cy="18" r="2" fill="#ef4444" />
              <circle cx="17" cy="12" r="2" fill="#10b981" class="led-blink" />
              <text x="0" y="-34" fill="#10b981" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">PI4 SERVER</text>
            </g>

            <!-- PIR HC-SR501 Sensor 1 -->
            <g transform="translate(400, 75)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 0.6s;" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 1.2s;" />
              <text x="0" y="-12" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">PIR 1</text>
            </g>

            <!-- PIR HC-SR501 Sensor 2 -->
            <g transform="translate(685, 250)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 1s;" />
              <text x="-18" y="4" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="end">PIR 2</text>
            </g>

            <!-- PIR HC-SR501 Sensor 3 -->
            <g transform="translate(110, 280)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 0.4s;" />
              <text x="18" y="4" fill="#f59e0b" font-family="monospace" font-size="8" text-anchor="start">PIR 3</text>
            </g>

            <!-- Sonoff Actuators (Lights) -->
            <g transform="translate(165, 150)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-Rec</text>
            </g>

            <g transform="translate(350, 140)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-A</text>
            </g>

            <g transform="translate(450, 140)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-B</text>
            </g>

            <g transform="translate(640, 310)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-Meet</text>
            </g>

            <!-- Broadlink IR Blaster -->
            <g transform="translate(425, 290)">
              <path d="M -10,6 L 0,-10 L 10,6 Z" fill="#111" stroke="#ef4444" stroke-width="1.5" />
              <circle cx="0" cy="0" r="1.5" fill="#ef4444" class="led-blink-red" />
              <text x="0" y="16" fill="#fca5a5" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">BROADLINK IR</text>
            </g>

            <!-- Air Conditioning Unit -->
            <g transform="translate(400, 340)">
              <rect x="-35" y="-12" width="70" height="24" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.8" />
              <line x1="-25" y1="2" x2="25" y2="2" stroke="#1e293b" stroke-width="1" />
              <line x1="-25" y1="6" x2="25" y2="6" stroke="#1e293b" stroke-width="1" />
              <rect x="25" y="-8" width="4" height="2" fill="#00ff66" />
              <g transform="translate(-20, 0)">
                <circle cx="0" cy="0" r="8" stroke="#334155" stroke-width="1" fill="#020617"/>
                <g class="fan-spin">
                  <path d="M 0,0 L 0,-6 A 2,2 0 0,1 2,-6 Z" fill="#60a5fa" />
                  <path d="M 0,0 L 6,0 A 2,2 0 0,1 6,2 Z" fill="#60a5fa" />
                  <path d="M 0,0 L 0,6 A 2,2 0 0,1 -2,6 Z" fill="#60a5fa" />
                  <path d="M 0,0 L -6,0 A 2,2 0 0,1 -6,-2 Z" fill="#60a5fa" />
                </g>
              </g>
              <path d="M -20,16 Q -10,24 0,16 T 20,16" stroke="url(#acAirGrad)" stroke-width="2" fill="none" class="air-flow" />
              <path d="M -20,24 Q -10,32 0,24 T 20,24" stroke="url(#acAirGrad)" stroke-width="2" fill="none" class="air-flow" style="animation-delay: 1s;" />
              <text x="12" y="4" fill="#60a5fa" font-family="monospace" font-size="8" font-weight="bold">A/C</text>
            </g>

            <!-- Map Legend -->
            <g transform="translate(65, 345)" opacity="0.95">
              <rect x="0" y="0" width="145" height="50" rx="4" fill="#0b1329" stroke="#1e293b" stroke-width="1" />
              <circle cx="15" cy="12" r="4" fill="#3b82f6" />
              <text x="26" y="15" fill="#94a3b8" font-family="monospace" font-size="8">LUMINARIA SONOFF</text>
              <rect x="10" y="22" width="10" height="6" fill="#f8fafc" stroke="#f59e0b" stroke-width="1" />
              <text x="26" y="27" fill="#94a3b8" font-family="monospace" font-size="8">SENSOR PIR</text>
              <rect x="10" y="34" width="10" height="10" fill="#0d4e24" stroke="#10b981" stroke-width="1" />
              <text x="26" y="41" fill="#94a3b8" font-family="monospace" font-size="8">SERVIDOR PI 4</text>
            </g>
          </svg>
        </div>

        <h4>Arquitectura Lógica de Integración IoT</h4>
        <p>Flujo de comunicaciones locales y protocolos de integración del servidor central de control:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="glowLineBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="1" />
                <stop offset="100%" stop-color="#00e5ff" stop-opacity="1" />
              </linearGradient>
            </defs>
            <style>
              @keyframes lineSignal {
                to { stroke-dashoffset: -40; }
              }
              @keyframes nodePulse {
                0%, 100% { filter: drop-shadow(0 0 2px #00e5ff); }
                50% { filter: drop-shadow(0 0 8px #00e5ff); }
              }
              .comm-line { stroke: url(#glowLineBlue); stroke-width: 2; stroke-dasharray: 6 4; animation: lineSignal 1.5s infinite linear; }
              .comm-line-reverse { stroke: url(#glowLineBlue); stroke-width: 2; stroke-dasharray: 6 4; animation: lineSignal 1.5s infinite linear; animation-direction: reverse; }
              .arch-card { fill: #0b1329; stroke: #1e293b; stroke-width: 1.5; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4)); transition: stroke 0.3s; }
              .arch-card:hover { stroke: #3b82f6; }
              .arch-title { font-family: "Outfit", sans-serif; font-size: 11px; font-weight: 700; fill: #fff; letter-spacing: 1px; }
              .arch-sub { font-family: "Outfit", sans-serif; font-size: 9px; fill: #60a5fa; }
              .arch-desc { font-family: monospace; font-size: 8px; fill: #94a3b8; }
            </style>

            <!-- Grid -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid2)" />

            <!-- Communication Lines -->
            <path d="M 400,200 L 180,95" class="comm-line-reverse" />
            <path d="M 400,200 L 180,200" class="comm-line-reverse" />
            <path d="M 400,200 L 180,305" class="comm-line" />
            <path d="M 400,200 L 620,95" class="comm-line" />
            <path d="M 400,200 L 620,200" class="comm-line" />

            <!-- Central Core Card -->
            <g transform="translate(400, 200)">
              <rect x="-95" y="-50" width="190" height="100" rx="8" fill="#091424" stroke="#00e5ff" stroke-width="2" style="animation: nodePulse 3s infinite ease-in-out;" />
              <g transform="translate(-55, 0) scale(0.7)">
                <rect x="-22" y="-30" width="44" height="60" rx="5" fill="#0d4e24" stroke="#10b981" stroke-width="1.5" />
                <rect x="-12" y="-12" width="15" height="15" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
                <line x1="-18" y1="-26" x2="18" y2="-26" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="1.8 1" />
                <circle cx="17" cy="12" r="2" fill="#10b981" class="led-blink" />
              </g>
              <text x="35" y="-20" class="arch-title" text-anchor="middle">NÚCLEO CENTRAL</text>
              <text x="35" y="-4" class="arch-sub" text-anchor="middle" font-weight="bold">Raspberry Pi 4</text>
              <text x="35" y="10" class="arch-desc" text-anchor="middle">Home Assistant OS</text>
              <text x="35" y="22" class="arch-desc" text-anchor="middle" fill="#00ff66" font-weight="bold">ONLINE</text>
            </g>

            <!-- Card 1: ILUMINACIÓN -->
            <g transform="translate(180, 95)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-15" width="24" height="16" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <circle cx="-63" cy="-7" r="3" fill="#3b82f6" />
              <circle cx="-57" cy="-11" r="1.5" fill="#00ff66" class="led-blink" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">ILUMINACIÓN (6x)</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Sonoff Basic R2 (Tasmota)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Firmware: Tasmota | MQTT</text>
            </g>

            <!-- Card 2: MONITOREO ELÉCTRICO -->
            <g transform="translate(180, 200)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-18" width="24" height="24" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <rect x="-71" y="-14" width="16" height="10" fill="#0f172a" />
              <text x="-63" y="-7" fill="#00e5ff" font-family="monospace" font-size="5" text-anchor="middle">1.85 kW</text>
              <text x="-40" y="-10" class="arch-title" text-anchor="start">MONITOREO ENERGÍA</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Sonoff POW Elite (20A)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Colecta kWh en Tiempo Real</text>
            </g>

            <!-- Card 3: SENSORES MOVIMIENTO -->
            <g transform="translate(180, 305)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-14" width="24" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="-63" cy="-6" r="5" fill="#f8fafc" stroke="#f59e0b" stroke-width="0.5" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">SENSORES DE MOVIMIENTO</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">PIR HC-SR501 (3x)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Wired GPIO | Presencia</text>
            </g>

            <!-- Card 4: CLIMATIZADOR -->
            <g transform="translate(620, 95)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <path d="M -73,-7 L -65,-21 L -57,-7 Z" fill="#1e293b" stroke="#ef4444" stroke-width="1.2" />
              <circle cx="-65" cy="-12" r="1.5" fill="#ef4444" class="led-blink-red" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">CLIMATIZADOR (AIRE)</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Broadlink RM4 Mini (IR)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Emisor Infrarrojo (IR)</text>
            </g>

            <!-- Card 5: INTERFAZ DE USUARIO -->
            <g transform="translate(620, 200)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-73" y="-20" width="16" height="28" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <line x1="-68" y1="-17" x2="-62" y2="-17" stroke="#3b82f6" stroke-width="1" />
              <circle cx="-65" cy="5" r="1.5" fill="#3b82f6" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">INTERFAZ DE USUARIO</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">App Dashboard / Web UI</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Lovelace UI | Control Local</text>
            </g>
          </svg>
        </div>

        <h4>Esquema de Conexiones Eléctricas (Luminarias)</h4>
        <p>Diagrama unifilar de conexionado y alimentación del relé Sonoff Basic R2 con el interruptor y la carga:</p>
        <div style="margin: 1rem 0 1rem 0;">
          <svg viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="lampGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </linearGradient>
            </defs>
            <style>
              @keyframes electricFlow {
                to { stroke-dashoffset: -20; }
              }
              @keyframes switchAction {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-25deg); }
              }
              .cable-phase { stroke: #ef4444; stroke-width: 3; }
              .cable-neutral { stroke: #3b82f6; stroke-width: 3; }
              .cable-flow { stroke-dasharray: 6 4; animation: electricFlow 1s infinite linear; }
              .terminal-block { fill: #1e293b; stroke: #475569; stroke-width: 1.5; }
              .glow-lamp { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); }
              .wire-label { font-family: monospace; font-size: 10px; font-weight: bold; }
            </style>

            <!-- Grid -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid3)" />

            <!-- Phase line -->
            <path d="M 60,100 L 260,100" class="cable-phase cable-flow" />
            <text x="60" y="88" fill="#ef4444" class="wire-label">Fase L (220V AC)</text>

            <!-- Neutral line -->
            <path d="M 60,250 L 260,250" class="cable-neutral cable-flow" />
            <text x="60" y="238" fill="#3b82f6" class="wire-label">Neutro N</text>

            <!-- SONOFF BASIC R2 Device Representation -->
            <g transform="translate(260, 60)">
              <rect x="0" y="0" width="280" height="210" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5" />
              <rect x="5" y="5" width="270" height="200" rx="6" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />
              <text x="140" y="32" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">SONOFF BASIC R2</text>
              <text x="140" y="48" fill="#60a5fa" font-family="'Outfit', sans-serif" font-size="9" text-anchor="middle" font-weight="bold">Interruptor Inteligente</text>

              <!-- Input Side Terminals -->
              <rect x="10" y="30" width="30" height="150" rx="4" class="terminal-block" />
              <circle cx="25" cy="40" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="21" y1="40" x2="29" y2="40" stroke="#1e293b" stroke-width="1.5" />
              <circle cx="25" cy="190" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="21" y1="190" x2="29" y2="190" stroke="#1e293b" stroke-width="1.5" />
              <text x="48" y="44" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">L IN</text>
              <text x="48" y="194" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">N IN</text>

              <!-- Output Side Terminals -->
              <rect x="240" y="30" width="30" height="150" rx="4" class="terminal-block" />
              <circle cx="255" cy="40" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="251" y1="40" x2="259" y2="40" stroke="#1e293b" stroke-width="1.5" />
              <circle cx="255" cy="190" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="251" y1="190" x2="259" y2="190" stroke="#1e293b" stroke-width="1.5" />
              <text x="232" y="44" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="end">L OUT</text>
              <text x="232" y="194" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="end">N OUT</text>

              <!-- PCB Board design -->
              <rect x="70" y="65" width="140" height="110" rx="4" fill="#0d4e24" stroke="#10b981" stroke-width="1.2" />
              <rect x="90" y="110" width="22" height="22" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
              <text x="101" y="123" fill="#94a3b8" font-family="monospace" font-size="5" text-anchor="middle" font-weight="bold">ESP8266</text>
              <circle cx="190" cy="85" r="3" fill="#10b981" class="led-blink" />
              <text x="190" y="78" fill="#10b981" font-family="monospace" font-size="6" text-anchor="middle">STATUS</text>

              <!-- Switch Schematic -->
              <rect x="135" y="85" width="35" height="50" rx="2" fill="#1e1e1e" stroke="#888" stroke-width="0.8" />
              <g transform="translate(152, 110)">
                <circle cx="0" cy="15" r="2" fill="#ef4444" />
                <circle cx="0" cy="-15" r="2" fill="#ef4444" />
                <line x1="0" y1="15" x2="0" y2="-13" stroke="#ef4444" stroke-width="2" style="animation: switchAction 2.5s infinite ease-in-out; transform-origin: 0px 15px;" />
              </g>
            </g>

            <!-- Output Connections to LED Panel -->
            <path d="M 540,100 L 650,100" class="cable-phase cable-flow" />
            <path d="M 540,250 L 600,250 L 600,180 L 650,180" class="cable-neutral cable-flow" />

            <!-- LED Panel Fixture -->
            <g transform="translate(650, 75)">
              <rect x="0" y="0" width="90" height="130" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2" class="glow-lamp" />
              <rect x="5" y="5" width="80" height="120" rx="2" fill="#fff" opacity="0.95" />
              <polygon points="5,-10 -50,140 140,140 85,-10" fill="url(#lampGlow)" opacity="0.6" style="transform: translateY(135px); pointer-events: none;" />
              <text x="45" y="60" fill="#1e293b" font-family="'Outfit', sans-serif" font-size="9" font-weight="700" text-anchor="middle">PANEL LED</text>
              <text x="45" y="74" fill="#64748b" font-family="monospace" font-size="8" text-anchor="middle">220V AC</text>
            </g>
          </svg>
        </div>
      `,
      en: `
        <div style="background: rgba(26, 106, 255, 0.05); border: 1px solid rgba(26, 106, 255, 0.2); padding: 1.25rem; border-radius: 6px; margin-bottom: 2.5rem; text-align: center;">
          <p style="margin-bottom: 0.75rem; font-size: 13px; font-family: 'Space Mono', monospace; color: var(--white);">Complete IoT System Diagram in SVG (Vector) format</p>
          <a href="/plano_smart_office_nanotechnology.svg" download="plano_smart_office_nanotechnology.svg" class="project-link" style="display: inline-block; text-decoration: none; text-align: center; font-family: 'Space Mono', monospace; font-size: 11px; padding: 10px 20px; background: var(--blue-light); color: var(--bg); border-radius: 4px; font-weight: bold; transition: all 0.3s;">📥 Download Floor Plan (SVG)</a>
        </div>

        <h4 style="margin-top:2.5rem;">IoT Distribution and Connectivity Plan (Nanotechnology SAC)</h4>
        <p>Smart office floor plan diagram showing the distribution of IoT devices and their connectivity paths:</p>
        <div style="margin: 1rem 0 2.5rem 0;">
          <svg viewBox="0 0 690 530" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
<title style="fill:rgb(0, 0, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">Plano Smart Office — Nanotechnology SAC</title>
<desc style="fill:rgb(0, 0, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">Plano de planta de la oficina inteligente con distribución de dispositivos IoT: Sonoff, cámaras, Raspberry Pi y router</desc>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
<mask id="imagine-text-gaps-o8e4t8" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="690" height="530" fill="white"/><rect x="39" y="461" width="90.921875" height="14" fill="black" rx="2"/><rect x="54" y="480" width="95.01318359375" height="14" fill="black" rx="2"/><rect x="156" y="480" width="56.609375" height="14" fill="black" rx="2"/><rect x="232" y="480" width="41.00439453125" height="14" fill="black" rx="2"/><rect x="312" y="480" width="68.0087890625" height="14" fill="black" rx="2"/><rect x="400" y="480" width="68.0087890625" height="14" fill="black" rx="2"/><rect x="478" y="480" width="94.421875" height="14" fill="black" rx="2"/><rect x="570" y="480" width="62.60791015625" height="14" fill="black" rx="2"/><rect x="73.2421875" y="244" width="76.515625" height="16" fill="black" rx="2"/><rect x="206.9921875" y="351" width="39.015625" height="16" fill="black" rx="2"/><rect x="291.9921875" y="351" width="39.015625" height="16" fill="black" rx="2"/><rect x="192.4921875" y="69" width="114.015625" height="16" fill="black" rx="2"/><rect x="349.7421875" y="70" width="60.515625" height="15" fill="black" rx="2"/><rect x="493.2421875" y="69" width="76.515625" height="16" fill="black" rx="2"/><rect x="468.4921875" y="220" width="53.015625" height="15" fill="black" rx="2"/><rect x="474.9921875" y="317" width="39.015625" height="16" fill="black" rx="2"/><rect x="430.4921875" y="387" width="114.015625" height="16" fill="black" rx="2"/><rect x="244.984375" y="201" width="139.818603515625" height="13" fill="black" rx="2"/><rect x="284.390625" y="239" width="40.003875732421875" height="13" fill="black" rx="2"/><rect x="512.1953125" y="109" width="50.4053955078125" height="13" fill="black" rx="2"/><rect x="506.9921875" y="118" width="60.8070068359375" height="13" fill="black" rx="2"/><rect x="208.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="202.9921875" y="121" width="34.015625" height="13" fill="black" rx="2"/><rect x="222.59375" y="113" width="54.8125" height="13" fill="black" rx="2"/><rect x="268.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="207.9921875" y="149" width="34.8031005859375" height="13" fill="black" rx="2"/><rect x="207.9921875" y="157" width="34.015625" height="13" fill="black" rx="2"/><rect x="252.9921875" y="149" width="34.015625" height="13" fill="black" rx="2"/><rect x="322.59375" y="113" width="54.8125" height="13" fill="black" rx="2"/><rect x="378.1953125" y="113" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="343.1953125" y="149" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="61" y="293" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="72.59375" y="317" width="54.8125" height="13" fill="black" rx="2"/><rect x="468" y="69" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="462.59375" y="127" width="54.8125" height="13" fill="black" rx="2"/><rect x="376" y="389" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="552.390625" y="389" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="306.1953125" y="273" width="24.40155029296875" height="13" fill="black" rx="2"/><rect x="447.9921875" y="231" width="34.015625" height="13" fill="black" rx="2"/><rect x="404.9921875" y="159" width="60.015625" height="13" fill="black" rx="2"/><rect x="158.9765625" y="19" width="361.046875" height="16" fill="black" rx="2"/><rect x="191.9765625" y="34" width="296.046875" height="13" fill="black" rx="2"/></mask></defs>



<rect width="680" height="520" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="10" y="10" width="660" height="500" fill="#060b18" stroke="rgba(26,106,255,0.15)" stroke-width="0.5" rx="4" style="fill:rgb(6, 11, 24);stroke:rgba(26, 106, 255, 0.15);color:rgb(0, 0, 0);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- ═══ PERÍMETRO EXTERIOR DE LA OFICINA ═══ -->
<rect x="40" y="50" width="580" height="390" rx="2" fill="none" stroke="#1a6aff" stroke-width="1.5" stroke-dasharray="6 3" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-dasharray:6px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- ═══ LEYENDA DE DISPOSITIVOS ═══ -->
<text x="44" y="470" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:700;text-anchor:start;dominant-baseline:auto">DEVICES:</text>

<!-- Sonoff POW -->
<rect x="44" y="480" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="58" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Sonoff POW Elite</text>

<!-- Sonoff R2 -->
<circle cx="150" cy="485" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="150" cy="485" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="160" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Sonoff R2</text>

<!-- Cámara -->
<polygon points="225,482 231,479 231,491 225,488" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="218" y="482" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="236" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Cámara</text>

<!-- Power strip -->
<rect x="300" y="481" width="12" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="304" cy="485" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="308" cy="485" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="316" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Power Strip</text>

<!-- Router -->
<rect x="390" y="480" width="10" height="10" rx="1" fill="#1a6aff" opacity="0.6" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.6;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="393" y1="480" x2="391" y2="475" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="395" y1="480" x2="395" y2="474" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="397" y1="480" x2="399" y2="475" stroke="#4a9eff" stroke-width="0.8" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="404" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Router WiFi</text>

<!-- Servidor RPi -->
<rect x="468" y="480" width="10" height="10" rx="1" fill="#1a6aff" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="470" y="482" width="6" height="6" rx="0.5" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="482" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Servidor (RPi 4)</text>

<!-- Gleco Plug -->
<circle cx="566" cy="485" r="5" fill="#2ecc71" opacity="0.8" style="fill:rgb(46, 204, 113);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.8;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="574" y="489" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:9px;font-weight:400;text-anchor:start;dominant-baseline:auto">Gleco Plug</text>

<!-- ═══ DIVISIONES INTERIORES ═══ -->

<!-- ALMACÉN 1 — izquierda grande -->
<rect x="40" y="230" width="145" height="210" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="112" y="255" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Warehouse 1</text>

<!-- BAÑO 1 y BAÑO 2 — parte inferior izquierda -->
<rect x="185" y="340" width="85" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="227" y="362" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Restroom</text>

<rect x="270" y="340" width="85" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="312" y="362" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Restroom</text>

<!-- ADMINISTRACIÓN -->
<rect x="185" y="50" width="130" height="140" fill="rgba(26,106,255,0.05)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.05);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="250" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Administration</text>

<!-- SOPORTE -->
<rect x="315" y="50" width="130" height="140" fill="rgba(26,106,255,0.05)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.05);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="380" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Support</text>

<!-- ALMACÉN 2 — derecha superior -->
<rect x="445" y="50" width="175" height="155" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="532" y="80" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Warehouse 2</text>

<!-- COCINA — derecha media -->
<rect x="445" y="205" width="100" height="100" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="495" y="230" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Kitchen</text>

<!-- BAÑO 3 — derecha media -->
<rect x="445" y="305" width="100" height="65" fill="rgba(26,106,255,0.04)" stroke="#1a6aff" stroke-width="0.8" style="fill:rgba(26, 106, 255, 0.04);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="495" y="328" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Restroom</text>

<!-- ÁREA COMERCIAL — franja inferior -->
<rect x="355" y="370" width="265" height="70" fill="rgba(26,106,255,0.06)" stroke="#1a6aff" stroke-width="1" style="fill:rgba(26, 106, 255, 0.06);stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="488" y="398" text-anchor="middle" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:10px;font-weight:700;text-anchor:middle;dominant-baseline:auto">Commercial Area</text>

<!-- PASILLO CENTRAL -->
<rect x="185" y="190" width="260" height="150" fill="rgba(26,106,255,0.02)" stroke="rgba(26,106,255,0.3)" stroke-width="0.5" stroke-dasharray="3 3" style="fill:rgba(26, 106, 255, 0.02);stroke:rgba(26, 106, 255, 0.3);color:rgb(0, 0, 0);stroke-width:0.5px;stroke-dasharray:3px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="315" y="210" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">— HALLWAY / CIRCULATION —</text>

<!-- ═══ DISPOSITIVOS ═══ -->

<!-- ROUTER WiFi — centro pasillo -->
<rect x="298" y="230" width="12" height="12" rx="1" fill="#1a6aff" opacity="0.6" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.6;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="302" y1="230" x2="300" y2="223" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="304" y2="222" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="306" y1="230" x2="308" y2="223" stroke="#4a9eff" stroke-width="1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="304" y="248" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">ROUTER</text>

<!-- SERVER Raspberry Pi 4 — cerca almacén 2 -->
<rect x="530" y="95" width="14" height="12" rx="1" fill="#1a6aff" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="532" y="97" width="10" height="8" rx="0.5" fill="#060b18" style="fill:rgb(6, 11, 24);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="533" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="536" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="539" y="98" width="2" height="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="537" y="118" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SERVER</text>
<text x="537" y="127" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">RPi 4 + HA</text>

<!-- SONOFF POW ELITE — Administration -->
<rect x="215" y="100" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="220" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POW</text>
<text x="220" y="130" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">ELITE</text>

<!-- SONOFF R2 — Administration -->
<circle cx="250" cy="105" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="250" cy="105" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="250" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Administration -->
<polygon points="280,103 286,100 286,112 280,109" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="273" y="103" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="280" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">CAM</text>

<!-- POWER STRIP — Administration -->
<rect x="218" y="138" width="14" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="223" cy="142" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="228" cy="142" r="1.5" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="225" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POWER</text>
<text x="225" y="166" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">STRIP</text>

<!-- GLECO PLUG — Administration -->
<circle cx="270" cy="142" r="5" fill="#2ecc71" opacity="0.8" style="fill:rgb(46, 204, 113);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.8;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="270" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">GLECO</text>

<!-- SONOFF R2 — Support -->
<circle cx="350" cy="105" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="350" cy="105" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="350" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Support -->
<polygon points="390,103 396,100 396,112 390,109" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="383" y="103" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="390" y="122" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">CAM</text>

<!-- SONOFF POW — Support -->
<rect x="350" y="138" width="10" height="10" rx="2" fill="#1a6aff" opacity="0.9" style="fill:rgb(26, 106, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="355" y="158" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">POW</text>

<!-- CÁMARA Warehouse 1 -->
<polygon points="55,290 61,287 61,299 55,296" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="48" y="290" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="65" y="302" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- SONOFF R2 — Warehouse 1 -->
<circle cx="100" cy="310" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="100" cy="310" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="100" y="326" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Warehouse 2 -->
<polygon points="455,65 461,62 461,74 455,71" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="448" y="65" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="472" y="78" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- SONOFF R2 — Warehouse 2 -->
<circle cx="490" cy="120" r="5" fill="none" stroke="#4a9eff" stroke-width="1.5" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<circle cx="490" cy="120" r="2" fill="#4a9eff" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="490" y="136" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">SONOFF R2</text>

<!-- CÁMARA Commercial Area izq -->
<polygon points="365,385 371,382 371,394 365,391" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="358" y="385" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="380" y="398" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:start;dominant-baseline:auto">CAM</text>

<!-- CÁMARA Commercial Area der -->
<polygon points="590,385 596,382 596,394 590,391" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="583" y="385" width="7" height="6" rx="1" fill="#ffa500" opacity="0.9" style="fill:rgb(255, 165, 0);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="572" y="398" text-anchor="end" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:end;dominant-baseline:auto">CAM</text>

<!-- SENSOR PIR — pasillo central -->
<polygon points="312,268 318,260 324,268" fill="rgba(74,158,255,0.6)" stroke="#4a9eff" stroke-width="0.8" style="fill:rgba(74, 158, 255, 0.6);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="318" y="282" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">PIR</text>

<!-- IR Transceiver (AC) — Kitchen -->
<rect x="460" y="220" width="10" height="8" rx="1" fill="none" stroke="#4a9eff" stroke-width="1" style="fill:none;stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="463" y2="214" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="465" y2="213" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="465" y1="220" x2="467" y2="214" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="2 1" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:2px, 1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="465" y="240" text-anchor="middle" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">IR/AC</text>

<!-- ═══ LÍNEAS WIFI DASHED AL ROUTER ═══ -->
<line x1="304" y1="230" x2="250" y2="145" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="355" y2="145" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="490" y2="130" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="100" y2="318" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="304" y1="230" x2="465" y2="226" marker-end="url(#arrow)" style="fill:none;stroke:rgb(26, 106, 255);color:rgb(0, 0, 0);stroke-width:0.8px;stroke-dasharray:4px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.5;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>

<!-- Línea Servidor → Router -->
<line x1="530" y1="101" x2="314" y2="230" stroke="#4a9eff" stroke-width="1" stroke-dasharray="5 3" opacity="0.7" marker-end="url(#arrow)" mask="url(#imagine-text-gaps-o8e4t8)" style="fill:rgb(0, 0, 0);stroke:rgb(74, 158, 255);color:rgb(0, 0, 0);stroke-width:1px;stroke-dasharray:5px, 3px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.7;font-family:&quot;Anthropic Sans&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="435" y="168" text-anchor="middle" transform="rotate(-25, 435, 168)" style="fill:rgb(136, 153, 187);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">LAN / WiFi</text>

<!-- TÍTULO -->
<text x="340" y="30" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" font-weight="700" fill="#4a9eff" letter-spacing="0.2em" style="fill:rgb(74, 158, 255);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:11px;font-weight:700;text-anchor:middle;dominant-baseline:auto">NANOTECHNOLOGY SAC — SMART OFFICE LAYOUT</text>
<text x="340" y="43" text-anchor="middle" font-family="'Courier New', monospace" font-size="8" fill="#4a5a7a" letter-spacing="0.15em" style="fill:rgb(74, 90, 122);stroke:none;color:rgb(0, 0, 0);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Courier New&quot;, monospace;font-size:8px;font-weight:400;text-anchor:middle;dominant-baseline:auto">TRUJILLO, PERU — HOME ASSISTANT + RASPBERRY PI 4</text>

</svg>
        </div>
    
        <h4>Project Budget and Material Bill (SENATI)</h4>
        <p>The official budget extracted from the innovation project technical specifications is listed below:</p>
        <table class="modal-table">
          <thead>
            <tr>
              <th>Component / Item</th>
              <th>Qty</th>
              <th>Unit Cost</th>
              <th>Total (S/.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Raspberry Pi 4 Model B Server (4GB) + Case & Supply</td>
              <td>1</td>
              <td>S/. 495.00</td>
              <td>S/. 495.00</td>
            </tr>
            <tr>
              <td>SONOFF Basic R3 Smart Switches (Tasmota Flashed)</td>
              <td>6</td>
              <td>S/. 25.00</td>
              <td>S/. 150.00</td>
            </tr>
            <tr>
              <td>SONOFF POW Elite Power Monitor Switch (20A)</td>
              <td>1</td>
              <td>S/. 85.00</td>
              <td>S/. 85.00</td>
            </tr>
            <tr>
              <td>PIR Motion Sensors HC-SR501 (GPIO)</td>
              <td>3</td>
              <td>S/. 20.00</td>
              <td>S/. 60.00</td>
            </tr>
            <tr>
              <td>Plastic conduits, electric cables and wiring accessories</td>
              <td>-</td>
              <td>S/. 120.00</td>
              <td>S/. 120.00</td>
            </tr>
            <tr>
              <td>Minor tools, fasteners and fuses</td>
              <td>-</td>
              <td>S/. 80.00</td>
              <td>S/. 80.00</td>
            </tr>
            <tr>
              <td>High efficiency LED Light Panels</td>
              <td>4</td>
              <td>S/. 95.00</td>
              <td>S/. 380.00</td>
            </tr>
            <tr>
              <td>Broadlink RM4 Mini IR AC Controller</td>
              <td>1</td>
              <td>S/. 150.00</td>
              <td>S/. 150.00</td>
            </tr>
            <tr>
              <td>Smart Wi-Fi Power Strips (Surge Protection)</td>
              <td>2</td>
              <td>S/. 180.00</td>
              <td>S/. 360.00</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid var(--border);">
              <td>Subtotal Materials and Equipment</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,720.00</td>
            </tr>
            <tr>
              <td>Qualified Labor (IT Tech, Electrician, Supervisor)</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,030.00</td>
            </tr>
            <tr style="font-weight: bold; background: var(--bg3); color: var(--blue-light);">
              <td>TOTAL GENERAL INVESTMENT</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 2,870.00</td>
            </tr>
          </tbody>
        </table>
        
        <h4>Return on Investment (ROI) Analysis</h4>
        <ul>
          <li><strong>Baseline Electrical Consumption:</strong> 357 kWh monthly (Approximately <strong>S/. 400.00</strong> per month).</li>
          <li><strong>Estimated Savings:</strong> Guaranteed reduction of <strong>S/. 120.00 monthly</strong> (30% savings by preventing waste).</li>
          <li><strong>Payback Period:</strong> ~24 months to fully amortize the initial hardware cost.</li>
        </ul>

                <h4 style="margin-top:2.5rem;">Device Layout and Distribution Plan (SENATI)</h4>
        <p>Physical distribution maps showing motion sensors (PIR), climate remote, and switches inside Nanotechnology Office:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
              </linearGradient>
              <linearGradient id="acAirGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <style>
              @keyframes ledBlink {
                0%, 100% { fill: #00ff66; filter: drop-shadow(0 0 3px #00ff66); }
                50% { fill: #004411; filter: none; }
              }
              @keyframes ledBlinkRed {
                0%, 100% { fill: #ff0055; filter: drop-shadow(0 0 3px #ff0055); }
                50% { fill: #550011; filter: none; }
              }
              @keyframes radarPulse {
                0% { r: 6; opacity: 1; stroke-width: 1.5; }
                50% { opacity: 0.5; }
                100% { r: 45; opacity: 0; stroke-width: 0.5; }
              }
              @keyframes fanRotation {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes airDrift {
                0% { stroke-dashoffset: 0; opacity: 0; transform: translateY(0); }
                30% { opacity: 0.8; }
                100% { stroke-dashoffset: 24; opacity: 0; transform: translateY(25px); }
              }
              @keyframes lineFlow {
                to { stroke-dashoffset: -20; }
              }
              .led-blink { animation: ledBlink 1s infinite steps(1); }
              .led-blink-red { animation: ledBlinkRed 1.5s infinite steps(1); }
              .radar-wave { animation: radarPulse 2s infinite cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: center; }
              .fan-spin { animation: fanRotation 0.8s infinite linear; transform-origin: 380px 340px; }
              .air-flow { animation: airDrift 2s infinite linear; stroke-dasharray: 6, 6; }
              .office-wall { stroke: #1e40af; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; fill: url(#wallGrad); }
              .office-wall-inner { stroke: #3b82f6; stroke-width: 1.5; stroke-opacity: 0.7; }
              .door-arc { stroke: #3b82f6; stroke-width: 1; stroke-dasharray: 3 3; fill: none; }
              .furniture { fill: #0b1329; stroke: #1e293b; stroke-width: 1.5; }
              .label-room { font-family: "Outfit", sans-serif; font-size: 11px; font-weight: 700; fill: #60a5fa; letter-spacing: 1.5px; opacity: 0.85; }
              .glow-node { filter: drop-shadow(0 0 4px #00e5ff); }
            </style>

            <!-- Grid Background -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid)" />

            <!-- Room Furniture (Desks) -->
            <rect x="70" y="80" width="40" height="70" rx="3" class="furniture" />
            <path d="M 110,95 A 15,15 0 0,1 110,135" stroke="#1e293b" stroke-width="1.5" fill="none"/>
            <rect x="70" y="240" width="30" height="30" rx="4" class="furniture" />
            <rect x="70" y="290" width="30" height="30" rx="4" class="furniture" />
            <rect x="70" y="340" width="30" height="30" rx="4" class="furniture" />
            <rect x="340" y="80" width="100" height="40" rx="3" class="furniture" />
            <rect x="340" y="160" width="100" height="40" rx="3" class="furniture" />
            <path d="M 640,60 L 710,60 L 710,130 L 680,130 L 680,90 L 640,90 Z" class="furniture" />
            <rect x="580" y="270" width="120" height="60" rx="30" class="furniture" />

            <!-- Main Office Walls (Outer) -->
            <rect x="50" y="40" width="700" height="370" class="office-wall" stroke-width="4" stroke="#1e3a8a"/>

            <!-- Inner Walls -->
            <line x1="50" y1="200" x2="210" y2="200" class="office-wall" />
            <line x1="50" y1="200" x2="210" y2="200" class="office-wall-inner" />
            <line x1="280" y1="40" x2="280" y2="130" class="office-wall" />
            <line x1="280" y1="40" x2="280" y2="130" class="office-wall-inner" />
            <line x1="280" y1="190" x2="280" y2="410" class="office-wall" />
            <line x1="280" y1="190" x2="280" y2="410" class="office-wall-inner" />
            
            <line x1="520" y1="40" x2="520" y2="150" class="office-wall" />
            <line x1="520" y1="40" x2="520" y2="150" class="office-wall-inner" />
            <line x1="520" y1="210" x2="520" y2="410" class="office-wall" />
            <line x1="520" y1="210" x2="520" y2="410" class="office-wall-inner" />
            <line x1="520" y1="220" x2="750" y2="220" class="office-wall" />
            <line x1="520" y1="220" x2="750" y2="220" class="office-wall-inner" />

            <!-- Doors arcs -->
            <path d="M 280,130 A 60,60 0 0,1 220,190" class="door-arc" />
            <line x1="280" y1="130" x2="220" y2="130" stroke="#3b82f6" stroke-width="2" />
            <path d="M 280,190 A 60,60 0 0,0 220,130" class="door-arc" />
            <line x1="280" y1="190" x2="220" y2="190" stroke="#3b82f6" stroke-width="2" />
            <path d="M 520,150 A 60,60 0 0,1 580,210" class="door-arc" />
            <line x1="520" y1="150" x2="520" y2="210" stroke="#3b82f6" stroke-width="2" />
            <path d="M 520,210 A 60,60 0 0,0 580,150" class="door-arc" />
            <line x1="520" y1="210" x2="520" y2="150" stroke="#3b82f6" stroke-width="2" />

            <!-- Room Labels -->
            <text x="165" y="115" class="label-room" text-anchor="middle">RECEPTION</text>
            <text x="165" y="315" class="label-room" text-anchor="middle">WAITING ROOM</text>
            <text x="400" y="225" class="label-room" text-anchor="middle" font-size="13">MAIN OFFICE</text>
            <text x="635" y="150" class="label-room" text-anchor="middle">IT / SUPPORT</text>
            <text x="635" y="360" class="label-room" text-anchor="middle">MEETING ROOM</text>

            <!-- Raspberry Pi 4 Model B -->
            <g transform="translate(635, 95) scale(0.95)">
              <rect x="-22" y="-30" width="44" height="60" rx="5" fill="#0d4e24" stroke="#10b981" stroke-width="1.5" />
              <rect x="-12" y="-12" width="15" height="15" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
              <rect x="-8" y="-8" width="7" height="7" fill="#0f172a" />
              <line x1="-18" y1="-26" x2="18" y2="-26" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="1.8 1" />
              <rect x="5" y="-18" width="12" height="10" rx="0.5" fill="#111" />
              <rect x="-18" y="25" width="8" height="8" fill="#475569" rx="1" />
              <rect x="-5" y="25" width="8" height="8" fill="#475569" rx="1" />
              <rect x="8" y="23" width="9" height="10" fill="#334155" rx="1" />
              <rect x="-24" y="-15" width="3" height="7" fill="#334155" />
              <circle cx="17" cy="18" r="2" fill="#ef4444" />
              <circle cx="17" cy="12" r="2" fill="#10b981" class="led-blink" />
              <text x="0" y="-34" fill="#10b981" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">PI4 SERVER</text>
            </g>

            <!-- PIR HC-SR501 Sensor 1 -->
            <g transform="translate(400, 75)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 0.6s;" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 1.2s;" />
              <text x="0" y="-12" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">PIR 1</text>
            </g>

            <!-- PIR HC-SR501 Sensor 2 -->
            <g transform="translate(685, 250)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 1s;" />
              <text x="-18" y="4" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="end">PIR 2</text>
            </g>

            <!-- PIR HC-SR501 Sensor 3 -->
            <g transform="translate(110, 280)">
              <rect x="-14" y="-9" width="28" height="18" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" />
              <circle cx="0" cy="0" r="7" stroke="#f59e0b" stroke-width="0.8" fill="none" class="radar-wave" style="animation-delay: 0.4s;" />
              <text x="18" y="4" fill="#f59e0b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="start">PIR 3</text>
            </g>

            <!-- Sonoff Actuators (Lights) -->
            <g transform="translate(165, 150)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-Rec</text>
            </g>

            <g transform="translate(350, 140)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-A</text>
            </g>

            <g transform="translate(450, 140)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-B</text>
            </g>

            <g transform="translate(640, 310)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <circle cx="6" cy="-4" r="1" fill="#00ff66" class="led-blink" />
              <text x="0" y="-12" fill="#93c5fd" font-family="monospace" font-size="8" text-anchor="middle">L-Meet</text>
            </g>

            <!-- Broadlink IR Blaster -->
            <g transform="translate(425, 290)">
              <path d="M -10,6 L 0,-10 L 10,6 Z" fill="#111" stroke="#ef4444" stroke-width="1.5" />
              <circle cx="0" cy="0" r="1.5" fill="#ef4444" class="led-blink-red" />
              <text x="0" y="16" fill="#fca5a5" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">BROADLINK IR</text>
            </g>

            <!-- Air Conditioning Unit -->
            <g transform="translate(400, 340)">
              <rect x="-35" y="-12" width="70" height="24" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.8" />
              <line x1="-25" y1="2" x2="25" y2="2" stroke="#1e293b" stroke-width="1" />
              <line x1="-25" y1="6" x2="25" y2="6" stroke="#1e293b" stroke-width="1" />
              <rect x="25" y="-8" width="4" height="2" fill="#00ff66" />
              <g transform="translate(-20, 0)">
                <circle cx="0" cy="0" r="8" stroke="#334155" stroke-width="1" fill="#020617"/>
                <g class="fan-spin">
                  <path d="M 0,0 L 0,-6 A 2,2 0 0,1 2,-6 Z" fill="#60a5fa" />
                  <path d="M 0,0 L 6,0 A 2,2 0 0,1 6,2 Z" fill="#60a5fa" />
                  <path d="M 0,0 L 0,6 A 2,2 0 0,1 -2,6 Z" fill="#60a5fa" />
                  <path d="M 0,0 L -6,0 A 2,2 0 0,1 -6,-2 Z" fill="#60a5fa" />
                </g>
              </g>
              <path d="M -20,16 Q -10,24 0,16 T 20,16" stroke="url(#acAirGrad)" stroke-width="2" fill="none" class="air-flow" />
              <path d="M -20,24 Q -10,32 0,24 T 20,24" stroke="url(#acAirGrad)" stroke-width="2" fill="none" class="air-flow" style="animation-delay: 1s;" />
              <text x="12" y="4" fill="#60a5fa" font-family="monospace" font-size="8" font-weight="bold">A/C</text>
            </g>

            <!-- Map Legend -->
            <g transform="translate(65, 345)" opacity="0.95">
              <rect x="0" y="0" width="145" height="50" rx="4" fill="#0b1329" stroke="#1e293b" stroke-width="1" />
              <circle cx="15" cy="12" r="4" fill="#3b82f6" />
              <text x="26" y="15" fill="#94a3b8" font-family="monospace" font-size="8">SONOFF SWITCH</text>
              <rect x="10" y="22" width="10" height="6" fill="#f8fafc" stroke="#f59e0b" stroke-width="1" />
              <text x="26" y="27" fill="#94a3b8" font-family="monospace" font-size="8">PIR SENSOR</text>
              <rect x="10" y="34" width="10" height="10" fill="#0d4e24" stroke="#10b981" stroke-width="1" />
              <text x="26" y="41" fill="#94a3b8" font-family="monospace" font-size="8">PI 4 SERVER</text>
            </g>
          </svg>
        </div>

        <h4>Logical IoT Integration Architecture</h4>
        <p>Conceptual integration diagram showing communication links between the central server and peripheral nodes:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="glowLineBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="1" />
                <stop offset="100%" stop-color="#00e5ff" stop-opacity="1" />
              </linearGradient>
            </defs>
            <style>
              @keyframes lineSignal {
                to { stroke-dashoffset: -40; }
              }
              @keyframes nodePulse {
                0%, 100% { filter: drop-shadow(0 0 2px #00e5ff); }
                50% { filter: drop-shadow(0 0 8px #00e5ff); }
              }
              .comm-line { stroke: url(#glowLineBlue); stroke-width: 2; stroke-dasharray: 6 4; animation: lineSignal 1.5s infinite linear; }
              .comm-line-reverse { stroke: url(#glowLineBlue); stroke-width: 2; stroke-dasharray: 6 4; animation: lineSignal 1.5s infinite linear; animation-direction: reverse; }
              .arch-card { fill: #0b1329; stroke: #1e293b; stroke-width: 1.5; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4)); transition: stroke 0.3s; }
              .arch-card:hover { stroke: #3b82f6; }
              .arch-title { font-family: "Outfit", sans-serif; font-size: 11px; font-weight: 700; fill: #fff; letter-spacing: 1px; }
              .arch-sub { font-family: "Outfit", sans-serif; font-size: 9px; fill: #60a5fa; }
              .arch-desc { font-family: monospace; font-size: 8px; fill: #94a3b8; }
            </style>

            <!-- Grid -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid2)" />

            <!-- Communication Lines -->
            <path d="M 400,200 L 180,95" class="comm-line-reverse" />
            <path d="M 400,200 L 180,200" class="comm-line-reverse" />
            <path d="M 400,200 L 180,305" class="comm-line" />
            <path d="M 400,200 L 620,95" class="comm-line" />
            <path d="M 400,200 L 620,200" class="comm-line" />

            <!-- Central Core Card -->
            <g transform="translate(400, 200)">
              <rect x="-95" y="-50" width="190" height="100" rx="8" fill="#091424" stroke="#00e5ff" stroke-width="2" style="animation: nodePulse 3s infinite ease-in-out;" />
              <g transform="translate(-55, 0) scale(0.7)">
                <rect x="-22" y="-30" width="44" height="60" rx="5" fill="#0d4e24" stroke="#10b981" stroke-width="1.5" />
                <rect x="-12" y="-12" width="15" height="15" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
                <line x1="-18" y1="-26" x2="18" y2="-26" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="1.8 1" />
                <circle cx="17" cy="12" r="2" fill="#10b981" class="led-blink" />
              </g>
              <text x="35" y="-20" class="arch-title" text-anchor="middle">CENTRAL CORE</text>
              <text x="35" y="-4" class="arch-sub" text-anchor="middle" font-weight="bold">Raspberry Pi 4</text>
              <text x="35" y="10" class="arch-desc" text-anchor="middle">Home Assistant OS</text>
              <text x="35" y="22" class="arch-desc" text-anchor="middle" fill="#00ff66" font-weight="bold">ONLINE</text>
            </g>

            <!-- Card 1: LIGHTING -->
            <g transform="translate(180, 95)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-15" width="24" height="16" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <circle cx="-63" cy="-7" r="3" fill="#3b82f6" />
              <circle cx="-57" cy="-11" r="1.5" fill="#00ff66" class="led-blink" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">LIGHTING (6x)</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Sonoff Basic R2 (Tasmota)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Firmware: Tasmota | MQTT</text>
            </g>

            <!-- Card 2: POWER MONITORING -->
            <g transform="translate(180, 200)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-18" width="24" height="24" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <rect x="-71" y="-14" width="16" height="10" fill="#0f172a" />
              <text x="-63" y="-7" fill="#00e5ff" font-family="monospace" font-size="5" text-anchor="middle">1.85 kW</text>
              <text x="-40" y="-10" class="arch-title" text-anchor="start">POWER MONITORING</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Sonoff POW Elite (20A)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Real-time kWh telemetry</text>
            </g>

            <!-- Card 3: MOTION SENSING -->
            <g transform="translate(180, 305)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-75" y="-14" width="24" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" />
              <circle cx="-63" cy="-6" r="5" fill="#f8fafc" stroke="#f59e0b" stroke-width="0.5" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">MOTION SENSING</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">PIR HC-SR501 (3x)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Wired GPIO | Presence logs</text>
            </g>

            <!-- Card 4: CLIMATE -->
            <g transform="translate(620, 95)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <path d="M -73,-7 L -65,-21 L -57,-7 Z" fill="#1e293b" stroke="#ef4444" stroke-width="1.2" />
              <circle cx="-65" cy="-12" r="1.5" fill="#ef4444" class="led-blink-red" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">CLIMATE CONTROLLER</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Broadlink RM4 Mini (IR)</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Infrared (IR) Transmitter</text>
            </g>

            <!-- Card 5: USER DASHBOARD -->
            <g transform="translate(620, 200)">
              <rect x="-90" y="-30" width="180" height="60" rx="6" class="arch-card" />
              <rect x="-73" y="-20" width="16" height="28" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.2" />
              <line x1="-68" y1="-17" x2="-62" y2="-17" stroke="#3b82f6" stroke-width="1" />
              <circle cx="-65" cy="5" r="1.5" fill="#3b82f6" />
              <text x="-40" y="-10" class="arch-title" text-anchor="start">USER DASHBOARD</text>
              <text x="-40" y="4" class="arch-sub" text-anchor="start">Mobile App / Web UI</text>
              <text x="-40" y="16" class="arch-desc" text-anchor="start">Lovelace UI | Local Control</text>
            </g>
          </svg>
        </div>

        <h4>Sensors and Relays Wiring Schematics</h4>
        <p>Electrical wiring connection diagram of the smart relays Sonoff Basic R2 with the lamp and switches:</p>
        <div style="margin: 1rem 0 1rem 0;">
          <svg viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; padding: 1rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            <defs>
              <pattern id="blueprintGrid3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e172a" stroke-width="0.7" />
              </pattern>
              <linearGradient id="lampGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
              </linearGradient>
            </defs>
            <style>
              @keyframes electricFlow {
                to { stroke-dashoffset: -20; }
              }
              @keyframes switchAction {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-25deg); }
              }
              .cable-phase { stroke: #ef4444; stroke-width: 3; }
              .cable-neutral { stroke: #3b82f6; stroke-width: 3; }
              .cable-flow { stroke-dasharray: 6 4; animation: electricFlow 1s infinite linear; }
              .terminal-block { fill: #1e293b; stroke: #475569; stroke-width: 1.5; }
              .glow-lamp { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); }
              .wire-label { font-family: monospace; font-size: 10px; font-weight: bold; }
            </style>

            <!-- Grid -->
            <rect width="100%" height="100%" fill="url(#blueprintGrid3)" />

            <!-- Phase line -->
            <path d="M 60,100 L 260,100" class="cable-phase cable-flow" />
            <text x="60" y="88" fill="#ef4444" class="wire-label">Phase L (220V AC)</text>

            <!-- Neutral line -->
            <path d="M 60,250 L 260,250" class="cable-neutral cable-flow" />
            <text x="60" y="238" fill="#3b82f6" class="wire-label">Neutral N</text>

            <!-- SONOFF BASIC R2 Device Representation -->
            <g transform="translate(260, 60)">
              <rect x="0" y="0" width="280" height="210" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5" />
              <rect x="5" y="5" width="270" height="200" rx="6" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />
              <text x="140" y="32" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">SONOFF BASIC R2</text>
              <text x="140" y="48" fill="#60a5fa" font-family="'Outfit', sans-serif" font-size="9" text-anchor="middle" font-weight="bold">Smart Switch</text>

              <!-- Input Side Terminals -->
              <rect x="10" y="30" width="30" height="150" rx="4" class="terminal-block" />
              <circle cx="25" cy="40" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="21" y1="40" x2="29" y2="40" stroke="#1e293b" stroke-width="1.5" />
              <circle cx="25" cy="190" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="21" y1="190" x2="29" y2="190" stroke="#1e293b" stroke-width="1.5" />
              <text x="48" y="44" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">L IN</text>
              <text x="48" y="194" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">N IN</text>

              <!-- Output Side Terminals -->
              <rect x="240" y="30" width="30" height="150" rx="4" class="terminal-block" />
              <circle cx="255" cy="40" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="251" y1="40" x2="259" y2="40" stroke="#1e293b" stroke-width="1.5" />
              <circle cx="255" cy="190" r="5" fill="#475569" stroke="#94a3b8" />
              <line x1="251" y1="190" x2="259" y2="190" stroke="#1e293b" stroke-width="1.5" />
              <text x="232" y="44" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="end">L OUT</text>
              <text x="232" y="194" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="end">N OUT</text>

              <!-- PCB Board design -->
              <rect x="70" y="65" width="140" height="110" rx="4" fill="#0d4e24" stroke="#10b981" stroke-width="1.2" />
              <rect x="90" y="110" width="22" height="22" rx="1" fill="#1e293b" stroke="#64748b" stroke-width="0.5" />
              <text x="101" y="123" fill="#94a3b8" font-family="monospace" font-size="5" text-anchor="middle" font-weight="bold">ESP8266</text>
              <circle cx="190" cy="85" r="3" fill="#10b981" class="led-blink" />
              <text x="190" y="78" fill="#10b981" font-family="monospace" font-size="6" text-anchor="middle">STATUS</text>

              <!-- Switch Schematic -->
              <rect x="135" y="85" width="35" height="50" rx="2" fill="#1e1e1e" stroke="#888" stroke-width="0.8" />
              <g transform="translate(152, 110)">
                <circle cx="0" cy="15" r="2" fill="#ef4444" />
                <circle cx="0" cy="-15" r="2" fill="#ef4444" />
                <line x1="0" y1="15" x2="0" y2="-13" stroke="#ef4444" stroke-width="2" style="animation: switchAction 2.5s infinite ease-in-out; transform-origin: 0px 15px;" />
              </g>
            </g>

            <!-- Output Connections to LED Panel -->
            <path d="M 540,100 L 650,100" class="cable-phase cable-flow" />
            <path d="M 540,250 L 600,250 L 600,180 L 650,180" class="cable-neutral cable-flow" />

            <!-- LED Panel Fixture -->
            <g transform="translate(650, 75)">
              <rect x="0" y="0" width="90" height="130" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2" class="glow-lamp" />
              <rect x="5" y="5" width="80" height="120" rx="2" fill="#fff" opacity="0.95" />
              <polygon points="5,-10 -50,140 140,140 85,-10" fill="url(#lampGlow)" opacity="0.6" style="transform: translateY(135px); pointer-events: none;" />
              <text x="45" y="60" fill="#1e293b" font-family="'Outfit', sans-serif" font-size="9" font-weight="700" text-anchor="middle">LED PANEL</text>
              <text x="45" y="74" fill="#64748b" font-family="monospace" font-size="8" text-anchor="middle">220V AC</text>
            </g>
          </svg>
        </div>
      `
    }
  },
  cursos: {
    title: {
      es: "Abre Cursos Pro (Guía & Recursos)",
      en: "Abre Cursos Pro (Guide & Resources)"
    },
    desc: {
      es: `
        <h4>Características y Flujo del Programa</h4>
        <p><strong>Abre Cursos Pro</strong> es una utilidad de escritorio desarrollada completamente en <strong>Python</strong> utilizando <strong>CustomTkinter</strong> para dotarle de un diseño cyberpunk premium similar a las herramientas industriales.</p>
        <p>Su función principal consiste en monitorear los horarios configurados a nivel de sistema e iniciar enlaces en navegadores de forma síncrona. Además de páginas web genéricas, se conecta a protocolos de inicio automático como:</p>
        <ul>
          <li><strong>Zoom Links:</strong> Lanza la app local omitiendo diálogos utilizando el URI scheme <code>zoommtg://</code>.</li>
          <li><strong>MS Teams:</strong> Lanza la aplicación mediante <code>msteams://</code> para garantizar accesos veloces.</li>
          <li><strong>LMS Canvas:</strong> Abre el navegador en la pestaña exacta del curso correspondiente.</li>
        </ul>
        
        <h4>Ventajas del Software</h4>
        <ul>
          <li><strong>Bajo Consumo de Memoria:</strong> Funciona discretamente minimizado en la bandeja del sistema consumiendo menos de 25MB de RAM.</li>
          <li><strong>Notificaciones Avanzadas:</strong> Se conecta con los Toast de Windows para alertarte antes de cada apertura.</li>
          <li><strong>Base de Datos Portátil:</strong> Guarda los datos de configuración en un archivo JSON local encriptado opcionalmente.</li>
        </ul>
      `,
      en: `
        <h4>Features and Program Flow</h4>
        <p><strong>Abre Cursos Pro</strong> is a desktop utility programmed entirely in <strong>Python</strong> utilizing <strong>CustomTkinter</strong> to yield a sleek dark-themed interface matching professional tools.</p>
        <p>Its primary goal is to run a local scheduler to launch classes in web browsers or desktop applications at the designated time. It supports launch protocols for:</p>
        <ul>
          <li><strong>Zoom Links:</strong> Launches the local app skipping prompts using the <code>zoommtg://</code> URI scheme.</li>
          <li><strong>MS Teams:</strong> Launches the app with the native protocol <code>msteams://</code>.</li>
          <li><strong>LMS Canvas:</strong> Automatically redirects the default browser to your course dashboard page.</li>
        </ul>
        
        <h4>Software Advantages</h4>
        <ul>
          <li><strong>Low Footprint:</strong> Runs quietly minimized to the system tray utilizing under 25MB of RAM.</li>
          <li><strong>Advanced Notifications:</strong> Seamlessly hooks with Windows native Action Center toast system.</li>
          <li><strong>Portable Storage:</strong> Persists data into local lightweight JSON structures.</li>
        </ul>
      `
    },
    extra: {
      es: `
        <!-- {{GITHUB_RELEASE_DOWNLOAD_PLACEHOLDER}} -->

        <h4>Guía de Instalación y Requisitos</h4>
        <p>Sigue las siguientes instrucciones para configurar y compilar el proyecto en tu entorno local:</p>
        
        <h4>1. Prerrequisitos</h4>
        <p>Asegúrate de contar con Python 3.10 o superior instalado en tu sistema de Windows.</p>
        
        <h4>2. Clonar y Configurar Dependencias</h4>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
git clone https://github.com/Francoisxd/abre-cursos.git
cd abre-cursos
pip install -r requirements.txt</pre>
        
        <h4>3. Ejecutar la Aplicación</h4>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
python main.py</pre>
        
        <h4>4. Compilar a Ejecutable (.EXE)</h4>
        <p>Para crear un ejecutable autónomo y portable que no requiera Python en otras máquinas, compílalo usando PyInstaller:</p>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
pip install pyinstaller
pyinstaller --noconsole --onefile --icon=resources/logo.ico --add-data "resources;resources" main.py</pre>
        <p>El ejecutable se generará en la carpeta <code>dist/</code> de tu directorio raíz y está listo para ser programado al inicio de Windows.</p>
      `,
      en: `
        <!-- {{GITHUB_RELEASE_DOWNLOAD_PLACEHOLDER}} -->

        <h4>Installation Guide and Requirements</h4>
        <p>Follow these steps to download, install, and compile the desktop client locally:</p>
        
        <h4>1. Prerequisites</h4>
        <p>Ensure Python 3.10+ is installed on your Windows machine.</p>
        
        <h4>2. Clone and Install Dependencies</h4>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
git clone https://github.com/Francoisxd/abre-cursos.git
cd abre-cursos
pip install -r requirements.txt</pre>
        
        <h4>3. Run the Development Client</h4>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
python main.py</pre>
        
        <h4>4. Compile to Standalone Executable (.EXE)</h4>
        <p>To produce a standalone portable executable package that runs without python setup:</p>
        <pre style="background:var(--bg3); padding:0.8rem; border-radius:4px; font-family:monospace; font-size:11px; overflow-x:auto; color:#fff; border:1px solid var(--border);">
pip install pyinstaller
pyinstaller --noconsole --onefile --icon=resources/logo.ico --add-data "resources;resources" main.py</pre>
        <p>The compiled asset will be placed within the <code>dist/</code> subdirectory.</p>
      `
    }
  }
};

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
        <a href="${latestRelease.download_url}" target="_blank" class="ctk-btn green" style="display: inline-block; text-decoration: none; text-align: center; font-family: 'Space Mono', monospace; font-size: 11px;">🚀 ${downloadLabel}</a>
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
const btnOpenOfficeModal = document.getElementById('btnOpenOfficeModal');
const btnOpenCursosModal = document.getElementById('btnOpenCursosModal');

if (btnOpenOfficeModal) {
  btnOpenOfficeModal.addEventListener('click', () => openModal('office'));
}
if (btnOpenCursosModal) {
  btnOpenCursosModal.addEventListener('click', () => openModal('cursos'));
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
    if (card.querySelector('#btnOpenOfficeModal')) {
      cardOffice = card;
    }
    if (card.querySelector('#btnOpenCursosModal')) {
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
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(74, 158, 255, 0.35)';
      ctx.fill();
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
