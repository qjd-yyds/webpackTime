import { createApp } from 'vue'
import './style.scss'
import '@/fonts/iconfont.css'
import App from './App.vue'
// console.log(ElementPlus);
// import 'element-plus/dist/index.css';
console.log(process.env.NODE_ENV)
console.log(__my__value)
const app = createApp(App)
// app.use(ElementPlus);
app.mount('#root')
