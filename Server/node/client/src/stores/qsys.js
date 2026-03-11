import { defineStore } from 'pinia'
import api from '../api'
import { useWebSocket } from '../composables/useWebSocket'

export const useQSysStore = defineStore('qsys', {
  state: () => ({
    components: [],
    subscriptions: [],
    stats: null,
    connected: false,
    loading: false
  }),
  
  getters: {
    componentByName: (state) => (name) => {
      return state.components.find(c => c.name === name)
    },
    
    controlValue: (state) => (componentName, controlName) => {
      const component = state.components.find(c => c.name === componentName)
      if (!component) return null
      const control = component.controls.find(c => c.name === controlName)
      return control?.value
    }
  },
  
  actions: {
    async fetchComponents() {
      this.loading = true
      try {
        const response = await api.get('/api/components')
        this.components = response.data.components
      } catch (error) {
        console.error('Failed to fetch components:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchSubscriptions() {
      try {
        const response = await api.get('/api/subscriptions')
        this.subscriptions = response.data.subscriptions
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error)
      }
    },
    
    async fetchStats() {
      try {
        const response = await api.get('/api/stats')
        this.stats = response.data
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    },
    
    async getControlHistory(componentName, controlName, limit = 50) {
      try {
        const response = await api.get(
          `/api/component/${encodeURIComponent(componentName)}/${encodeURIComponent(controlName)}/history`,
          { params: { limit } }
        )
        return response.data.history
      } catch (error) {
        console.error('Failed to fetch history:', error)
        return []
      }
    },
    
    updateComponentValue(componentName, controlName, value) {
      const component = this.components.find(c => c.name === componentName)
      if (!component) {
        this.components.push({
          name: componentName,
          controls: [{ name: controlName, value, timestamp: Date.now() }]
        })
        return
      }
      
      const control = component.controls.find(c => c.name === controlName)
      if (control) {
        control.value = value
        control.timestamp = Date.now()
      } else {
        component.controls.push({ name: controlName, value, timestamp: Date.now() })
      }
    },
    
    setConnected(status) {
      this.connected = status
    }
  }
})
