<template>
  <div>
    <div class="block">
      <div class="inner-block2">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <el-form-item label="员工ID">
                <el-input v-model="formData.employee_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="员工姓名">
                <el-input v-model="formData.username" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-input v-model="formData.gender" class="input-box"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机号">
                <el-input v-model="formData.phone_number" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工资">
                <el-input v-model="formData.salary" class="input-box"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-wrapper">
          <el-button @click="addData">新增</el-button>
          <el-button @click="queryData">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="inner-block">
        <div class="button-wrapper">
          <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" width="600px"
          header-cell-class-name="table-header">
          <el-table-column prop="employee_id" label="员工ID" min-width="20%" align="center"></el-table-column>
          <el-table-column prop="username" label="员工姓名" min-width="20%" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="phone_number" min-width="15%" label="手机号" align="center">
          </el-table-column>
          <el-table-column prop="salary" min-width="20%" label="工资" align="center">
          </el-table-column>
          <el-table-column  label="操作" min-width="15%" align="center">
              <el-button text :icon="Edit">
                编辑
              </el-button>
              <el-button style="color: red;" text :icon="Delete">
                删除
              </el-button>
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
import { RefreshRight,Edit,Delete } from '@element-plus/icons-vue';

const tableData = ref([]);
const formData = reactive({
  employee_id: '',
  username: '',
  gender: '',
  phone_number: '',
  salary: ''
})

const query = reactive({
  pageIndex: 1,
  pageSize: 25,
})

var pageTotal = 1;

const pullData = () => {
  cmRequest.request({
    url: 'administrator/staffInfo/message',
    method: 'GET',
    params: {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize
    }
  }).then((res) => {
    console.log(res);
    tableData.value = res.data;
    pageTotal = parseInt(res.pageTotal);
    console.log(pageTotal);
  })
}
pullData();


const resetFormData = () => {
  formData.employee_id = '';
  formData.username = '';
  formData.gender = '';
  formData.phone_number = '';
  formData.salary = '';
}

const queryData = () => {
  cmRequest.request({
    url: 'administrator/staffInfo/query',
    method: 'GET',
    params: {
      pageNum: query.pageIndex,
      pageSize: query.pageSize,
      employee_id: formData.employee_id,
      username: formData.username,
      gender: formData.gender,
      phone_number: formData.phone_number,
      salary: formData.salary
    }
  }).then((res) => {
    tableData.value = res.data;
    pageTotal = parseInt(res.pageTotal);
    resetFormData();
  })
}

const handlePageChange = (val) => {
  query.pageIndex = val;
  pullData();
};

const addData = () => {

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