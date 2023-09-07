<template>
    <div>
        <!-- <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3 custom-text"> 换电站电池管理 </span>
            </template>
        </el-page-header> -->
        <div class="block">
            <div class="inner-block2">
                <el-form :inline="true">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="电池位置">
                                <el-select v-model="formData.battery_status" filterable placeholder="选择状态" @change="updateselected">
                                    <el-option key="1" value="在换电站" label="在换电站"> </el-option>
                                    <el-option key="2" value="在车辆" label="在车辆"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <template v-if="formData.battery_status === '在换电站'">
                                <el-form-item label="换电站名">
                                    <el-input v-model="formData.keyword" class="input-box"></el-input>
                                </el-form-item>
                            </template>
                            <template v-if="formData.battery_status === '在车辆'">
                                <el-form-item label="车牌号">
                                    <el-input v-model="formData.keyword" class="input-box"></el-input>
                                </el-form-item>
                            </template>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="电池型号">
                                <el-select v-model="formData.battery_type_id" filterable placeholder="选择型号">
                                    <el-option key="1" value="标准续航型" label="标准续航型"> </el-option>
                                    <el-option key="2" value="长续航型" label="长续航型"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电池状态">
                                <el-select v-model="formData.available_status" filterable placeholder="选择状态">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
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
                    <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
                </div>
                <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                    height="120vh" v-loading="loadData">
                    <el-table-column prop="battery_id" label="电池ID" min-width="5%" align="center"></el-table-column>
                    <el-table-column prop="manufacturing_date" min-width="10%" label="出厂日期" align="center">
                    </el-table-column>
                    <el-table-column prop="battery_type_id" min-width="7%" label="电池型号" align="center">
                    </el-table-column>
                    <el-table-column prop="current_capacity" label="当前电量" min-width="7%" align="center">
                        <template v-slot="scope">
                            {{ scope.row.current_capacity }}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="curr_charge_times" label="当前充电次数" min-width="8%" align="center">
                    </el-table-column>
                    <el-table-column min-width="8%" label="电池状态" align="center">
                        <template #default="scope">
                            <template v-if="scope.row.isEditing">
                                <el-select v-model="scope.row.available_status" filterable placeholder="Select">
                                    <template v-if="scope.row.available_status === '已预定'">
                                        <el-option v-for="item in one_options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </template>
                                    <template v-else>
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </template>
                                </el-select>
                            </template>
                            <template v-else>
                                {{ scope.row.available_status }}
                            </template>
                        </template>
                    </el-table-column>

                        <el-table-column prop="name" :label="getLabel(formData.battery_status)" min-width="15%"
                            align="center">
                        </el-table-column>


                </el-table>
                <div class="pagination">
                    <el-pagination :current-page="query.pageIndex" :page-size="query.pageSize" :total="totalData"
                        @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { RefreshRight, Edit, Delete, Check } from '@element-plus/icons-vue';
const router = useRouter();

const loadData = ref(false);


const getLabel = (val)=>{
    if(val === '在换电站')
        return '所在换电站';
    else
        return '所在车辆'
}

const options = [
    {
        value: '可用',
        label: '可用',
    },
    {
        value: '已预定',
        label: '已预定',
    },
    {
        value: '充电中',
        label: '充电中',
    },
    {
        value: '损坏',
        label: '损坏',
    },
    {
        value: '未知',
        label: '未知',
    },
    {
        value: '汽车使用中',
        label: '汽车使用中',
    }
];

const one_options = [
    {
        value: '已预定',
        label: '已预定',
    }
]

const tableData = ref([]);
const editFlag = ref(false);
const addFlag = ref(false);

const formData = reactive({
    battery_type_id: '',
    available_status: '',
    battery_status: '在换电站',
    keyword: ''
});

const addedData = reactive({
    battery_type_id: '',
    manufacturing_date: ''
})

const query = reactive({
    pageIndex: 1,
    pageSize: 25,
});


var totalData = 1;

const updateselected=()=>{
    pullData();
}

const pullData = () => {
    loadData.value = true;
    cmRequest.request({
        url: 'api/administrator/battery/query',
        method: 'GET',
        params: {
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            battery_type_id: '',
            available_status: '',
            battery_status: formData.battery_status === '在换电站' ? 0 : 1,
            keyword: ''
        }
    }).then((res) => {
        if (!res.code) {
            
            tableData.value = res.data;
            totalData = parseInt(res.totaldata);
        }
        else {
            ElMessage({
                type: 'error',
                message: '刷新失败',
            })
        }
        loadData.value = false;
    })
}
pullData();

const changeView = () => {
    cmRequest.request({
        url: 'api/administrator/battery/query',
        method: 'GET',
        params: {
            pageIndex: 1,
            pageSize: query.pageSize,
            battery_type_id: '',
            available_status: '',
            battery_status: 0,
            keyword: ''
        }
    }).then((res) => {
        tableData.value = res.data;
        totalData = parseInt(res.totaldata);
    }
    )
}

const reset = ()=>{
    query.pageIndex = 1;
    resetFormData();
    pullData();
}


const resetFormData = () => {
    formData.battery_type_id = '';
    formData.available_status = '';
    formData.keyword = '';
}


const queryData = () => {
    loadData.value = true;

    cmRequest.request({
        url: 'api/administrator/battery/query',
        method: 'GET',
        params: {
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            battery_type_id: formData.battery_type_id,
            available_status: formData.available_status,
            battery_status: formData.battery_status === '在换电站' ? 0 : 1,
            keyword: formData.keyword
        }
    }).then((res) => {
        if (!res.code) {
            tableData.value = res.data;
            totalData = parseInt(res.totaldata);
        }
        else {
            ElMessage({
                type: 'error',
                message: '未找到内容',
            });
        }
        loadData.value = false;
    })
}

const handlePageChange = (val) => {
    query.pageIndex = val;
    queryData();
};


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


