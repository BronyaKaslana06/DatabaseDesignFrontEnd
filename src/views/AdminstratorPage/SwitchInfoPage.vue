<template>
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
              <el-form-item label="员工ID">
                <el-input v-model="formData.employee_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆ID">
                <el-input v-model="formData.vehicle_id" class="input-box"></el-input>
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
          height="70vh" v-loading ="loadData">
          <el-table-column prop="switch_service_id" label="换电订单ID" min-width="8%" align="center"></el-table-column>
          <el-table-column prop="employee_id" label="员工ID" min-width="6%" align="center"></el-table-column>
          <el-table-column prop="ownerid" label="车主ID" min-width="6%" align="center"></el-table-column>
          <el-table-column prop="vehicle_id" label="车辆ID" min-width="6%" align="center">
          </el-table-column>
          <el-table-column prop="switch_time" min-width="13%" label="换电时间" align="center">
          </el-table-column>
          <el-table-column prop="battery_id_on" min-width="8%" label="换上电池ID" align="center">
          </el-table-column>
          <el-table-column prop="battery_id_off" min-width="8%" label="换下电池ID" align="center">
          </el-table-column>
          <el-table-column prop="score" min-width="8%" label="评分" align="center"></el-table-column>
          <el-table-column prop="evaluations" min-width="19%" label="评价" align="center">
            <template v-slot="scope">
              <el-tooltip class="box-item" effect="light" :content="scope.row.evaluations" placement="top-end">
                <span>{{scope.row.evaluations===null?'暂无评价': Text(scope.row.evaluations) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :inline="true" label="操作" min-width="10%" align="center">
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
          <el-pagination :current-page="query.page_index" :page-size="query.page_size" :total="totalData"
            @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';

const tableData = ref([]);
const editFlag = ref(false);
const addFlag = ref(false);
const loadData = ref(false);
const totalData = ref(0);

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
  battery_id_off: '',
  evaluations: ''
})

const query = reactive({
  page_index: 1,
  page_size: 25,
});

const editForm = reactive({
  employee_id: '',
  switch_time: '',
  battery_id_on: '',
  battery_id_off: ''
});

const Text = (val) => {
  if (val === null)
    return '';
  if (val.length > 70) {
    return val.slice(0, 70) + '...'; // 截取文本并添加省略号
  }
  return val;
}

const pullData = () => {
  loadData.value = true;
  cmRequest.request({
    url: 'api/administrator/switch-info/query',    
    method: 'GET',
    params: {
      page_index: query.page_index,
      page_size: query.page_size
    }
  }).then((res) => {
    if (!res.code) {
      for(let item of res.data){
        if(item.score === -1){
          item.score = '未评分'
        }
      }
      tableData.value = res.data;
      totalData.value = parseInt(res.totalData); //如果可以直接返回数字，就可以不要这个parseInt转换函数
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
    loadData.value = false;
  })
}
pullData();

const resetFormData = () => {
  formData.switch_service_id = '';
  formData.employee_id = '';
  formData.vehicle_id = '';
}

const queryData = () => {
  loadData.value = true;
  cmRequest.request({
    url: 'api/administrator/switch-info/query',
    method: 'GET',
    params: {
      page_index: query.page_index,
      page_size: query.page_size,
      switch_service_id: formData.switch_service_id,
      employee_id: formData.employee_id,
      vehicle_id: formData.vehicle_id
    }
  }).then((res) => {
    if (!res.code) {
      for(let item of res.data){
        if(item.score === -1){
          item.score = '未评分'
        }
      }
      tableData.value = res.data;
      totalData.value = parseInt(res.totalData);
    }
    else {
      ElMessage({
        type: 'error',
        message: '未找到内容',
      });
    }
    loadData.value = false;
  })
}

const reset = () => {
  query.page_index = 1;
  resetFormData();
  pullData();
}

const handlePageChange = (val) => {
  query.page_index = val;
  queryData();
};

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

    }
    else {
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
  })
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

.box-item {
  width: 30px;
  display: flex;
  margin-left: 5em;
  margin-right: 3em;
}
</style>