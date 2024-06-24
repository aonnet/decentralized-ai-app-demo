import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Uploader, Toast } from 'vant';

import App from './App.vue'
import router from './router'
const pinia = createPinia();



const app = createApp(App)

app.use(router)
app.use(Uploader)
app.use(Toast)
app.use(pinia)

app.mount('#app')
