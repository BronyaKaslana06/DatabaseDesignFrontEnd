<template>
    <div>
        <el-page-header  @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3 custom-text"> 换电站电池管理 </span>
            </template>
        </el-page-header>
        <div class="block">
            <div class="inner-block2">
                <el-form :inline="true">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="电池ID">
                                <el-input v-model="formData.battery_id" class="input-box"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电池型号">
                                <el-input v-model="formData.battery_type_id" class="input-box"></el-input>
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
                    <el-table-column prop="battery_id" label="电池ID" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="manufacturing_date" min-width="10%" label="出厂日期" align="center">
                    </el-table-column>
                    <el-table-column prop="battery_type_id" min-width="10%" label="电池型号" align="center">
                    </el-table-column>
                    <el-table-column prop="current_capacity" label="当前电量" min-width="10%" align="center"></el-table-column>
                    <el-table-column prop="curr_charge_times" label="当前充电次数" min-width="5%" align="center">
                    </el-table-column>
                    <el-table-column min-width="10%" label="电池状态" align="center">
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
                    <el-table-column :inline="true" label="操作" min-width="15%" align="center">
                        <template #default="scope">
                            <span>
                                <el-button text :icon="scope.row.isEditing ? Check : Edit" @click="handleEdit(scope.row)">
                                    {{ scope.row.isEditing ? '完成' : '编辑' }}
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


    <el-dialog title="编辑" v-model="addFlag" width="30%" @close="cancleAddEvent">
        <el-form label-width="100px">
            <el-form-item label="电池型号">
                <el-select v-model="addedData.battery_type_id">
                <el-option key="1" value="标准续航型" label="标准续航型"> </el-option>
                <el-option key="2" value="长续航型" label="长续航型"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="出厂日期">
                <el-date-picker v-model="addedData.manufacturing_date" type="date" placeholder="选择日期"  />
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
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { RefreshRight, Edit, Delete, Check } from '@element-plus/icons-vue';
const router = useRouter();

const goBack = () => {
  router.push('/admin-dashboard-page');
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
    battery_id: '',
    battery_type_id: '',
    available_status: ''
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

const pullData = () => {
    cmRequest.request({
        url: 'api/staff/switchstation/battery',
        method: 'GET',
        params: {
            station_id:'1',
            pageIndex: query.pageIndex,
            pageSize: query.pageSize
        }
    }).then((res) => {
        if (!res.code) {
            ElMessage({
                type: 'success',
                message: '刷新成功',
            })
            tableData.value = res.data;
            totalData = parseInt(res.totaldata);
        }
        else {
            ElMessage({
                type: 'error',
                message: '刷新失败',
            })
        }
    })
}
pullData();
/*
tableData.value = [
    {
        battery_id: '111',
        manufacturing_date: '2021-2-2',
        battery_type_id: '蔚来汽车01款',
        current_capacity: '20',
        curr_charge_times: '30次',
        available_status: '可用',
        isEditing: false
    },
    {
        battery_id: '111',
        manufacturing_date: '2021-2-2',
        battery_type_id: '蔚来汽车01款',
        current_capacity: '20',
        curr_charge_times: '30次',
        available_status: '已预定',
        isEditing: false
    }
]*/

const changeView = () => {
    cmRequest.request({
        url: 'api/staff/switchstation/battery',
        method: 'GET',
        params: {
            station_id:'1',
            pageIndex: 1,
            pageSize: query.pageSize
        }
    }).then((res) => {
        tableData.value = res.data;
        totalData = parseInt(res.totaldata);
    }
    )
}

const cancleAddEvent = () => {
    addFlag.value = false;
    resetAddedData();
}
const resetFormData = () => {
    formData.battery_id = '';
    formData.battery_type_id = '';
    formData.available_status = '';
}

const resetAddedData = () => {
    addedData.battery_type_id = '';
    addedData.manufacturing_date = '';
}

const queryData = () => {


    cmRequest.request({
        url: 'api/staff/switchstation/battery',
        method: 'GET',
        params: {
            station_id:'1',
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            battery_id: formData.battery_id,
            battery_type_id: formData.battery_type_id,
            available_status: formData.available_status
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
        resetFormData();
    })
}

const handlePageChange = (val) => {
    query.pageIndex = val;
    pullData();
};


const handleEdit = (row) => {
    row.isEditing = !row.isEditing;
    if (!row.isEditing) {
        // 在点击“完成”按钮后执行的逻辑
        saveEdit(row);
    }
}


const addData = () => {
    let hasNullValue = false;
    for (const key in addedData) {
        if (addedData.hasOwnProperty(key) && addedData[key] === "") {
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
            url: 'api/staff/switchstation/battery/add',
            method: 'POST',
            data: {
                station_id:'1',
                manufacturing_date: addedData.manufacturing_date,
                battery_type_id: addedData.battery_type_id
            }
        }).then((res) => {
            addFlag.value = false;
            resetAddedData();
            if (!res.code) {
                changeView();
                ElMessage({
                    type: 'success',
                    message: '新建成功, 添加电池id为' + res.battery_id,
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
        url: 'api/staff/switchstation/battery/delete',
        method: 'DELETE',
        params: {
            station_id:'1',
            battery_id: val.battery_id
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

const saveEdit = (row) => {
    cmRequest.request({
        url: 'api/staff/switchstation/battery/update',
        method: 'PATCH',
        data: {
            station_id:'1',
            battery_id: row.battery_id,
            available_status: row.available_status
        }
    }).then((res) => {
        editFlag.value = false;
        if (!res.code) {
            changeView();
            ElMessage({
                type: 'success',
                message: '更新成功',
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


