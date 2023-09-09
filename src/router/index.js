import { createRouter, createWebHistory } from "vue-router"
import Home from '../views/HomePage.vue'

const user_type = localStorage.getItem("user_type");
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: user_type == 0 ? '/owner-dashboard' : (user_type == 1 ? '/staff-dashboard' : '/admin-dashboard') // 添加重定向路由
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/reservation',
                    name: 'reservation-page',
                    component: () => import('../views/OwnerPage/ReservationPage.vue')
                },
                {
                    path: '/staff-info',
                    name: 'staff-info-page',
                    component: () => import('../views/AdminstratorPage/StaffInfoPage.vue')
                },
                {
                    path: '/switch-info',
                    name: 'switch-info-page',
                    component: () => import('../views/AdminstratorPage/SwitchInfoPage.vue')
                },
                {
                    path: '/owner-info',
                    name: 'owner-info-page',
                    component: () => import('../views/AdminstratorPage/OwnerInfoPage.vue')
                },
                {

                    path: '/switch-station',
                    name: 'switch-station-page',
                    component: () => import('../views/AdminstratorPage/SwitchStationPage.vue')
                },
                {
                    path: '/notice-info',
                    name: 'notice-info-page',
                    component: () => import('../views/AdminstratorPage/NoticePage.vue')
                },
                {
                    path: '/maintenance',
                    name: 'maintenance-item-page',
                    component: () => import('../views/AdminstratorPage/RepairPage.vue')
                },
                {
                    path: '/repair',
                    name: 'Repair',
                    component: () => import('../views/OwnerPage/UserMaintenanceItemPage.vue')

                },
                {
                    path: '/personal-info',
                    name: 'personal-information-page',
                    component: () => import('../views/OwnerPage/PersonalInformationPage.vue')

                },
                {
                    path: '/employee-notice',
                    name: 'employee-notice-page',
                    component: () => import('../views/StaffPage/EmployeeNotice.vue')

                },
                // {
                //     path: '/employee-dashboard-page',
                //     name: 'employee-dashboard-page',
                //     component: () => import('../views/StaffPage/EmployeeDashboard.vue')

                // },
                {
                    path: '/employee-notice',
                    name: 'employee-notice-page',
                    component: () => import('../views/StaffPage/EmployeeNotice.vue')

                },
                {
                    path: '/staff-dashboard',
                    name: 'staff-information-page',
                    component: () => import('../views/StaffPage/StaffInformation.vue')

                },
                {
                    path: '/station-battery',
                    name: 'station-battery-page',
                    component: () => import('../views/StaffPage/StationBattery.vue')

                },
                {
                    path: '/admin-dashboard',
                    name: 'admin-dashboard-page',
                    component: () => import('../views/AdminstratorPage/AdminDashboard.vue')

                },
                {
                    path: '/battery-info',
                    name: 'battery-info-page',
                    component: () => import('../views/AdminstratorPage/BatteryInfo.vue')

                },
                {
                    //path: '/detailRepairInfo/:val',
                    path: '/detailRepairInfo',
                    name: 'detailRepairInfo',
                    component: () => import('../views/OwnerPage/DetailRepairInfoPage.vue')
                },
                {
                    path: '/switch-reservation',
                    name: 'switchReservation',
                    component: () => import('../views/StaffPage/SwitchReservation.vue')
                },
                {
                    path: '/owner-dashboard',
                    name: 'ownerDashboard',
                    component: () => import('../views/OwnerPage/OwnerDashboard.vue')
                },
                {
                    path: '/owner-notice',
                    name: 'owner-notice-page',
                    component: () => import('../views/OwnerPage/OwnerNotice.vue')
                },
                {
                    path: '/switch-history',
                    name: 'switch-history',
                    component: () => import('../views/OwnerPage/SwitchHistoryPage.vue')
                },
                {
                    path: '/staff-repair',
                    name: 'staffRepair',
                    component: () => import('../views/StaffPage/StaffRepairPage.vue')
                },
                {
                    path: '/staff-maintenance',
                    name: 'staffMaintenanceItem',
                    component: () => import('../views/StaffPage/StaffMaintenanceItemPage.vue')
                },
                {
                    path: '/staff-switch',
                    name: 'staffSwitch',
                    component: () => import('../views/StaffPage/StaffSwitchPage.vue')
                }
            ],
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/LoginPage.vue')
        },
        {
            path: '/sign-up',
            name: 'Signup',
            component: () => import('../views/SignupPage.vue')

        }
    ]
})

router.beforeEach((to, from, next) => {
    if(to.path === '/sign-up'){
        next();
    } 
    const role = localStorage.getItem('user_id');
    if (!role && to.path !== '/login') {
        next('/login');
    }

    else {
        sessionStorage.setItem("previousPage", to.path);
        next();
    }
})


export default router;
