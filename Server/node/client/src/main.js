import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Vueform from '@vueform/vueform'
import vueformConfig from './vueform.config'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vueform, vueformConfig)

app.mount('#app')
