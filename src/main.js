import { createApp } from 'vue';
import App from '@/App.vue';
import router from "@/router";
import { createPinia } from 'pinia';
import drag from "./util/drag";
const app = createApp(App,);
app.use(drag)
app.use(router)
app.use(createPinia())
app.mount('#app');
