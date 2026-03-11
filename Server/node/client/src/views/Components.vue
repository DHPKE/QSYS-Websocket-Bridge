<template>
  <div class="components-view">
    <Navbar />
    
    <div class="container">
      <header class="page-header">
        <h1>🎛️ Components</h1>
        <button @click="refresh" class="refresh-btn" :disabled="loading">
          <span v-if="!loading">🔄</span>
          <span v-else class="spinner">⏳</span>
          Refresh
        </button>
      </header>

      <div v-if="loading && !qsysStore.components.length" class="loading">
        Loading components...
      </div>

      <div v-else-if="!qsysStore.components.length" class="empty-state">
        <p>No components found. Make sure Q-SYS is connected.</p>
      </div>

      <div v-else class="components-grid">
        <div
          v-for="component in qsysStore.components"
          :key="component.name"
          class="component-card"
        >
          <div class="component-header">
            <h3>{{ component.name }}</h3>
          </div>

          <div class="controls-list">
            <div
              v-for="control in component.controls"
              :key="control.name"
              class="control-row"
            >
              <div class="control-info">
                <div class="control-name">{{ control.name }}</div>
                <div class="control-timestamp" v-if="control.timestamp">
                  {{ formatTimestamp(control.timestamp) }}
                </div>
              </div>
              
              <div class="control-value">
                <input
                  v-if="canEdit"
                  type="number"
                  :value="control.value"
                  @change="updateControl(component.name, control.name, $event.target.value)"
                  step="0.1"
                  class="value-input"
                />
                <span v-else class="value-display">
                  {{ formatValue(control.value) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQSysStore } from '../stores/qsys'
import { useAuthStore } from '../stores/auth'
import { useWebSocket } from '../composables/useWebSocket'
import Navbar from '../components/Navbar.vue'

const qsysStore = useQSysStore()
const authStore = useAuthStore()
const { setControl } = useWebSocket()

const loading = ref(false)

const canEdit = computed(() => authStore.isOperator)

const refresh = async () => {
  loading.value = true
  await qsysStore.fetchComponents()
  loading.value = false
}

const updateControl = (component, control, value) => {
  const numValue = parseFloat(value)
  if (!isNaN(numValue)) {
    setControl(component, control, numValue)
  }
}

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  return String(value)
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.components-view {
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

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.component-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.component-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-tertiary);
}

.component-header h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
}

.controls-list {
  padding: 1rem;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.control-row:last-child {
  border-bottom: none;
}

.control-info {
  flex: 1;
}

.control-name {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.control-timestamp {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.control-value {
  margin-left: 1rem;
}

.value-input {
  width: 100px;
  padding: 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.value-input:focus {
  outline: none;
  border-color: var(--primary);
}

.value-display {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}
</style>
