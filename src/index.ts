import { createApp } from 'vue';
import './style.scss';
import '@/fonts/iconfont.css';
import App from './App.vue';
console.log(process.env.NODE_ENV);
const vueInstance = createApp(App);

vueInstance.mount('#root');
