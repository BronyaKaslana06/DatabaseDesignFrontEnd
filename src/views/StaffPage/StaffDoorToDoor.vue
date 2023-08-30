<template>
  <div>
    <div class="flex-container">
      <el-card class="left-card-block">
        <template #header>
          <div class="maintenance-title">
            <span>待处理订单</span>
          </div>
          <div>
            <div class="switch-button">
              <el-switch v-model="show_status" class="mb-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color:#33b3f8" active-text="待完成订单"
                inactive-text="待接单订单" @change="handleSwitchChange(show_status)"/>
              <div>
                <el-button @click="refreshSwitch" :icon="RefreshRight">
                  刷新</el-button>
              </div>
            </div>
          </div>
        </template>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul class="list">
            <li v-for="item in switch_data" :key="item.switch_request_id" class="list-item" @click="showDetail(item)"
              style="cursor: pointer;">
              <div class="list-item-content">
                <div class="list-item-text">
                  <p style="font-weight: bold; margin-top = 0em; margin-bottom =0em">订单ID：{{ item.switch_request_id }}</p>
                  <span style="font-size: 14px;color: #999;   margin-right: 1em;">车牌号：{{ item.plate_number }}</span>
                  <span style="font-size: 14px;color: #999;">车型：{{ item.vehicle_model }}</span>
                </div>
                <div class="list-item-button">
                  <el-button v-if="!show_status" :icon="Document" type="primary" @click="take_order(item)">接单</el-button>
                  <el-button v-else :icon="Document" type="success" @click="finish_order(item)">完成订单</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
      <div class="card-container-vertical">
        <el-card class="right-card-block">
          <template #header>
            <div class="maintenance-title">
              <span>订单信息</span>
            </div>
          </template>
          <div v-if="selectedOrNot">
            <div class="container-vertical" v-loading="switch_detail_loading">
              <div class="left-info-part">
                <div class="detail-info">
                  <p>订单编号：{{ switch_item_data.switch_request_id }}</p>
                  <p>车牌号：{{ switch_item_data.plate_number }}</p>
                  <p>用户姓名：{{ switch_item_data.username }}</p>
                  <p>电话：{{ switch_item_data.phone_number }}</p>
                  <p>车型：{{ switch_item_data.vehicle_model }}</p>
                  <p>预约时间：{{ switch_item_data.request_time }}</p>
                  <p>备注：{{ switch_item_data.remarks }}</p>
                </div>
              </div>
              <div class="steps-part" style="height: 10em">
                <el-steps direction="vertical" :active="show_status?2:1">
                  <el-step title="待接单" />
                  <el-step title="待完成" />
                  <el-step title="待评分" />
                  <el-step title="已完成" />
                </el-steps>
              </div>
            </div>
          </div>
          <div class="block-text" v-else>
            <p class="no-selection-text">请选择一个订单,以查看该订单的信息</p>
          </div>
        </el-card>
        <el-card class="right-card-block">
          <template #header>
            <div>
              <span style="font-size: 16px;font-weight: bold;margin-bottom: 0.5em;">订单位置</span>
              <div style="margin-top: 0.3em;" v-if="!selectedOrNot">请选择一个订单,以查看该订单的地址</div>
              <div style="margin-top: 0.3em;" v-else>地址：{{ switch_item_data.position }}</div>
            </div>
          </template>
          <div v-show="showMap">
            <div id="map-container" style="width:100%;height:200px"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <el-dialog  
  v-model="show_switch_log"
  title="订单完成情况"
  width="30%"
  @open="open_switch_log"
  draggable>
    <div class='window'>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{fontSize: '1.3em'}">换电请求id</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.SwitchRequestId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{fontSize: '1.3em'}">换下电池id</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.batteryOffBatteryId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{fontSize: '1.3em'}">换上电池id</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.batteryOnBatteryId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{fontSize: '1.3em'}">换下电池id</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.batteryOffBatteryId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{fontSize: '1.3em'}">评价</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.Evaluation? switch_log.Evaluation:"暂无评价" }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8">
          <span :style="{fontSize: '1.3em'}">评分</span></el-col>
        <el-col :span="16">
          <span :style="{fontSize: '1.3em'}">
            {{ switch_log.Score? switch_log.Score:"暂无评分" }}
          </span>   
        </el-col>
      </el-row>
    </div>
  </el-dialog>
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
const show_status = ref(false);
const selectedOrNot = ref(false);
const showMap = ref(false);
// const activeName = ref('daijiedan');

const switch_data = ref([]); //换电订单列表

const switch_item_data = ref({
  switch_request_id: "1",
  phone_number: "67",
  username: "邱军",
  position: "上海市某街道",
  longitude: "123.456",
  latitude: "34.567",
  vehicle_model: "commodo sit minim",
  plate_number: "13",
  remarks: "culpa sint",
  order_status: "1",
  request_time: "2020-04-25 09:57:34"
});   //换电订单详细信息

const handleSwitchChange = (newStatus) => {
  show_status.value = newStatus;
  selectedOrNot.value = false;
  showMap.value = false;
  refreshSwitch();
};

const showDetail = (item) => {
  selectedOrNot.value = true;
  showMap.value = true;
  get_switch_info(item.switch_request_id);
  showLocation(item);
};
const switch_detail_loading = ref(true);

//根据switch决定的show_status当的状态，决定获取哪些状态的订单
const refreshSwitch = () => {
  //switch_data.value = [];
  let state = show_status.value ? '待完成' : '待接单';
  cmRequest.request({
    url: 'api/staff/switchrequest/doortodoor',
    //url: 'https://mock.apifox.cn/m1/3058331-0-default/staff/switchrequest/doortodoor',
    method: 'GET',
    params: {
      employee_id: '1', //TODO
      request_status: state,
      station_id:'1'  //TODO
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '获取上门换电订单列表成功',
      })
      switch_data.value = res.switch_request_array;
    }
    else {
      ElMessage({
        type: 'error',
        message: '获取上门换电订单列表失败',
      })
    }
  })
}
refreshSwitch();

//获取某个换电订单的详细信息
const get_switch_info = (id) => {
  switch_item_data.value = {};
  cmRequest.request({
    url: 'api/staff/switchrequest/detail',
    //url: '/staff/switchrequest/detail',
    method: 'GET',
    params: {
      switch_request_id: id.toString()
    }
  }).then((res) => {
    switch_detail_loading.value = false;
    if (res.code==200) {
      ElMessage({
        type: 'success',
        message: '获取上门换电订单成功',
      })
      switch_item_data.value = res.data.switch_request;
    }
    else {
      switch_detail_loading.value = false;
      ElMessage({
        type: 'error',
        message: '获取上门换电订单失败',
      })
    }
  })
}
//get_switch_info();

const showLocation = (item) => {
  const BMap = window.BMap;
  const map = new BMap.Map('map-container'); // 创建地图实例
  const location = new BMap.Point(item.longitude, item.latitude); // 替换为你的坐标经度和纬度
  map.centerAndZoom(location, 11); // 设置地图中心点和缩放级别
  map.enableScrollWheelZoom(true);
  const marker = new BMap.Marker(location); // 创建标记
  map.addOverlay(marker); // 将标记添加到地图上
}

const take_order = (item) => {
  console.log(item.switch_request_id+"接单");
  cmRequest.request({
    //url: 'api/staff/switchrequest/receive',
    url: '/staff/switchrequest/doortodoor/receive',
    method: 'POST',
    data: {
      switch_request_id: item.switch_request_id,
      employee_id: user_id
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '接单成功',
      })
      switch_data.value = res.data;
    }
    else {
      ElMessage({
        type: 'error',
        message: '接单失败，原因' + res.msg,
      })
    }
  })
}
const switch_log = ref({
  SwitchRequestId: '1',
  batteryOffBatteryId:'batteryOff',
  batteryOnBatteryId:'batteryOn',
  Evaluation:'',
  Score:''
});

const show_switch_log = ref(false);
const finish_order = (item) => {
  switch_log.value = {};
  console.log(item.switch_request_id+"完成");
  cmRequest.request({
    //url: 'api/staff/switchrequest/submit',
    url: '/staff/switchrequest/submit',
    method: 'POST',
    data: {
      switch_request_id: item.switch_request_id
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '订单完成',
      })
      switch_log.value = res.data;
      open_switch_log();
    }
    else {
      ElMessage({
        type: 'error',
        message: '完成失败，原因' + res.msg,
      })
    }
  })
}

const open_switch_log = () => {
  show_switch_log.value = true;
}

// const maintenance_data = ref([
//   {
//     maintenance_items_id: "1",
//     vehicle_id: "string",
//     plate_number: "沪A1111",
//     vehicle_model: "小鹏",
//     maintenance_location: "string",
//     title: "string",
//     username: "string",
//     phone_number: "1396666666",
//     order_submission_time: "string",
//     position: "黄渡"
//   },
//   {
//     maintenance_items_id: "2",
//     vehicle_id: "string",
//     plate_number: "沪A2222",
//     vehicle_model: "小鹏",
//     maintenance_location: "string",
//     title: "string",
//     username: "string",
//     phone_number: "1396666677",
//     order_submission_time: "string",
//     position: "黄渡"
//   }
// ]);

// const getMaintenanceData = () => {
//   maintenance_data.value = [];
//   cmRequest.request({
//     url: 'api/staff/door_to_door_service/get_maintenance_array',
//     //url: '/staff/door_to_door_service/get_maintenance_array',      
//     method: 'GET',
//     params: {
//       //employee_id: user_id.value
//       employee_id: 135
//     }
//   }).then((res) => {
//     if (!res.code) {
//       ElMessage({
//         type: 'success',
//         message: '获取维修订单成功',
//       })
//       maintenance_data.value = res.data;
//     }
//     else {
//       ElMessage({
//         type: 'error',
//         message: '获取维修订单失败',
//       })
//     }
//   })
// };

// const toDetail = (id) => {
//   if (staff_type.value === '换电站管理员') {
//     router.push({
//       name: 'staffSwitch',
//       params: { val: id }
//     });
//   }
//   else if (staff_type.value === '维修工') {
//     router.push({
//       name: 'staffRepair',
//       params: { val: id }
//     });
//   }
// }

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
// const getInitialData = (type) => {
//   //console.log(type);
//   if (type === '换电站管理员') {
//     return switch_data;
//   }
//   else if (type === '维修工') {
//     return maintenance_data;
//   }
//   else {
//     return '员工类型错误';
//   }
// }
//const displayed_data = ref(getInitialData(staff_type.value));

// function getKey(item) {
//   if (staff_type.value === '换电站管理员') {
//     return item.switch_request_id;
//   }
//   else if (staff_type.value === '维修工') {
//     return item.maintenance_items_id;
//   }
//   else {
//     return null;
//   }
// }
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  align-items: stretch;
  /* 默认值，保持两侧高度一致 */
}

.card-container-vertical {
  flex: 1;
  /* 占据剩余空间 */
  display: flex;
  justify-content: space-between;
  /* 在左半部分的空间中平均分配 */
  flex-direction: column;
}

.switch-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-card-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: auto;
  background-color: white;
  box-sizing: border-box;
  /* 防止边框影响宽度 */
  flex: 1;
  margin-right: 1em;
  margin-left: 1em;
  margin-top: 1em;
  height: auto;
}

.right-card-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  flex: 1;
  margin-right: 2em;
  margin-top: 1em;
  height: auto;
}

.container-vertical {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.left-info-part {
  display: flex;
  flex: 70%;
  border-right: 1px solid #ccc;
  padding-right: 1em;
}

.detail-info{
  flex: 70%;
}


.steps-part {
  flex: 30%;
  margin-left: 2em;
}

.block-text {
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

.infinite-list-wrapper {
  height: 100%;
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
  height: 5em;
  border-bottom: 1px solid #ddd;
}

.infinite-list-wrapper .list-item+.list-item {
  margin-top: 10px;
}

.infinite-list-wrapper .list-item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.infinite-list-wrapper .list-item-text {
  /*display: flex;*/
  flex: 1;
  margin-left: 10px;
}

#myMap {
  width: 100%;
  height: 30em;
}

.window {
  display: flex;
  flex-direction: column;
  gap: 1em; /* 调整行间距 */
}
</style>