<template>
    <div>
      <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 订单管理 </span>
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
            <el-button @click="addFlag = true" style="margin-bottom: 10px;">新增</el-button>
            <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            height="100vh">
            <el-table-column prop="employee_id" label="订单ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="username" label="车辆ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="gender" label="维修地点" min-width="25%" align="center"></el-table-column>
            <el-table-column prop="station_name" min-width="10%" label="订单状态" align="center"></el-table-column>
            <el-table-column :inline="true" label="操作" min-width="15%" align="center">
              <template #default="scope">
                <span>
                  <el-button text :icon="Edit" @click="handleEdit(scope.row)">
                    编辑
                  </el-button>
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
            <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal"
              @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  
    <el-dialog title="编辑" v-model="editFlag" width="30%">
      <el-form label-width="100px">
        <el-form-item label="订单ID">
          {{ editForm.maintenance_items_id }}
        </el-form-item>
        <el-form-item label="车辆ID">
          {{ editForm.vehicle_id }}

        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="editForm.gender">
            <el-option key="1" value="正常" label="正常"> </el-option>
            <el-option key="2" value="异常" label="异常"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修地点">
          <el-input v-model="editForm.maintenance_location"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFlag = false">取 消</el-button>
          <el-button type="" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  
    <el-dialog title="编辑" v-model="addFlag" width="30%" @close="cancleAddEvent">
      <el-form label-width="100px">
        <el-form-item label="车辆ID">
          <el-input v-model="addedData.vehicle_id"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="addedData.order_status">
            <el-option key="1" value="正常" label="正常"> </el-option>
            <el-option key="2" value="异常" label="异常"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修地点">
          <el-input v-model="addedData.maintenance_location"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancleAddEvent">取 消</el-button>
          <el-button type="" @click="addData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="js">
  import cmRequest from '../../service/index.js'
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';
  
  const tableData = ref([]);
  const editFlag = ref(false);
  const addFlag = ref(false);
  
  const formData = reactive({
    maintenance_items_id: '',
    vehicle_id: '',
    maintenance_location: '',
    order_status:''
  });

  const addedData = reactive({
  vehicle_id: '',
  maintenance_location: '',
  order_status: ''
})

  const query = reactive({
    pageIndex: 1,
    pageSize: 25,
  });
  
  const editForm = reactive({
    maintenance_items_id: '',
    vehicle_id: '',
    maintenance_location: '',
    order_status:''
  });
  
  var pageTotal = 1;
  const pullData = () => {
    cmRequest.request({
      url: 'api/administrator/maintenance_itemsInfo/message',
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
  
const cancleAddEvent =()=>{
  addFlag.value = false;
  resetAddedData();
}

const resetFormData = () => {
    formData.maintenance_items_id = '';
    formData.vehicle_id = '';
    formData.maintenance_location = '';
    formData.order_status = '';
}
  
const resetAddedData = () => {
  addedData.vehicle_id = '';
  addedData.maintenance_location = '';
  addedData.order_status = '';
}
  
  const queryData = () => {
    cmRequest.request({
      url: 'api/administrator/maintenance_itemsInfo/message',
      method: 'GET',
      params: {
        pageNum: query.pageIndex,
        pageSize: query.pageSize,
        maintenance_items_id: formData.maintenance_items_id,
        vehicle_id: formData.vehicle_id,
        maintenance_location: formData.maintenance_location,
        order_status: formData.order_status,
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
  
  
  const handleEdit = (row) => {
    editFlag.value = true;
    editForm.maintenance_items_id = row.maintenance_items_id;
    editForm.vehicle_id = row.vehicle_id;
    editForm.maintenance_location = row.maintenance_location;
    editForm.order_status = row.order_status;
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
      url: 'api/administrator/maintenance_itemInfo/addition',
      method: 'POST',
      data:{
        vehicle_id: addedData.vehicle_id,
        maintenance_location: addedData.maintenance_location,
        order_status: addedData.order_status,

      }
    }).then((res)=>{
      addFlag.value = false;
      resetAddedData();
      if (!res.code) {
      ElMessage({
        type: 'success',
        message: '新建成功, 订单id为'+res.maintenance_items_id,
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: '新建失败',
      })
    }
    })
  }
}
  
  const deleteInfo = (val) => {
    cmRequest.request({
      url: 'api/administrator/maintenance_itemInfo/erasure',
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
  }
  
  const saveEdit = () => {
    cmRequest.request({
      url: 'api/administrator/maintenance_itemInfo/updates',
      method: 'PATCH',
      data: {
        maintenance_items_id: editForm.maintenance_items_id,
        vehicle_id: editForm.vehicle_id,
        maintenance_location: editForm.maintenance_location,
        order_status: editForm.order_status,
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