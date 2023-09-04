<template>
  <div class="page-container">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3 custom-text"> 维修订单详情 </span>
      </template>
    </el-page-header>
  </div>

  <div class="card-container" v-loading="loading">
    <el-card shadow="always">
      <template #header>
        <div class="card-header">
          <span class="header-name">
            {{ repairItem.title }}
          </span>
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
            <el-col :span="4"><span :style="{ fontSize: '1.3em' }">预约地点:</span></el-col>
            <el-col :span="16">
              <el-input v-model="repairItem.maintenance_location"
                />
            </el-col>
            <el-col :span="4">
              <el-button type="primary"  @click="openMapDia = true">
                {{ '地图选点' }}</el-button>
            </el-col>
          </template>

          <template v-else>
            <span class="label">预约地点：</span>
            <span>{{ repairItem.maintenance_location }}</span>
          </template>
        </div>

        <div class="detail-item">
          <template v-if="isEditing">
            <el-col :span="4"><span :style="{ fontSize: '1.3em' }">预约时间：</span></el-col>
            <el-col :span="20">
              <el-date-picker v-model="repairItem.appoint_time" type="datetime" placeholder="选择日期和时间" />
            </el-col>
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
          <template v-if="repairItem.order_status === '待评分'">
            <el-button type="warning" disabled>待评分</el-button>
          </template>
          <template v-if="repairItem.order_status === '已完成'">
            <el-button type="success" disabled>已完成</el-button>
          </template>
        </div>

        <div class="detail-item">
          <span class="label">订单备注：</span>
          <template v-if="isEditing">
            <el-input v-model="repairItem.remarks" :rows="4" type="textarea" placeholder="订单备注" />
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
          <div class="label">评分：</div>
          <template v-if="disableShow">
            <el-rate v-model="repairItem.score" disabled :show-score="true" text-color="#ff9900"
               />
          </template>
          <template v-else>
            <el-rate v-model="repairItem.score" :disabled="disableInput" allow-half />
          </template>
        </div>

        <!-- 评价框 -->
        <template v-if="disableShow">
          <div class="label">评价：</div>
          <div class="readonly-evaluation">{{ repairItem.evaluations }}</div>
        </template>
        <template v-else>
          <div class="label">评价：</div>
          <el-input v-model="repairItem.evaluations" type="textarea" rows="4"
            :placeholder="disableInput ? '订单未完成，不可评价' : '请输入您的评价'" :disabled="disableInput" />
        </template>

        <div class="button-container">
          <el-button v-if="disableInput3" type="primary" @click="submitComment" :disabled="disableInput">提交评价</el-button>
          <el-button v-else type="primary" @click="handleChange">{{ isEditing ? '完成修改' : '修改订单' }}</el-button>
          <div class="button-space"></div> <!-- 添加一个用于间隔的空白元素 -->
          <el-button type="danger" @click="cancelItem" :disabled="disableInput2">取消订单</el-button>
        </div>


        <!-- 地图选点 -->
        <el-dialog v-model="openMapDia" title="地图选点" width="40%" @open="mapOpen" draggable>

          <div class="map-wrapper">
            <div id="myMap" style="width:100%;height:300px"></div>
          </div>
          <div class="address">
            {{ "当前地址：" + repairItem.maintenance_location }}
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
  longtitude: 121.21633041361302,
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
  longtitude: 0,
  latitude: 0
})

const goBack = () => {
  router.push('/repair');
}

const disableInput = computed(() => {
  return repairItem.order_status === '待评分' ? false : true;
})
const disableInput2 = computed(() => {
  return repairItem.order_status === '待接单' ? false : true;
})
const disableInput3 = computed(() => {
  return repairItem.order_status === '待评分'||repairItem.order_status === '已完成' ? true : false;
})
const disableShow = computed(() => {
  return repairItem.order_status === '已完成' ? true : false;
})

const handleChange = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 在点击“完成修改”按钮后执行的逻辑
    submitChange();
  }
}

const mapOpen = () => {
  const BMap = window.BMap;
  var map = new BMap.Map("myMap");
  console.log("map open");
  var point = new BMap.Point(repairItem.longtitude, repairItem.latitude)
  map.centerAndZoom(new BMap.Point(repairItem.longtitude, repairItem.latitude), 12);
  map.enableScrollWheelZoom(true);
  var geoc = new BMap.Geocoder();
  var marker = new BMap.Marker(point);
  map.addOverlay(marker);

  map.addEventListener("click", (e) => {
    var pt = e.point;
    geoc.getLocation(pt, (rs) => {
      repairItem.maintenance_location = rs.address
      console.log(rs.address);
    });
    map.removeOverlay(marker);
    marker = null;
    point.lng = e.point.lng;
    point.lat = e.point.lat;
    marker = new BMap.Marker(point);
    map.addOverlay(marker);
    //lz
    console.log("lng:", point.lng);
    console.log("lat:", point.lat);
    repairItem.longtitude = point.lng;
    repairItem.latitude = point.lat;
    console.log("up lo:", repairItem.longtitude);
    console.log("up lo:", repairItem.latitude);
  });

}

const getDetailedData = () => {
  loading.value = true;
  console.log(repairItem.maintenance_item_id)
  cmRequest.request({
    url: 'api/owner/repair_reservation/query',
    method: 'GET',
    params: {
      maintenance_item_id: repairItem.maintenance_item_id
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '获取维修项成功'
      })
      //进行赋值操作
      repairItem.plate_number = res.data.plate_number;
      repairItem.title = res.data.title;
      repairItem.order_submission_time = res.data.order_submission_time;
      repairItem.service_time = res.data.service_time;
      repairItem.order_status = res.data.order_status;
      repairItem.remarks = res.data.remarks;

      /* 旧版 */
      repairItem.name = res.data.name;
      repairItem.phone_number = res.data.phone_number;
      
      /* 新版 */
      /*for(let i =0;i<res.data[0].ep_data.length();i++)
      {
        repairItem.name += res.data[0].ep_data[i].name + '(' + res.data[0].ep_data[i].phone_number + ')  ';
      }
      console.log("repairItem.name:",repairItem.name);

      repairItem.score = res.data.score;
      repairItem.evaluations = res.data.evaluations;
      repairItem.appoint_time = res.data.appoint_time;
      repairItem.maintenance_location = res.data.maintenance_location;
      repairItem.longtitude = res.data.longtitude;
      repairItem.latitude = res.data.latitude;*/
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

const submitChange=()=>{
  cmRequest.request({
    url: 'api/owner/repair_reservation/update',
    method: 'POST',
    data: {
      maintenance_item_id: repairItem.maintenance_item_id,
      remarks : repairItem.remarks,
      appoint_time : repairItem.appoint_time,
      maintenance_location : repairItem.maintenance_location,
      longtitude : repairItem.longtitude,
      latitude : repairItem.latitude
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
          type: 'success',
          message: '修改订单成功',
        })
    }
    else {
      ElMessage({
        type: 'error',
        message: '修改订单失败'
      })
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
  cmRequest.request({
    url: 'api/owner/repair_reservation/update',
    method: 'POST',
    data: {
      maintenance_item_id: repairItem.maintenance_item_id,
      evaluations: repairItem.evaluations,
      score:repairItem.score
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '评价添加成功',
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: '评价添加失败',
      })
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
  font-size: 1.6em;
  margin-bottom: 7px;
}

.page-container {
  margin-top: 20px;
  /* 控制整体上边距 */
}

.card-container {
  margin-top: 20px;
  /* 控制卡片容器上边距 */
}

.card-content {
  padding: 15px;
}

.detail-item {
  margin-bottom: 1.5em;
}

.label {
  font-weight: bold;
  margin-bottom: 10px;
}

.button-container {
  margin-bottom: 5em;
  display: flex;
  margin-top: 30px;
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
</style>