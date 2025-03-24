import './assets/main.css'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue';


import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.mount('#app')
