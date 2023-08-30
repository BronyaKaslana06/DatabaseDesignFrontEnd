import { createRouter, createWebHistory } from "vue-router"
import Home from '../views/HomePage.vue'

const user_type = localStorage.getItem("user_type");
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: user_type == 0? '/reservation':(user_type == 1? '/employee-dashboard-page': '/admin-dashboard-page') // 添加重定向路由
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/reservation',
                    name: 'reservation-page',
                    component: ()=>import('../views/OwnerPage/ReservationPage.vue')
                },
                {
                    path: '/staff-info-page',
                    name: 'staff-info-page',
                    component: () => import('../views/AdminstratorPage/StaffInfoPage.vue')
                },
                {
                    path: '/switch-info-page',
                    name: 'switch-info-page',
                    component: () => import('../views/AdminstratorPage/SwitchInfoPage.vue')
                },
                {
                    path: '/owner-info-page',
                    name: 'owner-info-page',
                    component: () => import('../views/AdminstratorPage/OwnerInfoPage.vue')
                },
                {

                    path: '/switch-station-page',
                    name: 'switch-station-page',
                    component: () => import('../views/AdminstratorPage/SwitchStationPage.vue')
                },
                {
                    path: '/notice-info-page',
                    name: '/notice-info-page',
                    component: () => import('../views/AdminstratorPage/NoticePage.vue')
                },
                {
                    path: '/maintenance-item-page',
                    name: 'maintenance-item-page',
                    component: () => import('../views/AdminstratorPage/Maintenance_itemPage.vue')
                },
                {
                    path: '/repair',
                    name: 'Repair',
                    component: ()=>import('../views/OwnerPage/UserMaintenanceItemPage.vue')
        
                },
                {
                    path: '/personal-information-page',
                    name: 'personal-information-page',
                    component: ()=>import('../views/OwnerPage/PersonalInformationPage.vue')
        
                },
                {
                    path: '/employee-notice-page',
                    name: 'employee-notice-page',
                    component: ()=>import('../views/StaffPage/EmployeeNotice.vue')
        
                },
                {
                    path: '/employee-dashboard-page',
                    name: 'employee-dashboard-page',
                    component: ()=>import('../views/StaffPage/EmployeeDashboard.vue')
        
                },
                {
                    path: '/employee-notice-page',
                    name: 'employee-notice-page',
                    component: ()=>import('../views/StaffPage/EmployeeNotice.vue')
        
                },
                {
                    path: '/staff-information-page',
                    name: 'staff-information-page',
                    component: ()=>import('../views/StaffPage/StaffInformation.vue')
        
                },
                {
                    path: '/admin-dashboard-page',
                    name: 'admin-dashboard-page',
                    component: ()=>import('../views/AdminstratorPage/AdminDashboard.vue')
        
                },
                {
                    path: '/detailRepairInfo/:val',
                    name: 'detailRepairInfo',
                    component: ()=>import('../views/OwnerPage/DetailRepairInfoPage.vue')
                },
                {
                    path: '/orderDashboard',
                    name: 'ownerDashboard',
                    component: ()=>import('../views/OwnerPage/OwnerDashboard.vue')
                },
                {
                    path: '/car-page',
                    name: 'car-page',
                    component: ()=>import('../views/OwnerPage/CarPage.vue')
                },
                {
                    path: '/staffDoorToDoor',
                    name: 'doorToDoorService',
                    component: ()=>import('../views/StaffPage/StaffDoorToDoor.vue')
                },
                {
                    path: '/staffRepair/:val',
                    name: 'staffRepair',
                    component: ()=>import('../views/StaffPage/StaffRepairMessage.vue')
                },
                {
                    path: '/owner-notice-page',
                    name: 'owner-notice-page',
                    component: ()=>import('../views/OwnerPage/OwnerNotice.vue')
                },
                {
                    path: '/staffSwitch/:val',
                    //path: '/staffSwitch',
                    name: 'staffSwitch',
                    component: ()=>import('../views/StaffPage/StaffSwitchMessage.vue')
                },
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
