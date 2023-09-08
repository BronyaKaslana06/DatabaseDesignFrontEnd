<template>
  <div>
    <!-- <el-page-header :icon="ArrowLeft">
            <template #content>
                <span class="text-large font-600 mr-3"> 订单管理 </span>
              </template>
          </el-page-header> -->
    <div class="block">
      <div class="inner-block2">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单ID">
                <el-input v-model="formData.maintenance_items_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆ID">
                <el-input v-model="formData.vehicle_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修地点">
                <el-input v-model="formData.maintenance_location" class="input-box"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单状态">
                <el-select v-model="formData.order_status">
                  <el-option key="1" value="待接单" label="待接单"> </el-option>
                  <el-option key="2" value="待完成" label="待完成"> </el-option>
                  <el-option key="3" value="待评价" label="待评价"> </el-option>
                  <el-option key="4" value="已完成" label="已完成"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-wrapper">
          <el-button @click="reset">重置</el-button>
          <el-button @click="queryData">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="inner-block">
        <div class="button-wrapper">
          <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
          height="100vh">
          <el-table-column prop="maintenance_items_id" label="订单ID" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="vehicle_id" label="车辆ID" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="maintenance_location" label="维修地点" min-width="25%" align="center"></el-table-column>
          <el-table-column prop="order_status" min-width="10%" label="订单状态" align="center"></el-table-column>
          <el-table-column :inline="true" label="操作" min-width="15%" align="center">
            <template #default="scope">
              <span>
                <el-button text :icon="Document" @click="Detail(scope.row)">查看详情</el-button>
                <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否删除"
                  @confirm="deleteInfo(scope.row)">
                  <template #reference>
                    <el-button style="color: red;" text :icon="Delete">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="totalData"
            @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
  </div>


  <el-dialog v-model="dialogVisible" title="订单详情" width="50%">
    <div class="container-vertical" v-loading="item_loading">
      <div class="left-info-part">
        <div class="detail-info">
          <p>订单编号：{{ maintenance_item_detail.maintenance_item_id }}</p>
          <p>地点：{{ maintenance_item_detail.maintenance_location }}</p>
          <p>提交时间：{{ maintenance_item_detail.order_submission_time }}</p>
          <p>备注：{{ maintenance_item_detail.remarks ? maintenance_item_detail.remarks : "无" }}</p>
          <p>服务时间：{{ status_number > 2 ? maintenance_item_detail.service_time : "未进行服务" }}</p>
          <p>评价：{{ status_number > 3 ? maintenance_item_detail.evaluations : "用户未作出评价" }}</p>
          <p>评分：{{ status_number > 3 ? maintenance_item_detail.score : "暂无评分" }}</p>
          <p>订单状态：{{ maintenance_item_detail.order_status }}</p>
          <p>预约时间：{{ maintenance_item_detail.appoint_time }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
  
</template>
  
<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Edit, Delete, Document } from '@element-plus/icons-vue';

const tableData = ref([]);
const totalData = ref([]);

const formData = reactive({
  maintenance_items_id: '',
  vehicle_id: '',
  maintenance_location: '',
  order_status: ''
});


const query = reactive({
  pageIndex: 1,
  pageSize: 25,
});


const pullData = () => {
  cmRequest.request({
    url: 'api/administrator/repair',
    method: 'GET',
    params: {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize
    }
  }).then((res) => {
    if (!res.code) {
      tableData.value = res.data;
      totalData.value = parseInt(res.totalData);
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
}
pullData();


const resetFormData = () => {
  formData.maintenance_items_id = '';
  formData.vehicle_id = '';
  formData.maintenance_location = '';
  formData.order_status = '';
}


const queryData = () => {
  cmRequest.request({
    url: 'api/administrator/repair',
    method: 'GET',
    params: {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      maintenance_items_id: formData.maintenance_items_id,
      vehicle_id: formData.vehicle_id,
      maintenance_location: formData.maintenance_location,
      order_status: formData.order_status,
    }
  }).then((res) => {
    if (!res.code) {
      tableData.value = res.data;
      totalData.value = parseInt(res.totalData);
    }
    else {
      ElMessage({
        type: 'error',
        message: '未找到内容',
      });
    }
  })
}

const handlePageChange = (val) => {
  query.pageIndex = val;
  queryData();
};


const deleteInfo = (val) => {
  cmRequest.request({
    url: 'api/administrator/repair',
    method: 'DELETE',
    params: {
      maintenance_items_id: val.maintenance_items_id
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
  })
  //console.log(val.maintenance_items_id)
}

const dialogVisible = ref(false);
const selectedItemId = ref('');
const status_number = ref(2);
const item_loading = ref(true);
const maintenance_item_detail = ref({
  maintenance_item_id: '',
  maintenance_location: '',
  order_status: '',
  remarks: '',
  evaluations: '',
  order_submission_time: '',
  service_time: '',
  vehicle_id: '',
  score:'',
  title: '',
  appoint_time:''

})

const Detail = (val) => {
  dialogVisible.value = true;
  selectedItemId.value = val.maintenance_items_id;
  //Item.order_status="已完成"
  switch (val.order_status) {
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
  //console.log(val.maintenance_items_id)
  get_maintenance_info(val.maintenance_items_id);

}

const get_maintenance_info = (id) => {
  maintenance_item_detail.value = {};
  cmRequest.request({
    url: 'api/administrator/repair/detail',
    method: 'GET',
    params: {
      maintenance_item_id: id
    }
  }).then((res) => {
    if (!res.code) {
      maintenance_item_detail.value = res;
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

const reset = ()=>{
  query.pageIndex = 1;
  resetFormData();
  pullData();
}


</script>
  
<style scoped>
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