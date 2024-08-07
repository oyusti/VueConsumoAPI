import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import Swal from 'sweetalert2'

import './index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios, Swal)
app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')
