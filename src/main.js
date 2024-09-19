import './assets/main.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'flatpickr/dist/flatpickr.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
