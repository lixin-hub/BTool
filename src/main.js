import { createApp } from 'vue';
import App from '@/App.vue';
import router from "@/router";
import { createPinia } from 'pinia';
import drag from "./util/drag";
import { message } from 'ant-design-vue';
message.config(
    {
        maxCount:2,
        top:"0px",
        duration: 2
    }
)
const app = createApp(App,);
app.use(drag)
app.use(router)
app.use(createPinia())
app.mount('#app');
