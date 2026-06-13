
export const getAbreCursosSimulatorHTML = () => `
<div class="ac-app v254-theme">
  <!-- Window Header -->
  <div class="ac-header">
    <div class="ac-header-title">
      Abre-Cursos Pro <span class="ac-badge">v2.5.4</span>
    </div>
    <div class="ac-header-right">
      <span class="ac-next-class" id="acNextClassBadge">Calculando próxima clase...</span>
    </div>
  </div>

  <!-- CTk Nav/Header Control Bar -->
  <div class="ac-app-bar">
    <div class="ac-tabs">
      <button class="ac-tab active" type="button" data-target="tab-horario">Horario</button>
      <button class="ac-tab" type="button" data-target="tab-launchpad">Launchpad</button>
      <button class="ac-tab" type="button" data-target="tab-tareas">Tareas</button>
      <button class="ac-tab" type="button" data-target="tab-historial">Historial</button>
      <button class="ac-tab" type="button" data-target="tab-ajustes">Ajustes</button>
    </div>
    <div class="ac-app-clock">Calculando...</div>
  </div>

  <!-- CTk Body Area -->
  <div class="ac-body">
    <!-- HORARIO TAB -->
    <div class="ac-tab-content active" id="tab-horario">
      <form id="acForm" class="ac-form-container">
        <div class="ac-field">
          <label>Nombre de Asignatura</label>
          <input type="text" id="acInNombre" class="ac-input-v2" placeholder="Ej: MATEMÁTICAS BÁSICAS" required>
        </div>
        
        <div class="ac-field">
          <label>Enlace de Clase (URL)</label>
          <input type="url" id="acInUrl" class="ac-input-v2" placeholder="https://zoom.us/j/..." required>
        </div>

        <div class="ac-form-row">
          <div class="ac-field-inline">
            <label>Hora de Programación (24h)</label>
            <div class="ac-time-flex">
              <select id="acInHora" class="ac-select-v2" style="appearance: none; -webkit-appearance: none; outline:none; border:none; color:white;">
                <option value="07">07 ▼</option><option value="08">08 ▼</option><option value="09">09 ▼</option>
                <option value="10">10 ▼</option><option value="11">11 ▼</option><option value="12">12 ▼</option>
                <option value="13">13 ▼</option><option value="14">14 ▼</option><option value="15">15 ▼</option>
                <option value="16">16 ▼</option><option value="17">17 ▼</option><option value="18">18 ▼</option>
                <option value="19" selected>19 ▼</option><option value="20">20 ▼</option><option value="21">21 ▼</option>
                <option value="22">22 ▼</option>
              </select>
              <span>:</span>
              <select id="acInMin" class="ac-select-v2" style="appearance: none; -webkit-appearance: none; outline:none; border:none; color:white;">
                <option value="00">00 ▼</option><option value="10">10 ▼</option><option value="20">20 ▼</option>
                <option value="30" selected>30 ▼</option><option value="40">40 ▼</option><option value="50">50 ▼</option>
              </select>
            </div>
          </div>

          <div class="ac-field-inline">
            <label>Días de Clase</label>
            <div class="ac-days-group">
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="1"> Lun</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="2"> Mar</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="3"> Mie</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="4"> Jue</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="5"> Vie</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="6"> Sab</label>
              <label class="ac-checkbox"><input type="checkbox" class="ac-day-check" value="7"> Dom</label>
            </div>
          </div>

          <div class="ac-btn-container">
            <button type="submit" class="ac-btn-green" id="acBtnAdd">Agregar Curso</button>
          </div>
        </div>
      </form>

      <!-- Course List Area -->
      <div class="ac-list-header">
        <span class="bold">Cursos Programados</span>
        <span class="bold">Estado / Acciones</span>
      </div>
      <div class="ac-search-bar">
        <span>🔍</span>
        <input type="text" class="ac-search-input" placeholder="Buscar curso por nombre...">
      </div>

      <!-- Course Cards Container (Dynamic) -->
      <div class="ac-cards-wrapper" id="acCardList">
        <!-- JS will inject courses here -->
      </div>
    </div>

    <!-- MOCK TABS -->
    <div class="ac-tab-content" id="tab-launchpad" style="display:none; text-align:center; padding: 40px;">
      <h3 style="color:#aaa">🚀 Launchpad</h3>
      <p style="color:#666; margin-top:10px;">En este panel se visualiza el inicio forzado de las clases.</p>
    </div>
    <div class="ac-tab-content" id="tab-tareas" style="display:none; text-align:center; padding: 40px;">
      <h3 style="color:#aaa">📝 Tareas Pendientes</h3>
      <p style="color:#666; margin-top:10px;">Integración con Canvas LMS (Próximamente)</p>
    </div>
    <div class="ac-tab-content" id="tab-historial" style="display:none; text-align:center; padding: 40px;">
      <h3 style="color:#aaa">📊 Historial de Conexiones</h3>
      <p style="color:#666; margin-top:10px;">No hay registros recientes.</p>
    </div>
    <div class="ac-tab-content" id="tab-ajustes" style="display:none; text-align:center; padding: 40px;">
      <h3 style="color:#aaa">⚙️ Ajustes del Sistema</h3>
      <p style="color:#666; margin-top:10px;">Opciones de navegador, notificaciones y tolerancia.</p>
    </div>

  </div>
</div>
`;
