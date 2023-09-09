<template>
  <div class="card-container" v-loading="loading">
    <el-card shadow="always">
      <template #header>
        <div class="card-header">
          <span class="header-name">{{ repairItem.title }}</span>
          <div class="back-button" @click="goBack" style="cursor: pointer;">
            <el-icon style="font-size: 1.1em; margin-right: 0.7em; vertical-align: middle;">
              <Back />
            </el-icon>
            <el-button type="text" style="font-size: 1.1em; vertical-align: middle;margin-right: 1.4em;">返回</el-button>
          </div>

        </div>
      </template>
      <div class="card-content">
        <div class="detail-item">
          <span class="label">维修单号：</span>
          <span>{{ repairItem.maintenance_item_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">车牌号：</span>
          <span>{{ repairItem.plate_number }}</span>
        </div>
        <div class="detail-item">
          <template v-if="isEditing">
            <div class="flex-container">
              <div class="flex-item">
                <span style="fontSize: '1.2em'; font-weight: bold">预约地点：</span>
              </div>
              <div class="flex-item flex-input">
                <el-input v-model="changeItem.maintenance_location" />
              </div>
              <div class="flex-item">
                <el-button type="primary" @click="openMapDia = true">{{ '地图选点' }}</el-button>
              </div>
            </div>
          </template>

          <template v-else>
            <span class="label">预约地点：</span>
            <span>{{ repairItem.maintenance_location }}</span>
          </template>
        </div>

        <div class="detail-item">
          <template v-if="isEditing">
            <div class="flex-container">
              <div class="flex-item">
                <span style="fontSize: '1.2em'; font-weight: bold">预约时间：</span>
              </div>
              <div class="flex-item flex-input">
                <el-date-picker v-model="changeItem.appoint_time" type="datetime" placeholder="选择日期和时间" value-format="YYYY-MM-DD HH:mm:ss" />
              </div>
            </div>
          </template>
          <template v-else>
            <span class="label">预约时间：</span>
            <span>{{ repairItem.appoint_time }}</span>
          </template>
        </div>

        <div class="detail-item">
          <span class="label">订单提交时间：</span>
          <span>{{ repairItem.order_submission_time }}</span>
        </div>

        <div class="detail-item">
          <span class="label">服务时间：</span>
          <span>{{ repairItem.service_time }}</span>
        </div>

        <div class="detail-item">
          <span class="label">完成状态：</span>
          <template v-if="repairItem.order_status === '待接单'">
            <el-button type="primary" disabled>待接单</el-button>
          </template>
          <template v-if="repairItem.order_status === '待完成'">
            <el-button type="info" disabled>待完成</el-button>
          </template>
          <template v-if="repairItem.order_status === '待评价'">
            <el-button type="warning" disabled>待评价</el-button>
          </template>
          <template v-if="repairItem.order_status === '已完成'">
            <el-button type="success" disabled>已完成</el-button>
          </template>
        </div>

        <div class="detail-item">
          <span class="label">订单备注：</span>
          <template v-if="isEditing">
            <el-input v-model="changeItem.remarks" :rows="4" type="textarea" placeholder="订单备注" />
          </template>

          <template v-else>
            <span>{{ repairItem.remarks }}</span>
          </template>
        </div>

        <div class="detail-item">
          <span class="label">服务员工：</span>
          <span>{{ repairItem.name }}</span>
          <span class="phone-number">{{ repairItem.phone_number }}</span>
        </div>

        <div class="detail-item">
          <!-- <div class="label">评分：<span v-show="repairItem.order_status === '待评价'||repairItem.order_status === '已完成'">{{ repairItem.score }}</span></div> -->
          <div class="label">评分</div>
          <div v-if="repairItem.order_status === '待接单' || repairItem.order_status === '待完成'">
            订单未完成，暂不能评分
          </div>
          <div v-else-if="repairItem.order_status === '已完成'">
            <el-rate v-model="repairItem.score" disabled :show-score="true" text-color="#ff9900" />
          </div>
          <template v-else>
            <el-rate v-model="changeItem.score" :disabled="disableInput" allow-half />
          </template>

        </div>

        <!-- 评价框 -->
        <template v-if="disableShow">
          <div class="label">评价：</div>
          <el-input disabled :placeholder="repairItem.evaluations">{{ repairItem.evaluations }}</el-input>
        </template>
        <template v-else>
          <div class="label">评价：</div>
          <el-input v-model="changeItem.evaluations" type="textarea" rows="4"
            :placeholder="disableInput ? '订单未完成，不可评价' : '请输入您的评价'" :disabled="disableInput" />
        </template>

        <div class="button-container">
          <el-button v-if="disableInput3" type="primary" @click="submitComment" :disabled="disableInput">提交评价</el-button>
          <el-button v-else type="primary" @click="handleChange">{{ isEditing ? '完成修改' : '修改订单' }}</el-button>
          <el-button v-show="showCancelChangeButton" type="warning" @click="cancelChangeButton">取消修改</el-button>
          <el-button v-show="!showCancelChangeButton" type="danger" @click="cancelItem" :disabled="disableInput2">取消订单</el-button>
        </div>


        <!-- 地图选点 -->
        <el-dialog v-model="openMapDia" title="地图选点" width="40%" @open="mapOpen" draggable>

          <div class="map-wrapper">
            <div id="myMap" style="width:100%;height:300px"></div>
          </div>
          <div class="address">
            {{ "当前地址：" + changeItem.maintenance_location }}
          </div>
          <div class="button-wrapper">
            <el-button type="primary" @click="openMapDia = false">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex';
import { Back } from '@element-plus/icons-vue';

// import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';

const openMapDia = ref(false);
const loadMapButton = ref(true);
const loading = ref(false);
const isEditing = ref(false);

const router = useRouter();
const route = useRoute();
const store = useStore();
/*
const repairItem = reactive({
  maintenance_item_id: route.params.val,
  plate_number: '沪E6666',
  title: '补胎',
  order_submission_time: '2000-02-06',
  service_time: '',
  order_status: '待接单',
  remarks: '芝士备注',
  name: 'ccr',
  phone_number: '1399999999',
  score: 4.0,
  evaluations: '哈哈哈啊哈',
  appoint_time: '2000-02-06',
  maintenance_location: '这是地点',
  longitude: 121.21633041361302,
  latitude: 31.268357562330195
})*/

onMounted(() => {
  window.addEventListener('unload', saveState);
});
const saveState = () => {
  sessionStorage.setItem('state', store.state.maintenanceItemId);
}
const repairItem = reactive({
  // maintenance_item_id: route.params.val,
  maintenance_item_id: store.state.maintenanceItemId,
  plate_number: '',
  title: '',
  order_submission_time: '',
  service_time: '',
  order_status: '',
  remarks: '',
  name: '',
  phone_number: '',
  score: 0,
  evaluations: '',
  appoint_time: '',
  maintenance_location: '',
  longitude: 0,
  latitude: 0,
})

const goBack = () => {
  router.push('/repair');
}

const disableInput = computed(() => {
  return repairItem.order_status === '待评价' ? false : true;
})
const disableInput2 = computed(() => {
  return repairItem.order_status === '待接单'||repairItem.order_status === '待完成' ? false : true;
})
const disableInput3 = computed(() => {
  return repairItem.order_status === '待评价' || repairItem.order_status === '已完成' ? true : false;
})
const disableShow = computed(() => {
  return repairItem.order_status === '已完成' ? true : false;
})

const changeItem = ref({
  remarks: repairItem.remarks,
  appoint_time: repairItem.appoint_time,
  maintenance_location: repairItem.maintenance_location,
  longitude: repairItem.longitude,
  latitude: repairItem.latitude,
  evaluations: repairItem.evaluations,
  score: repairItem.score
})

const cancelChange = () => {
  changeItem.value.remarks = repairItem.remarks;
  changeItem.value.appoint_time = repairItem.appoint_time;
  changeItem.value.maintenance_location = repairItem.maintenance_location;
  changeItem.value.longitude = repairItem.longitude;
  changeItem.value.latitude = repairItem.latitude;
  changeItem.value.evaluations = repairItem.evaluations;
  changeItem.value.score =  repairItem.score;
}

const cancelChangeButton = () => {
  cancelChange();
  getDetailedData();
  isEditing.value=!isEditing.value;
  showCancelChangeButton.value = !showCancelChangeButton.value;
}

const showCancelChangeButton = ref(false);

const handleChange = () => {
  showCancelChangeButton.value = true;
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 在点击“完成修改”按钮后执行的逻辑
    submitChange();
  }
}

const mapOpen = () => {
  const BMap = window.BMap;
  var map = new BMap.Map("myMap");
  var point = new BMap.Point(changeItem.value.longitude, changeItem.value.latitude)
  map.centerAndZoom(new BMap.Point(changeItem.value.longitude, changeItem.value.latitude), 12);
  map.enableScrollWheelZoom(true);
  var geoc = new BMap.Geocoder();
  var marker = new BMap.Marker(point);
  map.addOverlay(marker);

  map.addEventListener("click", (e) => {
    var pt = e.point;
    geoc.getLocation(pt, (rs) => {
      changeItem.value.maintenance_location = rs.address
    });
    map.removeOverlay(marker);
    marker = null;
    point.lng = e.point.lng;
    point.lat = e.point.lat;
    marker = new BMap.Marker(point);
    map.addOverlay(marker);
    //lz
    changeItem.value.longitude = point.lng;
    changeItem.value.latitude = point.lat;
  });

}

const getDetailedData = () => {
  loading.value = true;
  cmRequest.request({
    url: 'api/owner/repair_reservation/query',
    method: 'GET',
    params: {
      maintenance_item_id: repairItem.maintenance_item_id
    }
  }).then((res) => {
    if (!res.code) {
      
      //进行赋值操作
      repairItem.plate_number = res.data.plate_number;
      repairItem.title = res.data.title;
      repairItem.order_submission_time = res.data.order_submission_time;
      repairItem.service_time = res.data.service_time;
      repairItem.order_status = res.data.order_status;
      repairItem.remarks = res.data.remarks !== null ? res.data.remarks : '';

      /* 旧版 */
      //repairItem.name = res.data.name;
      //repairItem.phone_number = res.data.phone_number;
      
      /* 新版 */
      repairItem.name = '';
      for(let i =0;i<res.data.ep_date.length;i++)
      {
        repairItem.name += res.data.ep_date[i].name + '(' + res.data.ep_date[i].phone_number + ')  ';
      }

      repairItem.score = res.data.score;
      repairItem.evaluations = res.data.evaluations;
      repairItem.appoint_time = res.data.appoint_time;
      repairItem.maintenance_location = res.data.maintenance_location;
      repairItem.longitude = res.data.longitude;
      repairItem.latitude = res.data.latitude;
      //repairItem.name = res.data.ep_date[0].name + '  ' + res.data.ep_date[0].phone_number;
      cancelChange();
    }
    else {
      ElMessage({
        type: 'error',
        message: '获取维修项失败'
      })
    }
    loading.value = false;
  })

}
getDetailedData();

const submitChange = () => {
  loading.value = true;
  cmRequest.request({
    url: 'api/owner/repair_reservation/update',
    method: 'PATCH',
    data: {
      maintenance_item_id: repairItem.maintenance_item_id.toString(),
      remarks: changeItem.value.remarks,
      appoint_time: changeItem.value.appoint_time,
      maintenance_location: changeItem.value.maintenance_location,
      longitude: changeItem.value.longitude,
      latitude: changeItem.value.latitude
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '修改订单成功',
      })
      getDetailedData();
      loading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '修改订单失败'
      })
      loading.value = false;
    }
  })
}

const cancelItem = () => {
  ElMessageBox.confirm(
    '您确定要删除这个维修项吗',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    cmRequest.request({
      url: 'api/owner/reparir_reservation/delete',
      method: 'DELETE',
      params: {
        maintenance_item_id: repairItem.maintenance_item_id
      }
    })
      .then((res) => {
        if (!res.code) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          goBack();
        }
        else {
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        }
      })
  })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
}

const submitComment = () => {
  loading.value = true;
  cmRequest.request({
    url: 'api/owner/repair_reservation/update',
    method: 'PATCH',
    data: {
      maintenance_item_id: repairItem.maintenance_item_id,
      evaluations: changeItem.value.evaluations,
      score: changeItem.value.score
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '评价提交成功',
      })
      getDetailedData();
      loading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '评价提交失败',
      })
      loading.value = false;
    }
  })
}

</script>

<style scoped>
.custom-text {
  font-size: 1em;
  /* 调整字体大小 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-name {
  flex: 1;
  font-size: 1.6em;
  margin-bottom: 7px;
}

.page-container {
  margin-top: 20px;
  /* 控制整体上边距 */
}

.card-container {
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.card-content {
  padding: 15px;
}

.detail-item {
  margin-bottom: 1.5em;
}

.detail-item span {
  font-size: 1.2em;
}

.label {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.button-container {
  margin-bottom: 1em;
  display: flex;
  margin-top: 1em;
}

/* 用于间隔按钮的空白元素样式 */
.button-space {
  width: 60px;
  /* 调整间隔宽度 */
}

.phone-number {
  margin-left: 10px;
  /* 添加姓名和电话之间的间隔 */
}

.readonly-evaluation {
  /* 样式用于只读的文本内容 */
  /* 可以添加样式来适配你的设计 */
  color: #333;
  padding: 6px 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.flex-container {
  display: flex;
  /*justify-content: space-between;*/
  /* 在元素之间均匀分布空间 */
  align-items: center;
  /* 垂直居中对齐元素 */
  gap: 1em;
  /* 元素之间的水平间距，根据需要调整 */
}

.flex-item {
  /*flex: 1;*/
  display: flex;
  align-items: center;
}

.flex-input {
  flex: 2;
  /* 更大的flex值，分配更多剩余空间给输入框 */
}</style>