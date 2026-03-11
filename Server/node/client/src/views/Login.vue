<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <h1>🎚️ Q-SYS Bridge</h1>
        <p>WebSocket Control Interface</p>
      </div>

      <Vueform
        v-model="formData"
        :endpoint="false"
        @submit="handleLogin"
        :messages="{ required: 'This field is required' }"
      >
        <TextElement
          name="username"
          label="Username"
          placeholder="Enter your username"
          :rules="['required']"
          autocomplete="username"
        />

        <TextElement
          name="password"
          input-type="password"
          label="Password"
          placeholder="Enter your password"
          :rules="['required']"
          autocomplete="current-password"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <ButtonElement
          name="submit"
          button-label="Login"
          :loading="loading"
          :submits="true"
        />
      </Vueform>

      <div class="login-footer">
        <p>Default credentials: <code>admin / admin</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(formData.value.username, formData.value.password)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.login-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 3rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.logo p {
  color: var(--text-secondary);
  font-size: 0.95rem;
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

.login-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.login-footer code {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  color: var(--primary);
}
</style>
