<template>
  <div class="terminal-card portfolio-card accent-border-cyan">
    <!-- Terminal Titlebar -->
    <div class="terminal-header">
      <div class="window-controls">
        <span class="control dot-red" @click="handleAction('clear')"></span>
        <span class="control dot-yellow" @click="handleAction('sysinfo')"></span>
        <span class="control dot-green" @click="handleAction('run')"></span>
      </div>
      <span class="terminal-title mono">ms@homelab-hypervisor:~/terminal</span>
      <span class="status-pill mono blinking">SYNCING</span>
    </div>

    <!-- Terminal Screen Body -->
    <div class="terminal-screen" ref="screenRef">
      <div class="system-welcome mono">
        Welcome to Marcin's Homelab hypervisor terminal v2.6.4.
        Type "help" or click action buttons to explore status logs.
      </div>
      
      <!-- List of active console logs -->
      <div v-for="(log, idx) in logs" :key="idx" :class="['log-line', 'log-' + log.type, 'mono']">
        <span class="log-time" v-if="log.time">[{{ log.time }}]</span>
        <span class="log-prefix" v-if="log.prefix">{{ log.prefix }}</span>
        <span class="log-text">{{ log.text }}</span>
      </div>

      <!-- Realtime Interactive Diagnostic Progress Bar -->
      <div v-if="diagnosticProgress !== null" class="diagnostic-progress-block mono">
        <div class="progress-bar-row">
          <span>RUNNING DIAGNOSTICS:</span>
          <span>{{ diagnosticProgress }}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: diagnosticProgress + '%' }"></div>
        </div>
      </div>

      <!-- Command prompt caret cursor -->
      <div class="prompt-line mono">
        <span class="prompt-symbol">ms@homelab:~$</span>
        <span class="prompt-text">{{ typedCommand }}</span>
        <span class="prompt-cursor"></span>
      </div>
    </div>

    <!-- Terminal Action buttons (Micro-interactions) -->
    <div class="terminal-actions">
      <button class="terminal-btn btn-cyan mono" @click="runDiagnostics" :disabled="isRunning">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        DIAGNOSE
      </button>
      <button class="terminal-btn btn-purple mono" @click="spawnAgent" :disabled="isRunning">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.525-4.475 10-10 10S2 17.525 2 12A10 10 0 0 1 12 2z"></path><path d="M12 6v12M6 12h12"></path></svg>
        SPAWN AI
      </button>
      <button class="terminal-btn btn-secondary mono" @click="clearLogs" :disabled="isRunning">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        RESET
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const screenRef = ref(null);
const logs = ref([]);
const typedCommand = ref('');
const diagnosticProgress = ref(null);
const isRunning = ref(false);

const initialLogTemplates = [
  { type: 'info', prefix: 'INFO: ', text: 'Initializing TrueNAS Scale ZFS storage pool...' },
  { type: 'success', prefix: 'SUCCESS: ', text: 'Pool "tank" imported (Health: ONLINE, Size: 12 TB)' },
  { type: 'info', prefix: 'INFO: ', text: 'Starting docker daemon & tailscale mesh tunnel...' },
  { type: 'success', prefix: 'SUCCESS: ', text: 'VPN router connected. Node IP assigned: 100.94.12.82' },
  { type: 'warning', prefix: 'WARN: ', text: 'Datadog agent reporting high rate of connections on SaaS ingress' },
  { type: 'info', prefix: 'INFO: ', text: 'Invoking Hangfire scheduler pipeline (#7912)...' },
  { type: 'success', prefix: 'SUCCESS: ', text: 'All 8 back-end microservices operational (C# / .NET 10)' }
];

let logIntervalId = null;

function padZero(num) {
  return String(num).padStart(2, '0');
}

function getTimestamp() {
  const now = new Date();
  return `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
}

function scrollToBottom() {
  nextTick(() => {
    if (screenRef.value) {
      screenRef.value.scrollTop = screenRef.value.scrollHeight;
    }
  });
}

function addLog(type, text, prefix = '') {
  logs.value.push({
    time: getTimestamp(),
    type,
    prefix,
    text
  });
  // Keep logs list clean
  if (logs.value.length > 50) {
    logs.value.shift();
  }
  scrollToBottom();
}

// Background idle task simulation
function startBackgroundTicker() {
  logIntervalId = setInterval(() => {
    if (isRunning.value) return;
    
    const randomLogs = [
      { type: 'info', text: 'Trace: Heartbeat check success for APM instrumentation.' },
      { type: 'info', text: 'Hangfire: Garbage collection job clean-up complete.' },
      { type: 'success', text: 'ZFS: scrub status ok on pool tank (0 errors).' },
      { type: 'warning', text: 'Docker: Container tinder-copilot restarted due to memory threshold.' },
      { type: 'info', text: 'Network: Incoming wireguard connection handshook successfully.' }
    ];
    
    const chosen = randomLogs[Math.floor(Math.random() * randomLogs.length)];
    addLog(chosen.type, chosen.text, chosen.type.toUpperCase() + ': ');
  }, 7000);
}

// Button actions
function runDiagnostics() {
  if (isRunning.value) return;
  isRunning.value = true;
  typedCommand.value = 'run --diagnostics';
  
  setTimeout(() => {
    addLog('command', 'Running cluster diagnostic suite...', 'guest@client:~$ ');
    typedCommand.value = '';
    diagnosticProgress.value = 0;
    
    const interval = setInterval(() => {
      diagnosticProgress.value += 10;
      if (diagnosticProgress.value >= 100) {
        clearInterval(interval);
        diagnosticProgress.value = null;
        
        // Print results
        addLog('success', 'DIAGNOSTICS RESOLVED WITH 0 ERROR FLAGS', 'SYSTEM: ');
        addLog('info', 'Hardware: Ryzen 9 5900X | RAM Usage: 24.5 GB / 64 GB', 'SYSINFO: ');
        addLog('info', 'Temperatures: CPU Core 38.2°C, SSD Nvme 31.0°C', 'SYSINFO: ');
        addLog('info', 'Docker containers active: 14/14 healthy', 'DOCKER: ');
        addLog('success', 'All API routes responded in < 18ms latency', 'NETWORK: ');
        isRunning.value = false;
      }
      scrollToBottom();
    }, 250);
  }, 800);
}

function spawnAgent() {
  if (isRunning.value) return;
  isRunning.value = true;
  typedCommand.value = 'spawn-agent --model google-antigravity';
  
  setTimeout(() => {
    addLog('command', 'Spawning Google Antigravity autonomous subagent...', 'system@core:~$ ');
    typedCommand.value = '';
    
    setTimeout(() => {
      addLog('info', 'Subagent conversation context initialised: ef08737e', 'ANTIGRAVITY: ');
      scrollToBottom();
      
      setTimeout(() => {
        addLog('info', 'Analyzing target directory desktop/portfolio...', 'ANTIGRAVITY: ');
        scrollToBottom();
        
        setTimeout(() => {
          addLog('success', 'Antigravity subagent successfully updated style sheets & cards.', 'ANTIGRAVITY: ');
          addLog('success', 'Task target accomplished. Subagent terminated.', 'ANTIGRAVITY: ');
          isRunning.value = false;
          scrollToBottom();
        }, 1200);
      }, 1000);
    }, 800);
  }, 800);
}

function clearLogs() {
  if (isRunning.value) return;
  typedCommand.value = 'clear';
  setTimeout(() => {
    logs.value = [];
    typedCommand.value = '';
    addLog('success', 'Terminal output buffer successfully flushed.');
  }, 400);
}

// Window control click mockings
function handleAction(action) {
  if (action === 'clear') {
    clearLogs();
  } else if (action === 'sysinfo') {
    addLog('info', 'OS: Ubuntu 24.04 LTS (x86_64) | Kernel: Linux 6.8.0-31-generic', 'HOST: ');
  } else if (action === 'run') {
    runDiagnostics();
  }
}

onMounted(() => {
  // Push initial records with short delays
  initialLogTemplates.forEach((logItem, index) => {
    setTimeout(() => {
      logs.value.push({
        time: getTimestamp(),
        ...logItem
      });
      scrollToBottom();
    }, index * 200);
  });
  
  setTimeout(startBackgroundTicker, 2000);
});

onUnmounted(() => {
  if (logIntervalId) {
    clearInterval(logIntervalId);
  }
});
</script>

<style scoped>
.terminal-card {
  height: 380px;
  background: rgba(8, 10, 16, 0.6) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--squircle-radius);
  padding: 0 !important; /* Standardized interior padding for terminal margins */
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.terminal-header {
  height: 42px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  flex-shrink: 0;
  user-select: none;
}

.window-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.control:hover {
  transform: scale(1.15);
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.terminal-title {
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.03em;
}

.status-pill {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--accent-cyan);
  background: rgba(0, 242, 254, 0.12);
  border: 1px solid rgba(0, 242, 254, 0.35);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.15);
}

.blinking {
  animation: terminalBlink 1.8s infinite ease-in-out;
}

.terminal-screen {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.terminal-screen::-webkit-scrollbar {
  width: 6px;
}

.terminal-screen::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
}

.mono {
  font-family: var(--font-mono);
}

.system-welcome {
  color: var(--text-dim);
  font-size: 0.78rem;
  line-height: 1.45;
  border-left: 2px solid var(--accent-cyan);
  padding-left: 0.75rem;
  margin-bottom: 0.75rem;
}

.log-line {
  font-size: 0.78rem;
  line-height: 1.4;
  word-break: break-all;
  text-align: left;
}

.log-time {
  color: var(--text-dim);
  margin-right: 0.5rem;
}

.log-prefix {
  font-weight: 700;
  margin-right: 0.25rem;
}

.log-info { color: #ffffff; }
.log-success { color: #39ff14; }
.log-success .log-prefix { color: #39ff14; }
.log-warning { color: #ff9f0a; }
.log-warning .log-prefix { color: #ff9f0a; }
.log-command { color: #00f2fe; }

.prompt-line {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
  margin-top: 0.25rem;
}

.prompt-symbol {
  color: #bf5af2;
  font-weight: 700;
  margin-right: 0.5rem;
}

.prompt-text {
  color: #ffffff;
}

.prompt-cursor {
  width: 6px;
  height: 14px;
  background: #ffffff;
  display: inline-block;
  margin-left: 3px;
  animation: caretBlink 1.1s infinite step-end;
}

/* Diagnostic Progress Bar Styles */
.diagnostic-progress-block {
  font-size: 0.75rem;
  color: var(--accent-cyan);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.4rem 0;
  text-align: left;
}

.progress-bar-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f2fe, #bf5af2);
  border-radius: 4px;
  box-shadow: 0 0 8px #00f2fe;
  transition: width 0.15s ease-out;
}

/* Actions footer */
.terminal-actions {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.terminal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: var(--transition-liquid);
}

.terminal-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1.5px);
}

.terminal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cyan {
  border-color: rgba(0, 242, 254, 0.35);
  color: #00f2fe;
}
.btn-cyan:hover:not(:disabled) {
  background: rgba(0, 242, 254, 0.1) !important;
  border-color: rgba(0, 242, 254, 0.7) !important;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.25);
}

.btn-purple {
  border-color: rgba(191, 90, 242, 0.35);
  color: #bf5af2;
}
.btn-purple:hover:not(:disabled) {
  background: rgba(191, 90, 242, 0.1) !important;
  border-color: rgba(191, 90, 242, 0.7) !important;
  box-shadow: 0 0 15px rgba(191, 90, 242, 0.25);
}

@keyframes terminalBlink {
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
}

@keyframes caretBlink {
  from, to { background-color: transparent }
  50% { background-color: #ffffff }
}

@media (max-width: 900px) {
  .terminal-card {
    height: 340px;
  }
}

@media (max-width: 480px) {
  .terminal-card {
    height: 300px;
  }
  .terminal-btn {
    padding: 0.4rem 0.65rem;
    font-size: 0.65rem;
    gap: 0.35rem;
  }
  .terminal-btn svg {
    width: 12px;
    height: 12px;
  }
}
</style>
