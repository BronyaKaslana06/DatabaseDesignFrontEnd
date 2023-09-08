<template>
  <div v-if="staff_type === '1'">
    <div>
      <!-- <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3 custom-text"> 换电服务 </span>
      </template>
    </el-page-header> -->

      <div class="upper-block">
        <div class="inner-block2">
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="换电类型">
                  <el-select v-model="infoForm.switch_type">
                    <el-option key="1" value="" label="所有类型"> </el-option>
                    <el-option key="1" value="上门换电" label="上门换电"> </el-option>
                    <el-option key="2" value="到店换电" label="到店换电"> </el-option>
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

      <div class="down-block">
        <div class="inner-block2">
          <div class="top-right">
            <div class="maintenance-title">
              换电记录
            </div>
            <!-- 日期选择 -->
            <div class="date-picker-wrapper">
              <el-date-picker v-model="timeValue" type="daterange" align="right" unlink-panels range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" format="YYYY 年 MM 月 DD 日"
                :shortcuts="shortcuts" @change="getDate">
              </el-date-picker>
            </div>
          </div>
          <div class="infinite-list-wrapper" style="overflow:auto flex:1;" v-loading="listLoading">
            <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
              <li v-for="item in listdata" :key="item.switch_record_id" class="list-item" style="cursor: pointer"
                @click="Detail(item)">
                <div class="list-item-content">
                  <div class="list-item-image">
                    <img src="@/assets/switch.png" alt="Image" />
                  </div>
                  <div class="list-item-text">
                    <p class="title">换电记录{{ item.switch_record_id }}</p>
                    <p class="type-date">预约时间：{{ item.switch_time
                    }}</p>
                  </div>
                  <div class="list-item-button" style="margin-right: 3em;">
                    <!-- <el-button text :icon="Document" @click="Detail(item)">查看详情</el-button> -->
                    <template v-if="item.request_status === '待评价'">
                      <el-button type="warning" disabled>待评价</el-button>
                    </template>
                    <template v-if="item.request_status === '已完成'">
                      <el-button type="success" disabled>已完成</el-button>
                    </template>
                  </div>
                </div>
              </li>
              <el-dialog v-model="dialogVisible" title="订单详情" width="50%">
                <div class="container-vertical" v-loading="item_loading">
                  <div class="left-info-part">
                    <div class="detail-info">
                      <p><strong>订单编号：</strong>{{ selectedItemId }}</p>
                      <p><strong>车牌号：</strong>{{ switch_item_detail.plate_number }}</p>
                      <p><strong>车型：</strong>{{ switch_item_detail.vehicle_model }}</p>
                      <p><strong>用户名：</strong>{{ switch_item_detail.username }}</p>
                      <p><strong>电话：</strong>{{ switch_item_detail.phone_number }}</p>
                      <p><strong>换电站：</strong>{{ switch_item_detail.station_name }}</p>
                      <p><strong>换电时间：</strong>{{ switch_item_detail.switch_time }}</p>
                      <p><strong>换电类型：</strong>{{ switch_item_detail.switch_type }}</p>
                      <p><strong>换上电池ID：</strong>{{ switch_item_detail.battery_id_on }}</p>
                      <p><strong>换上电池型号：</strong>{{ switch_item_detail.battery_type_on }}</p>
                      <p><strong>换下电池ID：</strong>{{ switch_item_detail.battery_id_off }}</p>
                      <p><strong>换下电池型号：</strong>{{ switch_item_detail.battery_type_off }}</p>
                      <p><strong>评价：</strong>{{ switch_item_detail.evaluations === '' ? '暂无评价' :
                        switch_item_detail.evaluations }}
                      </p>
                      <p><strong>评分：</strong>{{ switch_item_detail.score === -1 ? '暂无评分' : switch_item_detail.score }}</p>
                    </div>
                  </div>
                  <div class="steps-part" style="height: 20em">
                    <el-steps direction="vertical" :active='calculateStep(switch_item_detail.request_status)'>
                      <el-step title="待接单" />
                      <el-step title="待完成" />
                      <el-step title="待评价" />
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
  </div>
  <div v-else style="display: flex; justify-content: center;">
    <div style="display: flex; align-items: center;  flex-direction: column;">
      <div style="font-weight: bold; color: black; margin: 2em; font-size: 2em;">
        您不是换电站管理员，不可以查看换电站电池
      </div>
      <img src="../../assets/background.svg" style="width: 100%; height: auto; flex: 1;">
    </div>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';
const staff_type = ref(localStorage.getItem('staff_type'));

const infoForm = reactive({
  switch_type: '',
  startDate: '',
  endDate: ''
});

const listLoading = ref(false);

const queryData = () => {
  listLoading.value = true;
  cmRequest.request({
    url: 'api/staff/my-info/switch-records/query',
    method: 'GET',
    params: {
      employee_id: localStorage.getItem('user_id'),
      switch_type: infoForm.switch_type,
      startDate: infoForm.startDate,
      endDate: infoForm.endDate,
    }
  }).then((res) => {
    if (!res.code) {
      // ElMessage({
      //   type: 'success',
      //   message: '刷新成功',
      // })
      listdata.value = res;
      listLoading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
};
queryData();


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
const item_loading = ref(true);
const switch_item_detail = ref({
  plate_number: '',
  position: '',
  evaluations: '',
  switch_time: '',
  username: '',
  vehicle_model: '',
  phone_number: '',
  score: '',
  battery_id_on: '',
  battery_type_on: '',
  battery_id_off: '',
  battery_type_off: '',
  switch_type: '',
  request_status: '',
})

const calculateStep = (step) => {
  if (step == "待接单")
    return 1;
  if (step == "待完成")
    return 2;
  if (step == "待评价")
    return 3;
  if (step == "已完成")
    return 4;
}

const Detail = (Item) => {
  dialogVisible.value = true;
  selectedItemId.value = Item.switch_record_id;
  get_switch_info(Item.switch_record_id);
}

const get_switch_info = (id) => {
  item_loading.value = true;
  switch_item_detail.value = {};
  cmRequest.request({
    url: 'api/staff/switch_record/itemDetail',
    method: 'GET',
    params: {
      switch_record_id: id
    }
  }).then((res) => {
    if (!res.code) {
      // ElMessage({
      //   type: 'success',
      //   message: '查看订单成功',
      // })
      switch_item_detail.value = res;
      item_loading.value = false;
    }
    else {
      ElMessage({
        type: 'error',
        message: '查看订单失败',
      })
      item_loading.value = false;
    }
  })
}


</script>

<style scoped>
.custom-text {
  font-size: 1.5em;
  /* 调整字体大小 */
}

.down-block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto;
  background-color: white;
  margin: 1em 1em;
  height: 65vh;
  display: flex;
  /* 使用Flex布局 */
  flex-direction: column;
  /* 纵向排列 */
}

.upper-block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: hidden;
  background-color: white;
  margin: 1em 1em;
  height: 15vh;
}

.inner-block2 {
  padding: 1em 1em 1em 1em;
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

.list-item{
  transition: all 0.3s;
  padding-top: 10px;
}
.list-item:hover {
  background-color: #e8e8e8;
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

.infinite-list-wrapper .type-date {
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

.steps-part {
  flex: 30%;
  margin-left: 2em;
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
</style>