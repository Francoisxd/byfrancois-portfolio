
export const getAbreCursosSimulatorHTML = () => `
<div id="acSim">

  <!-- TOP BAR -->
  <div id="acTopBar">
    <span id="acTitle">Abre-Cursos Pro</span>
    <span id="acVerBadge">v2.5.4</span>
    <span id="acProxima"></span>
    <span id="acClock">--:--:--</span>
  </div>

  <!-- TAB NAV -->
  <div id="acTabNav">
    <button class="acTabBtn acActive" data-target="acTabHorario">Horario</button>
    <button class="acTabBtn" data-target="acTabLaunchpad">Launchpad</button>
    <button class="acTabBtn" data-target="acTabTareas">Tareas</button>
    <button class="acTabBtn" data-target="acTabHistorial">Historial</button>
    <button class="acTabBtn" data-target="acTabAjustes">Ajustes</button>
  </div>

  <!-- TAB: HORARIO -->
  <div id="acTabHorario" class="acTabPane">

    <!-- Form Panel -->
    <div class="acPanel">
      <form id="acForm">

        <div class="acFormField">
          <label class="acLabel">Nombre de Asignatura</label>
          <input type="text" id="acInNombre" class="acInput" placeholder="Ej: CÁLCULO 1" required>
        </div>

        <div class="acFormField">
          <label class="acLabel">Enlace de Clase (URL)</label>
          <input type="url" id="acInUrl" class="acInput" placeholder="https://upn.class.com/..." required>
        </div>

        <div class="acFormRow">
          <div class="acFormGroup">
            <label class="acLabel">Hora de Programación (24h)</label>
            <div class="acTimeRow">
              <select id="acInHora" class="acSelect">
                <option value="06">06</option><option value="07">07</option><option value="08">08</option>
                <option value="09">09</option><option value="10">10</option><option value="11">11</option>
                <option value="12">12</option><option value="13">13</option><option value="14">14</option>
                <option value="15">15</option><option value="16">16</option><option value="17">17</option>
                <option value="18">18</option><option value="19" selected>19</option><option value="20">20</option>
                <option value="21">21</option><option value="22">22</option>
              </select>
              <span class="acTimeSep">:</span>
              <select id="acInMin" class="acSelect">
                <option value="00">00</option><option value="10">10</option><option value="20">20</option>
                <option value="30" selected>30</option><option value="40">40</option><option value="50">50</option>
              </select>
            </div>
          </div>

          <div class="acFormGroup acFormGroupDays">
            <label class="acLabel">Días de Clase</label>
            <div class="acDaysRow">
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="1"> Lun</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="2"> Mar</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="3"> Mié</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="4"> Jue</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="5"> Vie</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="6"> Sáb</label>
              <label class="acDay"><input type="checkbox" class="ac-day-check" value="7"> Dom</label>
            </div>
          </div>

          <div class="acFormGroupBtn">
            <button type="submit" id="acBtnAdd">Agregar Curso</button>
          </div>
        </div>

      </form>
    </div>

    <!-- List Header -->
    <div id="acListHeader">
      <span>Cursos Programados</span>
      <span id="acListRight">Estado / Acciones</span>
    </div>

    <!-- Search -->
    <div id="acSearchWrap">
      <span>🔍</span>
      <input type="text" id="acSearch" placeholder="Buscar curso por nombre...">
    </div>

    <!-- Course Cards -->
    <div id="acCardList"></div>

  </div>

  <!-- TAB: LAUNCHPAD -->
  <div id="acTabLaunchpad" class="acTabPane acHidden">
    <div class="acEmptyTab"><div class="acEmptyIcon">🚀</div><div class="acEmptyTitle">Launchpad</div><p>Fuerza la apertura de cualquier curso sin esperar su hora programada.</p></div>
  </div>

  <!-- TAB: TAREAS -->
  <div id="acTabTareas" class="acTabPane acHidden">
    <div class="acEmptyTab"><div class="acEmptyIcon">📝</div><div class="acEmptyTitle">Tareas Pendientes</div><p>Integración con Canvas LMS — Próximamente.</p></div>
  </div>

  <!-- TAB: HISTORIAL -->
  <div id="acTabHistorial" class="acTabPane acHidden">
    <div class="acEmptyTab"><div class="acEmptyIcon">📊</div><div class="acEmptyTitle">Historial de Sesiones</div><p>Registros de clases abiertas automáticamente.</p></div>
  </div>

  <!-- TAB: AJUSTES -->
  <div id="acTabAjustes" class="acTabPane acHidden">
    <div class="acEmptyTab"><div class="acEmptyIcon">⚙️</div><div class="acEmptyTitle">Ajustes</div><p>Navegador, tolerancia de tiempo, notificaciones y temas de color.</p></div>
  </div>

</div>
`;
