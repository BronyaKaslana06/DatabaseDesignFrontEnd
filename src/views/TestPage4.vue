<template>
    <div>
      <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 维修订单 </span>
      </template>
      </el-page-header>
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
                    <el-option key="1" value="正常" label="正常"> </el-option>
                    <el-option key="2" value="异常" label="异常"> </el-option>
                    </el-select>
                 </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="提交时间">
                  <el-input v-model="formData.order_submission_time" class="input-box"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务时间">
                  <el-input v-model="formData.service_time" class="input-box"></el-input>
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
        <div class="inner-block">
          <div class="button-wrapper">
            <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            height="100vh">
            <el-table-column prop="maintenance_id" label="订单ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="vehicle_id" label="车辆ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="maintenance_location" label="维修地点" min-width="20%" align="center"></el-table-column>
            <el-table-column prop="order_status" min-width="10%" label="订单状态" align="center"></el-table-column>
            <el-table-column prop="order_submission_time" min-width="15%" label="提交时间" align="center"></el-table-column>
            <el-table-column prop="service_time" min-width="15%" label="服务时间" align="center"></el-table-column>
            <el-table-column prop="remarks" min-width="20%" label="备注" align="center"></el-table-column>
            <el-table-column prop="evolution" min-width="20%" label="评价" align="center">
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal"
              @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="js">
  import cmRequest from '../service/index.js'
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';
  
  const tableData = ref([]);

  
  const formData = reactive({
    maintenance_items_id: '',
    vehicle_id: '',
    maintenance_location: '',
    remarks:'',
    evaluations:'',
    order_submission_time :'',
    service_time:'',
    order_status:''
  });


  const query = reactive({
    pageIndex: 1,
    pageSize: 25,
  });
  
  
  var pageTotal = 1;
  const pullData = () => {
    cmRequest.request({
      url: '/staff/my-info/repair-records/{employee_id}',
      method: 'GET',
      params: {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        tableData.value = res.data;
        pageTotal = parseInt(res.pageTotal);
      }
      else{
        ElMessage({
          type: 'error',
          message: '刷新失败',
        })
      }
    })
  }
  pullData();

  const queryData = () => {
    cmRequest.request({
      url: '/staff/my-info/repair-records/{employee_id}',
      method: 'GET',
      params: {
        pageNum: query.pageIndex,
        pageSize: query.pageSize,
        maintenance_items_id: formData.maintenance_items_id,
        vehicle_id: formData.vehicle_id,
        maintenance_location: formData.maintenance_location,
        order_status: formData.order_status,
        remarks:formData.remarks,
        evaluations:formData.evaluations,
        order_submission_time :formData.order_submission_time,
        service_time:formData.service_time
      }
    }).then((res) => {
      if(!res.code){
        tableData.value = res.data;
        pageTotal = parseInt(res.pageTotal);
      }
      else{
        ElMessage({
          type: 'error',
          message: '未找到内容',
        });
      }
      resetFormData();
    })
  }
  
  const handlePageChange = (val) => {
    query.pageIndex = val;
    pullData();
  };
  
  
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
  </style>