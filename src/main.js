import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './css/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import cmRequest from './service/index.js'

const app = createApp(App);
app.use(router)
app.use(ElementPlus)
app.mount('#app')

cmRequest.request({
    url:'/test/1',
    method: 'GET'
})
