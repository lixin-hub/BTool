import { createApp } from 'vue';
import App from '@/App.vue';
import router from "@/router";
import flowDragDirective from '@/util/FlowDrag';
import { createPinia } from 'pinia';
const app = createApp(App,);
app.directive('flowDrag', flowDragDirective);
app.use(router)
app.use(createPinia())
app.mount('#app');
