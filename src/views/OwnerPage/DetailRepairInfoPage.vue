<template>
  <div class="page-container">
    <el-page-header  @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3 custom-text"> 维修服务 </span>
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
          <span class="label">维修车辆id：</span>
          <span>{{ repairItem.vehicle_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">车牌号：</span>
          <span>{{ repairItem.plate_number }}</span>
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
          <span>{{ repairItem.order_status }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单备注：</span>
          <span>{{ repairItem.remarks }}</span>
        </div>
        <div class="detail-item">
          <span class="label">服务员工：</span>
          <span>{{ repairItem.name }}</span>
          <span class="phone-number">{{ repairItem.phone_number }}</span>
        </div>
  
        <!-- 评价框 -->
        <div class="detail-item">
          <div class="label">评价：</div>
          <el-input v-model="repairItem.evaluations" type="textarea" rows="4" 
          :placeholder="disableInput ? '订单未完成，不可评价':'请输入您的评价'" :disabled="disableInput" />
        </div>
        
        <div class="button-container">
          <el-button type="primary" @click="submitComment" :disabled="disableInput">提交评价</el-button>
          <el-button type="danger" @click="cancelItem" :disabled="!disableInput">取消订单</el-button>
        </div>
      </div>
    </el-card>
  </div>
  

  
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
// import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';

const getItem = reactive({})
const loading = ref(false)

const router = useRouter();
const route = useRoute();

const repairItem = reactive({
  maintenance_item_id: route.params.val,
  vehicle_id: '123456',
  plate_number: '沪E6666',
  title: '补胎',
  order_submission_time: '',
  service_time: '',
  order_status: '否',
  remarks: '芝士备注',
  name: 'ccr',
  phone_number: '1399999999',
  evaluations:'',
})

const goBack = () => {
  router.push('/repair');
}

const disableInput = computed(() => {
  return repairItem.order_status === '否' ? true : false;
})

const getDetailedData = () => {
    cmRequest.request({
      url: 'api/owner/vehicle_maintenance_info/query',
      method: 'GET',
      params: {
        maintenance_item_id: repairItem.maintenance_item_id
      }
    }).then((res) => {
      if(!res.code){
        getItem.value = res.data;
        for(const key in getItem){
          repairItem[key] = getItem[key];
        }
      }
      else{
        ElMessage({
        type: 'error',
        message: '获取维修项失败'
      })
      }
    })
    loading.value = false;
  }
getDetailedData();

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
        url: 'api/owner/repair_reservation/submit_evaluations',
        method: 'POST',
        data:{
          maintenance_item_id: repairItem.maintenance_item_id,
          evaluations: repairItem.evaluations
        }
      }).then((res)=>{
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
  font-size: 1.5em; /* 调整字体大小 */
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
  margin-top: 20px; /* 控制整体上边距 */
}
.card-container {
  margin-top: 20px; /* 控制卡片容器上边距 */
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
  margin-top: 20px;
}

.phone-number {
  margin-left: 10px; /* 添加姓名和电话之间的间隔 */
}
.inner-block {
  padding: 20px 20px 60px 20px;
}

.inner-block2 {
  padding: 20px 20px 30px 20px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto;
  background-color: white;
  margin: 30px 20px;
}

.input-box {
  width: 100%;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>