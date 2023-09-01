<template>
  <!-- <div v-if="staff_type === '2'"> -->
  <div>
    <div class="flex-container">
      <el-card class="left-card-block">
        <template #header>
          <div class="maintenance-title">
            <span>待处理维修项</span>
          </div>
          <div>
            <div class="switch-button">
              <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleSwitchChange">
                <el-tab-pane label="待接单订单" name="1"></el-tab-pane>
                <el-tab-pane label="待完成订单" name="2"></el-tab-pane>
              </el-tabs>
              <div>
                <el-button @click="refreshRepair(true)" :icon="RefreshRight">
                  刷新</el-button>
              </div>
            </div>
          </div>
        </template>
        <div class="infinite-list-wrapper" style="overflow:auto" v-loading="listLoading">
          <ul class="list">
            <li v-for="item in repair_data" :key="item.maintenance_item_id" class="list-item" @click="showDetail(item)"
              style="cursor: pointer;">
              <div class="list-item-content">
                <div class="list-item-text">
                  <p style="font-weight: bold; margin-top = 0em; margin-bottom =0em">{{ item.title }}</p>
                  <span style="font-size: 14px;color: #999;   margin-right: 1em;">车牌号：{{ item.plate_number }}</span>
                  <span style="font-size: 14px;color: #999;">车型：{{ item.vehicle_model }}</span>
                </div>
                <div class="list-item-button">
                  <el-button v-if="activeName === '1'" :icon="Document" type="primary"
                    @click="take_order(item)">接单</el-button>
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
            <div class="container-vertical" v-loading="repair_item_loading">
              <div class="right-info-part">
                <div class="detail-info">
                  <p>订单编号：{{ repair_item_data.maintenance_item_id }}</p>
                  <p>车牌号：{{ repair_item_data.plate_number }}</p>
                  <p>用户姓名：{{ repair_item_data.username }}</p>
                  <p>用户电话：{{ repair_item_data.phone_number }}</p>
                  <p>车型：{{ repair_item_data.vehicle_model }}</p>
                  <p>预约时间：{{ repair_item_data.appoint_time }}</p>
                  <p>备注：{{ repair_item_data.remarks }}</p>
                </div>
              </div>
              <div class="steps-part" style="height: 10em">
                <el-steps direction="vertical" :active="activeName==='1' ? 1 : 2">
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
        <el-card class="right-map-block">
          <template #header>
            <div>
              <span style="font-size: 16px;font-weight: bold;margin-bottom: 0.5em;">订单位置</span>
              <div style="margin-top: 0.3em;" v-if="!selectedOrNot">请选择一个订单,以查看该订单的地址</div>
              <div style="margin-top: 0.3em;" v-else>地址：{{ repair_item_data.maintenance_location }}</div>
            </div>
          </template>
          <div v-show="showMap">
            <div id="map-container" style="width:100%;height:200px"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <!-- <div v-else style="display: flex; justify-content: center;">  
    <div style="display: flex; align-items: center;  flex-direction: column;">  
      <div style="font-weight: bold; color: black; margin: 2em; font-size: 2em;">  
        您不是维修员工，不可以查看维修项表  
      </div>  
      <img src="../../assets/background.svg" style="width: 100%; height: auto; flex: 1;">  
    </div>  
  </div> -->
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
const repair_data = ref([]); //维修订单列表
const repair_item_data = ref({});   //维修订单详细信息
const listLoading = ref(true);
const staff_type = ref(localStorage.getItem('staff_type'));

const handleSwitchChange = () => {
  //show_status.value = newStatus;
  selectedOrNot.value = false;
  showMap.value = false;
  refreshRepair(false);
};

const showDetail = (item) => {
  selectedOrNot.value = true;
  showMap.value = true;
  get_repair_info(item.maintenance_item_id);
  showLocation(item);
};
const repair_item_loading = ref(false);

//根据switch决定的show_status当的状态，决定获取哪些状态的订单
const refreshRepair = (show_message) => {
  // if (staff_type.value != '2')
  //   return;
  console.log("call refresh");
  listLoading.value = true;
  //repair_data.value = [];
  let state = activeName.value === '1' ? '待接单' : '待完成';
  cmRequest.request({
    url: 'api/staff/maintanence/doortodoor',
    //url: 'https://mock.apifox.cn/m1/3058331-0-default/staff/switchrequest/doortodoor',
    method: 'GET',
    params: {
      employee_id: parseInt(user_id.value), //TODO
      order_status: state,
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '获取維修订单列表成功',
      })
      repair_data.value = res.maintanence_item_array;
      listLoading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '获取維修订单列表失败',
      })
      listLoading.value = false;
    }
  })
}
refreshRepair();

//获取某个换电订单的详细信息
const get_repair_info = (id) => {
  repair_item_loading.value = true;
  repair_item_data.value = {};
  cmRequest.request({
    url: 'api/staff/maintanence/detail',
    //url: '/staff/switchrequest/detail',
    method: 'GET',
    params: {
      maintenance_item_id: id.toString()
    }
  }).then((res) => {
    if (!res.code) {
      // ElMessage({
      //   type: 'success',
      //   message: '获取維修订单成功',
      // })
      repair_item_data.value = res.data;
      repair_item_data.value.maintenance_item_id = id;
      repair_item_loading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '获取維修订单失败',
      })
      repair_item_loading.value = false;
    }
  })
}
//get_repair_info();

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
  console.log(item.maintenance_item_id + "接单");
  cmRequest.request({
    url: 'api/staff/maintanence/receive',
    method: 'POST',
    data: {
      maintenance_item_id: item.maintenance_item_id,
      employee_id: user_id.value
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '接单成功',
      })
      repair_data.value = res.data;
      refreshRepair(false);
    }
    else {
      ElMessage({
        type: 'error',
        message: '接单失败，原因' + res.msg,
      })
    }
  })
}

const finish_order = (item) => {
  console.log(item.maintenance_item_id + "完成");
  cmRequest.request({
    url: 'api/staff/maintanence/submit',
    //url: '/staff/switchrequest/submit',
    method: 'POST',
    data: {
      maintenance_item_id: item.maintenance_item_id
    }
  }).then((res) => {
    if (!res.code) {
      refreshRepair(false);
      ElMessage({
        type: 'success',
        message: '订单完成',
      })
      // switch_log.value = res.data;
      // open_switch_log();
    }
    else {
      ElMessage({
        type: 'error',
        message: '完成失败，原因' + res.msg,
      })
    }
  })
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
  overflow: auto;
  background-color: white;
  box-sizing: border-box;
  /* 防止边框影响宽度 */
  flex: 1;
  margin-right: 1em;
  margin-left: 1em;
  margin-top: 1em;
  height: 85vh;
}

.right-card-block {
  border: 1px white solid;
  border-radius: 10px;
  overflow: auto;
  background-color: white;
  box-sizing: border-box;
  flex: 1;
  margin-right: 2em;
  margin-top: 1em;
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
  gap: 1em;
  /* 调整行间距 */
}
</style>