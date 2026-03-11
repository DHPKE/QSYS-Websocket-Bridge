<template>
  <div class="settings-view">
    <Navbar />
    
    <div class="container">
      <header class="page-header">
        <h1>⚙️ Settings</h1>
      </header>

      <div class="settings-grid">
        <div class="settings-section">
          <h2>User Information</h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Username:</span>
              <span class="info-value">{{ authStore.user?.username || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Role:</span>
              <span class="info-value role-badge" :class="authStore.user?.role">
                {{ authStore.user?.role || 'N/A' }}
              </span>
            </div>
          </div>
        </div>

        <div class="settings-section" v-if="authStore.isAdmin">
          <h2>Register New User</h2>
          <Vueform
            v-model="registerForm"
            :endpoint="false"
            @submit="handleRegister"
          >
            <TextElement
              name="username"
              label="Username"
              placeholder="Enter username"
              :rules="['required', 'min:3']"
            />

            <TextElement
              name="password"
              input-type="password"
              label="Password"
              placeholder="Enter password"
              :rules="['required', 'min:6']"
            />

            <SelectElement
              name="role"
              label="Role"
              :native="false"
              :items="['admin', 'operator', 'viewer']"
              default="viewer"
            />

            <div v-if="registerError" class="error-message">
              {{ registerError }}
            </div>

            <div v-if="registerSuccess" class="success-message">
              {{ registerSuccess }}
            </div>

            <ButtonElement
              name="submit"
              button-label="Create User"
              :loading="registerLoading"
              :submits="true"
            />
          </Vueform>
        </div>

        <div class="settings-section">
          <h2>Connection Status</h2>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">WebSocket:</span>
              <span class="status-indicator" :class="{ connected: qsysStore.connected }">
                {{ qsysStore.connected ? '✅ Connected' : '❌ Disconnected' }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Components Cached:</span>
              <span class="info-value">{{ qsysStore.components.length }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Active Subscriptions:</span>
              <span class="info-value">{{ qsysStore.subscriptions.length }}</span>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h2>Actions</h2>
          <div class="actions-card">
            <button @click="handleLogout" class="action-btn logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQSysStore } from '../stores/qsys'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const qsysStore = useQSysStore()

const registerForm = ref({
  username: '',
  password: '',
  role: 'viewer'
})

const registerLoading = ref(false)
const registerError = ref('')
const registerSuccess = ref('')

const handleRegister = async () => {
  registerLoading.value = true
  registerError.value = ''
  registerSuccess.value = ''
  
  const result = await authStore.register(
    registerForm.value.username,
    registerForm.value.password,
    registerForm.value.role
  )
  
  if (result.success) {
    registerSuccess.value = `User "${registerForm.value.username}" created successfully!`
    registerForm.value = { username: '', password: '', role: 'viewer' }
  } else {
    registerError.value = result.error
  }
  
  registerLoading.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.settings-view {
  min-height: 100vh;
  background: var(--bg-primary);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--text-primary);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.settings-section h2 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.info-card,
.actions-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

.role-badge.operator {
  background: rgba(245, 158, 11, 0.2);
  color: var(--warning);
}

.role-badge.viewer {
  background: rgba(59, 130, 246, 0.2);
  color: var(--primary);
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
}

.status-indicator.connected {
  color: var(--success);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.actions-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.action-btn.logout {
  background: var(--danger);
  color: white;
}

.action-btn.logout:hover {
  background: #dc2626;
}
</style>
