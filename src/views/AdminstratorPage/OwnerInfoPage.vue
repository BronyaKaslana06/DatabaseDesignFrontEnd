<template>
  <!-- <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 车主管理 </span>
      </template>
  </el-page-header> -->

  <div>
    <div class="block">
      <div class="inner-block2">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <el-form-item label="车主ID">
                <el-input v-model="formData.owner_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车主姓名">
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
              <el-form-item label="地址">
                <el-input v-model="formData.address" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码">
                <el-input v-model="formData.password" class="input-box"></el-input>
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
          <el-table-column prop="owner_id" label="车主ID" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="username" label="车主姓名" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="gender" label="性别" min-width="5%" align="center">
          </el-table-column>
          <el-table-column prop="phone_number" min-width="10%" label="手机号" align="center">
          </el-table-column>
          <el-table-column prop="address" min-width="15%" label="地址" align="center">
          </el-table-column>
          <el-table-column prop="password" min-width="15%" label="密码" align="center">
          </el-table-column>
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
      <el-form-item label="车主ID">
        {{ editForm.owner_id }}
      </el-form-item>
      <el-form-item label="车主姓名">
        {{ editForm.username }}
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="editForm.gender">
          <el-option key="1" value="男" label="男"> </el-option>
          <el-option key="2" value="女" label="女"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="editForm.phone_number"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="editForm.address"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="editForm.password"></el-input>
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
      <el-form-item label="车主姓名">
        <el-input v-model="addedData.username"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="addedData.gender">
          <el-option key="1" value="男" label="男"> </el-option>
          <el-option key="2" value="女" label="女"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="addedData.phone_number"></el-input>
      </el-form-item>
      <el-form-item label=地址>
        <el-input v-model="addedData.address"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="addedData.password"></el-input>
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
  owner_id: '',
  username: '',
  gender: '',
  phone_number: '',
  address: '',
  password: ''
});

const addedData = reactive({
  username: '',
  gender: '',
  phone_number: '',
  address: '',
  password: ''
})

const query = reactive({
  pageIndex: 1,
  pageSize: 25,
});

const editForm = reactive({
  gender: '',
  phone_number: '',
  address: '',
  password: ''
});

var pageTotal = 1;

const pullData = () => {
    cmRequest.request({
    url: 'api/administrator/owner-info/message',
    // url: 'administrator/owner-info/message',// 我的本地api地址
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
      pageTotal = parseInt(res.totalData);
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
  formData.owner_id = '';
  formData.username = '';
  formData.gender = '';
  formData.phone_number = '';
  formData.address = '';
  formData.password = '';
}

const resetAddedData = () => {
  addedData.gender = '';
  addedData.phone_number = '';
  addedData.address = '';
  addedData.password = '';
}

const queryData = () => {
  cmRequest.request({
    url: 'api/administrator/owner-info/query', 
    // url: 'administrator/owner-info/query', // 我的本地api地址
    method: 'GET',
    params: {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      owner_id: formData.owner_id,
      username: formData.username,
      gender: formData.gender,
      phone_number: formData.phone_number,
      address: formData.address,
      password: formData.password
    }
  }).then((res) => {
    if(!res.code){
      console.log(res);
      tableData.value = res.data;
      pageTotal = parseInt(res.pageTotal);
      console.log(pageTotal);
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
  editForm.owner_id = row.owner_id;
  editForm.gender = row.gender;
  editForm.phone_number = row.phone_number;
  editForm.address = row.address;
  editForm.password = row.password;
  editForm.username = row.username;
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
      url: 'api/administrator/owner-info',
      // url: 'administrator/owner-info', // 我的本地api地址
      method: 'POST',
      data:{
        username: addedData.username,
        phone_number: addedData.phone_number,
        gender: addedData.gender,
        address: addedData.address,
        password: addedData.password
      }
    }).then((res)=>{
      addFlag.value = false;
      resetAddedData();
      if (!res.code) {
      ElMessage({
        type: 'success',
        message: '新建成功, 新车主id为'+res.owner_id,
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
    url: 'api/administrator/owner-info',
    // url: 'administrator/owner-info', // 我的本地api地址
    method: 'DELETE',
    params: {
      owner_id: val.owner_id
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
    url: 'api/administrator/owner-info',
    // url: 'administrator/owner-info', // 我的本地api地址
    method: 'PATCH',
    data: {
      owner_id: editForm.owner_id,
      username: editForm.username,
      gender: editForm.gender,
      phone_number: editForm.phone_number,
      address: editForm.address,
      password: editForm.password,
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