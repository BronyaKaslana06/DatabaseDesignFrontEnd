import { createRouter, createWebHistory } from "vue-router"
import Home from '../views/HomePage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/page1' // 添加重定向路由
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/page1',
                    name: 'page1',
                    component: () => import('../views/TestPage1')
                },
                {
                    path: '/page2',
                    name: 'page2',
                    component: () => import('../views/TestPage2')
                },
                {
                    path: '/page3',
                    name: 'page3',
                    component: () => import('../views/TestPage3')
                },
                {
                    path: '/page4',
                    name: 'page4',
                    component: () => import('../views/TestPage4')
                },
                {
                    path: '/page5',
                    name: 'page5',
                    component: () => import('../views/TestPage5')
                }
            ],
        }
    ]
})

export default router;
