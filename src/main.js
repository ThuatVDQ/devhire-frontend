import './assets/main.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'flatpickr/dist/flatpickr.css'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right', // Thay đổi vị trí nếu cần
  timeOut: '5000',
  extendedTimeOut: '1000',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  toastClass: 'toastr-custom'
}

const app = createApp(App)

app.use(router)

app.mount('#app')
