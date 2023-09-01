<template>
    <div>
        <div>
            <input v-model="keyword" type="text" class="search-bar" placeholder="请输入关键词" @keydown.enter="search" />
            <button  v-wave="{  color: 'white',
                    initialOpacity: 0.7,
                    duration: 0.35,
                    easing: 'ease-out'}" class="search-button" @click="search">查询</button>
        </div>
        <div v-infinite-scroll="load" style="overflow: auto" class="info-list" :infinite-scroll-disabled="loading"
            infinite-scroll-distance="100">
            <div v-for="(item, index) in dataItem" :key="index" class="info-group">
                <div v-wave="{
                    color: '#3FA89F',
                    initialOpacity: 0.5,
                    duration: 0.3,
                    easing: 'ease-in',
                }" class="info-block" @click="drawer = true, getSpecificInfo(item.station_id)">
                    <div class="station_name">{{ item.station_name }}</div>
                    <div class="distance">{{ item.distance + "m" }}</div>
                    <div class="opening_time">{{ "营业时间：" + item.opening_time }}</div>
                    <div class="cell">
                        <div style="align-items: center; display: flex;transform: translateY(-4px);">
                            <div>可用电池数：</div>
                            <div class="cell-avb-num">{{ item.cell_avb_num }}</div>
                            <div class="cell-num">{{ "/" + item.cell_num }}</div>
                        </div>
                    </div>
                    <div class="waiting_number">{{ "等候：" + item.waiting_number + "人" }}</div>
                </div>
            </div>
        </div>
        <el-drawer v-model="drawer" direction="rtl" size="40%" :with-header="false">
            <div class="drawer-info-group">
                <div class="spc-st-name">{{ specificDataItem.station_name }}</div>
                <div class="spc-st-dist">{{ "距离您约" + specificDataItem.distance + "米" }}</div>
                <div class="green-block">
                    <div style="display: inline-block;position: relative;left:25%">
                        <div>
                            <div
                                style="display: inline;font-size: 36.5px;color: #3FA89F;font-style: normal;font-weight: 700;line-height: 150%;">
                                {{ specificDataItem.cell_avb_num }}
                            </div>
                            <div
                                style="display: inline;font-size: 36.5px;color: black;font-style: normal;font-weight: 700;line-height: 150%;width:auto">
                                /</div>
                            <div
                                style="display: inline;font-size: 23.5px;color: black;font-style: normal;font-weight: 700;line-height: 150%;">
                                {{ specificDataItem.cell_num }}
                            </div>
                        </div>
                        <div class="btm-title">
                            可用电池
                        </div>
                    </div>
                    <div style="display: inline-block;position: relative;left:50%">
                        <div>
                            <div
                                style="display:inline-block;font-size: 36.5px;color: black;font-style: normal;font-weight: 700;line-height: 150%;position:relative;left:50%;transform: translateX(-50%);">
                                {{ specificDataItem.waiting_number }}</div>
                        </div>
                        <div class="btm-title">
                            排队人数
                        </div>
                    </div>
                    <img src="@/assets/logo2.png"
                        style="position: absolute;bottom: 10px;right: 16px;transform: scale(0.05);transform-origin: bottom right; " />
                </div>
                <div style="display:flex; flex-direction: column;">
                    <div class="spc-opening_time">{{ "营业时间： " + specificDataItem.opening_time }}</div>
                    <div class="spc-power_rate">{{ "电费： ￥" + specificDataItem.power_rate + " / 度" }}</div>
                    <div class="spc-service_fee">{{ "服务费： ￥" + specificDataItem.service_fee + " / 次" }}</div>
                    <div class="spc-parking_fee">{{ "停车费： " + specificDataItem.parking_fee }}</div>
                    <div class="spc-battery">电池信息</div>
                    <div style="display: flex;flex-direction: column;">
                        <div style="position: relative;margin-bottom: 10px;display: flex;">
                            <div style="display: inline-block;" class="spc-space">标准续航级（70/75kWh）</div>
                            <div style="display: inline;position: absolute;left: 60%;align-items: center;">
                                <div
                                    style="display: inline-block;color: #3FA89F;font-size: 20px;font-style: normal;font-weight: 400;">
                                    {{ specificDataItem.std_avb_num + '可用' }}&nbsp</div>
                                <div style="display: inline-block;">{{ " / " + specificDataItem.std_iavb_num + "充电" }}</div>
                            </div>
                        </div>
                        <div style="position: relative;display: flex;margin-bottom: 10px;">
                            <div style="display: inline-block;" class="spc-space">长续航级（100kWh）</div>
                            <div style="display: inline;position: absolute;left: 60%;align-items: center;">
                                <div
                                    style="display: inline-block;color: #3FA89F;font-size: 20px;font-style: normal;font-weight: 400;">
                                    {{ specificDataItem.lng_avb_num + '可用' }}&nbsp</div>
                                <div style="display: inline-block;">{{ " / " + specificDataItem.lng_iavb_num + "充电" }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="spc-address">{{ specificDataItem.address }}</div>
                    <div id="station_map" style="width:100%;height:200px"></div>
                </div>
                <button type="button" @click="rsvFlag = true" class="reservation-button" v-wave="{
                    color: 'white',
                    initialOpacity: 0.5,
                    duration: 0.25,
                    easing: 'ease-in'
                }">预约换电</button>
            </div>

        </el-drawer>
        <el-dialog v-model="rsvFlag" @close="resetForm">
            <div style="display:inline-block;position: relative;left:50%;transform: translateX(-50%);">预约换电日期</div>
            <div
                style="display: flex;align-items: center;justify-content: space-around;width: 90%;position: relative;left:50%;transform:translateX(-50%);margin-top: 20px;">
                <el-radio-group v-model="dateRadio">
                    <div v-for="item in dateArray">
                        <el-radio border :label="item" :value="item" @click.native="timeArrayCheck(item)">{{ item
                        }}</el-radio>
                    </div>
                </el-radio-group>
            </div>
            <div style="display:inline-block;position: relative;left:50%;transform: translateX(-50%);margin:20px 0">预约换电时间段
            </div>
            <div
                style="display: flex;align-items: center;justify-content: space-around;position: relative;left:50%;transform:translateX(-50%);flex-wrap: nowrap;">
                <el-radio-group v-model="timeRadio">
                    <div v-for="(item, index) in timeArray">
                        <el-radio border :key="index" :label="item.value" :disabled="item.disabled">{{
                            item.label }}</el-radio>
                    </div>
                </el-radio-group>
            </div>
            <div style="display:inline-block;position: relative;left:50%;transform: translateX(-50%);margin:20px 0">换电方式
            </div>
            <div
                style="display: flex;align-items: center;justify-content: space-around;width: 90%;position: relative;left:50%;transform:translateX(-50%);">
                <el-radio-group v-model="switchType">
                    <el-radio label="线下换电"></el-radio>
                    <el-radio label="上门换电"></el-radio>
                </el-radio-group>
            </div>
            <div v-if="switchType === '上门换电'"
                style="display:inline-block;position: relative;left:50%;transform: translateX(-50%);">
                <div style="display:inline;">地址</div>
                <el-input style="width:450px;margin-left: 10px;margin-top: 10px;" v-model="address"></el-input>
            </div>
            <div style="display: inline-block;left: 50%;
    position: relative;
    transform: translateX(-50%);">
                <div style="display:inline;">其他</div>
                <el-input style="width:600px;margin-left: 10px;margin-top: 10px;" v-model="additionalInfo"></el-input>
            </div>
            <button class="reservation-button submit-button" v-wave="{
                color: 'white',
                initialOpacity: 0.5,
                duration: 0.3,
                easing: 'ease-in'
            }" @click='submit'>提交</button>
        </el-dialog>
    </div>
</template>

<script setup lang="js">
import { ElMessage } from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';

import cmRequest from '../../service/index.js';

let curInfoIndex = 1;
let curStationID = null;
const loading = ref(false);
const dataItem = ref([]);
const rsvFlag = ref(false);
const dateArray = ref([]);
const dateRadio = ref(null);
const timeRadio = ref(null);
const switchType = ref(null);
const address = ref(null);
const keyword = ref(null);
const additionalInfo = ref(null);
const timeArray = ref([
    { label: "0:00-4:00", value: 0, disabled: false },
    { label: "4:00-8:00", value: 1, disabled: false },
    { label: "8:00-12:00", value: 2, disabled: false },
    { label: "12:00-16:00", value: 3, disabled: false },
    { label: "16:00-20:00", value: 4, disabled: false },
    { label: "20:00-24:00", value: 5, disabled: false }
]);


const timeArrayCheck = (selectedDate) => {
    const currentDate = dateArray.value[0];    //当前系统的日期

    const date = new Date();
    const currentHour = date.getHours();

    // 如果选中的日期是今天并且当前小时超过了选中的时间段的结束小时
    if (selectedDate === currentDate) {
        for (let i = 0; i < timeArray.value.length; i++) {
            if (currentHour >= (timeArray.value[i].value + 1) * 4)
                timeArray.value[i].disabled = true;
        }
    }
    else {
        for (let i = 0; i < timeArray.value.length; i++) {
            timeArray.value[i].disabled = false;
        }
    }
};

const search = () => {
    if (keyword.value == "") {
        dataItem.value = [];
        curInfoIndex =1;
        pullData();
    }
    cmRequest.request({
        url: "api/owner/stations/keyword",
        method: 'GET',
        params: {
            info_num: 15,
            info_index: 1,
            keyword: keyword.value
        }
    }).then((res) => {
        if (!res.code) {
            dataItem.value = res.data;
            loading.value = true;
        }
        else {
            ElMessage({
                type: 'error',
                message: '查询失败',
            })
        }
    })
}

const resetForm = () => {
    dateRadio.value = null;
    timeRadio.value = null;
    switchType.value = null;
    address.value = null;
    additionalInfo.value = null;
}


const initDateArray = () => {
    const currentDate = new Date();
    const res = [];

    for (let i = 0; i < 3; i++) {
        const nextDate = new Date(currentDate);

        nextDate.setDate(currentDate.getDate() + i);

        const nextDateStr = nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + nextDate.getDate();
        res.push(nextDateStr);
    }
    dateArray.value = res;
}

initDateArray();
const specificDataItem = reactive({
    battery_array: [],
    service_fee: 0,
    parking_fee: 0,
    power_rate: 0,
    latitude: 0,
    longitude: 0,
    opening_time: "",
    station_name: "",
    distance: 0,
    address: "",
    cell_avb_num: 0,
    cell_num: 0,
    waiting_number: 0,
    std_avb_num: 0,
    std_iavb_num: 0,
    lng_avb_num: 0,
    lng_iavb_num: 0
});
const drawer = ref()

const submit = () => {
    if (dateRadio.value == null || timeRadio.value == null || switchType.value == null || (switchType.value === "上门换电" && address.value == null)) {
        ElMessage({
            type: 'warning',
            message: '请填写完整的表单信息'
        });
        return;
    }
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 注意月份从0开始，所以要加1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    currrent_time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    cmRequest.request({
        url: 'api/owner/switch-reservation',
        method: 'POST',
        params: {
            owner_id: localStorage.getItem("user_id"),
            replace_type: switchType.value,
            owner_address: address.value,
            additional_info: additionalInf.value,
            date: dateRadio.value,
            period: timeRadio.value,
            station_id: curStationID,
            create_time: currrent_time
        }
    }).then((res) => {
        if (!res.code) {
            ElMessage({
                type: 'success',
                message: '换电请求发送成功',
            })
        }
        else {
            ElMessage({
                type: 'error',
                message: '换电请求发送失败',
            })
        }
    })
}

const pullData = () => {
    const BMap = window.BMap;
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition((r) => {
        if (geolocation.getStatus() == 0) {
            var userLocation = r.point;
            var user_lat = userLocation.lat;
            var user_lng = userLocation.lng;
            cmRequest.request({
                url: 'api/owner/stations',
                method: 'GET',
                params: {
                    latitude: user_lat,
                    longitude: user_lng,
                    info_num: 18,
                    info_index: curInfoIndex
                }
            }).then((res) => {
                if (!res.code) {  
                    if ( typeof dataItem.value === 'undefined' ||  dataItem.value.length === 0) {
                        dataItem.value = res.data;
                    } else {
                        dataItem.value = [...dataItem.value, ...res.data];
                    }
                    loading.value = false;
                }
                else {
                    ElMessage({
                        type: 'error',
                        message: '换电站信息获取失败',
                    })
                }
            })

        }
        else {
            ElMessage({
                type: 'error',
                message: '获取用户位置失败',
            })
            return;
        }
    });


}
const load = () => {
    loading.value = true;
    pullData();
    curInfoIndex++;
}

const assignment = (data) => {
    specificDataItem.station_name = data.station_name;
    specificDataItem.service_fee = data.service_fee;
    specificDataItem.opening_time = data.opening_time;
    specificDataItem.latitude = data.latitude;
    specificDataItem.longitude = data.longitude;
    specificDataItem.distance = data.distance;
    specificDataItem.power_rate = data.power_rate;
    specificDataItem.parking_fee = data.parking_fee;
    specificDataItem.battery_array = data.battery_array;
    specificDataItem.cell_avb_num = 0;
    specificDataItem.std_avb_num = 0;
    specificDataItem.std_iavb_num = 0;
    specificDataItem.lng_avb_num = 0;
    specificDataItem.lng_iavb_num = 0;
    specificDataItem.cell_num = data.battery_array.length;
    specificDataItem.waiting_number = data.waiting_number;
    specificDataItem.address = data.address;
    for (const item of specificDataItem.battery_array) {
        if (item.available_status === "可用") {
            specificDataItem.cell_avb_num++;
            if (item.battery_type === "标准续航级")
                specificDataItem.std_avb_num++;
            else if (item.battery_type === "长续航级")
                specificDataItem.lng_avb_num++;
        }
        else if (item.available_status === "充电中") {
            if (item.battery_type === "标准续航级")
                specificDataItem.std_iavb_num++;
            else if (item.battery_type === "长续航级")
                specificDataItem.lng_iavb_num++;
        }
    }
}

const getSpecificInfo = (id) => {
    cmRequest.request({
        url: "api/owner/stations/detailed-infos",
        method: "GET",
        params: {
            station_id: id,
            longitude: 120,
            latitude: 30,
        }
    }).then((res) => {
        if (!res.code) {
            curStationID = id;
            assignment(res.data);
            drawMap();
        }
        else {
            ElMessage({
                type: 'error',
                message: '获取换电站具体信息失败',
            })
            return;
        }
    })
}

const drawMap = () => {
    const BMap = window.BMap;
    var map = new BMap.Map("station_map");
    var point = new BMap.Point(specificDataItem.longitude, specificDataItem.latitude);
    map.centerAndZoom(new BMap.Point(specificDataItem.longitude, specificDataItem.latitude), 100);
    map.enableScrollWheelZoom(true);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
</script>
<style scoped>
.reservation-button {
    transform: translateX(-50%);
    position: relative;
    left: 50%;
    height: 40px;
    width: 50%;
    background-color: #4FD1C5;
    border-radius: 20px;
    border: solid 1px #4FD1C5;
    color: white;
    font-weight: bolder;
    font-size: 20px;
    margin-top: 20px;
    cursor: pointer;
}

.submit-button {
    height: 30px;
    display: block;
    font-size: 10px;
    width: 25%;
}

.btm-title {
    color: rgba(0, 0, 0, 0.61);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    display: inline-block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}

.search-button {
    display: inline;
    margin-left: 20px;
    width: 100px;
    background-color: #4FD1C5;
    border-radius: 20px;
    border: solid 1px #4FD1C5;
    color: white;
    font-weight: bolder;
    font-size: 20px;
    margin-top: 20px;
    cursor: pointer;
    height: 40px;
}



.drawer-info-group {
    padding-left: 43px;
    padding-right: 43px;
    position: relative;
}

.green-block {
    width: 100%;
    height: 90px;
    border-radius: 9px;
    background: rgba(79, 209, 197, 0.13);
    padding-top: 10px;
    position: relative;
}

.spc-st-name {
    color: rgba(0, 0, 0, 0.72);
    font-family: Microsoft YaHei UI;
    font-size: 36.53px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    margin-top: 64px;
    margin-bottom: 10px;
}

.spc-st-dist {
    color: #6A6A6A;
    font-family: Microsoft YaHei UI;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 20px;
    /* 24px */
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
    border-color: #4FD1C5;
    background-color: #4FD1C5;
    color: #4FD1C5;
}

:deep(.el-radio__input.is-checked+.el-radio__label) {
    color: #3FA89F;
}

:deep(.el-radio.is-bordered.is-checked) {
    border-color: #4FD1C5;
}

:deep(.el-drawer.rtl.open) {
    border-radius: 25px 0 0 25px;
}

:deep(.el-radio-group) {
    flex-wrap: nowrap;
}

.distance {
    position: absolute;
    top: 0;
    right: 15px;
    margin-right: 5px;
    margin-top: 30px;
    color: #666;
    font-size: 20px;
    display: flex;

}


.cell::before {
    display: flex;
    content: url(../../assets/battery.svg);
    margin-right: 12px;
    align-items: center;
}

.spc-opening_time,
.opening_time,
.cell,
.waiting_number,
.spc-power_rate,
.spc-service_fee,
.spc-parking_fee,
.spc-address,
.spc-battery {
    display: flex;
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin: 15px 0;
}

.spc-space {
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
}

.spc-address::before {
    content: url(../../assets/address.svg);
    margin-right: 18px;
    align-items: center;
}

.spc-space::before {
    content: url(../../assets/space.png);
    margin-right: 18px;
    align-items: center;
}

.spc-battery::before {
    content: url(../../assets/battery.svg);
    margin-right: 18px;
    align-items: center
}

.spc-parking_fee::before {
    content: url(../../assets/parking_fee.svg);
    margin-right: 18px;
    align-items: center
}

.spc-parking_fee {
    margin-left: 4px;
}

.spc-service_fee {
    margin-left: 42px;
    height: 30.22px;
}

.spc-power_rate::before {
    content: url(../../assets/power_rate.svg);
    margin-right: 18px;
    align-items: center
}

.spc-opening_time::before {
    content: url(../../assets/opening_time.svg);
    margin-right: 18px;
    align-items: center
}

.opening_time::before {
    content: url(../../assets/opening_time.svg);
    margin-right: 12px;
    align-items: center
}

.waiting_number::before {
    content: url(../../assets/waiting_people.svg);
    margin-right: 12px;
    align-items: center
}

.distance::before {
    content: url(../../assets/location.svg);
    align-items: center;
}

.station_name {
    font-size: 23.53px;
    font-weight: bolder;
    width: 80%;
}

.info-group {
    width: 33.3%;
    margin-bottom: 30px;
}

.info-list {
    height: 100vh;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

}

.info-block {
    border: 1px white solid;
    border-radius: 10px;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
    overflow: auto;
    background-color: white;
    width: 80%;
    /* 让每个 info-block 占据一行的一半宽度 */
    padding: 30px 30px 0 0;
    padding-left: 15px;
    position: relative;
    cursor: pointer;
}

.cell-num,
.cell-avb-num {
    font-size: 21px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    align-items: center;
    display: flex;
}

.cell-avb-num {
    color: #3FA89F;
}

.search-bar {
    border-radius: 10px;
    height: 40px;
    margin: 15px 0;
    border: 0.75px solid var(--gray-gray-200, #E2E8F0);
    border-radius: 22.5px;
    outline: none;
    padding: 3px 40px;
    background: url(../../assets/search.svg) no-repeat;
    background-position: 10px center;
    width: 80%;
    background-color: white;
    font-size: larger;
}
</style>