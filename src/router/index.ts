import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../views/Home.vue')
    // },
    {
        path: '/',
        name: 'Editor',
        component: () => import('../views/Panel.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
