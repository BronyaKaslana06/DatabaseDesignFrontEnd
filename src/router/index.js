import { createRouter, createWebHistory } from "vue-router"
import Home from '../views/HomePage.vue'

const user_type = localStorage.getItem("user_type");
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: user_type == 0? '/page3':(user_type == 1? '/page4': '/staff-info-page') // 添加重定向路由
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/reservation',
                    name: 'reservation-page',
                    component: ()=>import('../views/ReservationPage.vue')
                },
                {
                    path: '/staff-info-page',
                    name: 'staff-info-page',
                    component: () => import('../views/StaffInfoPage')
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
                },
                
                {
                    path: '/maintenance-item-page',
                    name: 'maintenance-item-page',
                    component: () => import('../views/Maintenance_itemPage')

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
                },
                {
                    path: '/repair',
                    name: 'Repair',
                    component: ()=>import('../views/UserMaintenanceItemPage.vue')
        
                },
                {
                    path: '/personal-information-page',
                    name: 'personal-information-page',
                    component: ()=>import('../views/PersonalInformationPage.vue')
        
                },
                {
                    path: '/employee-notice-page',
                    name: 'employee-notice-page',
                    component: ()=>import('../views/EmployeeNotice.vue')
        
                },
                {
                    path: '/employee-dashboard-page',
                    name: 'employee-dashboard-page',
                    component: ()=>import('../views/EmployeeDashboard.vue')
        
                },
                {
                    path: '/admin-dashboard-page',
                    name: 'admin-dashboard-page',
                    component: ()=>import('../views/AdminDashboard.vue')
        
                },
                {
                    path: '/detailRepairInfo/:val',
                    name: 'detailRepairInfo',
                    component: ()=>import('../views/DetailRepairInfoPage.vue')
        
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

router.beforeEach((to, from, next) => {
    // Check authentication and perform redirection
    const role = localStorage.getItem('user_id');
    if (!role && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
})


export default router;
