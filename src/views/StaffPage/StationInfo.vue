<template>
    <div>
        <div class="block">
            <div class="inner-block">
                <div class="title-and-left">
                    <div class="mytitle">
                        <span>我的换电站</span>
                    </div>
                    <div class="left-section">

                        <div class="text-section">
                            <el-form label-width="170px">
                                <el-form-item label="换电站名字 :" style="font-weight: bold;">
                                    {{ stationInfo.station_name }}
                                </el-form-item>
                                <el-form-item label="换电站ID :" style="font-weight: bold;">
                                    {{stationInfo.station_id }}
                                </el-form-item>
                                <el-form-item label="换电站地址 :" style="font-weight: bold;">
                                    {{stationInfo.station_name }}
                                </el-form-item>
                                <el-form-item label="可用电池数/电池容量 :" style="font-weight: bold;">
                                    {{ stationInfo.available_battery_count }} / {{ stationInfo.battery_capacity }}
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="right-section">
                    <div id="myMap" style="width:100%;height:260px"></div>
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



const stationInfo = ref({})

const pullData = () => {
    cmRequest.request({
        url: 'api/staff/switchstation/station_info',
        method: 'GET',
        params: {
            employee_id: localStorage.getItem('user_id').toString()
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

const mapOpen = () => {
    const BMap = window.BMap;
    var map = new BMap.Map("myMap");
    var point = new BMap.Point(stationInfo.longitude, stationInfo.latitude);
    map.centerAndZoom(new BMap.Point(stationInfo.longitude, stationInfo.latitude), 100);
    map.enableScrollWheelZoom(true);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
onMounted(() => {
    mapOpen();
})

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


.mytitle {
    font-size: 27px;
    font-weight: bold;
    margin-bottom: 1em;
}

.text-section {
    display: flex;
    align-items: flex-start;
    /* label 内容顶部对齐 */
    justify-content: flex-start;
    /* 左对齐 */
    border: 2px solid transparent;
    /* 透明边框，确保阴影显示 */
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);
    /* 上下阴影 */
    padding: 5px;
    /* 调整内边距 */
    border-radius: 20px;
    /* 圆角 */
    padding-right: 40px;
    /* 调整距离 */
}

.text-section .el-form-item {
    text-align: right;
    border-bottom: 2px solid #ddd;
    /* 底部横线分隔线 */
    margin-bottom: 20px;
    /* 控制间距 */
    padding-bottom: 10px;
    /* 控制底部内边距 */
}

.text-section .el-form-item:last-child {
    border-bottom: none;
    /* 移除最后一个元素的底部边框 */
}
.inner-block {
    display: flex;
    align-items: flex-start;
    padding: 20px 20px 60px 20px;
}
.left-section {
    flex: 1;
    margin-right: 70px;
    margin-left: 50px;
}

.right-section {
    width: 60%;
    margin-top: 75px;
    margin-right: 50px;
}

.title-and-left {
    display: flex;
    flex-direction: column;
}</style>