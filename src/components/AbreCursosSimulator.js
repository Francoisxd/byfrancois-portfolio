
export const getAbreCursosSimulatorHTML = () => `
<div class="ctk-window">

  <!-- Title Bar -->
  <div class="ctk-titlebar">
    <div class="ctk-titlebar-dots">
      <span class="ctk-dot red"></span>
      <span class="ctk-dot yellow"></span>
      <span class="ctk-dot green"></span>
    </div>
    <div class="ctk-titlebar-title">Abre-Cursos Pro v2.5.4</div>
    <div class="ctk-titlebar-next" id="acNextClassBadge">⏰ Calculando próxima clase...</div>
  </div>

  <!-- Sidebar + Main -->
  <div class="ctk-layout">

    <!-- Sidebar Nav -->
    <nav class="ctk-sidebar">
      <button class="ctk-nav-btn active" data-target="tab-horario">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Horario
      </button>
      <button class="ctk-nav-btn" data-target="tab-launchpad">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Launchpad
      </button>
      <button class="ctk-nav-btn" data-target="tab-historial">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Historial
      </button>
      <button class="ctk-nav-btn" data-target="tab-ajustes">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Ajustes
      </button>

      <div class="ctk-sidebar-clock" id="acClock">--:--:--</div>
    </nav>

    <!-- Main Content -->
    <main class="ctk-main">

      <!-- TAB: HORARIO -->
      <div class="ctk-tab active" id="tab-horario">

        <!-- Add Course Form -->
        <div class="ctk-panel">
          <div class="ctk-panel-title">➕ Agregar Nuevo Curso</div>
          <form id="acForm" class="ctk-form">
            <div class="ctk-form-row">
              <div class="ctk-form-group">
                <label class="ctk-label">Nombre de la Asignatura</label>
                <input type="text" id="acInNombre" class="ctk-input" placeholder="Ej: CÁLCULO 1" required>
              </div>
              <div class="ctk-form-group">
                <label class="ctk-label">URL de la Clase</label>
                <input type="url" id="acInUrl" class="ctk-input" placeholder="https://zoom.us/j/..." required>
              </div>
            </div>
            <div class="ctk-form-row">
              <div class="ctk-form-group ctk-form-group-sm">
                <label class="ctk-label">Hora</label>
                <select id="acInHora" class="ctk-select">
                  <option value="06">06:00</option><option value="07">07:00</option><option value="08">08:00</option>
                  <option value="09">09:00</option><option value="10">10:00</option><option value="11">11:00</option>
                  <option value="12">12:00</option><option value="13">13:00</option><option value="14">14:00</option>
                  <option value="15">15:00</option><option value="16">16:00</option><option value="17">17:00</option>
                  <option value="18">18:00</option><option value="19" selected>19:00</option><option value="20">20:00</option>
                  <option value="21">21:00</option><option value="22">22:00</option>
                </select>
              </div>
              <div class="ctk-form-group ctk-form-group-sm">
                <label class="ctk-label">Minuto</label>
                <select id="acInMin" class="ctk-select">
                  <option value="00">:00</option><option value="10">:10</option><option value="20">:20</option>
                  <option value="30" selected>:30</option><option value="40">:40</option><option value="50">:50</option>
                </select>
              </div>
              <div class="ctk-form-group">
                <label class="ctk-label">Días</label>
                <div class="ctk-days">
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="1"> Lun</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="2"> Mar</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="3"> Mie</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="4"> Jue</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="5"> Vie</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="6"> Sab</label>
                  <label class="ctk-day-label"><input type="checkbox" class="ac-day-check" value="7"> Dom</label>
                </div>
              </div>
              <div class="ctk-form-group ctk-form-group-btn">
                <label class="ctk-label">&nbsp;</label>
                <button type="submit" class="ctk-btn-add">Agregar Curso</button>
              </div>
            </div>
          </form>
        </div>

        <!-- Course List -->
        <div class="ctk-panel">
          <div class="ctk-panel-title-row">
            <span class="ctk-panel-title">📋 Cursos Programados</span>
            <input type="text" class="ctk-search" id="acSearch" placeholder="🔍 Buscar...">
          </div>
          <div id="acCardList" class="ctk-course-list"></div>
        </div>

      </div>

      <!-- TAB: LAUNCHPAD -->
      <div class="ctk-tab" id="tab-launchpad" style="display:none">
        <div class="ctk-panel ctk-center-panel">
          <div style="font-size:3rem">🚀</div>
          <h3 style="color:#ddd; margin:12px 0 8px">Launchpad</h3>
          <p style="color:#666">Desde aquí puedes forzar la apertura de cualquier clase manualmente, sin esperar la hora programada.</p>
        </div>
      </div>

      <!-- TAB: HISTORIAL -->
      <div class="ctk-tab" id="tab-historial" style="display:none">
        <div class="ctk-panel ctk-center-panel">
          <div style="font-size:3rem">📊</div>
          <h3 style="color:#ddd; margin:12px 0 8px">Historial de Sesiones</h3>
          <p style="color:#666">No hay conexiones registradas en esta sesión simulada.</p>
        </div>
      </div>

      <!-- TAB: AJUSTES -->
      <div class="ctk-tab" id="tab-ajustes" style="display:none">
        <div class="ctk-panel ctk-center-panel">
          <div style="font-size:3rem">⚙️</div>
          <h3 style="color:#ddd; margin:12px 0 8px">Ajustes</h3>
          <p style="color:#666">Navegador predeterminado, tolerancia en segundos y configuración de notificaciones.</p>
        </div>
      </div>

    </main>
  </div>
</div>
`;
