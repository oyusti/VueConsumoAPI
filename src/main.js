import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import Swal from 'sweetalert2'

import './index.css'

axios.defaults.baseURL = 'http://localhost:8000'

const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
  store.router = markRaw(router)
})

app.use(pinia)
app.use(router)
app.use(VueAxios, axios, Swal)
app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')
