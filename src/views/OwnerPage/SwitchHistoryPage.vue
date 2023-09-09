<template>
    <div class="container">
        <el-tabs type="border-card" @tab-click="init_type">
            <el-tab-pane label="待接单">
                <el-table :data="tableData1" border class="table" v-infinite-scroll="load"
                    :infinite-scroll-disabled="loading1" height="80vh">
                    <el-table-column prop="switch_request_id" label="订单id" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_type" label="换电方式" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="battery_type" label="电池类型" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_date" label="换电日期" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_period" label="换电时间段" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_name" label="负责换电站" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_address" label="换电站地址" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="request_time" label="订单创建时间" min-width="10%" align="center"></el-table-column>
                    <el-table-column label="操作" min-width="10%" align="center">
                        <template #default="scope">
                            <div style="display: flex;flex-direction: column;">
                                <el-button text :icon="Document" @click="getMoreInfo(scope.row)" style="color: #4FD1C5">
                                    详情
                                </el-button>
                                <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否撤销"
                                    @confirm="deleteInfo(scope.row)">
                                    <template #reference>
                                        <el-button style="color: rgb(224, 116, 116);" text :icon="DeleteFilled">
                                            撤销
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待完成">
                <el-table :data="tableData2" border class="table" v-infinite-scroll="load"
                    :infinite-scroll-disabled="loading2" height="80vh">
                    <el-table-column prop="switch_request_id" label="订单id" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_type" label="换电方式" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="battery_type" label="电池类型" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_date" label="换电日期" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_period" label="换电时间段" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_name" label="负责换电站" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_address" label="换电站地址" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="request_time" label="订单创建时间" min-width="10%" align="center"></el-table-column>
                    <el-table-column label="操作" min-width="10%" align="center">
                        <template #default="scope">
                            <div style="display: flex;flex-direction: column;">
                                <el-button text :icon="Document" @click="getMoreInfo(scope.row)" style="color: #4FD1C5">
                                    详情
                                </el-button>
                                <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="请确认是否撤销"
                                    @confirm="deleteInfo(scope.row)">
                                    <template #reference>
                                        <el-button style="color: rgb(224, 116, 116);" text :icon="DeleteFilled">
                                            撤销
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="待评价">
                <el-table :data="tableData3" border class="table" v-infinite-scroll="load"
                    :infinite-scroll-disabled="loading3" height="80vh">
                    <el-table-column prop="switch_request_id" label="订单id" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_type" label="换电方式" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="battery_type" label="电池类型" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_date" label="换电日期" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_period" label="换电时间段" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_name" label="负责换电站" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_address" label="换电站地址" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="request_time" label="订单创建时间" min-width="10%" align="center"></el-table-column>
                    <el-table-column label="操作" min-width="10%" align="center">
                        <template #default="scope">
                            <div style="display: flex;flex-direction: column;">
                                <el-button text :icon="Document" @click="getMoreInfo(scope.row)" style="color: #4FD1C5">
                                    详情
                                </el-button>
                                <el-button style="color: rgb(227, 178, 29);" text :icon="StarFilled"
                                    @click="rating(scope.row)">
                                    评分
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="已完成">
                <el-table :data="tableData4" border class="table" v-infinite-scroll="load"
                    :infinite-scroll-disabled="loading4" height="80vh">
                    <el-table-column prop="switch_request_id" label="订单id" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_type" label="换电方式" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="battery_type" label="电池类型" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_date" label="换电日期" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="switch_period" label="换电时间段" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_name" label="负责换电站" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="station_address" label="换电站地址" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="request_time" label="订单创建时间" min-width="10%" align="center"></el-table-column>
                    <el-table-column label="操作" min-width="10%" align="center">
                        <template #default="scope">
                            <div style="display: flex;flex-direction: column;">
                                <el-button text :icon="Document" @click="getMoreInfo(scope.row)" style="color: #4FD1C5">
                                    详情
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-dialog v-model="openFlag">
        <div style="display:flex;align-items: center;">
            <div id="station_map">
            </div>
            <el-form style="display: flex;flex-direction: column; margin-left: 30px;">
                <el-form-item label="订单id">
                    {{ dialogData.switch_request_id }}
                </el-form-item>
                <el-form-item label="订单类型">
                    {{ dialogData.switch_type }}
                </el-form-item>
                <el-form-item label="订单状态">
                    {{ dialogData.order_status }}
                </el-form-item>
                <el-form-item label="订单创建时间">
                    {{ dialogData.request_time }}
                </el-form-item>
                <el-form-item label="负责换电站">
                    {{ dialogData.station_name }}
                </el-form-item>
                <el-form-item label="换电站地址">
                    {{ dialogData.station_address }}
                </el-form-item>
                <el-form-item label="换电日期">
                    {{ dialogData.switch_date }}
                </el-form-item>
                <el-form-item label="换电时间段">
                    {{ dialogData.switch_period }}
                </el-form-item>
                <el-form-item label="电池类型">
                    {{ dialogData.battery_type }}
                </el-form-item>
                <el-form-item label="换电车型">
                    {{ dialogData.vehicle_model }}
                </el-form-item>
                <el-form-item label="换电车牌">
                    {{ dialogData.plate_number }}
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>

    <el-dialog v-model="ratingFlag" class="rating-dialog" @close="ratingcancle">
        <div>
            <div>
                <div style="align-items: center;position: relative;left: 50%;transform: translateX(-50%);width:fit-content"
                    class="rating-title">为我们的服务评分</div>
                <div class="line"></div>
            </div>
            <div style="display: flex;align-items: center;position: relative;left: 50%;transform:
            translateX(-50%);width:fit-content">
                <div style="margin-right: 20px;">轻点评分</div>
                <div>
                    <el-rate v-model="mark" :colors="colors" />
                </div>
            </div>
            <div style="position: relative;left: 50%;transform: translateX(-50%);width:fit-content;margin-top: 20px;">
                <el-button @click="ifWrite = true" :icon="Edit">撰写您的评论</el-button>
            </div>
            <div v-if="ifWrite === true" style="margin-top: 20px;">
                <el-input :rows="3" type="textarea" v-model="remarks"> </el-input>
            </div>
            <div style="display:flex; flex-direction: row;position:relative;left: 50%;transform: translateX(-50%);width:fit-content">
                <button v-wave="{
                color: 'rgba(171, 171, 171, 0.767)',
                initialOpacity: 0.5,
                duration: 0.3,
                easing: 'ease-in'
            }" class="cancle-btn">取消</button>
                <button v-wave="{
                color: 'white',
                initialOpacity: 0.5,
                duration: 0.3,
                easing: 'ease-in'
            }" class="submit-btn" @click="submit">提交评价</button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js';
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { DeleteFilled, StarFilled, Edit,Document } from '@element-plus/icons-vue';

const order_status = ref("待接单");
const loading1 = ref(false);
const loading2 = ref(true);
const loading3 = ref(true);
const loading4 = ref(true);
const openFlag = ref(false);
const ratingFlag = ref(false);
const tableData1 = ref([]);
const tableData2 = ref([]);
const tableData3 = ref([]);
const tableData4 = ref([]);
const order_id = ref(null);
const ifWrite = ref(false);
const mark = ref(0);
const colors = ref(['#ffc917'])
const remarks = ref(null)
const dialogData = reactive({
    switch_request_id: 0,
    switch_type: "",
    request_time: "",
    position: "",
    station_name: "",
    station_address: "",
    plate_number: "",
    vehicle_model: "",
    battery_type: "",
    employee_id: "",
    switch_date: "",
    switch_period: "",
    order_status: "",
    longitude: "",
    latitude: "",
    remarks: "",
})
let curInfoIndex = 1;
let preTab = "";

const init_type = (tab, event) => {
    if (preTab === tab.props.label) {
        return;
    }
    preTab = tab.props.label;
    let num = tab.props.label;
    curInfoIndex = 1;
    loading1.value = true;
    loading2.value = true;
    loading3.value = true;
    loading4.value = true;
    tableData1.value = [];
    tableData2.value = [];
    tableData3.value = [];
    tableData4.value = [];
    order_status.value = num;
    if (order_status.value === "待接单") {

        loading1.value = false;
    }
    else if (order_status.value === "待完成") {
        order_status.value = "待完成";
        loading2.value = false;
    }
    else if (order_status.value === "待评价") {
        order_status.value = "待评价";
        loading3.value = false;
    }
    else if (order_status.value === "已完成") {
        order_status.value = "已完成";
        loading4.value = false;
    }
}

const ratingcancle = () => {
    mark.value = 0;
    remarks.value = null;
    ifWrite.value = false;
}

const submit =()=>{
    if(mark.value == 0){
        ElMessage({
            type: "warning",
            message: "请轻点进行评分"
        })
        return;
    }
    cmRequest.request({
        url:'api/owner/review',
        method:'POST',
        data:{
            switch_request_id: order_id.value,
            score: mark.value,
            evaluation: remarks.value
        }
    }).then((res)=>{
        if(!res.code){
            ElMessage({
            type: "success",
            message: "评价成功"
        })
        tableData3.value = [];
        curInfoIndex = 1;
        load();
        }
        else{
            ElMessage({
            type: "error",
            message: "评价失败"
        })
        }
        ratingFlag.value = false;
    })
}

const load = () => {
    if (order_status.value === '待接单')
        loading1.value = true;
    else if (order_status.value === '待完成')
        loading2.value = true;
    else if (order_status.value === '待评价')
        loading3.value = true;
    else if (order_status.value === '已完成')
        loading4.value = true;
    let trans_order_status = order_status.value;
    cmRequest.request({
        url: 'api/owner/switch_history',
        method: 'GET',
        params: {
            pageIndex: curInfoIndex,
            pageSize: 10,
            owner_id: localStorage.getItem("user_id"),
            order_status: order_status.value
        }
    }).then((res) => {
        if (!res.code) {
            console.log(trans_order_status, order_status.value)
            if (res.data.length === 0) {
                if (trans_order_status === '待接单')
                    loading1.value = true;
                else if (trans_order_status === '待完成')
                    loading2.value = true;
                else if (trans_order_status === '待评价')
                    loading3.value = true;
                else if (trans_order_status === '已完成')
                    loading4.value = true;
                return;
            }
            if (trans_order_status === '待接单') {
                tableData1.value = [...tableData1.value, ...res.data];
                loading1.value = false;
            }
            else if (trans_order_status === '待完成') {
                loading2.value = false;
                tableData2.value = [...tableData2.value, ...res.data];
            }
            else if (trans_order_status === '待评价') {
                loading3.value = false;
                tableData3.value = [...tableData3.value, ...res.data];
            }
            else if (trans_order_status === '已完成') {
                loading4.value = false;
                tableData4.value = [...tableData4.value, ...res.data];
            }
            curInfoIndex++;

        }
        else {
            ElMessage({
                type: 'error',
                message: "获取订单信息失败"
            });
            load();
        }
    })
}

const rating = (val) => {
    mark.value = 0;
    order_id.value = val.switch_request_id;
    ratingFlag.value = true;
}

const deleteInfo = (val) => {
    const user_id = localStorage.getItem("user_id");
    cmRequest.request({
        url: 'api/owner/switch_history',
        method: 'DELETE',
        params: {
            switch_request_id: val.switch_request_id,
            owner_id: localStorage.getItem("user_id")
        }
    }).then((res) => {
        if (!res.code) {
            curInfoIndex = 1;
            if (order_status.value === '待接单'){
                tableData1.value = [];
                load();
            }
            else if (order_status.value === '待完成'){
                tableData2.value = [];
                load();      
            }
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
//     switch_request_id: 0,
//     switch_type: "",
//     request_time: "",
//     position: "",
//     station_name: "",
//     station_address: "",
//     plate_number: "",
//     vehicle_model: "",
//     battery_type: "",
//     employee_id: "",
//     switch_date: "",
//     switch_period: "",
//     order_status: "",
const getMoreInfo = (val) => {
    openFlag.value = true;
    dialogData.switch_request_id = val.switch_request_id;
    dialogData.switch_type = val.switch_type;
    dialogData.request_time = val.request_time;
    dialogData.station_name = val.station_name;
    dialogData.station_address = val.station_address;
    dialogData.vehicle_model = val.vehicle_model;
    dialogData.battery_type = val.battery_type;
    dialogData.employee_id = val.employee_id;
    dialogData.switch_date = val.switch_date;
    dialogData.switch_period = val.switch_period;
    dialogData.order_status = val.order_type;
    dialogData.remarks = val.remarks;
    cmRequest.request({
        url: "api/staff/switchrequest/detail",
        method: "GET",
        params: {
            switch_request_id: val.switch_request_id
        }
    }).then((res) => {
        if (res.code == 0) {
            dialogData.latitude = res.data.switch_request.latitude;
            dialogData.longitude = res.data.switch_request.longitude;
            dialogData.plate_number = res.data.switch_request.plate_number;
            console.log(res)
            drawMap();
        }
        else {
            ElMessage({
                type: "error",
                message: "无法获取信息"
            })
        }

    })
}

const drawMap = () => {
    const BMap = window.BMap;
    var map = new BMap.Map("station_map");
    var point = new BMap.Point(dialogData.longitude, dialogData.latitude);
    map.centerAndZoom(new BMap.Point(dialogData.longitude, dialogData.latitude), 100);
    map.enableScrollWheelZoom(true);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}

</script>

<style scoped>
.container {
    margin-left: 40px;
    margin-right: 40px;
    height: 85vh;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active) {
    color: #4FD1C5 !important;
}

:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover) {
    color: #4FD1C5 !important;
}

.el-button+.el-button {
    margin-left: 0;
}

:deep(.el-form-item__label) {
    font-weight: 600;
}

#station_map {
    height: 400px;
    width: 50%;
}

.rating-title {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 700;
}

.line {
    width: 125px;
    height: 3px;
    background-color: #4bcac0;
    border-radius: 2px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 20px;
}

.line:hover{
    width: 200px;
    transition: width 0.35s;
}

.cancle-btn{
    background-color: white;
    border-radius: 20px;
    border: solid 3px rgb(171, 171, 171);
    color: rgb(171, 171, 171);
    font-weight: bolder;
    font-size: 15px;
    margin-top: 20px;
    cursor: pointer;
    height:35px;
    margin:35px;
    padding: 0 40px;
}
.submit-btn{
    background-color: #4FD1C5;
    border-radius: 20px;
    border: solid 1px #4FD1C5;
    color: white;
    font-weight: bolder;
    font-size: 15px;
    margin-top: 20px;
    cursor: pointer;
    height:35px;
    margin: 35px;
    padding: 0 40px;
}

</style>