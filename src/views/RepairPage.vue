<template>
  <div>维修界面</div>
  <el-button type="primary" :icon="Plus" circle @click="handinDialog = true" />
  <div style="margin-top: 20px">
    <el-button v-for="car in carOptions" :key="car.value" 
    @click="goToDetailPage(car.value)"> {{ car.label }}</el-button>
  </div>

  <!-- 维保信息提交dialog -->
  <el-dialog  
  v-model="handinDialog"
  title="维保信息提交"
  width="50%"
  @open="openHandin"
  @close="handleCancel"
  draggable>
    <el-text class="mx-1">您可以在此处填写维保车辆以及相关需求的信息。
    若需要取送车或事故现场值守等上门服务，请确保已经提前联系过相关门店负责人以及保险方面人员。
    </el-text>
    <el-divider />
    <div class="form">
      <el-row :gutter="10" class="custom-row">
        <el-col :span="4"><span :style="{fontSize: '1.3em'}">维修车辆id</span></el-col>
        <el-col :span="20"><span :style="{fontSize: '1.3em'}">{{ repairItem.vehicle_id }}</span></el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="4"><span :style="{fontSize: '1.3em'}">车牌号</span></el-col>
        <el-col :span="20">
          <el-select v-model="repairItem.license_number" placeholder="请选择">
            <el-option
              v-for="item in carOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="custom-row">
        <el-col :span="4"><span :style="{fontSize: '1.3em'}">维修地点</span></el-col>
        <el-col :span="16">
          <el-input v-model="repairItem.maintenance_location" :placeholder="loadMapButton ? '获取您的位置中...' : '请输入您的位置'" />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="loadMapButton" @click="openMapDia = true"> 
            {{ loadMapButton ? '加载中' : '地图选点' }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="custom-row">
        <el-col :span="4"><span :style="{fontSize: '1.3em'}">维修内容：</span></el-col>
        <el-col :span="20">
          <el-input v-model="repairItem.title" placeholder="请输入维修内容" />
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div style="padding: 0px 0px 20px 0px;">
      维修备注（非必填）
    </div>
    <el-input
    v-model="repairItem.remarks"
    :rows="4"
    type="textarea"
    placeholder="请输入备注"
    />
    <div class="button-wrapper">
      <el-button type="primary" @click="handleClose">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>

  <!-- 地图选点 -->
  <el-dialog
  v-model="openMapDia"
  title="地图选点"
  width="40%" 
  @open="mapOpen" 
  draggable>

  <div class="map-wrapper">
    <div id="myMap"></div>
  </div>
  <div class="address">
    {{"当前地址：" + repairItem.maintenance_location }}
  </div>
  <div class="button-wrapper">
    <el-button type="primary" @click="openMapDia = false">确定</el-button>
  </div>
  </el-dialog>
</template>

<script setup lang="js">
import cmRequest from '../service/index.js'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const handinDialog = ref(false);
const openMapDia = ref(false);
const loadMapButton = ref(true);
const router = useRouter();

const goToDetailPage = (carValue) => {
  // 导航到DetailRepairInfo页面，并传递选中的车辆值作为参数
  console.log(carValue);
  router.push({
     name: 'detailRepairInfo', 
     params: { val: carValue } 
    });
};

//用户需要填写的维修项表
const repairItem = reactive({
  vehicle_id: '123456',
  license_number: '',
  maintenance_location: '',
  remarks: '',
  order_status: '否',
  title:'',
})

const repairLocation = reactive({
  lng: 121.21633041361302,
  lat: 31.268357562330195
});

const carOptions = [
  {
    value: '沪E9999',
    label: '沪E9999',
  },
  {
    value: '沪E8888',
    label: '沪E8888',
  }
]

const clearRepairItem = () => {
  //repairItem.vehicle_id = '';
  repairItem.maintenance_location='';
  repairItem.remarks='';
  repairItem.order_status='否';
  repairLocation.lng = 121.21633041361302;
  repairLocation.lat = 31.268357562330195;
}

const openHandin = () => {
  const BMap = window.BMap;
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition((r)=>{
    if(geolocation.getStatus() == 0){
      var userLocation = r.point; // 用户当前位置的坐标
      var userAddress = r.address; // 用户当前位置的地址信息
      for (const key in userAddress) {
        if (userAddress[key] != '' ) {
          if( key=='province' ){
            repairItem.maintenance_location = userAddress[key] + repairItem.maintenance_location;
          }
          else{
            repairItem.maintenance_location += userAddress[key];
          }
        }
      }
      repairLocation.lat = userLocation.lat;
      repairLocation.lng = userLocation.lng;
      loadMapButton.value = false;
    }
    else {
      ElMessage({
        type: 'warning',
        message: '获取用户位置失败',
      })
      console.log("获取用户位置失败");
      loadMapButton.value = false;
    }
  });

}

const mapOpen = () =>{
  const BMap = window.BMap;
  var map = new BMap.Map("myMap"); 
  console.log("map open");
  var point = new BMap.Point(repairLocation.lng, repairLocation.lat)
  map.centerAndZoom(new BMap.Point(repairLocation.lng, repairLocation.lat), 12);          
  map.enableScrollWheelZoom(true);  
  var geoc = new BMap.Geocoder(); 
  var marker = new BMap.Marker(point); 
  map.addOverlay(marker);   

  map.addEventListener("click", (e)=>{        
    var pt = e.point;
    geoc.getLocation(pt, (rs) => {
        repairItem.maintenance_location = rs.address
        console.log(rs.address);
    });
    map.removeOverlay(marker);
    marker = null;
    point.lng = e.point.lng;
    point.lat = e.point.lat;
    marker = new BMap.Marker(point); 
    map.addOverlay(marker);      
  });
}

const handleCancel = () => {
  clearRepairItem();
  handinDialog.value = false;
}

const handleClose = () => {
  let hasNullValue = false;
  for (const key in repairItem) {
    if (repairItem.hasOwnProperty(key) && repairItem[key] === "" && key != 'remarks' ) {
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
      url: 'api/owner/repair_reservation/submit',
      //url: 'owner/repair_reservation/submit',
      method: 'POST',
      data:{
        vehicle_id: repairItem.vehicle_id,
        maintenance_location: repairItem.maintenance_location,
        remarks: repairItem.remarks,
        order_status: repairItem.order_status,
        plate_number: repairItem.license_number,
        title:repairItem.title
      }
    }).then((res)=>{
      handinDialog.value = false;
      if (!res.code) {
      clearRepairItem();
      ElMessage({
        type: 'success',
        message: '添加维修项成功',
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: '添加维修项失败',
      })
    }
    })
  }
}

</script>

<style scoped>

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
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

.custom-row {
  margin-bottom: 20px;
}

#myMap{
  width: 100%;
  height: 30em;
}
</style>


