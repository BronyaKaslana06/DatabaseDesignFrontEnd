<template>
  <!-- <div v-if="staff_type === '1'"> -->
  <div>
    <div class="flex-container">
      <el-card class="left-card-block" :body-style="{height: '85%'}">
        <template #header>
          <div class="maintenance-title">
            <span>待处理订单</span>
          </div>
          <div>
            <div class="switch-button">
              <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleSwitchChange">
                <el-tab-pane label="待接单订单" name="1" :disabled="listLoading"></el-tab-pane>
                <el-tab-pane label="待完成订单" name="2" :disabled="listLoading"></el-tab-pane>
                <el-tab-pane label="换电站订单" name="3" :disabled="listLoading"></el-tab-pane>
              </el-tabs>
              <div>
                <el-button @click="refreshSwitch" :icon="RefreshRight">
                  刷新</el-button>
              </div>
            </div>
          </div>
        </template>
        <div class="infinite-list-wrapper" style="overflow:auto" v-loading="listLoading">
          <ul class="list">
            <li v-for="item in switch_data" :key="item.switch_request_id" class="list-item" @click="showDetail(item)">
              <div class="list-item-content">
                <div class="list-item-text">
                  <div style="display: flex;margin-bottom: 5px;">
                  <div style="font-weight: bold; margin-top = 0em; margin-bottom =0em;width: fit-content;margin-right: 20px;" >订单ID</div>
                  <div style="width: fit-content;">{{ item.switch_request_id }}</div></div>
                  <div style="margin-top: 10px;">
                  <span style="font-size: 14px;background-color: #4fd1c4e7;border-radius: 10px;border: solid 1px #4fd1c4; color: white;padding: 2px 10px;margin-right: 20px;">{{ item.vehicle_model }}</span>
                  <span style="font-size: 14px;background-color: #f5a74de7;border-radius: 10px;border: solid 1px #f5a74d; color: white;padding: 2px 10px;margin-right: 20px;">{{ item.request_time }}</span>
                  <span style="font-size: 14px;background-color: #729cff;border-radius: 10px;border: solid 1px #729cff; color: white;padding: 2px 10px;">{{ item.battery_type }}</span>
                  </div>
                </div>
                <div class="list-item-button">
                  <el-button v-if="activeName==='1'" :icon="Document" @click="take_order(item)" style="background-color: #9dd8ff58;border: solid 2px #2d79dd;color:#2d79dd;font-weight:bolder;margin-right: 20px;">接单</el-button>
                  <el-button v-else :icon="Document" type="success" @click="finish_order(item)" style="background-color: rgb(240, 249, 235);border: solid 2px rgb(61 169 87);color:rgb(61 169 87);font-weight:bolder;margin-right: 20px;">完成</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
      <div class="card-container-vertical">
        <el-card class="right-card-block"  :body-style="{height:'83%'}">
          <template #header>
            <div class="maintenance-title">
              <span>订单信息</span>
            </div>
          </template>
          <div v-if="selectedOrNot" style="height: 100%;">
            <div class="container-vertical" v-loading="switch_detail_loading" style="height: 100%;">
              <div class="right-info-part" style="overflow: auto;">
                <div class="detail-info" style="height: 100%;padding-top: 10px;padding-left: 20px;">
                  <el-form-item label="订单编号">{{ switch_item_data.switch_request_id }}</el-form-item>
                  <el-form-item label="用户姓名">{{ switch_item_data.username }}</el-form-item>
                  <el-form-item label="电池类型">{{ switch_item_data.battery_type }}</el-form-item>
                  <el-form-item label="预约时间">{{ switch_item_data.request_time }}</el-form-item>
                  <el-form-item label="电话">{{ switch_item_data.phone_number }}</el-form-item>
                  <el-form-item label="车型">{{ switch_item_data.vehicle_model }}</el-form-item>
                  <el-form-item label="备注">{{ switch_item_data.remarks }}</el-form-item>
                </div>
              </div>
              <div class="steps-part" style="height: 50%;position: relative;top: 50%;transform: translateY(-50%);">
                <el-steps direction="vertical" :active="activeName !='1' ? 2 : 1">
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
        <el-card v-if="activeName === '1'|| activeName === '2'" class="right-card-block" style="margin-top: 2em;">
          <template #header>
            <div>
              <span style="font-size: 16px;font-weight: bold;margin-bottom: 0.5em;">订单位置</span>
              <div style="margin-top: 0.3em;" v-if="!selectedOrNot">请选择一个订单,以查看该订单的地址</div>
              <div style="margin-top: 0.3em;" v-else>地址：{{ switch_item_data.position }}</div>
            </div>
          </template>
          <div v-show="showMap">
            <div id="map-container" style="width:100%;height:240px"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <!-- <div v-else style="display: flex; justify-content: center;">  
    <div style="display: flex; align-items: center;  flex-direction: column;">  
      <div style="font-weight: bold; color: black; margin: 2em; font-size: 2em;">  
        您不是换电站管理员，不可以查看换电订单  
      </div>  
      <img src="../../assets/background.svg" style="width: 100%; height: auto; flex: 1;">  
    </div>  
  </div> -->
  <el-dialog v-model="show_switch_log" title="订单完成情况" width="30%" @open="open_switch_log" draggable>
    <div class='window'>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{ fontSize: '1.3em' }">换电请求id</span></el-col>
        <el-col :span="16">
          <span :style="{ fontSize: '1.3em' }">
            {{ switch_log.switch_request_id }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{ fontSize: '1.3em' }">换下电池id</span></el-col>
        <el-col :span="16">
          <span :style="{ fontSize: '1.3em' }">
            {{ switch_log.batteryOffId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{ fontSize: '1.3em' }">换上电池id</span></el-col>
        <el-col :span="16">
          <span :style="{ fontSize: '1.3em' }">
            {{ switch_log.batteryOnId }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8"><span :style="{ fontSize: '1.3em' }">评价</span></el-col>
        <el-col :span="16">
          <span :style="{ fontSize: '1.3em' }">
            {{ switch_log.evaluation ? switch_log.evaluation : "暂无评价" }}
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="8">
          <span :style="{ fontSize: '1.3em' }">评分</span></el-col>
        <el-col :span="16">
          <span :style="{ fontSize: '1.3em' }">
            {{ switch_log.score === -1 ? "暂无评分" : switch_log.score }}
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
const defaultAvatar = '../../assets/defaultAvatar.jpg'; // 设置默认头像路径
// const show_status = ref(false);
const selectedOrNot = ref(false);
const showMap = ref(false);
const activeName = ref('1');
const switch_data = ref([]); //换电订单列表
const listLoading = ref(false);
const staff_type = ref(localStorage.getItem('staff_type'));

const switch_item_data = ref({});   //换电订单详细信息

const handleSwitchChange = () => {
  //show_status.value = newStatus;
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
const switch_detail_loading = ref(false);

//根据switch决定的show_status当的状态，决定获取哪些状态的订单
const refreshSwitch = () => {
  // if (staff_type.value != '1')
  //   return;
  listLoading.value = true;
  //switch_data.value = [];
  if (activeName.value != '3') {
    let state = activeName.value === '1' ? '待接单' : '待完成';
    cmRequest.request({
      url: 'api/staff/switchrequest/doortodoor',
      method: 'GET',
      params: {
        //employee_id: '1', //TODO
        employee_id: localStorage.getItem('user_id'),
        request_status: state,
        station_id:localStorage.getItem('station_id'),
      }
    }).then((res) => {
      if (!res.code) {
        switch_data.value = res.switch_request_array;
        listLoading.value = false;
      }
      else {
        ElMessage({
          type: 'error',
          message: '获取上门换电订单列表失败',
        })
        listLoading.value = false;
      }
    })
  }
  else {
    cmRequest.request({
      url: 'api/staff/switchrequest/reservation',
      method: 'GET',
      params: {
        request_status: '待完成',
        station_id: localStorage.getItem("station_id")  //TODO
        //station_id: '244'
      }
    }).then((res) => {
      if (!res.code) {
        switch_data.value = res.switch_request_array;
        listLoading.value = false;
      }
      else {
        ElMessage({
          type: 'error',
          message: '获取换电站订单列表失败',
        })
        listLoading.value = false;
      }
    })
  }
}

refreshSwitch();

//获取某个换电订单的详细信息
const get_switch_info = (id) => {
  switch_detail_loading.value = true;
  switch_item_data.value = {};
  cmRequest.request({
    url: 'api/staff/switchrequest/detail',
    method: 'GET',
    params: {
      switch_request_id: id.toString()
    }
  }).then((res) => {
    if (!res.code) {
      switch_item_data.value = res.data.switch_request;
      switch_detail_loading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '获取上门换电订单失败',
      })
      switch_detail_loading.value = false;
    }
  })
}
//get_switch_info();

const showLocation = (item) => {
  if(activeName.value == 3)
    return;
  const BMap = window.BMap;
  const map = new BMap.Map('map-container'); // 创建地图实例
  const location = new BMap.Point(item.longitude, item.latitude); // 替换为你的坐标经度和纬度
  map.centerAndZoom(location, 11); // 设置地图中心点和缩放级别
  map.enableScrollWheelZoom(true);
  const marker = new BMap.Marker(location); // 创建标记
  map.addOverlay(marker); // 将标记添加到地图上
}

const take_order = (item) => {
  console.log(item.switch_request_id + "接单");
  cmRequest.request({
    url: 'api/staff/switchrequest/receive',
    method: 'POST',
    data: {
      switch_request_id: item.switch_request_id,
      employee_id: localStorage.getItem('user_id')
    }
  }).then((res) => {
    if (!res.code) {
      refreshSwitch();
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

const switch_log = ref({});

const show_switch_log = ref(false);
const finish_order = (item) => {
  switch_log.value = {};
  console.log(item.switch_request_id + "完成");
  cmRequest.request({
    url: 'api/staff/switchrequest/submit',
    //url: '/staff/switchrequest/submit',
    method: 'POST',
    data: {
      switch_request_id: item.switch_request_id
    }
  }).then((res) => {
    if (!res.code) {
      refreshSwitch();
      ElMessage({
        type: 'success',
        message: '订单完成',
      })
      switch_log.value = res.switch_log;
      open_switch_log();
    }
    else {
      ElMessage({
        type: 'error',
        message: '完成失败，原因' + res.msg,
      })
    }
  })
  selectedOrNot.value = false;
}

const open_switch_log = () => {
  show_switch_log.value = true;
}

</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  align-items: stretch;
  margin-top: 2vh;
  /* 默认值，保持两侧高度一致 */
}

.card-container-vertical {
  flex: 1;
  /* 占据剩余空间 */
  display: flex;
  justify-content: space-between;
  /* 在左半部分的空间中平均分配 */
  flex-direction: column;
  height: 85vh;
}

.switch-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-card-block {
  border: 1px white solid;
  border-radius: 10px;
  background-color: white;
  box-sizing: border-box;
  flex: 1;
  margin-right: 1em;
  margin-left: 1em;
  height: 85vh;
}

.right-card-block {
  border: 1px white solid;
  border-radius: 10px;
  background-color: white;
  box-sizing: border-box;
  flex: 1;
  margin-right: 2em;
  height: 50%;
}

.right-map-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  flex: 1;
  margin-right: 2em;
  margin-top: 1em;
  height: 50%;
}


.container-vertical {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.right-info-part {
  display: flex;
  flex: 70%;
  border-right: 1px solid #ccc;
  padding-right: 1em;
}

.detail-info {
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
  padding: 5px 0;
}

.infinite-list-wrapper .list-item:hover{
  background-color: rgba(218, 218, 218, 0.516);
  transition: all  0.4s ease;
}

.infinite-list-wrapper .list-item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.infinite-list-wrapper .list-item-text {
  /*display: flex;*/
  flex: 1;
  margin-left: 20px;
}

#myMap {
  width: 100%;
  height: 30em;
}

.window {
  display: flex;
  flex-direction: column;
  gap: 1em;
  /* 调整行间距 */
}

.el-form-item{
  font-weight: bolder;
  color:#797979;
}

:deep(.el-form-item__content){
  font-weight:500;
  color: black;
}

:deep(.el-card__body){
    padding: 0;
}
</style>