<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/">🎚️ Q-SYS Bridge</router-link>
      </div>

      <div class="nav-links">
        <router-link to="/" class="nav-link">
          📊 Dashboard
        </router-link>
        <router-link to="/components" class="nav-link">
          🎛️ Components
        </router-link>
        <router-link to="/settings" class="nav-link">
          ⚙️ Settings
        </router-link>
      </div>

      <div class="nav-user">
        <div class="user-badge">
          👤 {{ authStore.user?.username }}
          <span class="user-role">{{ authStore.user?.role }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.navbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand a {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-link.router-link-active {
  color: var(--primary);
  background: rgba(59, 130, 246, 0.1);
}

.nav-user {
  display: flex;
  align-items: center;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.user-role {
  padding: 0.2rem 0.5rem;
  background: var(--bg-primary);
  border-radius: 0.25rem;
  font-size: 0.8rem;
  color: var(--primary);
  text-transform: uppercase;
  font-weight: 600;
}
</style>
