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
      es: `        <h4>Presupuesto y Lista de Materiales (SENATI)</h4>
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

        <h4 style="margin-top:2.5rem;">Plano de Distribución y Conectividad IoT (Nanotechnology SAC)</h4>
        <p>Distribución de dispositivos inteligentes y sus conexiones al Router principal en la planta de la oficina:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 914 434" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
  <defs>
    <!-- Glow filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <style>
    /* Hotspot Interactive Elements */
    .hotspot { cursor: pointer; }
    .hotspot-ring { fill: none; stroke: #3b82f6; stroke-width: 1.5; opacity: 0; transition: all 0.3s; }
    .hotspot-pulse { fill: none; stroke: #3b82f6; stroke-width: 1.5; opacity: 0; transform-origin: center; transition: all 0.3s; }
    .flow-line { fill: none; stroke: #00ffcc; stroke-width: 2; opacity: 0; stroke-linecap: round; stroke-dasharray: 6 4; transition: all 0.3s; }
    .target-dot { fill: #00ffcc; opacity: 0; transition: all 0.3s; filter: url(#neonGlow); }
    .tooltip-bg { fill: #0b1329; stroke: #00ffcc; stroke-width: 1.2; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); }
    .tooltip-card { opacity: 0; pointer-events: none; transition: all 0.3s; transform: translateY(5px); }

    /* Hover triggers */
    .hotspot:hover .hotspot-ring { opacity: 1; stroke: #00ffcc; filter: url(#neonGlow); }
    .hotspot:hover .hotspot-pulse { opacity: 1; stroke: #00ffcc; animation: pulseWave 1.2s infinite linear; }
    .hotspot:hover .flow-line { opacity: 1; animation: flowDash 1s infinite linear; }
    .hotspot:hover .target-dot { opacity: 1; animation: targetPulse 1.2s infinite ease-out; }
    .hotspot:hover .tooltip-card { opacity: 1; transform: translateY(0); }

    @keyframes pulseWave {
      0% { r: 14; opacity: 1; stroke-width: 1.5; }
      100% { r: 35; opacity: 0; stroke-width: 0.5; }
    }
    @keyframes flowDash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes targetPulse {
      0% { r: 3; opacity: 1; }
      100% { r: 12; opacity: 0; stroke: #00ffcc; stroke-width: 1; }
    }
  </style>

  <!-- Slide Background Image -->
  <image href="/images/plano_smart_office_3d.png" x="0" y="0" width="914" height="434" />

  <!-- ════════ INTERACTIVE HOTSPOTS OVERLAY ════════ -->

  <!-- NODE 1: Regleta Lab (Row 1) -->
  <g class="hotspot">
    <!-- Overlay Line -->
    <line x1="288" y1="110" x2="288" y2="300" class="flow-line" />
    <circle cx="288" cy="300" r="5" class="target-dot" />
    <!-- Floating Circle Trigger -->
    <circle cx="288" cy="110" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="288" cy="110" r="14" class="hotspot-ring" />
    <circle cx="288" cy="110" r="14" class="hotspot-pulse" />
    <!-- Tooltip -->
    <g class="tooltip-card" transform="translate(288, 70)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Regleta Smart (Lab)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Corta corriente de computadoras</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">de noche para evitar consumo fantasma.</text>
    </g>
  </g>

  <!-- NODE 2: Sonoff R2 (Lab Row 2) -->
  <g class="hotspot">
    <line x1="317" y1="185" x2="317" y2="275" class="flow-line" />
    <circle cx="317" cy="275" r="5" class="target-dot" />
    <circle cx="317" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="317" cy="185" r="14" class="hotspot-ring" />
    <circle cx="317" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(317, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Computo)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controla encendido de luminarias</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">automático por presencia/inactividad.</text>
    </g>
  </g>

  <!-- NODE 3: Sonoff R2 (Kitchen) -->
  <g class="hotspot">
    <line x1="385" y1="185" x2="385" y2="305" class="flow-line" />
    <circle cx="385" cy="305" r="5" class="target-dot" />
    <circle cx="385" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="385" cy="185" r="14" class="hotspot-ring" />
    <circle cx="385" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(385, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Cocina)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control local y apagado automático</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">de iluminación en comedor de personal.</text>
    </g>
  </g>

  <!-- NODE 4: Sonoff POW Elite -->
  <g class="hotspot">
    <line x1="420" y1="110" x2="420" y2="230" class="flow-line" />
    <circle cx="420" cy="230" r="5" class="target-dot" />
    <circle cx="420" cy="110" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="420" cy="110" r="14" class="hotspot-ring" />
    <circle cx="420" cy="110" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(420, 70)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff POW Elite</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Medición de consumo general (20A)</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">monitorea consumo de kWh en vivo.</text>
    </g>
  </g>

  <!-- NODE 5: Enchufe Smart (Corridor) -->
  <g class="hotspot">
    <line x1="480" y1="195" x2="480" y2="280" class="flow-line" />
    <circle cx="480" cy="280" r="5" class="target-dot" />
    <circle cx="480" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="480" cy="195" r="14" class="hotspot-ring" />
    <circle cx="480" cy="195" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(480, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Enchufe Smart (Lobby)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control de climatizador auxiliar</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">y ventiladores en zona común.</text>
    </g>
  </g>

  <!-- NODE 6: Servidor Central (Raspberry Pi 4) -->
  <g class="hotspot">
    <line x1="550" y1="60" x2="550" y2="310" class="flow-line" style="stroke:#10b981;" />
    <circle cx="550" cy="310" r="5" class="target-dot" style="fill:#10b981;" />
    <circle cx="550" cy="60" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="550" cy="60" r="14" class="hotspot-ring" style="stroke:#10b981;" />
    <circle cx="550" cy="60" r="14" class="hotspot-pulse" style="stroke:#10b981;" />
    <g class="tooltip-card" transform="translate(550, 20)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" style="stroke:#10b981;" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">Servidor RPi 4 (HA)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Cerebro central del sistema IoT.</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">Corre Home Assistant y MQTT local.</text>
    </g>
  </g>

  <!-- NODE 7: Sonoff R2 (Restrooms) -->
  <g class="hotspot">
    <line x1="620" y1="185" x2="620" y2="310" class="flow-line" />
    <circle cx="620" cy="310" r="5" class="target-dot" />
    <circle cx="620" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="620" cy="185" r="14" class="hotspot-ring" />
    <circle cx="620" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(620, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Servicios)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Apagado automático de extractor</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">e iluminación en los servicios higiénicos.</text>
    </g>
  </g>

  <!-- NODE 8: Enchufe Smart (IT Office / Support) -->
  <g class="hotspot">
    <line x1="670" y1="195" x2="670" y2="290" class="flow-line" />
    <circle cx="670" cy="290" r="5" class="target-dot" />
    <circle cx="670" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="670" cy="195" r="14" class="hotspot-ring" />
    <circle cx="670" cy="195" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(670, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Enchufe Smart (Soporte)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control de tomacorrientes de soporte</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">e impresoras fuera de oficina.</text>
    </g>
  </g>

  <!-- NODE 9: Sonoff R2 (Meetings Screen) -->
  <g class="hotspot">
    <line x1="730" y1="140" x2="730" y2="320" class="flow-line" />
    <circle cx="730" cy="320" r="5" class="target-dot" />
    <circle cx="730" cy="140" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="730" cy="140" r="14" class="hotspot-ring" />
    <circle cx="730" cy="140" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(730, 100)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Multimedia)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Corta corriente de pantalla de TV</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">y reproductores en sala de juntas.</text>
    </g>
  </g>

  <!-- NODE 10: Regleta Wi-Fi (Meetings Table) -->
  <g class="hotspot">
    <line x1="790" y1="185" x2="790" y2="330" class="flow-line" />
    <circle cx="790" cy="330" r="5" class="target-dot" />
    <circle cx="790" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="790" cy="185" r="14" class="hotspot-ring" />
    <circle cx="790" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(790, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Regleta Smart (Reuniones)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Programa el corte de proyectores</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">y tomacorrientes de mesa principal.</text>
    </g>
  </g>

  <!-- NODE 11: Sonoff R2 (Warehouse Shelves) -->
  <g class="hotspot">
    <line x1="845" y1="130" x2="845" y2="290" class="flow-line" />
    <circle cx="845" cy="290" r="5" class="target-dot" />
    <circle cx="845" cy="130" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="845" cy="130" r="14" class="hotspot-ring" />
    <circle cx="845" cy="130" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(845, 90)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Almacén)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controla luminarias de pasillos</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">en estanterías de almacenamiento.</text>
    </g>
  </g>
</svg>
        </div>
`,
      en: `        <h4>Project Budget and Material Bill (SENATI)</h4>
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
              <td>Raspberry Pi 4 Model B Server (4GB) + Power & Case</td>
              <td>1</td>
              <td>S/. 495.00</td>
              <td>S/. 495.00</td>
            </tr>
            <tr>
              <td>SONOFF Basic R3 Smart Switch (Tasmota)</td>
              <td>6</td>
              <td>S/. 25.00</td>
              <td>S/. 150.00</td>
            </tr>
            <tr>
              <td>SONOFF POW Elite Energy Monitoring Switch (20A)</td>
              <td>1</td>
              <td>S/. 85.00</td>
              <td>S/. 85.00</td>
            </tr>
            <tr>
              <td>PIR Motion Sensor HC-SR501 (GPIO)</td>
              <td>3</td>
              <td>S/. 20.00</td>
              <td>S/. 60.00</td>
            </tr>
            <tr>
              <td>Plastic Conduits, Electrical Wiring and Accessories</td>
              <td>-</td>
              <td>S/. 120.00</td>
              <td>S/. 120.00</td>
            </tr>
            <tr>
              <td>Minor Tools, Fasteners and Fuses</td>
              <td>-</td>
              <td>S/. 80.00</td>
              <td>S/. 80.00</td>
            </tr>
            <tr>
              <td>High Efficiency LED Lighting Panels</td>
              <td>4</td>
              <td>S/. 95.00</td>
              <td>S/. 380.00</td>
            </tr>
            <tr>
              <td>Broadlink RM4 Mini IR Air Conditioning Control</td>
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
              <td>Materials and Equipment Subtotal</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,720.00</td>
            </tr>
            <tr>
              <td>Skilled Labor (IT Technician, Electrician, Supervisor)</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 1,030.00</td>
            </tr>
            <tr style="font-weight: bold; background: var(--bg3); color: var(--blue-light);">
              <td>GRAND TOTAL OF INVESTMENT</td>
              <td>-</td>
              <td>-</td>
              <td>S/. 2,870.00</td>
            </tr>
          </tbody>
        </table>
        
        <h4>Return on Investment (ROI) Analysis</h4>
        <ul>
          <li><strong>Initial Electric Consumption:</strong> 357 kWh monthly (Approximately equivalent to <strong>S/. 400.00</strong> per month).</li>
          <li><strong>Estimated Savings:</strong> Guaranteed reduction of <strong>S/. 120.00 monthly</strong> (30% savings by preventing waste).</li>
          <li><strong>Payback Period:</strong> ~24 months to fully amortize the initial hardware cost.</li>
        </ul>

        <h4 style="margin-top:2.5rem;">IoT Distribution and Connectivity Plan (Nanotechnology SAC)</h4>
        <p>Distribution of smart devices and their connectivity links to the main Router inside the office floor plan:</p>
        <div style="margin: 1rem 0 2rem 0;">
          <svg viewBox="0 0 914 434" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
  <defs>
    <!-- Glow filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <style>
    /* Hotspot Interactive Elements */
    .hotspot { cursor: pointer; }
    .hotspot-ring { fill: none; stroke: #3b82f6; stroke-width: 1.5; opacity: 0; transition: all 0.3s; }
    .hotspot-pulse { fill: none; stroke: #3b82f6; stroke-width: 1.5; opacity: 0; transform-origin: center; transition: all 0.3s; }
    .flow-line { fill: none; stroke: #00ffcc; stroke-width: 2; opacity: 0; stroke-linecap: round; stroke-dasharray: 6 4; transition: all 0.3s; }
    .target-dot { fill: #00ffcc; opacity: 0; transition: all 0.3s; filter: url(#neonGlow); }
    .tooltip-bg { fill: #0b1329; stroke: #00ffcc; stroke-width: 1.2; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); }
    .tooltip-card { opacity: 0; pointer-events: none; transition: all 0.3s; transform: translateY(5px); }

    /* Hover triggers */
    .hotspot:hover .hotspot-ring { opacity: 1; stroke: #00ffcc; filter: url(#neonGlow); }
    .hotspot:hover .hotspot-pulse { opacity: 1; stroke: #00ffcc; animation: pulseWave 1.2s infinite linear; }
    .hotspot:hover .flow-line { opacity: 1; animation: flowDash 1s infinite linear; }
    .hotspot:hover .target-dot { opacity: 1; animation: targetPulse 1.2s infinite ease-out; }
    .hotspot:hover .tooltip-card { opacity: 1; transform: translateY(0); }

    @keyframes pulseWave {
      0% { r: 14; opacity: 1; stroke-width: 1.5; }
      100% { r: 35; opacity: 0; stroke-width: 0.5; }
    }
    @keyframes flowDash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes targetPulse {
      0% { r: 3; opacity: 1; }
      100% { r: 12; opacity: 0; stroke: #00ffcc; stroke-width: 1; }
    }
  </style>

  <!-- Slide Background Image -->
  <image href="/images/plano_smart_office_3d.png" x="0" y="0" width="914" height="434" />

  <!-- ════════ INTERACTIVE HOTSPOTS OVERLAY ════════ -->

  <!-- NODE 1: Regleta Lab (Row 1) -->
  <g class="hotspot">
    <!-- Overlay Line -->
    <line x1="288" y1="110" x2="288" y2="300" class="flow-line" />
    <circle cx="288" cy="300" r="5" class="target-dot" />
    <!-- Floating Circle Trigger -->
    <circle cx="288" cy="110" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="288" cy="110" r="14" class="hotspot-ring" />
    <circle cx="288" cy="110" r="14" class="hotspot-pulse" />
    <!-- Tooltip -->
    <g class="tooltip-card" transform="translate(288, 70)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Power Strip</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Cuts power to computers</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">overnight to prevent standby waste.</text>
    </g>
  </g>

  <!-- NODE 2: Sonoff R2 (Lab Row 2) -->
  <g class="hotspot">
    <line x1="317" y1="185" x2="317" y2="275" class="flow-line" />
    <circle cx="317" cy="275" r="5" class="target-dot" />
    <circle cx="317" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="317" cy="185" r="14" class="hotspot-ring" />
    <circle cx="317" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(317, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Lab)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls light fixtures status</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">automatically based on occupancy.</text>
    </g>
  </g>

  <!-- NODE 3: Sonoff R2 (Kitchen) -->
  <g class="hotspot">
    <line x1="385" y1="185" x2="385" y2="305" class="flow-line" />
    <circle cx="385" cy="305" r="5" class="target-dot" />
    <circle cx="385" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="385" cy="185" r="14" class="hotspot-ring" />
    <circle cx="385" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(385, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Kitchen)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Local control and scheduled shutdown</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">of lights in employee cafeteria.</text>
    </g>
  </g>

  <!-- NODE 4: Sonoff POW Elite -->
  <g class="hotspot">
    <line x1="420" y1="110" x2="420" y2="230" class="flow-line" />
    <circle cx="420" cy="230" r="5" class="target-dot" />
    <circle cx="420" cy="110" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="420" cy="110" r="14" class="hotspot-ring" />
    <circle cx="420" cy="110" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(420, 70)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff POW Elite</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Main energy monitor (20A rating)</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">tracks live kWh usage dashboard.</text>
    </g>
  </g>

  <!-- NODE 5: Enchufe Smart (Corridor) -->
  <g class="hotspot">
    <line x1="480" y1="195" x2="480" y2="280" class="flow-line" />
    <circle cx="480" cy="280" r="5" class="target-dot" />
    <circle cx="480" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="480" cy="195" r="14" class="hotspot-ring" />
    <circle cx="480" cy="195" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(480, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Plug (Lobby)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls auxiliary air conditioning</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and fan units in common hallway.</text>
    </g>
  </g>

  <!-- NODE 6: Servidor Central (Raspberry Pi 4) -->
  <g class="hotspot">
    <line x1="550" y1="60" x2="550" y2="310" class="flow-line" style="stroke:#10b981;" />
    <circle cx="550" cy="310" r="5" class="target-dot" style="fill:#10b981;" />
    <circle cx="550" cy="60" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="550" cy="60" r="14" class="hotspot-ring" style="stroke:#10b981;" />
    <circle cx="550" cy="60" r="14" class="hotspot-pulse" style="stroke:#10b981;" />
    <g class="tooltip-card" transform="translate(550, 20)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" style="stroke:#10b981;" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">RPi 4 Server (HA)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Core brain of local IoT system.</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">Runs Home Assistant & MQTT Broker.</text>
    </g>
  </g>

  <!-- NODE 7: Sonoff R2 (Restrooms) -->
  <g class="hotspot">
    <line x1="620" y1="185" x2="620" y2="310" class="flow-line" />
    <circle cx="620" cy="310" r="5" class="target-dot" />
    <circle cx="620" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="620" cy="185" r="14" class="hotspot-ring" />
    <circle cx="620" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(620, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Restrooms)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Automatic shutdown of exhaust fans</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and light fixtures inside restrooms.</text>
    </g>
  </g>

  <!-- NODE 8: Enchufe Smart (IT Office / Support) -->
  <g class="hotspot">
    <line x1="670" y1="195" x2="670" y2="290" class="flow-line" />
    <circle cx="670" cy="290" r="5" class="target-dot" />
    <circle cx="670" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="670" cy="195" r="14" class="hotspot-ring" />
    <circle cx="670" cy="195" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(670, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Plug (Support)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls office charger sockets</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and printer devices overnight.</text>
    </g>
  </g>

  <!-- NODE 9: Sonoff R2 (Meetings Screen) -->
  <g class="hotspot">
    <line x1="730" y1="140" x2="730" y2="320" class="flow-line" />
    <circle cx="730" cy="320" r="5" class="target-dot" />
    <circle cx="730" cy="140" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="730" cy="140" r="14" class="hotspot-ring" />
    <circle cx="730" cy="140" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(730, 100)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Media)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Cuts standby power to TV screen</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and video board in meeting room.</text>
    </g>
  </g>

  <!-- NODE 10: Regleta Wi-Fi (Meetings Table) -->
  <g class="hotspot">
    <line x1="790" y1="185" x2="790" y2="330" class="flow-line" />
    <circle cx="790" cy="330" r="5" class="target-dot" />
    <circle cx="790" cy="185" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="790" cy="185" r="14" class="hotspot-ring" />
    <circle cx="790" cy="185" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(790, 145)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Strip (Meetings)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Schedules shutdown of projector</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and main conference desk outlets.</text>
    </g>
  </g>

  <!-- NODE 11: Sonoff R2 (Warehouse Shelves) -->
  <g class="hotspot">
    <line x1="845" y1="130" x2="845" y2="290" class="flow-line" />
    <circle cx="845" cy="290" r="5" class="target-dot" />
    <circle cx="845" cy="130" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="845" cy="130" r="14" class="hotspot-ring" />
    <circle cx="845" cy="130" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(845, 90)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Warehouse)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls lighting in aisle racks</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">inside the warehouse storage area.</text>
    </g>
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
