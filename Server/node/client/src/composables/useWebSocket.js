import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/auth'
import { useQSysStore } from '../stores/qsys'

export function useWebSocket() {
  const socket = ref(null)
  const connected = ref(false)
  const authStore = useAuthStore()
  const qsysStore = useQSysStore()
  
  const connect = () => {
    if (socket.value?.connected) return
    
    socket.value = io('http://localhost:3000', {
      auth: {
        token: authStore.token
      },
      transports: ['websocket', 'polling']
    })
    
    socket.value.on('connect', () => {
      console.log('✅ WebSocket connected')
      connected.value = true
      qsysStore.setConnected(true)
    })
    
    socket.value.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
      connected.value = false
      qsysStore.setConnected(false)
    })
    
    // Listen for Q-SYS control updates
    socket.value.on('qsys:control:update', (data) => {
      console.log('📊 Control update:', data)
      qsysStore.updateComponentValue(data.component, data.control, data.value)
    })
    
    socket.value.on('qsys:error', (error) => {
      console.error('❌ Q-SYS error:', error)
    })
    
    socket.value.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  }
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
      qsysStore.setConnected(false)
    }
  }
  
  const emit = (event, data) => {
    if (socket.value?.connected) {
      socket.value.emit(event, data)
    } else {
      console.warn('⚠️ Socket not connected')
    }
  }
  
  const subscribe = (component, controls) => {
    emit('qsys:subscribe', { component, controls })
  }
  
  const unsubscribe = (component, controls) => {
    emit('qsys:unsubscribe', { component, controls })
  }
  
  const setControl = (component, control, value) => {
    emit('qsys:control:set', { component, control, value })
  }
  
  onMounted(() => {
    if (authStore.isAuthenticated) {
      connect()
    }
  })
  
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    socket,
    connected,
    connect,
    disconnect,
    emit,
    subscribe,
    unsubscribe,
    setControl
  }
}
