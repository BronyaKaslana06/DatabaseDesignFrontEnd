<template>
    <header class="dashboard-header">
      <h1 class="dashboard-title">个人主页</h1>
      <el-button @click="pullData" style="margin-bottom: 10px;" :icon="RefreshRight">刷新</el-button>
    </header> 

    <div class="info-card">
        <div class="info-card-item">
          <h2 class="info-card-value">{{ totalCharge }}</h2>
          <p class="info-card-label">总充电次数</p>
        </div>

        <div class="info-card-item">
          <h2 class="info-card-value">{{ totalOrders }}</h2>
          <p class="info-card-label">总维修次数</p>
        </div>

        <div class="info-card-item">
          <h2 class="info-card-value">{{ totalVehicle }}</h2>
          <p class="info-card-label">车辆数量</p>
        </div> 
    </div>
    
    <div class="dashboard">      
        <div class="chart-container">
          <div ref="lineChart" class="chart"></div>
        </div>
        <div class="chart-container">
          <div ref="chartDom" class="chart"></div>
        </div>
    </div>

</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue';
import * as echarts from 'echarts';


const totalCharge = ref();
const totalOrders = ref();
const totalVehicle = ref(); 
const chartDom = ref();

const pullData = () => {
    cmRequest.request({
    // url: 'api/owner/dashboard/message',
    url: 'owner/dashboard/message',// 我的本地api地址
    method: 'GET',
   
  }).then((res) => {
    if(!res.code){
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      totalCharge.value = res.data.totalCharge;
      totalOrders.value = res.data.totalOrders;
      totalVehicle.value = res.data.totalVehicle;
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

totalCharge.value = 1919;
totalOrders.value = 810;
totalVehicle.value = 2;

const barChart = ref();
const lineChart = ref();
const pieChart = ref();
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
    
  })
}
getOrderData();

// 处理面积图的实现
let base = +new Date(1968, 9, 3);
let oneDay = 24 * 3600 * 1000;
let date = [];
let data = [Math.random() * 300];
for (let i = 1; i < 20000; i++) {
  var now = new Date((base += oneDay));
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}

// 各个图表数据的存放
onMounted(() => {
    // 折线图（本周每日充电总车次）
    const lineChartInstance = echarts.init(lineChart.value);
    lineChartInstance.setOption({
        title: {
        text: '本周每日充换电次数',
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
        {
          data: [3, 4, 1, 2, 4, 1, 5],
          type: 'line',
          smooth: true
        }
        ]
    });
    // 面积图（）
    const chartDomInstance = echarts.init(chartDom.value);
    chartDomInstance.setOption({
    tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
    },
    title: {
    left: 'center',
    text: '每日电量变化'
    },
    toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
    },
    xAxis: {
    type: 'category',
    boundaryGap: false,
    data: date
    },
    yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
    },
    dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 10
    },
    {
      start: 0,
      end: 10
    }
    ],
    series: [
    {
      name: 'Fake Data',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgb(255, 70, 131)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 158, 68)'
          },
          {
            offset: 1,
            color: 'rgb(255, 70, 131)'
          }
        ])
      },
      data: data
    }
    ] 
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
</style>