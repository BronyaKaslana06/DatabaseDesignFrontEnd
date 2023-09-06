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
              <el-col :span="8">
                <el-form-item label="所在换电站ID">
                  <el-input v-model="formData.station_id" class="input-box"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="所在换电站名称">
                  <el-input v-model="formData.station_name" class="input-box"></el-input>
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
            <el-button @click="addFlag = true" style="margin-bottom: 10px;">新增</el-button>
            <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
          </div>
          <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            height="100vh" v-loading="loadTableData">
            <el-table-column prop="employee_id" label="员工ID" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="username" label="员工姓名" min-width="10%" align="center"></el-table-column>
            <el-table-column prop="gender" label="性别" min-width="5%" align="center">
            </el-table-column>
            <el-table-column prop="station_name" min-width="10%" label="换电站名" align="center">
              <template v-slot="scope">
                <span>{{ scope.row.station_name===null ? "维修工无所属换电站":scope.row.station_name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="station_id" min-width="10%" label="换电站ID" align="center">
              <template v-slot="scope">
                <span>{{ scope.row.station_id===-1 ? "维修工无所属换电站":scope.row.station_id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone_number" min-width="10%" label="手机号" align="center">
            </el-table-column>
            <el-table-column prop="salary" min-width="8%" label="工资" align="center">
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
            <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="totalData"
              @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="编辑" v-model="editFlag" width="30%">
      <el-form label-width="100px">
        <el-form-item label="员工ID">
          {{ editForm.employee_id }}
        </el-form-item>
        <el-form-item label="员工姓名">
          {{ editForm.username }}
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option key="1" value="男" label="男"> </el-option>
            <el-option key="2" value="女" label="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换电站ID">
          <el-input v-model="editForm.station_id"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="工资">
          <el-input v-model="editForm.salary"></el-input>
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
        <el-form-item label="员工姓名">
          <el-input v-model="addedData.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addedData.gender">
            <el-option key="1" value="男" label="男"> </el-option>
            <el-option key="2" value="女" label="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换电站ID">
          <el-input v-model="addedData.station_id"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addedData.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="工资">
          <el-input v-model="addedData.salary"></el-input>
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
  const totalData = ref(0);
  const editFlag = ref(false);
  const addFlag = ref(false);
  const loadTableData = ref(false);

  const formData = reactive({
    employee_id: '',
    username: '',
    gender: '',
    phone_number: '',
    salary: '',
    station_name: '',
    station_id: ''
  });

  const addedData = reactive({
    username: '',
    gender: '',
    phone_number: '',
    salary: '',
    station_id: ''
  })

  const query = reactive({
    pageIndex: 1,
    pageSize: 25,
  });

  const editForm = reactive({
    gender: '',
    phone_number: '',
    salary: '',
    station_id: ''
  });


  const pullData = () => {
    loadTableData.value = true;
    cmRequest.request({
      url: 'api/administrator/staff-info/query',
      method: 'GET',
      params: {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize
      }
    }).then((res) => {
      if(!res.code){
        tableData.value = res.data;
        totalData.value = parseInt(res.totalData);
        loadTableData.value = false;
      }
      else{
        ElMessage({
          type: 'error',
          message: '刷新失败',
        })
        loadTableData.value = false;
      }
    })
    cmRequest.request({
      url: 'api/Account/GetTest',
    }).then((res)=>{

    })
  }
  pullData();

  const changeView = ()=>{
    cmRequest.request({
      url: 'api/administrator/staff-info/query',
      method: 'GET',
      params: {
        pageIndex: 1,
        pageSize: query.pageSize
      }
    }).then((res) => {
        tableData.value = res.data;
        totalData.value = parseInt(res.totalData);
      }
    )
  }

  const cancleAddEvent =()=>{
    addFlag.value = false;
    resetAddedData();
  }
  const resetFormData = () => {
    formData.employee_id = '';
    formData.username = '';
    formData.gender = '';
    formData.phone_number = '';
    formData.salary = '';
    formData.station_id = '';
    formData.station_name = '';
  }

  const resetAddedData = () => {
    addedData.gender = '';
    addedData.phone_number = '';
    addedData.salary = '';
    addedData.station_id = '';
    addedData.username = '';
  }

  const reset = ()=>{
    query.pageIndex = 1;
    resetFormData();
    pullData();
  }

  const queryData = () => {
    cmRequest.request({
      url: 'api/administrator/staff-info/query',
      method: 'GET',
      params: {
        pageIndex: query.pageIndex,
        pageSize: query.pageSize,
        employee_id: formData.employee_id === '' ? null : formData.employee_id,
        username: formData.username=== '' ? null : formData.username,
        gender: formData.gender=== '' ? null: formData.gender,
        phone_number: formData.phone_number=== '' ? null: formData.phone_number,
        salary: formData.salary=== '' ? null: formData.salary,
        station_id: formData.station_id=== '' ? null : formData.station_id,
        station_name: formData.station_name=== '' ? null : formData.station_name
      }
    }).then((res) => {
      if(!res.code){
        tableData.value = res.data;
        totalData.value = parseInt(res.totalData);
      }
      else{
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


  const handleEdit = (row) => {
    editFlag.value = true;
    editForm.employee_id = row.employee_id;
    editForm.gender = row.gender;
    editForm.phone_number = row.phone_number;
    editForm.salary = row.salary;
    editForm.station_id = row.station_id;
    editForm.username = row.username;
    editForm.station_name = row.station_name;
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
        url: 'api/administrator/staff-info',
        method: 'POST',
        data:{
          username: addedData.username,
          phone_number: addedData.phone_number,
          gender: addedData.gender,
          station_id: addedData.station_id,
          salary: addedData.salary
        }
      }).then((res)=>{
        addFlag.value = false;
        resetAddedData();
        if (!res.code) {
        changeView();
        ElMessage({
          type: 'success',
          message: '新建成功,请刷新后查看，新员工id为'+res.employee_id,
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
      url: 'api/administrator/staff-info',
      method: 'DELETE',
      params: {
        employee_id: val.employee_id
      }
    }).then((res) => {
      if (!res.code) {
        changeView();
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
      url: 'api/administrator/staff-info',
      method: 'PATCH',
      data: {
        employee_id: editForm.employee_id,
        gender: editForm.gender,
        phone_number: editForm.phone_number,
        salary: editForm.salary,
        station_id: editForm.station_id,
      }
    }).then((res) => {
      editFlag.value = false;
      if (!res.code) {
        changeView();
        ElMessage({
          type: 'success',
          message: '更新成功，请刷新后查看',
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


// name: 管理员-员工信息页,
// author: 前端：束赫
//         后端：俞春先
// date: 2023-8-10
