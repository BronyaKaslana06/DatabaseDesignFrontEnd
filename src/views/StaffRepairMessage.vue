<template>
  <el-page-header :icon="ArrowLeft" @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 维修订单 </span>
    </template>
  </el-page-header>

  <div class="order-info-page">
    <div class="flex-container">
      <el-card class="card-block">
        <template #header>
          <div class="section-title">
            <span>订单信息</span>
          </div>
        </template>
        <div class="order-field">
          <span class="field-label">订单id</span> {{ repairInfo.maintenance_items_id }}
        </div>
        <div class="order-field">
          <span class="field-label">用户名:</span> {{ username }}
        </div>
        <div class="order-field">
          <span class="field-label">电话:</span> {{ phone_number }}
        </div>
        <div class="order-field">
          <span class="field-label">维修地点:</span> {{ maintenance_location }}
        </div>
        <div class="order-field">
          <span class="field-label">车型:</span> {{ vehicle_model }}
        </div>
        <div class="order-field">
          <span class="field-label">提交时间:</span> {{ order_submission_time }}
        </div>
      </el-card>
      <el-card class="card-block" :body-style="{ padding: '0px' }">
        <template #header>
          <div class="section-title">
            <span>订单位置</span>
          </div>
        </template>
        <div id="map-container" class="map"></div>
      </el-card>
    </div>
  </div>

  <div class="order-info-page">
    <div class="flex-container">
      <el-card class="card-block">
        <template #header>
          <div class="section-title">
            <span>用户备注</span>
          </div>
        </template>
        <div class="order-field">
          <span class="field-label">{{ remarks }}</span> 
        </div>
      </el-card>
      <el-card class="card-block">
        <template #header>
          <div class="section-title">
            <span>订单状态</span>
          </div>
        </template>
        <div class="order-field">
          <span class="field-label"></span> 
          <select v-model="order_status">
          <option value="待处理">待处理</option>
          <option value="已完成">已完成</option>
          </select>
          <span class="field-label">{{ order_status }}</span> 
        </div>
        <el-button @click="save" type="primary" class="save-button">保存</el-button>
      </el-card>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted } from "vue";
import cmRequest from "../service/index.js";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const repairLocation = reactive({
  lng: 121.21633041361302,
  lat: 31.268357562330195
});

const repairInfo = reactive({
  maintenance_items_id: route.params.val,
  username: "",
  phone_number: "",
  maintenance_location: "",
  vehicle_model: "",
  order_submission_time: "",
  service_time: "",
  plate_number: "",
  order_status: "",
  title: "",
  remarks: "",
});

onMounted( () => { 
  //处理地图
  const BMap = window.BMap;
  const map = new BMap.Map('map-container'); // 创建地图实例
  const location = new BMap.Point(repairLocation.lng, repairLocation.lat); // 替换为你的坐标经度和纬度
  map.centerAndZoom(location, 11); // 设置地图中心点和缩放级别
  map.enableScrollWheelZoom(true);  
  const marker = new BMap.Marker(location); // 创建标记
  map.addOverlay(marker); // 将标记添加到地图上
})

const username= ref();
const phone_number= ref();
const maintenance_location= ref();
const vehicle_model= ref();
const order_submission_time= ref();
const order_status = ref();
const remarks = ref();
const maintenance_items_id= ref();

const queryData = () => {
  cmRequest.request({
  // url: 'api/staff/door_to_door_service/get_maintenance_item',
  url: 'https://mock.apifox.cn/m1/3058331-0-default/staff/door_to_door_service/get_maintenance_item',// 我的本地api地址
  method: 'GET',
  params: {
    maintenance_item_id:route.params.val
      // 传入输入的maintenance_item_id
  }
  }).then((res) => {
  if(!res.code){
    ElMessage({
      type: 'success',
      message: '刷新成功',
    })
    username.value = res.data.username;
    phone_number.value = res.data.phone_number;
    maintenance_location.value = res.data.maintenance_location;
    vehicle_model.value = res.data.vehicle_model;
    order_submission_time.value = res.data.order_submission_time; 
    order_status.value = res.data.order_status;
    remarks.value = res.data.remarks;
  }
  else{
    ElMessage({
      type: 'error',
      message: '刷新失败',
    })
  }
  })
}

queryData();

const save = () => {
    cmRequest.request({
    url: 'api/staff/doortodoorservice/switch-record',
    method: 'PATCH',
    data: {
      maintenance_items_id: maintenance_items_id.value,
      order_status:order_status.value,
    }
    }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '更新成功',
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: '更新失败',
      })
    }
  })
  }

const goBack = () => {
  router.go(-1); // 返回上次访问的页面
}

</script>
  
<style scoped>
.order-info-page {
  /*padding: 20px;*/
  font-family: Arial, sans-serif;
}

.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%; 
}

.order-details {
  display: flex;
  justify-content: space-between;
  background-color: #f5f8fa; /* 淡蓝色背景 */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto; 
  background-color: white;
  margin: 30px 20px;
  height: 15em;
  flex: 1;
  margin-right: 1em; /* 可以调整需要的间距 */
}

.order-section {
  flex: 1;
}

.section-title {
  margin-bottom: 0.1em;
  font-size: 1.4rem; /* 大一点的标题 */
  color: #2d3a4b; /* 深蓝色标题 */
}

.map {
  width: 100%;
  height: 10.5em;
}

.field-label {
  font-weight: bold;
  color: #555;
}

.order-field {
  margin-bottom: 10px;
  color: #777;
}

.note {
  background-color: #f5f8fa; /* 淡蓝色背景 */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.note textarea {
  width: 100%;
  height: 100px;
  resize: vertical;
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 1rem;
  color: #333;
}
</style>
