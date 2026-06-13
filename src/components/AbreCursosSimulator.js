
export const getAbreCursosSimulatorHTML = () => `
<div class="ac-app v254-theme">
  <!-- Window Header -->
  <div class="ac-header">
    <div class="ac-header-title">
      Abre-Cursos Pro <span class="ac-badge">v2.5.4</span>
    </div>
    <div class="ac-header-right">
      <span class="ac-next-class">Próxima: PROGRAMACIÓN ORIENTADA A OBJETOS (en 2h 7m)</span>
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
    <div class="ac-app-clock">Viernes 19:02:24</div>
  </div>

  <!-- CTk Body Area -->
  <div class="ac-body">
    <!-- Form Area -->
    <div class="ac-tab-content active" id="tab-horario">
    <div class="ac-form-container">
      <div class="ac-field">
        <label>Nombre de Asignatura</label>
        <input type="text" class="ac-input-v2" placeholder="">
      </div>
      
      <div class="ac-field">
        <label>Enlace de Clase (URL)</label>
        <input type="text" class="ac-input-v2" placeholder="">
      </div>

      <div class="ac-form-row">
        <div class="ac-field-inline">
          <label>Hora de Programación (24h)</label>
          <div class="ac-time-flex">
            <div class="ac-select-v2">08 <span class="arr">▼</span></div>
            <span>:</span>
            <div class="ac-select-v2">00 <span class="arr">▼</span></div>
          </div>
        </div>

        <div class="ac-field-inline">
          <label>Días de Clase</label>
          <div class="ac-days-group">
            <label class="ac-checkbox"><input type="checkbox"> Lun</label>
            <label class="ac-checkbox"><input type="checkbox"> Mar</label>
            <label class="ac-checkbox"><input type="checkbox"> Mie</label>
            <label class="ac-checkbox"><input type="checkbox"> Jue</label>
            <label class="ac-checkbox"><input type="checkbox"> Vie</label>
            <label class="ac-checkbox"><input type="checkbox"> Sab</label>
            <label class="ac-checkbox"><input type="checkbox"> Dom</label>
          </div>
        </div>

        <div class="ac-btn-container">
          <button class="ac-btn-green" type="button">Agregar Curso</button>
        </div>
      </div>
    </div>

    <!-- Course List Area -->
    <div class="ac-list-header">
      <span class="bold">Cursos Programados</span>
      <span class="bold">Estado / Acciones</span>
    </div>
    <div class="ac-search-bar">
      <span>🔍</span>
      <input type="text" class="ac-search-input" placeholder="Buscar curso por nombre...">
    </div>

    <!-- Course Cards -->
    <div class="ac-cards-wrapper">
      
      <div class="ac-course-card">
        <div class="ac-course-info">
          <div class="ac-course-title">
            PROBABILIDAD Y ESTADÍSTICA <span class="ac-time-badge">19:30</span>
          </div>
          <div class="ac-course-meta">
            <span class="ac-meta-day">Lun</span>
            <span class="ac-meta-tag">Web</span>
            <span class="ac-meta-url">https://upn.class.com/class/********</span>
          </div>
        </div>
        <div class="ac-course-actions">
          <div class="ac-toggle on"></div>
          <button class="ac-btn-mini green">Abrir</button>
          <button class="ac-btn-mini orange">Editar</button>
          <button class="ac-btn-mini red">Borrar</button>
        </div>
      </div>

      <div class="ac-course-card">
        <div class="ac-course-info">
          <div class="ac-course-title">
            CÁLCULO 1 <span class="ac-time-badge">19:30</span>
          </div>
          <div class="ac-course-meta">
            <span class="ac-meta-day">Mar</span>
            <span class="ac-meta-tag">Web</span>
            <span class="ac-meta-url">https://upn.class.com/class/********</span>
          </div>
        </div>
        <div class="ac-course-actions">
          <div class="ac-toggle on"></div>
          <button class="ac-btn-mini green">Abrir</button>
          <button class="ac-btn-mini orange">Editar</button>
          <button class="ac-btn-mini red">Borrar</button>
        </div>
      </div>

      <div class="ac-course-card">
        <div class="ac-course-info">
          <div class="ac-course-title">
            PROGRAMACIÓN ORIENTADA A OBJETOS <span class="ac-time-badge">19:30</span>
          </div>
          <div class="ac-course-meta">
            <span class="ac-meta-day">Mie</span>
            <span class="ac-meta-tag">Web</span>
            <span class="ac-meta-url">https://upn.class.com/class/********</span>
          </div>
        </div>
        <div class="ac-course-actions">
          <div class="ac-toggle on"></div>
          <button class="ac-btn-mini green">Abrir</button>
          <button class="ac-btn-mini orange">Editar</button>
          <button class="ac-btn-mini red">Borrar</button>
        </div>
      </div>

    </div>
  </div>

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
