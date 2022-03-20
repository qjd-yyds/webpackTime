import { createApp } from 'vue'
import App from './App.vue'
import '@/fonts/iconfont.css'
import './style.scss'

console.log(process.env.NODE_ENV)
const app = createApp(App)
app.mount('#root')
