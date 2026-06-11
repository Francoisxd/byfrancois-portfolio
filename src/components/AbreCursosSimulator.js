export const getAbreCursosSimulatorHTML = () => `
<!-- Dynamic CustomTkinter Simulator Wrapper -->
        <div class="ac-app">
          <!-- Window Header Bar -->
          <div class="ac-header">
            <div class="ac-header-title">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="#1a6aff" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 1a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14V2.5A1.5 1.5 0 0 1 4.5 1h7zM4.5 2a.5.5 0 0 0-.5.5v11.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5h-7z"/>
              </svg>
              Abre-Cursos Pro <span>v2.1.9</span>
            </div>
            <div class="ac-win-controls">
              <span class="ac-win-btn min"></span>
              <span class="ac-win-btn max"></span>
              <span class="ac-win-btn close"></span>
            </div>
          </div>

          <!-- CTk Nav/Header Control Bar -->
          <div class="ac-app-bar">
            <div class="ac-tabs">
              <button class="ac-tab active" type="button" data-tab="horario" data-i18n="nav_projects">Horario</button>
              <button class="ac-tab" type="button" data-tab="historial" data-i18n="sim_metrics">Historial</button>
              <button class="ac-tab" type="button" data-tab="ajustes" data-i18n="nav_about">Ajustes</button>
            </div>
            <div class="ac-app-clock" id="acClockDisplay">Lunes 19:20</div>
          </div>

          <!-- CTk Body Area -->
          <div class="ac-body">
            <!-- Vacation Banner -->
            <div class="ac-vacation-banner" id="acVacationBanner">
              <span aria-hidden="true">🏖️</span> MODO VACACIONES ACTIVO - Los cursos automáticos están pausados temporalmente.
            </div>

            <!-- Tab 1: Horario (Form + Courses cards) -->
            <div class="ac-tab-pane active" id="acTab-horario">
              <!-- Inline Add Form -->
              <form id="acFormCourse" class="ac-form-grid">
                <div class="ac-field" class="project-card reveal full-width-card">
                  <label for="acInNombre">Nombre de Asignatura</label>
                  <input type="text" id="acInNombre" class="ac-input" placeholder="Ej: Cálculo 2" required>
                </div>
                
                <div class="ac-field" class="project-card reveal full-width-card">
                  <label for="acInUrl">Enlace de Clase (URL)</label>
                  <input type="url" id="acInUrl" class="ac-input" placeholder="https://zoom.us/j/... o link de Teams" required>
                </div>

                <div class="ac-field">
                  <label>Hora de Programación (24h)</label>
                  <div class="ac-time-flex">
                    <select id="acInHora" class="ac-select" style="width: 70px;">
                      <option value="07">07</option><option value="08">08</option><option value="09">09</option>
                      <option value="10">10</option><option value="11">11</option><option value="12">12</option>
                      <option value="13">13</option><option value="14">14</option><option value="15">15</option>
                      <option value="16">16</option><option value="17">17</option><option value="18">18</option>
                      <option value="19" selected>19</option><option value="20">20</option><option value="21">21</option>
                      <option value="22">22</option>
                    </select>
                    <span style="color:#fff">:</span>
                    <select id="acInMin" class="ac-select" style="width: 70px;">
                      <option value="00">00</option><option value="10">10</option><option value="20">20</option>
                      <option value="30" selected>30</option><option value="40">40</option><option value="50">50</option>
                    </select>
                  </div>
                </div>

                <div class="ac-field">
                  <label>Días de Clase</label>
                  <div class="ac-days-checkboxes">
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="1"> Lun</label>
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="2"> Mar</label>
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="3"> Mie</label>
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="4"> Jue</label>
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="5"> Vie</label>
                    <label class="ac-checkbox-label"><input type="checkbox" class="ac-day-check" value="6"> Sab</label>
                  </div>
                </div>

                <div style="grid-column: 1 / -1; text-align: right; margin-top: 5px;">
                  <button type="submit" class="ctk-btn green" id="acBtnAdd">Agregar Curso</button>
                </div>
              </form>

              <!-- Course cards container -->
              <div class="ac-list-header">
                <span>Cursos Programados</span>
                <span>Estado / Acciones</span>
              </div>
              <div class="ac-card-list" id="acCardList">
                <!-- Javascript will inject here -->
              </div>
            </div>

            <!-- Tab 2: Historial (Stats cards + Logs terminal) -->
            <div class="ac-tab-pane" id="acTab-historial">
              <div class="ac-stats-row">
                <div class="ac-stat-box green">
                  <span class="ac-stat-title">Asistencias</span>
                  <div class="ac-stat-value" id="acStatAsis">0</div>
                </div>
                <div class="ac-stat-box blue">
                  <span class="ac-stat-title">Retrasos</span>
                  <div class="ac-stat-value" id="acStatRetr">0</div>
                </div>
                <div class="ac-stat-box orange">
                  <span class="ac-stat-title">Omitidos</span>
                  <div class="ac-stat-value" id="acStatOmit">0</div>
                </div>
              </div>
`;
