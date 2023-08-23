<template>
    <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 仪表盘 </span>
      </template>
    </el-page-header>

    <header class="dashboard-header">
      <h1 class="dashboard-title">员工仪表盘</h1>
      <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
    </header> 

    <div class="info-card">
        <div class="info-card-item">
          <h2 class="info-card-value">{{ orderTodo }}</h2>
          <p class="info-card-label">待处理订单</p>
        </div>

        <div class="info-card-item">
          <h2 class="info-card-value">{{ orderFinished }}</h2>
          <p class="info-card-label">已完成订单</p>
        </div>

        <div class="info-card-item">
          <h2 class="info-card-value">{{ staffSalary }}</h2>
          <p class="info-card-label">本月工资</p>
        </div> 

        <div class="info-card-item">
          <h2 class="info-card-value">{{ orderGrabed }}</h2>
          <p class="info-card-label">抢单次数</p>
        </div> 
    </div>
    
    <div class="dashboard">
        <h1 class="dashboard-title">员工仪表盘</h1>
      
        <div class="chart-container">
          <div ref="barChart" class="chart"></div>
        </div>

        <div class="image-container">
          <img src="../assets/StuffDashboard-1.png" alt="page_1" />
        </div>
    </div>


</template>

<script setup lang="js">
import cmRequest from '../service/index.js'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

const orderTodo = ref();
const orderFinished = ref();
const staffSalary = ref();
const orderGrabed = ref();

const pullData = () => {
    cmRequest.request({
    // url: 'api/administrator/dashboard/message',
    url: 'administrator/dashboard/message',// 我的本地api地址
    method: 'GET',
   
  }).then((res) => {
    if(!res.code){
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      orderTodo.value = res.data.orderTodo;
      orderFinished.value = res.data.orderFinished;
      staffSalary.value = res.data.staffSalary;
      orderGrabed.value = res.data.orderGrabed;
    }
    else{
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
}
pullData();

const barChart = ref();
// const lineChart = ref();
// const pieChart = ref();
const barChartData = ref([]);
const lineChartData = ref([]);
const pieChartData = ref([]);

const getOrderData= () =>{
    cmRequest.request({
    // url: 'api/administrator/dashboard/order',
    url: 'administrator/dashboard/order',// 我的本地api地址
    method: 'GET',
   
  }).then((res) => {
    if(!res.code){
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      barChartData.value = res.data.barChartData; // 根据API响应修改
      lineChartData.value = res.data.lineChartData; // 根据API响应修改
      pieChartData.value = res.data.pieChartData; // 根据API响应修改
    }
    else{
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
}
getOrderData();

onMounted(() => {
    const barChartInstance = echarts.init(barChart.value);
    barChartInstance.setOption({
        title: {
          text: '每月订单',
        },
        tooltip: {},
        legend: {},
        xAxis: {
          type: 'category',
          data: ["Jan","Feb","Mar","Apr","May","Jue","Jul","Sept","Oct","Nov","Dec"],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '订单数量',
          data: [20,30,40,50,10,35,37,53,12,43,23,12],
          type: 'bar',
        }],
    });


});

</script>

<style scoped>
 .dashboard {
    background-color: #f4f5f7;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
  }
  
  .dashboard-header {
    background-color: #35495e;
    color: #ffffff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dashboard-title {
    font-size: 28px;
    margin: 0;
  }

  .info-card {
    display: flex;
    gap: 20px;
    margin: 20px;
  }

  .info-card-item {
    flex: 1;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }
  
  .info-card-item:hover {
    transform: translateY(-5px);
  }
  
  .info-card-value {
    font-size: 28px;
    margin: 0;
    color: #35495e;
  }
  
  .info-card-label {
    font-size: 16px;
    color: #8e8e8e;
    margin-top: 5px;
  }

  .chart-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .chart {
    width: 100%;
    height: 400px;
  }

  .image-container {
  display: flex; /* 使用 Flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  }

  .image-container img {
  margin-right: 10px; /* 可以根据需要调整间距大小 */
  }
</style>