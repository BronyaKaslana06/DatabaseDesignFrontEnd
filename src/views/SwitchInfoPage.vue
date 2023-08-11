<template>
    <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 换电订单 </span>
      </template>
    </el-page-header>

    <div>
      <div class="block">
        <div class="inner-block2">
          <el-form :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="换电订单ID">
                  <el-input v-model="formData.switch_service_id" class="input-box"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="员工id">
                  <el-input v-model="formData.employee_id" class="input-box"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车辆id">
                  <el-input v-model="formData.vehicle_id" class="input-box"></el-input>
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
            <el-table-column prop="switch_service_id" label="换电订单ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="employee_id" label="员工ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="vehicle_id" label="车辆ID" min-width="5%" align="center">
            </el-table-column>
            <el-table-column prop="switch_time" min-width="10%" label="换电时间" align="center">
            </el-table-column>
            <el-table-column prop="battery_id_on" min-width="10%" label="换上电池ID" align="center">
            </el-table-column>
            <el-table-column prop="battery_id_off" min-width="10%" label="换下电池ID" align="center">
            </el-table-column>
            <el-table-column prop="evaluations" min-width="8%" label="评价" align="center">
            </el-table-column>
            <el-table-column :inline="true" label="操作" min-width="15%" align="center">
              <template #default="scope">
                <span>
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
            <el-pagination :current-page="query.page_index" :page-size="query.page_size" :total="totaldata"
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
  const editFlag = ref(false);
  const addFlag = ref(false);
  
  const formData = reactive({
    switch_service_id: '',
    employee_id: '',
    vehicle_id: ''
  });
  
  const addedData = reactive({
    employee_id: '',
    vehicle_id: '',
    switch_time: '',
    battery_id_on: '',
    battery_id_off:'',
    evaluations:''
  })
  
  const query = reactive({
    page_index: 1,
    page_size: 25,
  });
  
  const editForm = reactive({
    employee_id: '',
    switch_time: '',
    battery_id_on: '',
    battery_id_off:''
  });
  
  var totaldata = 1;
  const pullData = () => {
    cmRequest.request({
      url: 'api/administrator/switch-info/query',
      //url: 'administrator/switch-info/query',      
      method: 'GET',
      params: {
        page_index: query.page_index,
        page_size: query.page_size,
        //switch_request_id:'',
        //employee_id:'',
        //vehicle_id:''
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        tableData.value = res.data;
        totaldata = parseInt(res.totaldata); //如果可以直接返回数字，就可以不要这个parseInt转换函数
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
  
  
  const cancleAddEvent =()=>{
    addFlag.value = false;
    resetAddedData();
  }
  const resetFormData = () => {
    formData.switch_service_id = '';
    formData.employee_id = '';
    formData.vehicle_id = '';
  }
  
  const resetAddedData = () => {
    addedData.employee_id= '';
    addedData.vehicle_id= '';
    addedData.switch_time= '';
    addedData.battery_id_on= '';
    addedData.battery_id_off='';
    addedData.evaluations='';
  }
  

  const queryData = () => {
    cmRequest.request({
      url: 'api/administrator/switch-info/query',
      //url: 'administrator/switch-info/query',
      method: 'GET',
      params: {
        page_index: query.page_index,
        page_size: query.page_size,
        switch_service_id: formData.switch_service_id,
        employee_id: formData.employee_id,
        vehicle_id: formData.vehicle_id
      }
    }).then((res) => {
      if(!res.code){
        tableData.value = res.data;
        totaldata = parseInt(res.totaldata);
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
    query.page_index = val;
  
    pullData();
  };
  
  
  const handleEdit = (row) => {
    editFlag.value = true;
    editForm.switch_request_id = row.switch_request_id;
    editForm.employee_id = row.employee_id;
    editForm.vehicle_id = row.vehicle_id;
    editForm.switch_time = row.switch_time;
    editForm.battery_id_on = row.battery_id_on;
    editForm.battery_id_off = row.battery_id_off;
  }
  
  
  const addData = () => {
    let hasNullValue = false;
    for (const key in addedData) {
      if (addedData.hasOwnProperty(key) && addedData[key] === "") {
        hasNullValue = true;
        break; // 找到任意一个值为0的属性后，就不再继续检查
      }
    }
    if(hasNullValue){
      ElMessage({
          type: 'warning',
          message: '请填写完整信息',
        })
    }
    else{
      cmRequest.request({
        url: 'administrator/switch-info/add',
        method: 'POST',
        data:{
            employee_id: addedData.employee_id,
            vehicle_id: addedData.vehicle_id,
            switch_time: addedData.switch_time,
            battery_id_on: addedData.battery_id_on,
            battery_id_off: addedData.battery_id_off,
            evaluations: addedData.evaluations
        }
      }).then((res)=>{
        addFlag.value = false;
        resetAddedData();
        if (!res.code) {
        ElMessage({
          type: 'success',
          message: '新建成功, 新换电订单id为'+res.switch_request_id,
        })
      }
      else {
        ElMessage({
          type: 'error',
          message: '2新建失败',
        })
      }
      })
    }
  }
  
  const deleteInfo = (val) => {
    cmRequest.request({
      url: 'api/administrator/switch-info',
      //url: 'administrator/switch-info',
      method: 'DELETE',
      params: {
        switch_service_id: val.switch_service_id
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
  }
  
  const saveEdit = () => {
    cmRequest.request({
      url: 'administrator/switch-info',
      method: 'PATCH',
      data: {
        switch_request_id:editForm.switch_request_id,
        employee_id: editForm.employee_id,
        switch_time: editForm.switch_time,
        battery_id_on: editForm.battery_id_on,
        battery_id_off: editForm.battery_id_off
      }
    }).then((res) => {
      editFlag.value = false;
      if (!res.code) {
        ElMessage({
          type: 'success',
          message: '更新成功',
        })
      }
      else {
        ElMessage({
          type: 'error',
          message: '更新失败',
        })
      }
    })
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
  </style>