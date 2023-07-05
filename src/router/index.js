import { createRouter, createWebHistory } from "vue-router"
import Home from '../view/HomePage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/page1',
                    name: 'page1',
                    component: ()=>import('../view/TestPage1')
                },
                {
                    path: '/page2',
                    name: 'page2',
                    component: ()=>import('../view/TestPage2')
                },
                {
                    path: '/page3',
                    name: 'page3',
                    component: ()=>import('../view/TestPage3')
                },
                {
                    path: '/page4',
                    name: 'page4',
                    component: ()=>import('../view/TestPage4')
                },
                {
                    path: '/page5',
                    name: 'page5',
                    component: ()=>import('../view/TestPage5')
                }
            ],
        }
    ]
})

export default router;