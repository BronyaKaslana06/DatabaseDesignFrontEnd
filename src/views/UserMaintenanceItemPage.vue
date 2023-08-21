<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 维修服务 </span>
            </template>
        </el-page-header>
        <div class="block">
            <div class="inner-block">
                <el-form label-width="100px" class="form-item-margin">
                    <el-form-item label="当前车辆">
                        <el-select v-model="selectedValue" filterable placeholder="请选择" @change="updateSelected">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
                                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                :value="item.value" />
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
                            format="YYYY 年 MM 月 DD 日" :picker-options="pickerOptions" @change="getDate">
                        </el-date-picker>
                    </div>

                </div>
                <div class="infinite-list-wrapper" style="overflow:auto">
                    <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
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
                                    <el-button text :icon="Document"
                                        @click="Detail(item.maintenance_item_id)">查看详情</el-button>
                                    <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否删除"
                                        @confirm="deleteInfo(item.maintenance_item_id)">
                                        <template #reference>
                                            <el-button style="color: red;" text :icon="Delete">
                                                删除
                                            </el-button>
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
import cmRequest from '../service/index.js'
import { useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const options = [
    { value: '1', label: '沪A12345' },
    { value: '2', label: '沪B12345' },
    { value: '3', label: '沪C12345' },
    { value: '4', label: '沪D12345' },
    { value: '5', label: '沪E12345' }
];

const getOptions = () => {
    //写接口
    return options;
};
const selectedValue = ref('');

const infoForm = reactive({
    vehicle_id: '',
    vehicle_model: '',
    purchase_date: '',
    current_capacity: '',

    //可能需要加时间两个变量
});


const updateSelected = () => {
    // 根据选择器的选择更新相关变量的值
    infoForm.vehicle_id = selectedValue;
    //写接口 
    infoForm.vehicle_model = '更新后的车型';
    infoForm.purchase_date = '更新后的购车时间';
    infoForm.current_capacity = '更新后的电池电量';
    //获取当前的维修订单的接口
    //更新listdata的值
};

const repairRoughItem = reactive({
    maintenance_item_id: '',
    title: '',
    order_submission_time: '',
    maintenance_location: '',
});

const timeValue = ref('');


const pickerOptions = {
    shortcuts: [
        {
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            },
        },
    ]
};

const getDate = ([startDate, endDate]) => {
    console.log('开始日期:', startDate);
    console.log('结束日期:', endDate);
    //写接口，进行搜索
};

const listdata = ref([
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '2',
        title: '维修项目2',
        order_submission_time: '2023-08-02',
        maintenance_location: '地点2',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },


    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    {
        maintenance_item_id: '1',
        title: '维修项目1',
        order_submission_time: '2023-08-01',
        maintenance_location: '地点1',
    },
    // ...其他数据
]);



const count = ref(3);
const loading = ref(false);

const noMore = computed(() => count.value >= listdata.value.length);

const disabled = computed(() => loading.value || noMore.value);

const load = () => {
    console.log(1);
  loading.value = true;
  setTimeout(() => {
    count.value += 2;
    loading.value = false;
  }, 2000);
};

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
};

/*  ccr   */
const handinDialog = ref(false);
const openMapDia = ref(false);
const loadMapButton = ref(true);

//用户需要填写的维修项表
const repairItem = reactive({
    vehicle_id: '',
    license_number: '',
    maintenance_location: '',
    remarks: '',
    order_status: '否',
    title: '',
})
const selectedValue2 = ref('');
const updateSelected2 = () => {
    // 根据选择器的选择更新相关变量的值 
    //对于一个变量没有意义写这个函数，但是防止后续新增的绑定关系，在这里用这个函数来写
    repairItem.vehicle_id = selectedValue2;
    console.log("id:", repairItem.vehicle_id);
};

const repairLocation = reactive({
    lng: 121.21633041361302,
    lat: 31.268357562330195
});

const clearRepairItem = () => {
    //repairItem.vehicle_id = '';
    repairItem.maintenance_location = '';
    repairItem.remarks = '';
    repairItem.order_status = '否';
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
                vehicle_id: repairItem.vehicle_id,
                maintenance_location: repairItem.maintenance_location,
                remarks: repairItem.remarks,
                order_status: repairItem.order_status,
                plate_number: repairItem.license_number,
                title: repairItem.title
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



.list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.list-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.list-item-content {
    display: flex;
    align-items: center;
    width: 100%;
}

.list-item-image {
    margin-right: 10px;
}

.list-item-image img {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.list-item-text {
    flex: 1;
}

.title {
    font-weight: bold;
}

.location-date {
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