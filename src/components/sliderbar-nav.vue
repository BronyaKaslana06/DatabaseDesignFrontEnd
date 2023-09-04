<template>
  <div>
    <el-menu :default-active="activePath" background-color="#F9FAFB" text-color="#bfcbd9" active-text-color="#20a0ff"
      unique-opened router class="slider-bar" @select="onMenuSelect">
      <template v-for="item in items" :key="item.index">
        <el-menu-item :index="item.index">
          <div
            :class="['icon-placeholder', item.index == selectedItem ? 'icon-active-' + item.title : 'icon-' + item.title]">
          </div>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
  
<script setup lang="js">
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { computed, ref, onMounted } from 'vue';

const selectedItem = ref(null);
const activePath = ref(null);
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
    name: '换电站信息',
    index: '/switch-station-page',
    title: '换电站信息'
  },
  {
    name: '电池管理',
    index: '/battery-info-page',
    title: '电池管理'
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
    name: '个人主页',
    index: '/orderDashboard',
    title: '个人主页'
  },
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
    name: '换电订单历史',
    index: '/switch-history',
    title: '换电订单历史'
  },
  {
    name: '个人信息',
    index: '/personal-information-page',
    title: '个人信息'
  },
  {
    name: '公告信息',
    index: '/owner-notice-page',
    title: '公告信息'
  },
  {
    name: '车辆信息',
    index: '/car-page',
    title: '车辆信息'
  }
]

const staff_items = [
  // {
  //   name: '员工仪表盘',
  //   index: '/employee-dashboard-page',
  //   title: '员工仪表盘'
  // },
  {
    name: '员工信息',
    index: '/staff-information-page',
    title: '员工信息'
  },
  {
    name: '电池管理',
    index: '/station-battery-page',
    title: '电池管理'
  },
  {
    name: '换电管理',
    index: '/switchReservation',
    title: '换电管理'
  },
  {
    name: '上门维修',
    index: '/staffRepair',
    title: '上门维修'
  },
  {
    name: '公告信息',
    index: '/employee-notice-page',
    title: '公告信息'
  },
  {
    name: '维修历史',
    index: '/staffMaintenanceItem',
    title: '维修历史'
  },
  {
    name: '换电历史',
    index: '/staffSwitch',
    title: '换电历史'
  }
]

const user_type = localStorage.getItem("user_type");
let items = [];
if (user_type == 0) {
  console.log("a");
  items = owner_items;
  activePath.value = sessionStorage.getItem('previousPage');
  selectedItem.value = sessionStorage.getItem('previousPage');
}
else if (user_type == 1) {
  console.log("b");
  items = staff_items;
  activePath.value = sessionStorage.getItem('previousPage');
  selectedItem.value = sessionStorage.getItem('previousPage');
}
else {
  console.log("c");
  items = admin_items;
  activePath.value = sessionStorage.getItem('previousPage');
  selectedItem.value = sessionStorage.getItem('previousPage');
}
const route = useRoute();
onBeforeRouteUpdate((to) => {
  activePath.value = to.path;
  selectedItem.value = to.path;
})

const onMenuSelect = (item) => {
  selectedItem.value = item;
  console.log(selectedItem.value);
}

// 对于选中时的svg图片进行预加载，防止使用时出现滞后出现
const svgArray = [
  '车主信息',
  '公告管理',
  '管理员仪表盘',
  '换电申请信息',
  '换电站信息',
  '上门维修服务',
  '维修订单管理',
  '员工信息',
  '换电订单历史',
  '换电站电池管理'
]


for (let name of svgArray) {
  const svgUrl = require('@/assets/' + name + '-active.svg');
  const img = new Image();
  img.src = svgUrl;
}



</script>
  
<style scoped>
.slider-bar {
  height: 90vh;
  left: 0%;
  width: 100%;
}

.slider-bar .el-menu-item {
  color: #333;
  /* 设置字体颜色 */
  font-size: 1.1em;
}

.el-menu-item.is-active {
  border-radius: 19.412px;
  background: var(--black-amp-white-white, #FFF);
  box-shadow: 0px 4.529411315917969px 7.117647171020508px 0px rgba(0, 0, 0, 0.09);
}

.el-menu-item {
  display: flex;
  align-items: center;

}

.icon-placeholder {
  height: 46px;
  margin-right: 20px;
  transition: margin-right 0.3s
}

.icon-换电订单历史::before {
  content: url(../assets/换电订单历史.svg);
}

.icon-员工信息::before {
  content: url(../assets/员工信息.svg);
}

.icon-active-员工信息::before {
  content: url(../assets/员工信息-active.svg);
}

.icon-个人主页::before,
.icon-管理员仪表盘::before,
.icon-员工仪表盘::before {
  content: url(../assets/管理员仪表盘.svg);
}

.icon-active-个人主页::before,
.icon-active-管理员仪表盘::before,
.icon-active-员工仪表盘::before {
  content: url(../assets/管理员仪表盘-active.svg);
}

.icon-车主信息::before,
.icon-个人信息::before {
  content: url(../assets/车主信息.svg);
}

.icon-active-车主信息::before,
.icon-active-个人信息::before {
  content: url(../assets/车主信息-active.svg);
}

.icon-active-换电申请信息::before,
.icon-active-换电预约::before,
.icon-active-换电管理::before {
  content: url(../assets/换电申请信息-active.svg);
}

.icon-换电申请信息::before,
.icon-换电预约::before,
.icon-换电管理::before {
  content: url(../assets/换电申请信息.svg);
}

.icon-换电站信息::before {
  content: url(../assets/换电站信息.svg);
}

.icon-active-换电站信息::before{
  content: url(../assets/换电站信息-active.svg);
}

.icon-公告管理::before,
.icon-公告信息::before {
  content: url(../assets/公告管理.svg);
}

.icon-active-公告管理::before,
.icon-active-公告信息::before {
  content: url(../assets/公告管理-active.svg);
}


.icon-维修订单管理::before {
  content: url(../assets/维修订单管理.svg);
}

.icon-active-维修订单::before,
.icon-active-维修订单管理::before {
  content: url(../assets/维修订单管理-active.svg);
}

.icon-上门维修服务::before,
.icon-维修服务::before,
.icon-上门维修::before {
  content: url(../assets/上门维修服务.svg);
}

.icon-active-上门维修服务::before,
.icon-active-维修服务::before,
.icon-active-上门维修::before {
  content: url(../assets/上门维修服务-active.svg);
}

.icon-active-换电订单历史::before {
  content: url(../assets/换电订单历史-active.svg);
}

.icon-电池管理::before,
.icon-换电站电池管理::before{
  content: url(../assets/换电站电池管理.svg)
}

.icon-active-电池管理::before,
.icon-active-换电站电池管理::before{
  content: url(../assets/换电站电池管理-active.svg)
}

.el-menu-item:hover {
  background-color: rgb(255, 255, 255) !important;
  border-radius: 19.412px;
}

.slider-bar .el-menu-item {
  color: #A0AEC0;
}

.el-menu-item.is-active {
  color: #585858 !important;
}

.el-menu-item {
  height: 75px !important;
  margin-bottom: 3px;

}
</style> 
