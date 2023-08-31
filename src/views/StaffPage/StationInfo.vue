<template>
    <div>
        <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3 custom-text"> 换电站管理 </span>
            </template>
        </el-page-header>

        <div class="block">
            <div class="inner-block">
                <div class="text-section">
                <div class="mytitle">
                    <span>我的换电站</span>
                </div>

                <el-form label-width="170px">
                    <el-form-item label="换电站名字 :">
                        {{ stationInfo.station_name }}
                    </el-form-item>
                    <el-form-item label="换电站ID :">
                        {{ stationInfo.station_id }}
                    </el-form-item>
                    <el-form-item label="换电站地址 :">
                        {{ stationInfo.station_name }}
                    </el-form-item>
                    <el-form-item label="可用电池数/电池容量 :">
                        {{ stationInfo.available_battery_count }} / {{ stationInfo.battery_capacity }}
                    </el-form-item>
                </el-form>
            </div>
                <div class="map-section">
                    <div id="myMap" class="map-container"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import cmRequest from '@/service/index.js'
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElButton, ElSelect, ElOption, ElCard } from 'element-plus';
import { RefreshRight, Edit, Delete, Plus, Document } from '@element-plus/icons-vue';

const stationInfo = ref({});

const pullData = () => {
    cmRequest.request({
        url: 'api/staff/switchstation/station_info',
        method: 'GET',
        params: {
            employee_id: localStorage.getItem('user_id')
        }
    }).then((res) => {
        if (!res.code) {
            ElMessage({
                type: 'success',
                message: '刷新成功',
            })
            stationInfo.value = res.data;
        }
        else {
            ElMessage({
                type: 'error',
                message: '刷新失败',
            })
        }
    })
};
pullData();
stationInfo.value =
{
    "station_id": "38",
    "station_name": "好内那",
    "faliure_status": true,
    "battery_capacity": 88,
    "available_battery_count": 14,
    "longitude": 121.21633041361302,
    "latitude": 31.268357562330195
};

const mapOpen = () => {
    const BMap = window.BMap;
    var map = new BMap.Map("myMap");
    console.log("map open");
    var point = new BMap.Point(stationInfo.longitude, stationInfo.latitude);
    map.centerAndZoom(point, 6);
    map.enableScrollWheelZoom(false);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
//mapOpen();

</script>

<style scoped>
.block {
    border: 1px white solid;
    border-radius: 10px;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
    overflow: auto;
    background-color: white;
    margin: 30px 20px;
}

.inner-block {
    display: flex;
    align-items: flex-start;
    padding: 20px 20px 60px 20px;
}

.text-section {
    flex: 1;
}
.mytitle {
    font-size: 27px;
    font-weight: bold;
    margin-bottom: 1em;
}

.map-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-left: 20px; /* Add some spacing between text and map */
}

.map-container {
    width: 400px; /* Adjust the width as needed */
    height: 400px; /* Adjust the height as needed */
    border: 1px solid #ddd;
}
</style>