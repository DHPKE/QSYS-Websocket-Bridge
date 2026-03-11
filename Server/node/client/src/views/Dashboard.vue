<template>
  <div class="dashboard">
    <Navbar />
    
    <div class="container">
      <header class="page-header">
        <h1>📊 Dashboard</h1>
        <div class="status-badge" :class="{ connected: qsysStore.connected }">
          <span class="status-dot"></span>
          {{ qsysStore.connected ? 'Connected' : 'Disconnected' }}
        </div>
      </header>

      <div class="stats-grid" v-if="qsysStore.stats">
        <div class="stat-card">
          <div class="stat-icon">📤</div>
          <div class="stat-content">
            <div class="stat-value">{{ qsysStore.stats.messagesSent || 0 }}</div>
            <div class="stat-label">Messages Sent</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📥</div>
          <div class="stat-content">
            <div class="stat-value">{{ qsysStore.stats.messagesReceived || 0 }}</div>
            <div class="stat-label">Messages Received</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎛️</div>
          <div class="stat-content">
            <div class="stat-value">{{ qsysStore.stats.components || 0 }}</div>
            <div class="stat-label">Components</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📡</div>
          <div class="stat-content">
            <div class="stat-value">{{ qsysStore.stats.subscriptions || 0 }}</div>
            <div class="stat-label">Subscriptions</div>
          </div>
        </div>
      </div>

      <div class="recent-components" v-if="qsysStore.components.length">
        <h2>Recent Components</h2>
        <div class="component-list">
          <div
            v-for="component in qsysStore.components.slice(0, 10)"
            :key="component.name"
            class="component-item"
          >
            <div class="component-name">{{ component.name }}</div>
            <div class="component-controls">
              <span
                v-for="control in component.controls.slice(0, 3)"
                :key="control.name"
                class="control-badge"
              >
                {{ control.name }}: {{ formatValue(control.value) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>🎚️ No components yet. Connect to Q-SYS to see data.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQSysStore } from '../stores/qsys'
import { useWebSocket } from '../composables/useWebSocket'
import Navbar from '../components/Navbar.vue'

const qsysStore = useQSysStore()
const { connect } = useWebSocket()

onMounted(async () => {
  connect()
  await qsysStore.fetchComponents()
  await qsysStore.fetchStats()
  
  // Refresh stats every 5 seconds
  setInterval(() => {
    qsysStore.fetchStats()
  }, 5000)
})

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  return String(value)
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--bg-primary);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--text-primary);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.status-badge.connected {
  border-color: var(--success);
  color: var(--success);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.status-badge.connected .status-dot {
  background: var(--success);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.recent-components h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.component-list {
  display: grid;
  gap: 1rem;
}

.component-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.component-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.component-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.control-badge {
  background: var(--bg-tertiary);
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}
</style>
