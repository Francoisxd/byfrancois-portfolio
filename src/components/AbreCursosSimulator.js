
export const getAbreCursosSimulatorHTML = () => `
<div class="ctk-window">

  <!-- Top Bar: Title + Clock -->
  <div class="ctk-topbar">
    <div class="ctk-topbar-left">
      <span class="ctk-app-title">Abre-Cursos Pro</span>
      <span class="ctk-version-badge">v2.5.4</span>
      <span class="ctk-proxima-label" id="acNextClassBadge"></span>
    </div>
    <div class="ctk-clock-capsule" id="acClock">--:--:--</div>
  </div>

  <!-- Tab Navigation (horizontal, like CTkTabview) -->
  <div class="ctk-tabbar">
    <button class="ctk-tab-btn active" data-target="tab-horario">Horario</button>
    <button class="ctk-tab-btn" data-target="tab-launchpad">Launchpad</button>
    <button class="ctk-tab-btn" data-target="tab-tareas">Tareas</button>
    <button class="ctk-tab-btn" data-target="tab-historial">Historial</button>
    <button class="ctk-tab-btn" data-target="tab-ajustes">Ajustes</button>
  </div>

  <!-- Tab Content Area -->
  <div class="ctk-content">

    <!-- TAB: HORARIO -->
    <div class="ctk-tab-pane active" id="tab-horario">

      <!-- Form Panel -->
      <div class="ctk-form-panel">
        <form id="acForm">
          <div class="ctk-form-row-top">
            <div class="ctk-fg">
              <label class="ctk-lbl">Nombre del Curso</label>
              <input type="text" id="acInNombre" class="ctk-inp" placeholder="Ej: CÁLCULO 1" required>
            </div>
            <div class="ctk-fg">
              <label class="ctk-lbl">URL de la Clase</label>
              <input type="url" id="acInUrl" class="ctk-inp" placeholder="https://upn.class.com/..." required>
            </div>
          </div>
          <div class="ctk-form-row-bot">
            <div class="ctk-fg ctk-fg-sm">
              <label class="ctk-lbl">Hora</label>
              <select id="acInHora" class="ctk-sel">
                <option value="06">06</option><option value="07">07</option><option value="08">08</option>
                <option value="09">09</option><option value="10">10</option><option value="11">11</option>
                <option value="12">12</option><option value="13">13</option><option value="14">14</option>
                <option value="15">15</option><option value="16">16</option><option value="17">17</option>
                <option value="18">18</option><option value="19" selected>19</option><option value="20">20</option>
                <option value="21">21</option><option value="22">22</option>
              </select>
            </div>
            <div class="ctk-fg ctk-fg-sm">
              <label class="ctk-lbl">Min</label>
              <select id="acInMin" class="ctk-sel">
                <option value="00">00</option><option value="10">10</option><option value="20">20</option>
                <option value="30" selected>30</option><option value="40">40</option><option value="50">50</option>
              </select>
            </div>
            <div class="ctk-fg">
              <label class="ctk-lbl">Días de Clase</label>
              <div class="ctk-day-row">
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="1"><span>Lun</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="2"><span>Mar</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="3"><span>Mié</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="4"><span>Jue</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="5"><span>Vie</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="6"><span>Sáb</span></label>
                <label class="ctk-day"><input type="checkbox" class="ac-day-check" value="7"><span>Dom</span></label>
              </div>
            </div>
            <div class="ctk-fg ctk-fg-btn">
              <label class="ctk-lbl">&nbsp;</label>
              <button type="submit" class="ctk-add-btn">Agregar Curso</button>
            </div>
          </div>
        </form>
      </div>

      <!-- List Header -->
      <div class="ctk-list-header">
        <span>Cursos Programados</span>
        <div class="ctk-search-wrap">
          <span class="ctk-search-icon">🔍</span>
          <input type="text" class="ctk-search-inp" id="acSearch" placeholder="Buscar curso...">
        </div>
      </div>

      <!-- Scrollable course list -->
      <div class="ctk-scroll-area" id="acCardList"></div>

    </div>

    <!-- TAB: LAUNCHPAD -->
    <div class="ctk-tab-pane" id="tab-launchpad" style="display:none">
      <div class="ctk-empty-tab">
        <div class="ctk-empty-icon">🚀</div>
        <div class="ctk-empty-title">Launchpad</div>
        <div class="ctk-empty-sub">Fuerza la apertura de cualquier curso sin esperar su hora.</div>
      </div>
    </div>

    <!-- TAB: TAREAS -->
    <div class="ctk-tab-pane" id="tab-tareas" style="display:none">
      <div class="ctk-empty-tab">
        <div class="ctk-empty-icon">📝</div>
        <div class="ctk-empty-title">Tareas Pendientes</div>
        <div class="ctk-empty-sub">Integración con Canvas LMS — Próximamente.</div>
      </div>
    </div>

    <!-- TAB: HISTORIAL -->
    <div class="ctk-tab-pane" id="tab-historial" style="display:none">
      <div class="ctk-empty-tab">
        <div class="ctk-empty-icon">📊</div>
        <div class="ctk-empty-title">Historial de Sesiones</div>
        <div class="ctk-empty-sub">Registros de clases abiertas automaticamente.</div>
      </div>
    </div>

    <!-- TAB: AJUSTES -->
    <div class="ctk-tab-pane" id="tab-ajustes" style="display:none">
      <div class="ctk-empty-tab">
        <div class="ctk-empty-icon">⚙️</div>
        <div class="ctk-empty-title">Ajustes</div>
        <div class="ctk-empty-sub">Navegador, tolerancia de tiempo, notificaciones y temas.</div>
      </div>
    </div>

  </div>
</div>
`;
