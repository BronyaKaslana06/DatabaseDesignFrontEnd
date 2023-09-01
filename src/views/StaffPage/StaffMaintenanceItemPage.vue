<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3 custom-text"> 维修服务 </span>
      </template>
    </el-page-header>

    <div class="block">
      <div class="inner-block2">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单状态">
                <el-select v-model="infoForm.order_status">
                  <el-option key="1" value="待完成" label="待完成"> </el-option>
                  <el-option key="2" value="待评分" label="待评分"> </el-option>
                  <el-option key="3" value="已完成" label="已完成"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-wrapper">
          <el-button @click="queryData">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="block">
      <div class="inner-block2">
        <div class="top-right">
          <div class="maintenance-title">
            维修记录
          </div>
          <!-- 日期选择 -->
          <div class="date-picker-wrapper">
            <el-date-picker v-model="timeValue" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" format="YYYY 年 MM 月 DD 日"
              :shortcuts="shortcuts" @change="getDate">
            </el-date-picker>
          </div>
        </div>
        <div class="infinite-list-wrapper" style="overflow:auto">
          <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
            <li v-for="item in listdata" :key="item.maintenance_items_id" class="list-item">
              <div class="list-item-content">
                <div class="list-item-image">
                  <img src="@/assets/repair.png" alt="Image" />
                </div>
                <div class="list-item-text">
                  <p class="title">{{ item.title }}</p>
                  <p class="location-date">{{ item.maintenance_location }} - {{ item.order_submission_time
                  }}</p>
                </div>
                <div class="list-item-button">
                  <el-button text :icon="Document" @click="Detail(item)">查看详情</el-button>
                </div>
              </div>
            </li>
            <el-dialog v-model="dialogVisible" title="订单详情" width="50%">
              <div class="container-vertical" v-loading="item_loading">
                <div class="left-info-part">
                  <div class="detail-info">
                    <p>订单编号：{{ selectedItemId }}</p>
                    <p>车牌号：{{ maintenance_item_detail.plate_number }}</p>
                    <p>车型：{{ maintenance_item_detail.vehicle_model }}</p>
                    <p>用户姓名：{{ maintenance_item_detail.user_name }}</p>
                    <p>电话：{{ maintenance_item_detail.phone_number }}</p>
                    <p>地点：{{ maintenance_item_detail.maintenance_location }}</p>
                    <p>提交时间：{{ maintenance_item_detail.order_submission_time }}</p>
                    <p>备注：{{ maintenance_item_detail.remarks?maintenance_item_detail.remarks:"无" }}</p>
                    <p>服务时间：{{ status_number>2?maintenance_item_detail.service_time:"未进行服务" }}</p>
                    <p>评价：{{ status_number>3?maintenance_item_detail.evaluations:"用户未作出评价" }}</p>
                    <p>评分：{{ status_number>3?maintenance_item_detail.score:"暂无评分" }}</p>
                  </div>
                </div>
                <div class="steps-part" style="height: 20em">
                  <el-steps direction="vertical" :active="status_number">
                    <el-step title="待接单" />
                    <el-step title="待完成" />
                    <el-step title="待评分" />
                    <el-step title="已完成" />
                  </el-steps>
                </div>
              </div>

            </el-dialog>
          </ul>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption, ElDialog } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const infoForm = reactive({
  order_status: '',
  startDate: '',
  endDate: ''
});

const queryData = () => {
  cmRequest.request({
    url: 'api/staff/my-info/repair-records/query',
    method: 'GET',
    params: {
      //employee_id: localStorage.getItem('user_id'),
      employee_id:"12",
      order_status: infoForm.order_status,
      startDate: infoForm.startDate,
      endDate: infoForm.endDate
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      listdata.value = res;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
};


const timeValue = ref('');


const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const getDate = ([startDate, endDate]) => {
  console.log('开始日期:', startDate);
  console.log('结束日期:', endDate);
  infoForm.startDate = startDate;
  infoForm.endDate = endDate;
  //写接口，进行搜索
  queryData();
};

const listdata = ref([]);
const count = ref(4)
const loading = ref(false)
const noMore = computed(() => count.value >= listdata.value.length)
const disabled = computed(() => loading.value || noMore.value)
const load = () => {
  console.log("Scroll event triggered");
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 2000)
}

const goBack = () => {
  // 使用 Vue Router 的 go(-1) 方法返回上一个访问的页面
  router.go(-1);
};

const dialogVisible = ref(false);
const selectedItemId = ref('');
const status_number = ref(2);
const item_loading =ref(true);
const maintenance_item_detail = ref({
  plate_number: '',
  maintenance_location: '',
  order_status: '',
  remarks: '',
  evaluations: '',
  order_submission_time: '',
  service_time: '',
  vehicle_model: '',
  phone_number: '',
  username: '',
  score:'',
  title: ''

})

const Detail = (Item) => {
  dialogVisible.value = true;
  selectedItemId.value = Item.maintenance_items_id;

  switch (Item.order_status) {
    case "待完成":
      status_number.value = 2;
      break;
    case "待评分":
      status_number.value = 3;
      break;
    case "已完成":
      status_number.value = 4;
      break;
    default:
      status_number.value = 0;
  }
  get_maintenance_info(Item.maintenance_items_id);

}

const get_maintenance_info = (id) => {
  maintenance_item_detail.value = {};
  cmRequest.request({
    //url: 'api/staff/maintanence/detail',
    url: 'api/staff/my-info/repair-records/MessageDetail',
    method: 'GET',
    params: {
      maintenance_item_id: id
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '查看订单成功',
      })
      maintenance_item_detail.value = res;
      item_loading.value=false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '查看订单失败',
      })
      item_loading.value=false;
    }
  })
}




</script>

<style scoped>
.custom-text {
  font-size: 1.5em;
  /* 调整字体大小 */
}

.block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto;
  background-color: white;
  margin: 30px 20px;
}

.inner-block {
  padding: 20px 20px 30px 20px;
}

.inner-block2 {
  padding: 20px 20px 60px 20px;
}

.maintenance-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.date-picker-wrapper {

  text-align: right;
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

.infinite-list-wrapper .list-item+.list-item {
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

.infinite-list-wrapper .title {
  font-weight: bold;
}

.infinite-list-wrapper .location-date {
  font-size: 14px;
  color: #999;
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

.detail-info {
  flex: 70%;
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

.steps-part {
  flex: 30%;
  margin-left: 2em;
}
</style>