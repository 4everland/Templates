import './css/style.scss'
import Components from './components'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Components)

app.mount('#app')
