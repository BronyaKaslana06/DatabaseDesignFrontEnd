<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 换电服务 </span>
            </template>
        </el-page-header>

        <div class="block">
        <div class="inner-block2">
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="订单ID">
                  <el-input v-model="infoForm.switch_request_id" class="input-box"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车辆ID">
                  <el-input v-model="infoForm.vehicle_id" class="input-box"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="换电类型">
                  <el-input v-model="infoForm.switch_type" class="input-box"></el-input>
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
                        换电记录
                    </div>
                    <!-- 日期选择 -->
                    <div class="date-picker-wrapper">
                        <el-date-picker v-model="timeValue" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                            format="YYYY 年 MM 月 DD 日" :shortcuts="shortcuts" @change="getDate">
                        </el-date-picker>
                    </div>

                </div>
                <div class="infinite-list-wrapper" style="overflow:auto">
                    <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
                        <li v-for="item in listdata" :key="item.switch_request_id" class="list-item">
                            <div class="list-item-content">
                                <div class="list-item-image">
                                    <img src="@/assets/repair.png" alt="Image" />
                                </div>
                                <div class="list-item-text">
                                    <p class="title">{{ item.title }}</p>
                                    <p class="location-date">{{ item.switch_type }} - {{ item.request_time
                                    }}</p>
                                </div>
                                <div class="list-item-button">
                                    <el-button text :icon="Document"
                                        @click="Detail(item.switch_request_id)">查看详情</el-button>
                                  
                                </div>
                            </div>
                        </li>
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
import { ElMessage, ElButton, ElSelect, ElOption } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';



const infoForm = reactive({
    employee_id:'',
    switch_request_id: '',
    vehicle_id: '',
    switch_type: '',
    request_time:'',
    remarks:'',
    startDate:'',
    endDate:''
});

const queryData=()=>{
    cmRequest.request({
      url: '/api/staff/my-info/switch-records/{employee_id}',      
      method: 'GET',
      params: {
        employee_id:infoForm.employee_id,
        switch_request_id:infoForm.switch_request_id,
        vehicle_id:infoForm.vehicle_id,
        switch_type:infoForm.switch_type,
        startDate:infoForm.startDate,
        endDate:infoForm.endDate
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        listdata.value=res.data;
      }
      else{
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

const router = useRouter();
const Detail = (maintenanceItemId) => {
    // Perform the desired action using the maintenanceItemId parameter
    console.log('Editing item with ID:', maintenanceItemId);
    router.push({
        name: 'staffRepair',
        params: { val: maintenanceItemId }
    });
};


</script>

<style scoped>
.custom-text {
    font-size: 1.5em; /* 调整字体大小 */
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

  .infinite-list-wrapper .title {
    font-weight: bold;
  }

  .infinite-list-wrapper .location-date {
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