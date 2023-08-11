import { createRouter, createWebHistory } from "vue-router"
import Home from '../views/HomePage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/stuff-info-page' // 添加重定向路由
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/stuff-info-page',
                    name: 'stuff-info-page',
                    component: () => import('../views/StuffInfoPage')
                },
                {
                    path: '/switch-info-page',
                    name: 'switch-info-page',
                    component: () => import('../views/SwitchInfoPage')
                },
                {
                    path: '/owner-info-page',
                    name: 'owner-info-page',
                    component: () => import('../views/OwnerInfoPage')
                },
                {

                    path: '/switch-station-page',
                    name: 'switch-station-page',
                    component: () => import('../views/SwitchStationPage')
                },
                {
                    path: '/notice-info-page',
                    name: '/notice-info-page',
                    component: () => import('../views/NoticePage')
                }
                }，
                // {
                //     path: '/page2',
                //     name: 'page2',
                //     component: () => import('../views/TestPage2')

                // },
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
        },
        {
            path:'/login',
            name: 'Login',
            component:()=> import('../views/LoginPage.vue')
        },
        {
            path: '/sign-up',
            name: 'Signup',
            component: ()=>import('../views/SignupPage.vue')
        
        }
    ]
})

router.beforeEach((to,from,next)=>{
    if(to.path === '/sign-up'){
        next();
        return;
    }
    if(from.path === '/sign-up'){
        console.log("hi");
        next();
        return;
    }
    const role = localStorage.getItem('user_id');
    if(!role&&to.path !=='/login'){
        next('/login');
    }
    else{
        next();
    }
})

export default router;
