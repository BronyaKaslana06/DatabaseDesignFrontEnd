<template>
  <div>
    <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 换电站管理 </span>
      </template>
    </el-page-header>
    <div class="block">
      <div class="inner-block2">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <el-form-item label="换电站名称">
                <el-input v-model="formData.station_name" class="input-box"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="换电站ID">
                <el-input v-model="formData.station_id" class="input-box"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label="管理员ID">
                <el-input v-model="formData.employee_id" class="input-box"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="可用状态">
                <!-- <el-input v-model="formData.faliure_status" class="input-box"></el-input> -->
                <el-select v-model="formData.faliure_status">
                  <el-option key="1" value="是" label="是"> </el-option>
                  <el-option key="2" value="否" label="否"> </el-option>
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
          <el-table-column prop="station_name" min-width="10%" label="换电站名" align="center"></el-table-column>
          <el-table-column prop="station_id" min-width="10%" label="换电站ID" align="center"></el-table-column>
          <!-- <el-table-column prop="employee_id" label="管理员工ID" min-width="10%" align="center"></el-table-column> -->
          <el-table-column prop="battery_capacity" min-width="10%" label="电池容量" align="center"></el-table-column>
          <el-table-column prop="available_battery_count" min-width="8%" label="可用电池" align="center"></el-table-column>
          <el-table-column prop="faliure_status" min-width="8%" label="可用状态" align="center"></el-table-column>
          <el-table-column prop="electricity_fee" min-width="8%" label="电费" align="center"></el-table-column>
          <el-table-column prop="service_fee" min-width="8%" label="服务费" align="center"></el-table-column>
          <el-table-column :inline="true" label="操作" min-width="15%" align="center">
            <template #default="scope">
              <span>
                <el-button text type="primary" size="small" :icon="Edit" @click="handleEdit(scope.row)">
                  编辑
                </el-button>
                <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否删除"
                  @confirm="deleteInfo(scope.row)">
                  <template #reference>
                    <el-button style="color: red;" type="primary" size="small" text :icon="Delete">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </span>
            </template>
            <!-- <template #default>
              <el-button link type="primary" size="small" :icon="Edit" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否删除"
                  @confirm="deleteInfo(scope.row)">
                  <template #reference>
                    <el-button link type="primary" size="small" :icon="Delete">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
            </template> -->
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal"
            @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
        </div>
      </div>
    </div>
  </div>

  <el-dialog title="编辑" @open="openEdit" v-model="editFlag" width="30%">
    <el-form label-width="100px">
      <el-form-item label="换电站ID">
        {{ editForm.station_id }}
      </el-form-item>
      <el-form-item label="换电站名">
        <el-input v-model="editForm.station_name"></el-input>
      </el-form-item>
      <el-form-item label="换电站ID">
        <el-input v-model="editForm.station_id"></el-input>
      </el-form-item>
      <!-- <el-form-item label="换电站经度">
        <el-input v-model="editForm.longtitude"></el-input>
      </el-form-item>
      <el-form-item label="换电站纬度">
        <el-input v-model="editForm.latitude"></el-input>
      </el-form-item> -->
      <el-form-item label="换电站位置">
        <div id="myMapEdit"></div>
      </el-form-item>
      <el-form-item label="可用状态">
        <el-select v-model="editForm.faliure_status">
          <el-option key="1" value="是" label="是"> </el-option>
          <el-option key="2" value="否" label="否"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电池容量">
        <el-input v-model="editForm.battery_capacity"></el-input>
      </el-form-item>
      <!-- <el-form-item label="可用电池数目">
        <el-input v-model="editForm.available_battery_count"></el-input>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="" @click="saveEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="新增" v-model="addFlag" @open="openAdd" width="30%" @close="cancleAddEvent">
    <el-form label-width="100px">
      <el-form-item label="换电站名">
        <el-input v-model="addedData.station_name"></el-input>
      </el-form-item>
      <el-form-item label="换电站ID">
        <el-input v-model="addedData.station_id"></el-input>
      </el-form-item>
      <el-form-item label="管理员ID">
        <el-input v-model="addedData.employee_id"></el-input>
      </el-form-item>
      <el-form-item label="换电站位置">
        <div id="myMapAdd"></div>
      </el-form-item>
      <!-- <el-form-item label="换电站经度">
        <el-input v-model="addedData.longitude"></el-input>
      </el-form-item>
      <el-form-item label="换电站纬度">
        <el-input v-model="addedData.latitude"></el-input>
      </el-form-item> -->
      <el-form-item label="可用状态">
        <el-select v-model="addedData.faliure_status">
          <el-option key="1" value="是" label="是"> </el-option>
          <el-option key="2" value="否" label="否"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电池容量">
        <el-input v-model="addedData.battery_capacity"></el-input>
      </el-form-item>
      <el-form-item label="可用电池数">
        <el-input v-model="addedData.available_battery_count"></el-input>
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
import cmRequest from '../service/index.js'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Edit, Delete } from '@element-plus/icons-vue';

const tableData = ref([]);
const editFlag = ref(false);
const addFlag = ref(false);

const formData = reactive({
  station_name: '',
  station_id: '',
  //employee_id: '',
  faliure_status: ''
});

const addedData = reactive({
  station_id: '',
  station_name: '',
  employee_id: '',
  longtitude: '',
  latitude: '',
  faliure_status: '',
  battery_capacity: '',
  available_battery_count: ''
})

const query = reactive({
  pageIndex: 1,
  pageSize: 25,
});

const stationLocation = reactive({
  lng: 0,
  lat: 0
});

const editForm = reactive({
  station_id: '',
  station_name: '',
  longtitude: '',
  latitude: '',
  faliure_status: '',
  battery_capacity: '',
  available_battery_count: '',
  //employee_id: ''
});

const openAdd = () =>{
  stationLocation.lng = 121.21633041361302;
  stationLocation.lat = 31.268357562330195;
  const BMap = window.BMap;
  var map = new BMap.Map("myMapAdd"); 
  var point = new BMap.Point(stationLocation.lng, stationLocation.lat)
  map.centerAndZoom(point, 10);                 // 初始化地图，设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);              //开启鼠标滚轮缩放
  var marker = new BMap.Marker(point);
  map.addOverlay(marker);
  marker.enableDragging();
  marker.addEventListener("dragend", (e) => {     
    //console.log("当前位置：" + e.point.lng + ", " + e.point.lat)
    point.lng = e.point.lng;
    point.lat = e.point.lat;
    stationLocation.lng = point.lng;
    stationLocation.lat = point.lat;
    addedData.longtitude = point.lng;
    addedData.latitude = point.lat;
    console.log("当前位置：" + addedData.longtitude + ", " + addedData.latitude);
  })
}

const openEdit = () =>{
  stationLocation.lng = editForm.longtitude;
  stationLocation.lat = editForm.latitude;
  const BMap = window.BMap;
  var map = new BMap.Map("myMapEdit"); 
  var point = new BMap.Point(stationLocation.lng, stationLocation.lat)
  map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true);              //开启鼠标滚轮缩放
  var marker = new BMap.Marker(point);
  map.addOverlay(marker);
  marker.enableDragging();
  marker.addEventListener("dragend", (e) => {     
    console.log("当前位置：" + e.point.lng + ", " + e.point.lat)
    point.lng = e.point.lng;
    point.lat = e.point.lat;
    stationLocation.lng = point.lng;
    stationLocation.lat = point.lat;
    editForm.longtitude = point.lng;
    editForm.latitude = point.lat;
  })
}

var pageTotal = 1;
const pullData = () => {
  cmRequest.request({
    url: 'api/administrator/stationInfo/query',
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
        message: '刷新成功',
      })
    }
  })
}
pullData();


const cancleAddEvent =()=>{
  addFlag.value = false;
  //resetAddedData();
}
const resetFormData = () => {
  //formData.employee_id = '';
  formData.station_name = '';
  formData.station_id = '';
  formData.faliure_status = '';
}

const resetAddedData = () => {
  addedData.station_id = '';
  addedData.station_name = '';
  addedData.employee_id = '';
  addedData.longtitude = '';
  addedData.latitude = '';
  addedData.faliure_status = '';
  addedData.battery_capacity = '';
  addedData.available_battery_count = '';
}

const queryData = () => {
  //将空属性置为Null
  for (const key in formData) {
    if (formData.hasOwnProperty(key) && formData[key] === "" ) {
      formData[key] = null;
    }
  }
  cmRequest.request({
    url: 'api/administrator/stationInfo/query',
    //url: 'administrator/stationInfo',
    method: 'GET',
    params: {
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
      station_name: formData.station_name,
      station_id: formData.station_id,
      //employee_id: formData.employee_id,
      faliure_status: formData.faliure_status
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
//queryData();

const handlePageChange = (val) => {
  query.pageIndex = val;
  queryData();
};


const handleEdit = (row) => {
  editFlag.value = true;
  editForm.station_id = row.station_id;
  editForm.station_name = row.station_name;
  //editForm.employee_id = row.employee_id;
  editForm.longtitude = row.longtitude;
  editForm.latitude = row.latitude;
  editForm.faliure_status = row.faliure_status;
  editForm.battery_capacity = row.battery_capacity;
  //editForm.available_battery_count = row.available_battery_count;
}


const addData = () => {
  let hasNullValue = false;
  for (const key in addedData) {
    if (addedData.hasOwnProperty(key) && addedData[key] === "" ) {
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
      url: 'api/administrator/stationInfo',
      //url: 'administrator/stationInfo',
      method: 'POST',
      data:{
        station_id: addedData.station_id,
        station_name: addedData.station_name,
        employee_id: addedData.employee_id,
        longtitude: addedData.longtitude,
        latitude: addedData.latitude,
        faliure_status: addedData.faliure_status,
        battery_capacity: Number(addedData.battery_capacity),
        available_battery_count: Number(addedData.available_battery_count),
      }
    }).then((res)=>{
      addFlag.value = false;
      //resetAddedData();
      if (!res.code) {
      resetAddedData();
      ElMessage({
        type: 'success',
        //message: '新建成功, 新换电站id为'+res.station_id,
        message: '新建成功',
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
  pullData();
}

const deleteInfo = (val) => {
  cmRequest.request({
    url: 'api/administrator/stationInfo',
    //url: 'administrator/stationInfo',
    method: 'DELETE',
    params: {
      station_id: val.station_id
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
        message: '删除失败 原因：'+ res.msg,
      })
    }
  })
  pullData();
}

const saveEdit = () => {
  cmRequest.request({
    url: 'api/administrator/stationInfo',
    //url: 'administrator/stationInfo',
    method: 'PATCH',
    data: {
      station_id: editForm.station_id,
      employee_name: editForm.station_name,
      //employee_id: editForm.employee_id,
      longitude: editForm.longtitude,
      latitude: editForm.latitude,
      faliure_status: editForm.faliure_status,
      battery_capacity: editForm.battery_capacity,
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
        message: '更新失败 原因：'+ res.message,
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

#myMapAdd{
  width: 350px;
  height: 150px;
  border: black 2px;
}

#myMapEdit{
  width: 350px;
  height: 150px;
  border: black 2px;
}
</style>