import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'




const app = createApp(App)

app.use(router) // ← aktywuj router
app.mount('#app')
