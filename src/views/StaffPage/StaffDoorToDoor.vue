<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 上门服务 </span>
            </template>
        </el-page-header>
<!-- 
        <el-card class="block">
          <div class="user-info-container">
            <el-avatar :src="userAvatar || defaultAvatar" size="large"></el-avatar>
            <div class="user-details">
              <div class="name-position-container">
                <span class="user-id">{{ user_id }}</span>
                <span class="user-name">{{ user_name }}</span>
                <span class="user-position">{{ staff_type }}</span>
              </div>
            </div>
          </div>
        </el-card> -->
        
        <div class="flex-container">
          <el-card class="card-block">
            <template #header>
              <div class="maintenance-title">
                <span>待处理订单</span>
              </div>
              <div>
                <div class="switch-button">
                  <el-switch
                    v-model="show_status"
                    class="mb-2"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color:#33b3f8"
                    active-text="待完成订单"
                    inactive-text="待接单订单"
                  />
                  <div>
                    <el-button @click="refreshSwitch" :icon="RefreshRight">
                      刷新</el-button>
                  </div>
                </div>
              </div>
              
            </template>
              <div class="infinite-list-wrapper" style="overflow:auto">
                  <ul class="list">
                      <li v-for="item in switch_data" 
                      :key="item.switch_request_id" class="list-item" @click="showDetail(item)" style="cursor: pointer;">
                          <div class="list-item-content">
                              <div class="list-item-text">
                                  <p class="plate_number">{{ item.plate_number }}</p>
                                  <p class="vehicle_model">车型：{{ item.vehicle_model }}</p>
                              </div>
                              <div class="list-item-button">
                                  <el-button :icon="Document" type="primary"
                                  @click="changeStatus">接单</el-button>
                              </div>
                          </div>
                      </li>
                  </ul>
                  <!-- <p v-if="loading">加载中...</p>
                  <p v-if="noMore">没有更多了</p>  -->
              </div>
          </el-card>
          <div class="card-container-vertical">
            <el-card class="left-card-block">
            <template #header>
              <div class="maintenance-title">
                <span>订单信息</span>
              </div>
            </template>
            <div v-if="selectedOrNot" class="detail-info">
              <div v-if="staff_type === '换电站管理员'">
                <div class="container-vertical">
                  <div class="left-info-part">
                    <p>订单编号：{{ selectedDetail.switch_request_id }}</p>
                    <p>车牌号：{{ selectedDetail.plate_number }}</p>
                    <p>电话：{{ selectedDetail.phone_number }}</p>
                    <p>位置：{{ selectedDetail.position }}</p>
                    <p>车型：{{ selectedDetail.vehicle_model }}</p>
                    <div class="operation-button-container">
                    <el-button class="operation-button" type="primary" @click="toDetail(selectedDetail.switch_request_id)">
                      处理订单
                    </el-button>
                  </div>
                  <div class="steps-part">
                    <div style="height: 4em">
                      <el-steps direction="vertical" :active="1">
                        <el-step title="待接单" />
                        <el-step title="待完成" />
                        <el-step title="待评分" />
                        <el-step title="已完成" />
                      </el-steps>
                    </div>
                  </div>
                </div>

              </div>
                
              </div>
              <!-- <div v-else-if="staff_type === '维修工'"> 
                <p>订单编号：{{ selectedDetail.maintenance_items_id }}</p>
                <p>车牌号：{{ selectedDetail.plate_number }}</p>
                <p>电话：{{ selectedDetail.phone_number }}</p>
                <p>位置：{{ selectedDetail.position }}</p>
                <p>车型：{{ selectedDetail.vehicle_model }}</p>
                <div class="operation-button-container">
                  <el-button class="operation-button" type="primary" @click="toDetail(selectedDetail.maintenance_items_id)">处理订单</el-button>
                </div>
              </div>
              <div v-else>
                <p>员工类型错误</p>
              </div> -->
            </div>
            <div class="block-text" v-else>
              <p class="no-selection-text">请选择一个订单,以查看该订单的信息</p>
            </div>
          </el-card>
          <el-card class="left-card-block">
            <template #header>
              <div class="maintenance-title">
                <span>订单位置</span>
              </div>
            </template>
            <div id="map-container" style="width:100%;height:200px"></div>
          </el-card>
        </div>
          
          
        </div>

        
    </div>
</template>

<script setup lang="js">
import cmRequest from '@/service/index.js'
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption, ElCard } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const userAvatar = ref(localStorage.getItem('userAvatar'));
const user_id = ref(localStorage.getItem('user_id'));
const user_name = ref(localStorage.getItem('user_name'));
const staff_type = ref('换电站管理员');
const defaultAvatar = '../../assets/defaultAvatar.jpg'; // 设置默认头像路径
const router = useRouter();
const route = useRoute();
const show_status = ref(false);
const selectedOrNot = ref(false);

const goBack = () => {
  router.push('/admin-dashboard-page');
}

onMounted(() => {
  // userAvatar.value = localStorage.getItem('userAvatar');
  // user_id.value = localStorage.getItem('user_id');
  // user_name.value = localStorage.getItem('user_name');
  //staff_type.value = localStorage.getItem('staff_type');
  //staff_type.value = '维修工';

});

// const switch_data = ref([]); //换电列表信息数组

const switch_data = [
  {
    switch_request_id: "1",
    plate_number: "沪E 9999",
    vehicle_model: "蔚来",
    phone_number: "1399999999",
    request_time: "string",
    longitude: "123.456",
    latitude: "34.567",
    position: "上海市某街道",
    order_status: 1
  },
  {
    switch_request_id: "2",
    plate_number: "沪E 8888",
    vehicle_model: "蔚来",
    phone_number: "1388888888",
    request_time: "string",
    longitude: "123.789",
    latitude: "34.123",
    position: "上海市另一街道",
    order_status: 1
  }
];

const maintenance_data = [
  {
    maintenance_items_id: "1",
    vehicle_id: "string",
    plate_number: "沪A1111",
    vehicle_model: "小鹏",
    maintenance_location: "string",
    title: "string",
    username: "string",
    phone_number: "1396666666",
    order_submission_time: "string",
    position:"黄渡"
  },
  {
    maintenance_items_id: "2",
    vehicle_id: "string",
    plate_number: "沪A2222",
    vehicle_model: "小鹏",
    maintenance_location: "string",
    title: "string",
    username: "string",
    phone_number: "1396666677",
    order_submission_time: "string",
    position:"黄渡"
  },
  {
    maintenance_items_id: "3",
    vehicle_id: "string",
    plate_number: "沪A3333",
    vehicle_model: "小鹏",
    maintenance_location: "string",
    title: "string",
    username: "string",
    phone_number: "13966666888",
    order_submission_time: "string",
    position:"黄渡"
  },
  {
    maintenance_items_id: "4",
    vehicle_id: "string",
    plate_number: "沪A4444",
    vehicle_model: "小鹏",
    maintenance_location: "string",
    title: "string",
    username: "string",
    phone_number: "13966664444",
    order_submission_time: "string",
    position:"黄渡"
  }
];
// const maintenance_data = ref([])

const getInitialData = (type) => {
  //console.log(type);
  if (type === '换电站管理员') {
    return switch_data;
  } 
  else if (type === '维修工') {
    return maintenance_data;
  } 
  else {
    return '员工类型错误';
  }
}
//const displayed_data = ref(getInitialData(staff_type.value));

function getKey(item) {
  if (staff_type.value === '换电站管理员'){
    return item.switch_request_id;
  }
  else if (staff_type.value === '维修工'){
    return item.maintenance_items_id;
  }
  else{
    return null;
  }
}

// const count = ref(6);
// const loading = ref(false)
// //const noMore = computed(() => count.value >= switch_data.value.length)
// const load = () => {
//   //console.log("Scroll event triggered");
//   loading.value = true
//   setTimeout(() => {
//     count.value += 2
//     //loading.value = false
//   }, 2000)
// }
//const disabled = computed(() => loading.value || noMore.value)

const selectedDetail = ref(null);

const showLocation = (item) => {
  const BMap = window.BMap;
  const map = new BMap.Map('map-container'); // 创建地图实例
  const location = new BMap.Point(item.longitude, item.latitude); // 替换为你的坐标经度和纬度
  map.centerAndZoom(location, 11); // 设置地图中心点和缩放级别
  map.enableScrollWheelZoom(true);  
  const marker = new BMap.Marker(location); // 创建标记
  map.addOverlay(marker); // 将标记添加到地图上
}

const showDetail = (item) => {
  //console.log("showDetail");
  selectedOrNot.value = true;
  selectedDetail.value = item;
  showLocation(item);
};

const toDetail = (id) => {
  if (staff_type.value === '换电站管理员'){
    router.push({
      name: 'staffSwitch',
      params: { val: id }
    });
  }
  else if (staff_type.value === '维修工'){
    router.push({
      name: 'staffRepair',
      params: { val: id }
    });
  }
}

const refreshSwitch = () => {
  switch_data.value = [];
  let state = show_status.value? '待完成':'待接单';
   cmRequest.request({
      //url: 'api/staff/door_to_door_service/get_switch_array',
      url: '/staff/door_to_door_service/get_switch_array',      
      method: 'GET',
      params: {
        employee_id: user_id.value ,
        request_status:state
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '获取上门换电订单成功',
        })
        switch_data.value = res.data;
      }
      else{
        ElMessage({
          type: 'error',
          message: '获取上门换电订单失败',
        })
      }
    })
}

const getMaintenanceData = () => {
  maintenance_data.value = [];
  cmRequest.request({
      url: 'api/staff/door_to_door_service/get_maintenance_array',
      //url: '/staff/door_to_door_service/get_maintenance_array',      
      method: 'GET',
      params: {
        //employee_id: user_id.value
        employee_id: 135
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '获取维修订单成功',
        })
        maintenance_data.value = res.data;
      }
      else{
        ElMessage({
          type: 'error',
          message: '获取维修订单失败',
        })
      }
    })
};

// const getData = () => {
//   //staff_type.value = '维修工';
//   console.log(staff_type.value)
//   if(staff_type.value === '换电站管理员'){
//     console.log("run getSwitchData");
//     getSwitchData();
//   }
//   else if(staff_type.value === '维修工'){
//     console.log("run getMaintenanceData");
//     getMaintenanceData();
//   }
// }
// getData();
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%; 
  height: 100%;
  align-items: stretch; /* 默认值，保持两侧高度一致 */
}
.card-container-vertical {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: space-between; /* 在左半部分的空间中平均分配 */
  flex-direction: column;
}

.switch-button{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.user-info-container {
  display: flex;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.user-id {
  font-size: 1.2em;
  font-weight: bold;
}

.user-name {
  font-size: 1.5em;
}

.user-position {
  font-size: 1em;
}
.name-position-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.additional-info {
  font-size: 0.9em;
  margin-top: 10px;
}
.custom-text {
    font-size: 1.5em; /* 调整字体大小 */
  }
.block {
    border: 1px white solid;
    border-radius: 10px;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
    overflow: auto;
    background-color: white;
    margin: 1em 1em;
}
.card-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: auto; 
  background-color: white;
  box-sizing: border-box; /* 防止边框影响宽度 */
  flex: 1;
  margin-right: 1em; 
  margin-top: 3em;
  height: auto;
}
.left-card-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: auto; 
  background-color: white;
  box-sizing: border-box; /* 防止边框影响宽度 */
  flex: 1;
  margin-right: 2em; 
  margin-top: 3em;
  height: auto;
}
 .container-vertical{
  display: flex;
  /*flex-direction: column;*/
  align-items: stretch; 
}
.left-info-part {
  flex: 70%; 
  border-right: 1px solid #ccc; 
}
.steps-part{
  flex: 30%; 
}
.block-text{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
}

.inner-block2 {
    padding: 20px 20px 60px 20px;
}

.maintenance-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 0.5em;
}
.operation-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: auto; /* 将按钮推到底部 */
}

.infinite-list-wrapper {
    height: 300px;
  }

  .infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-bottom: 1px solid #ddd;
  }

  .infinite-list-wrapper .list-item + .list-item {
    margin-top: 10px;
  }

  .infinite-list-wrapper .list-item-content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .infinite-list-wrapper .list-item-image {
    margin-right: 10px;
  }

  .infinite-list-wrapper .list-item-image img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .infinite-list-wrapper .list-item-text {
    flex: 1;
    margin-left: 10px;
  }

  .infinite-list-wrapper .plate_number {
    font-weight: bold;
  }

  .infinite-list-wrapper .vehicle_model {
    font-size: 14px;
    color: #999;
  }



.form-item-margin {
    margin-top: 40px;
    /* 添加上边框间距 */
    margin-left: 30px;
    /* 添加左边框间距 */
}

.top-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.button-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.custom-row {
    margin-bottom: 20px;
}

#myMap {
    width: 100%;
    height: 30em;
}


</style>