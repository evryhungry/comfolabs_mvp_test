import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './app/router'
import App from './app/App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
