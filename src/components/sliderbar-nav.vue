<template>
    <div>
      <el-menu
        :default-active="onRoutes"
        background-color="#eaeaea"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
        class="slider-bar"
      >
        <template v-for="item in items" :key="item.index">
          <el-menu-item :index="item.index">
            <!-- 
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
            -->
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </template>
  
<script setup lang="js">
import { useRoute } from "vue-router";
import { computed } from 'vue';

const admin_items = [
  {
    name: '管理员仪表盘',
    index: '/admin-dashboard-page',
    title: '管理员仪表盘'
  },
  {
    name: '员工信息',
    index: '/staff-info-page',
    title: '员工信息'
  },
  {
    name: '换电申请信息',
    index: '/switch-info-page',
    title: '换电申请信息'
  },
  {
    name: '车主信息',
    index: '/owner-info-page',
    title: '车主信息'
  },
  {
    name: '换电站管理',
    index: '/switch-station-page',
    title: '换电站管理'
  },
  {
    path: '公告管理',
    index: '/notice-info-page',
    title: '公告管理'
  },
  {
    name: '维修订单管理',
    index: '/maintenance-item-page',
    title: '维修订单管理'
  },
];

const owner_items = [
  {
    name: '换电预约',
    index: '/reservation',
    title: '换电预约'
  },
  {
    name: '维修服务',
    index: '/repair',
    title: '维修服务'
  },
  {
    name: '个人信息',
    index: '/personal-information-page',
    title: '个人信息'
  }
]

const staff_items = [
  {
    name: '员工仪表盘',
    index: '/employee-dashboard-page',
    title: '员工仪表盘'
  },
  {
    name: '换电站电池管理',
    index: '/station-battery-page',
    title: '换电站电池管理'
  },
  {
    name: '换电站管理',
    index: '/station-info-page',
    title: '换电站管理'
  },
  {
    name: '上门服务',
    index: '/staffDoorToDoor',
    title: '上门服务'
  },
  {
    name: '公告信息',
    index: '/employee-notice-page',
    title: '公告信息'
  }
]

const user_type = localStorage.getItem("user_type");
let items = [];
if(user_type == 0)
  items = owner_items;
else if(user_type == 1)
  items = staff_items;
else
  items = admin_items;

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});
</script>
  
<style>
.slider-bar{
    height: 100vh;
    left: 0%;
    width: 100%;
}

.slider-bar .el-menu-item {
  color: #333; /* 设置字体颜色 */
  font-size: 1.1em;
}
</style>
