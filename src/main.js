import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './css/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import cmRequest from './service/index.js'
import axios from 'axios'
axios.defaults.baseURL=''
import VWave from 'v-wave'

const app = createApp(App);
app.use(router)
app.use(ElementPlus)
app.use(VWave)
app.mount('#app')
