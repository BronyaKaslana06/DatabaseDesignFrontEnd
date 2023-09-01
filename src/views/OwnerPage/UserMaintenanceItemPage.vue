<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 维修服务 </span>
            </template>
        </el-page-header>
        <div class="block">
            <div class="inner-block">
              <div class="content">
                <div class="form-content">
                <el-form label-width="100px" class="form-item-margin" v-loading="loadData">
                    <el-form-item label="当前车辆">
                        <el-select v-model="selectedValue" filterable placeholder="请选择" @change="updateSelected">
                            <el-option v-for="item in options" :key="item.vehicle_id" :label="item.plate_number" :value="item.vehicle_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车型:">
                        <div class="value">{{ infoForm.vehicle_model }}</div>
                    </el-form-item>
                    <el-form-item label="购车时间:">
                        <div class="value">{{ infoForm.purchase_date }}</div>
                    </el-form-item>
                    <el-form-item label="当前电池电量:">
                        <div class="value">{{ infoForm.current_capacity }}</div>
                    </el-form-item>
                </el-form>
              </div>
              <div class="image-content">
                <img :src="base64Image || ''" alt="" class="right-aligned-image" />
              </div>
            </div>
          </div>
        </div>
        <div class="block">
            <div class="inner-block2">
                <div class="top-right">
                    <div class="maintenance-title">
                        维修记录
                        <el-button type="primary" :icon="Plus" circle @click="handinDialog = true" />
                        <!-- 维保信息提交dialog -->
                        <el-dialog v-model="handinDialog" title="维保信息提交" width="50%" @open="openHandin"
                            @close="handleCancel" draggable>
                            <el-text class="mx-1">您可以在此处填写维保车辆以及相关需求的信息。
                                若需要取送车或事故现场值守等上门服务，请确保已经提前联系过相关门店负责人以及保险方面人员。
                            </el-text>
                            <el-divider />
                            <div class="form">
                                <el-row :gutter="10" class="custom-row">
                                    <el-col :span="4"><span :style="{ fontSize: '1.3em' }">维修车辆id</span></el-col>
                                    <el-col :span="20"><span :style="{ fontSize: '1.3em' }">{{ repairItem.vehicle_id
                                    }}</span></el-col>
                                </el-row>
                                <el-row :gutter="10" class="custom-row">
                                    <el-col :span="4"><span :style="{ fontSize: '1.3em' }">车牌号</span></el-col>
                                    <el-col :span="20">
                                        <el-select v-model="selectedValue2" placeholder="请选择" @change="updateSelected2">
                                            <el-option v-for="item in options" :key="item.vehicle_id" :label="item.plate_number"
                                                :value="item.vehicle_id" />
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" class="custom-row">
                                    <el-col :span="4"><span :style="{ fontSize: '1.3em' }">维修地点</span></el-col>
                                    <el-col :span="16">
                                        <el-input v-model="repairItem.maintenance_location"
                                            :placeholder="loadMapButton ? '获取您的位置中...' : '请输入您的位置'" />
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="primary" :loading="loadMapButton" @click="openMapDia = true">
                                            {{ loadMapButton ? '加载中' : '地图选点' }}</el-button>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" class="custom-row">
                                    <el-col :span="4"><span :style="{ fontSize: '1.3em' }">维修内容：</span></el-col>
                                    <el-col :span="20">
                                        <el-input v-model="repairItem.title" placeholder="请输入维修内容" />
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" class="custom-row">
                                    <el-col :span="4"><span :style="{ fontSize: '1.3em' }">预约时间：</span></el-col>
                                    <el-col :span="20">
                                      <el-date-picker
                                        v-model="repairItem.appoint_time"
                                        type="datetime"
                                        placeholder="选择日期和时间"
                                        value-format="YYYY-MM-DD HH:mm:ss"
                                        />
                                    </el-col>
                                </el-row>
                            </div>
                            <el-divider />
                            <div style="padding: 0px 0px 20px 0px;">
                                维修备注（非必填）
                            </div>
                            <el-input v-model="repairItem.remarks" :rows="4" type="textarea" placeholder="请输入备注" />
                            <div class="button-wrapper">
                                <el-button type="primary" @click="handleClose">提交</el-button>
                                <el-button @click="handleCancel">取消</el-button>
                            </div>
                        </el-dialog>

                        <!-- 地图选点 -->
                        <el-dialog v-model="openMapDia" title="地图选点" width="40%" @open="mapOpen" draggable>

                            <div class="map-wrapper">
                                <div id="myMap"></div>
                            </div>
                            <div class="address">
                                {{ "当前地址：" + repairItem.maintenance_location }}
                            </div>
                            <div class="button-wrapper">
                                <el-button type="primary" @click="openMapDia = false">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 日期选择 -->
                    <div class="date-picker-wrapper">
                        <el-date-picker v-model="timeValue" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                            format="YYYY 年 MM 月 DD 日" :shortcuts="shortcuts" @clear="handleDateClear" @change="getDate">
                        </el-date-picker>
                    </div>

                </div>
                <div class="infinite-list-wrapper" style="overflow:auto">
                    <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled" v-loading="loadData2">
                        <li v-for="item in listdata" :key="item.maintenance_item_id" class="list-item">
                            <div class="list-item-content">
                                <div class="list-item-image">
                                    <img src="@/assets/repair.png" alt="Image" />
                                </div>
                                <div class="list-item-text">
                                    <p class="title">{{ item.title }}</p>
                                    <p class="location-date">{{ item.maintenance_location }} - {{ item.order_submission_time
                                    }}</p>
                                </div>
                                <div class="list-item-button">
                                  <template v-if="item.order_status === '待接单'">
                                    <el-button type="primary" disabled>待接单</el-button>
                                    </template>
                                    <template v-if="item.order_status === '待完成'">
                                    <el-button type="info" disabled>待完成</el-button>
                                    </template>
                                    <template v-if="item.order_status === '待评分'">
                                    <el-button type="warning" disabled>待评分</el-button>
                                    </template>
                                    <template v-if="item.order_status === '已完成'">
                                    <el-button type="success" disabled>已完成</el-button>
                                    </template>
                                    <el-button text :icon="Document"
                                        @click="Detail(item.maintenance_item_id)">查看详情</el-button>
                                    <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否删除"
                                        @confirm="deleteInfo(item.maintenance_item_id)">
                                        <template #reference>
                                          <template v-if="item.order_status === '待接单'||item.order_status === '待完成'">
                                            <el-button style="color: red;" text :icon="Delete">
                                                删除
                                            </el-button>
                                          </template>
                                          <template v-else>
                                            <el-button style="color: red;" text :icon="Delete" disabled>
                                                删除
                                            </el-button>
                                          </template>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p v-if="loading">加载中...</p>
                    <p v-if="noMore">没有更多了</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const loadData = ref(false);
const loadData2 = ref(false);
const options =  ref([]);
const base64Image = ref('')
const showImage = ref(false)

const getOptions = () => {
    cmRequest.request({
      url: 'api/owner/repair_reservation/own_query',
      //url: '/owner/repair_reservation/own_query',      
      method: 'GET',
      params: {
        owner_id: localStorage.getItem('user_id')  
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        options.value = res.data;
      }
      else{
        ElMessage({
          type: 'error',
          message: '刷新失败',
        })
      }
    })
};
getOptions();


const selectedValue = ref('');

const infoForm = reactive({
    vehicle_id: 0,
    vehicle_model: '',
    purchase_date: '',
    current_capacity: '',
    snip:'',
    start_time:'1000-01-01',
    end_time:'9999-12-31'
});

const rough_query=()=>{
    loadData2.value = true;
    cmRequest.request({
      url: 'api/owner/repair_reservation/rough_query',
      //url: '/owner/repair_reservation/rough_query',      
      method: 'GET',
      params: {
        vehicle_id : infoForm.vehicle_id,
        start_time : infoForm.start_time,
        end_time : infoForm.end_time
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        listdata.value=res.data;
        //listdata.value = 
      }
      else{
        ElMessage({
          type: 'error',
          message: '刷新失败',
        })
      }
      loadData2.value=false;
    })
};

const updateSelected = () => {
    loadData.value = true;
    showImage.value = true;
    // 根据选择器的选择更新相关变量的值
    infoForm.vehicle_id = selectedValue.value;
    cmRequest.request({
      url: 'api/owner/repair_reservation/info_query',
      //url: '/owner/repair_reservation/info_query',      
      method: 'GET',
      params: {
        vehicle_id : infoForm.vehicle_id
      }
    }).then((res) => {
      if(!res.code){
        ElMessage({
          type: 'success',
          message: '刷新成功',
        })
        infoForm.vehicle_model = res.data[0].vehicle_model;
        infoForm.purchase_date = res.data[0].purchase_date;
        infoForm.current_capacity = res.data[0].current_capacity;
        //更新图片信息
        infoForm.snip = res.data[0].snip;
        base64Image.value = 'data:image/png;base64,'+ infoForm.snip;
      }
      else{
        ElMessage({
          type: 'error',
          message: '刷新失败',
        })
      }
      loadData.value = false;
      showImage.value = false;
    })

    //获取当前的维修订单的接口
    //更新listdata的值
    rough_query();
};

const timeValue = ref('');


const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const handleDateClear= () => {
      infoForm.start_time = '1000-01-01';
      infoForm.end_time = '9999-12-31';
      //写接口，进行搜索
    rough_query();
};

const getDate = () => {
    console.log('timevalue:', timeValue.value[0]);
    console.log('startDate:', timeValue.value[0]);
    console.log('endDate:', timeValue.value[1]);
    /*
    if (timeValue.value && timeValue.value[0] !== null && timeValue.value[1] !== null)
    {
      infoForm.start_time = timeValue.value[0];
      infoForm.end_time = timeValue.value[1];
    }
    else
    {
      infoForm.start_time = '1000-01-01';
      infoForm.end_time = '9999-12-31';
  }*/
    infoForm.start_time = timeValue.value[0];
      infoForm.end_time = timeValue.value[1];
    //写接口，进行搜索
    rough_query();
};

const listdata = ref([]);

const count = ref(4)
const loading = ref(false)
const noMore = computed(() => count.value >= listdata.value.length)
const disabled = computed(() => loading.value || noMore.value)
const load = () => {
  console.log("Scroll event triggered");
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 2000)
}

const goBack = () => {
  // 使用 Vue Router 的 go(-1) 方法返回上一个访问的页面
  router.go(-1);
};

const router = useRouter();
const Detail = (maintenanceItemId) => {
    // Perform the desired action using the maintenanceItemId parameter
    console.log('Editing item with ID:', maintenanceItemId);
    router.push({
        name: 'detailRepairInfo',
        params: { val: maintenanceItemId }
    });
};

const deleteInfo = (maintenanceItemId) => {
  // Perform the desired delete action
  console.log('Deleting item with ID:', maintenanceItemId);
  cmRequest.request({
      url: 'api/owner/repair_reservation/delete',
      //url: '/owner/repair_reservation/delete',
      method: 'DELETE',
      params: {
        maintenance_item_id: maintenanceItemId
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
    rough_query();
};

/*  ccr   */
const handinDialog = ref(false);
const openMapDia = ref(false);
const loadMapButton = ref(true);

//用户需要填写的维修项表
const repairItem = reactive({
    vehicle_id: '',
    plate_number: '',
    maintenance_location: '',
    remarks: '',
    title: '',
    appoint_time:'',
    longitude:'',
    latitude:''
})
const selectedValue2 = ref('');

const updateSelected2 = () => {
    // 根据选择器的选择更新相关变量的值 
    //对于一个变量没有意义写这个函数，但是防止后续新增的绑定关系，在这里用这个函数来写
    repairItem.vehicle_id = selectedValue2.value;
    repairItem.plate_number = selectedValue2.label;
    console.log("id:", repairItem.vehicle_id);
    console.log("plate number:", repairItem.plate_number);
};

const repairLocation = reactive({
    lng: 121.21633041361302,
    lat: 31.268357562330195
});

const clearRepairItem = () => {
    //repairItem.vehicle_id = '';
    repairItem.maintenance_location = '';
    repairItem.remarks = '';
    repairItem.appoint_time = '';
    repairItem.longitude = repairLocation.lng;
    repairItem.latitude = repairLocation.lat;

    repairLocation.lng = 121.21633041361302;
    repairLocation.lat = 31.268357562330195;
}

const openHandin = () => {
    const BMap = window.BMap;
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition((r) => {
        if (geolocation.getStatus() == 0) {
            var userLocation = r.point; // 用户当前位置的坐标
            var userAddress = r.address; // 用户当前位置的地址信息
            for (const key in userAddress) {
                if (userAddress[key] != '') {
                    if (key == 'province') {
                        repairItem.maintenance_location = userAddress[key] + repairItem.maintenance_location;
                    }
                    else {
                        repairItem.maintenance_location += userAddress[key];
                    }
                }
            }
            repairLocation.lat = userLocation.lat;
            repairLocation.lng = userLocation.lng;
            repairItem.longitude=repairLocation.lng;
            repairItem.latitude=repairLocation.lat;
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

const mapOpen = () => {
    const BMap = window.BMap;
    var map = new BMap.Map("myMap");
    console.log("map open");
    var point = new BMap.Point(repairLocation.lng, repairLocation.lat)
    map.centerAndZoom(new BMap.Point(repairLocation.lng, repairLocation.lat), 12);
    map.enableScrollWheelZoom(true);
    var geoc = new BMap.Geocoder();
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);

    map.addEventListener("click", (e) => {
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
        //lz
        console.log("lng:",point.lng);
        console.log("lat:",point.lat);
        repairItem.longitude=point.lng;
        repairItem.latitude=point.lat;
        console.log("up lo:",repairItem.longitude);
        console.log("up lo:",repairItem.latitude);
    });
    
}

const handleCancel = () => {
    clearRepairItem();
    handinDialog.value = false;
}

const handleClose = () => {
    let hasNullValue = false;
    for (const key in repairItem) {
        if (repairItem.hasOwnProperty(key) && repairItem[key] === "" && key != 'remarks') {
            hasNullValue = true;
            break; // 找到任意一个值为0的属性后，就不再继续检查
        }
    }
    if (hasNullValue) {
        ElMessage({
            type: 'warning',
            message: '请填写完整信息',
        })
    }
    else {
        cmRequest.request({
            url: 'api/owner/repair_reservation/submit',
            //url: 'owner/repair_reservation/submit',
            method: 'POST',
            data: {
                vehicle_id: (repairItem.vehicle_id).toString(),
                maintenance_location: repairItem.maintenance_location,
                remarks: repairItem.remarks,
                plate_number: repairItem.plate_number,
                title: repairItem.title,
                appoint_time:repairItem.appoint_time,
                longitude:repairItem.longitude,
                latitude:repairItem.latitude
            }
        }).then((res) => {
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
.custom-text {
    font-size: 1.5em; /* 调整字体大小 */
  }
.block {
    border: 1px white solid;
    border-radius: 10px;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
    overflow: auto;
    background-color: white;
    margin: 30px 20px;
}

.inner-block {
    padding: 20px 20px 30px 20px;
}
.content {
  display: flex; /* 创建水平布局 */
  align-items: center; /* 垂直居中对齐 */
}

.form-content {
  flex: 1; /* 让表单内容占据剩余的空间 */
}
.right-aligned-image {
  float: right; /* 靠右显示 */
  width: 600px; /* 设置图片的宽度，根据需要调整大小 */
  height: auto; /* 让高度自动适应宽度的变化 */
  margin-left: 20px; /* 添加一些左边距，以防止文字与图片过于接近 */
}
.inner-block2 {
    padding: 20px 20px 60px 20px;
}

.maintenance-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.date-picker-wrapper {

    text-align: right;
}


.infinite-list-wrapper {
    height: 300px;
  }

  .infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-bottom: 1px solid #ddd;
  }

  .infinite-list-wrapper .list-item + .list-item {
    margin-top: 10px;
  }

  .infinite-list-wrapper .list-item-content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .infinite-list-wrapper .list-item-image {
    margin-right: 10px;
  }

  .infinite-list-wrapper .list-item-image img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .infinite-list-wrapper .list-item-text {
    flex: 1;
    margin-left: 10px;
  }

  .infinite-list-wrapper .title {
    font-weight: bold;
  }

  .infinite-list-wrapper .location-date {
    font-size: 14px;
    color: #999;
  }



.form-item-margin {
    margin-top: 40px;
    /* 添加上边框间距 */
    margin-left: 30px;
    /* 添加左边框间距 */
}

.top-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.button-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.custom-row {
    margin-bottom: 20px;
}

#myMap {
    width: 100%;
    height: 30em;
}
</style>