export const modalData = {
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
          <svg viewBox="0 0 1024 444" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
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
      0% { r: 12; opacity: 1; stroke-width: 1.5; }
      100% { r: 30; opacity: 0; stroke-width: 0.5; }
    }
    @keyframes flowDash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes targetPulse {
      0% { r: 3; opacity: 1; }
      100% { r: 12; opacity: 0; stroke: #00ffcc; stroke-width: 1; }
    }
  </style>

  <!-- Slide Background Image (New Premium 3D Maquette) -->
  <image href="/images/plano_smart_office_3d.webp" x="0" y="0" width="1024" height="444" />

  <!-- ════════ INTERACTIVE HOTSPOTS OVERLAY ════════ -->

  <!-- NODE 1: Sonoff R2 (Lab Row 1) -->
  <g class="hotspot">
    <line x1="307" y1="215" x2="307" y2="340" class="flow-line" />
    <circle cx="307" cy="340" r="5" class="target-dot" />
    <circle cx="307" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="307" cy="215" r="12" class="hotspot-ring" />
    <circle cx="307" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(307, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Lab)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controla el encendido de luminarias</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">según detección de presencia.</text>
    </g>
  </g>

  <!-- NODE 2: Sonoff R2 (Executive Office) -->
  <g class="hotspot">
    <line x1="374" y1="215" x2="374" y2="300" class="flow-line" />
    <circle cx="374" cy="300" r="5" class="target-dot" />
    <circle cx="374" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="374" cy="215" r="12" class="hotspot-ring" />
    <circle cx="374" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(374, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Oficina)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Apagado automático de luces</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">al salir de la oficina ejecutiva.</text>
    </g>
  </g>

  <!-- NODE 3: Sonoff POW Elite -->
  <g class="hotspot">
    <line x1="458" y1="175" x2="458" y2="280" class="flow-line" />
    <circle cx="458" cy="280" r="5" class="target-dot" />
    <circle cx="458" cy="175" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="458" cy="175" r="14" class="hotspot-ring" />
    <circle cx="458" cy="175" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(458, 135)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff POW Elite</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Medidor de consumo general (20A)</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">monitorea consumo de kWh en vivo.</text>
    </g>
  </g>

  <!-- NODE 4: Sonoff R2 (Cocina) -->
  <g class="hotspot">
    <line x1="511" y1="215" x2="511" y2="310" class="flow-line" />
    <circle cx="511" cy="310" r="5" class="target-dot" />
    <circle cx="511" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="511" cy="215" r="12" class="hotspot-ring" />
    <circle cx="511" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(511, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Cocina)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control local y apagado automático</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">de iluminación en comedor de personal.</text>
    </g>
  </g>

  <!-- NODE 5: Enchufe Smart (Pasillo) -->
  <g class="hotspot">
    <line x1="593" y1="215" x2="593" y2="330" class="flow-line" />
    <circle cx="593" cy="330" r="5" class="target-dot" />
    <circle cx="593" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="593" cy="215" r="12" class="hotspot-ring" />
    <circle cx="593" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(593, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Enchufe Smart</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control de climatizador auxiliar</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">y ventiladores en el pasillo.</text>
    </g>
  </g>

  <!-- NODE 6: Sonoff R2 (Baños 1) -->
  <g class="hotspot">
    <line x1="655" y1="215" x2="655" y2="340" class="flow-line" />
    <circle cx="655" cy="340" r="5" class="target-dot" />
    <circle cx="655" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="655" cy="215" r="12" class="hotspot-ring" />
    <circle cx="655" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(655, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Baños 1)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Apagado automático de extractor</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">e iluminación en servicios higiénicos.</text>
    </g>
  </g>

  <!-- NODE 7: Sonoff R2 (Baños 2) -->
  <g class="hotspot">
    <line x1="717" y1="215" x2="717" y2="330" class="flow-line" />
    <circle cx="717" cy="330" r="5" class="target-dot" />
    <circle cx="717" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="717" cy="215" r="12" class="hotspot-ring" />
    <circle cx="717" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(717, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Baños 2)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Control de iluminación y energía</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">en servicios higiénicos secundarios.</text>
    </g>
  </g>

  <!-- NODE 8: Regleta Wi-Fi (Reuniones) -->
  <g class="hotspot">
    <line x1="784" y1="175" x2="784" y2="320" class="flow-line" />
    <circle cx="784" cy="320" r="5" class="target-dot" />
    <circle cx="784" cy="175" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="784" cy="175" r="14" class="hotspot-ring" />
    <circle cx="784" cy="175" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(784, 135)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Regleta Smart (Reuniones)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Programa el corte de proyectores</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">y tomacorrientes de la mesa principal.</text>
    </g>
  </g>

  <!-- NODE 9: Sonoff R2 (Almacén) -->
  <g class="hotspot">
    <line x1="848" y1="215" x2="848" y2="290" class="flow-line" />
    <circle cx="848" cy="290" r="5" class="target-dot" />
    <circle cx="848" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="848" cy="215" r="12" class="hotspot-ring" />
    <circle cx="848" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(848, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Almacén)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controla luminarias de pasillos</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">en estanterías de almacenamiento.</text>
    </g>
  </g>

  <!-- NODE 10: Router Principal -->
  <g class="hotspot">
    <circle cx="405" cy="210" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="405" cy="210" r="12" class="hotspot-ring" />
    <circle cx="405" cy="210" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(405, 170)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Router Principal</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Gestiona la red local y canaliza</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">comandos hacia los periféricos IoT.</text>
    </g>
  </g>

  <!-- NODE 11: Servidor RPi4 -->
  <g class="hotspot">
    <circle cx="554" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="554" cy="195" r="14" class="hotspot-ring" style="stroke:#10b981;" />
    <circle cx="554" cy="195" r="14" class="hotspot-pulse" style="stroke:#10b981;" />
    <g class="tooltip-card" transform="translate(554, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" style="stroke:#10b981;" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">Servidor RPi 4 (HA)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Cerebro central de Home Assistant,</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">ejecuta reglas y automatizaciones.</text>
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
          <svg viewBox="0 0 1024 444" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; border:1px solid var(--border); border-radius:12px; background:#060b18; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
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
      0% { r: 12; opacity: 1; stroke-width: 1.5; }
      100% { r: 30; opacity: 0; stroke-width: 0.5; }
    }
    @keyframes flowDash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes targetPulse {
      0% { r: 3; opacity: 1; }
      100% { r: 12; opacity: 0; stroke: #00ffcc; stroke-width: 1; }
    }
  </style>

  <!-- Slide Background Image (New Premium 3D Maquette) -->
  <image href="/images/plano_smart_office_3d.webp" x="0" y="0" width="1024" height="444" />

  <!-- ════════ INTERACTIVE HOTSPOTS OVERLAY ════════ -->

  <!-- NODE 1: Sonoff R2 (Lab Row 1) -->
  <g class="hotspot">
    <line x1="307" y1="215" x2="307" y2="340" class="flow-line" />
    <circle cx="307" cy="340" r="5" class="target-dot" />
    <circle cx="307" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="307" cy="215" r="12" class="hotspot-ring" />
    <circle cx="307" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(307, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Lab)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls lighting status</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">based on occupancy detection.</text>
    </g>
  </g>

  <!-- NODE 2: Sonoff R2 (Executive Office) -->
  <g class="hotspot">
    <line x1="374" y1="215" x2="374" y2="300" class="flow-line" />
    <circle cx="374" cy="300" r="5" class="target-dot" />
    <circle cx="374" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="374" cy="215" r="12" class="hotspot-ring" />
    <circle cx="374" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(374, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Exec Office)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Automatic lighting shutdown</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">upon leaving the executive office.</text>
    </g>
  </g>

  <!-- NODE 3: Sonoff POW Elite -->
  <g class="hotspot">
    <line x1="458" y1="175" x2="458" y2="280" class="flow-line" />
    <circle cx="458" cy="280" r="5" class="target-dot" />
    <circle cx="458" cy="175" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="458" cy="175" r="14" class="hotspot-ring" />
    <circle cx="458" cy="175" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(458, 135)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff POW Elite</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Main energy monitor (20A rating)</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">tracks live kWh usage dashboard.</text>
    </g>
  </g>

  <!-- NODE 4: Sonoff R2 (Kitchen) -->
  <g class="hotspot">
    <line x1="511" y1="215" x2="511" y2="310" class="flow-line" />
    <circle cx="511" cy="310" r="5" class="target-dot" />
    <circle cx="511" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="511" cy="215" r="12" class="hotspot-ring" />
    <circle cx="511" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(511, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Kitchen)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Local control and scheduled shutdown</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">of lights in employee cafeteria.</text>
    </g>
  </g>

  <!-- NODE 5: Smart Plug (Pasillo) -->
  <g class="hotspot">
    <line x1="593" y1="215" x2="593" y2="330" class="flow-line" />
    <circle cx="593" cy="330" r="5" class="target-dot" />
    <circle cx="593" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="593" cy="215" r="12" class="hotspot-ring" />
    <circle cx="593" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(593, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Plug</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls auxiliary A/C</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and ventilation in common hallway.</text>
    </g>
  </g>

  <!-- NODE 6: Sonoff R2 (Restrooms 1) -->
  <g class="hotspot">
    <line x1="655" y1="215" x2="655" y2="340" class="flow-line" />
    <circle cx="655" cy="340" r="5" class="target-dot" />
    <circle cx="655" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="655" cy="215" r="12" class="hotspot-ring" />
    <circle cx="655" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(655, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Restrooms 1)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Automatic shutdown of exhaust fans</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and light fixtures inside restrooms.</text>
    </g>
  </g>

  <!-- NODE 7: Sonoff R2 (Restrooms 2) -->
  <g class="hotspot">
    <line x1="717" y1="215" x2="717" y2="330" class="flow-line" />
    <circle cx="717" cy="330" r="5" class="target-dot" />
    <circle cx="717" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="717" cy="215" r="12" class="hotspot-ring" />
    <circle cx="717" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(717, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Restrooms 2)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls lighting and power status</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">inside secondary restroom block.</text>
    </g>
  </g>

  <!-- NODE 8: Regleta Wi-Fi (Reuniones) -->
  <g class="hotspot">
    <line x1="784" y1="175" x2="784" y2="320" class="flow-line" />
    <circle cx="784" cy="320" r="5" class="target-dot" />
    <circle cx="784" cy="175" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="784" cy="175" r="14" class="hotspot-ring" />
    <circle cx="784" cy="175" r="14" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(784, 135)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Smart Strip (Meetings)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Schedules shutdown of projectors</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and main conference desk outlets.</text>
    </g>
  </g>

  <!-- NODE 9: Sonoff R2 (Warehouse) -->
  <g class="hotspot">
    <line x1="848" y1="215" x2="848" y2="290" class="flow-line" />
    <circle cx="848" cy="290" r="5" class="target-dot" />
    <circle cx="848" cy="215" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="848" cy="215" r="12" class="hotspot-ring" />
    <circle cx="848" cy="215" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(848, 175)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Sonoff R2 (Warehouse)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Controls lighting in aisle racks</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">inside the warehouse storage area.</text>
    </g>
  </g>

  <!-- NODE 10: Main Router -->
  <g class="hotspot">
    <circle cx="405" cy="210" r="12" fill="rgba(0,255,204,0.01)" />
    <circle cx="405" cy="210" r="12" class="hotspot-ring" />
    <circle cx="405" cy="210" r="12" class="hotspot-pulse" />
    <g class="tooltip-card" transform="translate(405, 170)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#00ffcc" font-weight="bold" text-anchor="middle">Main Router</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Manages local network routing</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">and forwards smart IoT commands.</text>
    </g>
  </g>

  <!-- NODE 11: Servidor RPi4 -->
  <g class="hotspot">
    <circle cx="554" cy="195" r="14" fill="rgba(0,255,204,0.01)" />
    <circle cx="554" cy="195" r="14" class="hotspot-ring" style="stroke:#10b981;" />
    <circle cx="554" cy="195" r="14" class="hotspot-pulse" style="stroke:#10b981;" />
    <g class="tooltip-card" transform="translate(554, 155)">
      <rect x="-85" y="-55" width="170" height="45" rx="5" class="tooltip-bg" style="stroke:#10b981;" />
      <text x="0" y="-40" font-family="'Space Mono', monospace" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">RPi 4 Server (HA)</text>
      <text x="0" y="-28" font-family="'Outfit', sans-serif" font-size="8" fill="#e2e8f0" text-anchor="middle">Central brain of Home Assistant,</text>
      <text x="0" y="-18" font-family="'Outfit', sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">monitors status and runs automation rules.</text>
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