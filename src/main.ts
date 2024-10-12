import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Uploader, Toast ,Tabs,Tab,NavBar } from 'vant';

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia();

const app = createApp(App)

app.use(router)
app.use(Uploader)
app.use(NavBar)
app.use(Toast)
app.use(Tabs);
app.use(Tab);
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')
