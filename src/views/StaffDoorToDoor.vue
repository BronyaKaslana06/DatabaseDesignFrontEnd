<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 上门服务 </span>
            </template>
        </el-page-header>

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
        </el-card>

        <div class="flex-container">
          <el-card class="card-block">
            <template #header>
              <div class="maintenance-title">
                <span>订单信息</span>
              </div>
            </template>
            <div v-if="selectedDetail" class="detail-info">
              <div v-if="staff_type === '换电站管理员'">
                <p>订单编号：{{ selectedDetail.switch_request_id }}</p>
                <p>车牌号：{{ selectedDetail.plate_number }}</p>
                <p>电话：{{ selectedDetail.phone_number }}</p>
                <p>位置：{{ selectedDetail.position }}</p>
                <p>车型：{{ selectedDetail.vehicle_model }}</p>
                <div class="operation-button-container">
                  <el-button class="operation-button" type="primary" @click="toDetail(selectedDetail.switch_request_id)">处理订单</el-button>
                </div>
              </div>
              <div v-else-if="staff_type === '维修工'"> 
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
              </div>
            </div>
            <div class="block-text" v-else>
              <p class="no-selection-text">请选择一个订单,以查看该订单的信息</p>
            </div>
          </el-card>
  
          <el-card class="card-block">
            <template #header>
              <div class="maintenance-title">
                <span>待处理订单</span>
              </div>
            </template>
              <div class="infinite-list-wrapper" style="overflow:auto">
                  <ul v-infinite-scroll="load" class="list">
                      <li v-for="item in getInitialData(staff_type)" :key="getKey(item)" class="list-item">
                          <div class="list-item-content">
                              <div class="list-item-text">
                                  <p class="plate_number">{{ item.plate_number }}</p>
                                  <p class="vehicle_model">车型：{{ item.vehicle_model }}</p>
                              </div>
                              <div class="list-item-button">
                                  <el-button text :icon="Document"
                                  @click="showDetail(item)">查看详情</el-button>
                              </div>
                          </div>
                      </li>
                  </ul>
                  <!-- <p v-if="loading">加载中...</p>
                  <p v-if="noMore">没有更多了</p>  -->
              </div>
          </el-card>
        </div>

        
    </div>
</template>

<script setup lang="js">
import cmRequest from '../service/index.js'
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption, ElCard } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const userAvatar = ref('');
const user_id = ref('');
const user_name = ref('');
const staff_type = ref('');
const defaultAvatar = '@/assets/defaultAvatar.jpg'; // 设置默认头像路径
const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.push('/admin-dashboard-page');
}

onMounted(() => {
  userAvatar.value = localStorage.getItem('userAvatar');
  user_id.value = localStorage.getItem('user_id');
  user_name.value = localStorage.getItem('user_name');
  //staff_type.value = localStorage.getItem('staff_type');
  staff_type.value = '维修工';
});

// const switch_data = ref([]); //换电列表信息数组

const switch_data = [
  {
    switch_request_id: "1",
    plate_number: "沪A1111",
    request_time: "1970-04-21 17:01:38",
    position: "同济大学",
    latitude: "consectetur esse",
    longtitude: "sunt pariatur id ad dolor",
    vehicle_model: "蔚来",
    phone_number:"1399999999"
  },
  {
    switch_request_id: "2",
    plate_number: "沪A2222",
    request_time: "1985-12-02 10:25:15",
    position: "同济大学",
    latitude: "ad reprehenderit do laborum",
    longtitude: "elit dolor laboris non ullamco",
    vehicle_model: "蔚来",
    phone_number:"1399999999"
  },
  {
    switch_request_id: "3",
    plate_number: "沪A3333",
    request_time: "2005-08-15 21:55:43",
    position: "同济大学",
    latitude: "ex velit aliqua id",
    longtitude: "nulla est eu amet laboris",
    vehicle_model: "蔚来",
    phone_number:"1399999999"
  },
  {
    switch_request_id: "4",
    plate_number: "沪A4444",
    request_time: "2005-08-15 21:55:43",
    position: "同济大学",
    latitude: "ex velit aliqua id",
    longtitude: "nulla est eu amet laboris",
    vehicle_model: "蔚来",
    phone_number:"1399999999"
  },
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

const getInitialData = (type) => {
  console.log(type);
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

const count = ref(4);
const loading = ref(false)
//const noMore = computed(() => count.value >= switch_data.value.length)
const load = () => {
  console.log("Scroll event triggered");
  loading.value = true
  setTimeout(() => {
    count.value += 2
    //loading.value = false
  }, 2000)
}
//const disabled = computed(() => loading.value || noMore.value)

const selectedDetail = ref(null);

const showDetail = (item) => {
  selectedDetail.value = item;
};

const toDetail = (id) => {
  console.log(id);
  
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
const getSwitchData = () => {
  cmRequest.request({
      //url: 'api/staff/door_to_door_service/get_switch_array',
      url: '/staff/door_to_door_service/get_switch_array',      
      method: 'GET',
      params: {
        employee_id: user_id  
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
};

const getMaintenanceData = () => {
  cmRequest.request({
      //url: 'api/staff/door_to_door_service/get_maintenance_array',
      url: '/staff/door_to_door_service/get_maintenance_array',      
      method: 'GET',
      params: {
        employee_id: user_id  
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

const getData = () => {
  if(staff_type.value === '换电站管理员'){
    console.log("run getSwitchData");
    getSwitchData();
  }
  else if(staff_type.value === '维修工'){
    console.log("run getMaintenanceData");
    getMaintenanceData();
  }
}
getData();
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%; 
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
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto; 
  background-color: white;
  margin: 30px 20px;
  height: 22em;
  flex: 1;
  margin-right: 1em; /* 可以调整需要的间距 */
}
.inner-block {
    padding: 20px 20px 30px 20px;
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
    margin-bottom: 1em;
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