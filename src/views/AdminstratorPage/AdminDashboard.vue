<template>
  <div class="info-card">
    <div class="info-card-item">
      <h2 class="info-card-value">{{ infoSet.owner_count }}</h2>
      <p class="info-card-label">总用户数</p>
    </div>

    <div class="info-card-item">
      <h2 class="info-card-value">{{ infoSet.switch_count }}</h2>
      <p class="info-card-label">总订单数</p>
    </div>

    <div class="info-card-item">
      <h2 class="info-card-value">{{ infoSet.station_count }}</h2>
      <p class="info-card-label">总换电站数</p>
    </div>

    <div class="info-card-item">
      <h2 class="info-card-value">{{ infoSet.staff_count }}</h2>
      <p class="info-card-label">总员工数</p>
    </div>
  </div>
  <div style="width:100%;">
    <div style="display: flex;flex-direction: row;width: 100%;">
      <div style="height: 400px; width: 50%;" class="info-card-item">
        <line-chart :chartData="chartData" :key="chartKey" />
      </div>
      <div style="height: 400px; width: 50%;" class="info-card-item">

      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import LineChart from '../../components/LineChart.vue'


const infoSet = ref([]);
const chartKey = ref(0);
const chartData = reactive({
  labels: [],
  datasets: [
    {
      data: [],
    }
  ]
})

const pullData = () => {
  cmRequest.request({
    // url: 'api/administrator/dashboard/message',
    url: 'api/administrator/dashboard/stats',// 我的本地api地址
    method: 'GET',

  }).then((res) => {
    if (!res.code) {
      infoSet.value = res.data;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })

  cmRequest.request({
    baseURL: 'https://mock.apifox.cn/m1/3058331-0-default',
    url: 'administrator/dashboard/time_span_stats',
    method: 'GET',
    params: {
      query_range: "month"
    }
  }).then((res) => {
    chartData.labels = [];
    chartData.datasets = [{}];
    if (!res.code) {
      let data = [];
      for (let item of res.data) {
        chartData.labels.push(item.time_span);
        data.push(item.switch_count);
      }
      chartData.datasets[0].data = data;
      console.log(chartData);
      chartKey.value++;
    }
    else {
    }
  })
}
pullData();

// const barChart = ref();
// const lineChart = ref();
// const pieChart = ref();
// const barChartData = ref([]);
// const lineChartData = ref([]);
// const pieChartData = ref([]);


// const getOrderData = () => {
//   cmRequest.request({
//     // url: 'api/administrator/dashboard/order',
//     url: 'administrator/dashboard/order',// 我的本地api地址
//     method: 'GET',

//   }).then((res) => {
//     if (!res.code) {
//       ElMessage({
//         type: 'success',
//         message: '刷新成功',
//       })
//       barChartData.value = res.data.barChartData; // 根据API响应修改
//       lineChartData.value = res.data.lineChartData; // 根据API响应修改
//       pieChartData.value = res.data.pieChartData; // 根据API响应修改
//     }

//   })
// }
// getOrderData();

// // 处理条形图的实现
// var app = {};
// const posList = [
//   'left',
//   'right',
//   'top',
//   'bottom',
//   'inside',
//   'insideTop',
//   'insideLeft',
//   'insideRight',
//   'insideBottom',
//   'insideTopLeft',
//   'insideTopRight',
//   'insideBottomLeft',
//   'insideBottomRight'
// ];
// app.configParameters = {
//   rotate: {
//     min: -90,
//     max: 90
//   },
//   align: {
//     options: {
//       left: 'left',
//       center: 'center',
//       right: 'right'
//     }
//   },
//   verticalAlign: {
//     options: {
//       top: 'top',
//       middle: 'middle',
//       bottom: 'bottom'
//     }
//   },
//   position: {
//     options: posList.reduce(function (map, pos) {
//       map[pos] = pos;
//       return map;
//     }, {})
//   },
//   distance: {
//     min: 0,
//     max: 100
//   }
// };
// app.config = {
//   rotate: 90,
//   align: 'left',
//   verticalAlign: 'middle',
//   position: 'insideBottom',
//   distance: 15,
//   onChange: function () {
//     const labelOption = {
//       rotate: app.config.rotate,
//       align: app.config.align,
//       verticalAlign: app.config.verticalAlign,
//       position: app.config.position,
//       distance: app.config.distance
//     };
//     myChart.setOption({
//       series: [
//         {
//           label: labelOption
//         },
//         {
//           label: labelOption
//         },
//         {
//           label: labelOption
//         },
//         {
//           label: labelOption
//         }
//       ]
//     });
//   }
// };
// const labelOption = {
//   show: true,
//   position: app.config.position,
//   distance: app.config.distance,
//   align: app.config.align,
//   verticalAlign: app.config.verticalAlign,
//   rotate: app.config.rotate,
//   formatter: '{c}  {name|{a}}',
//   fontSize: 16,
//   rich: {
//     name: {}
//   }
// };

// // 处理面积图的实现
// let base = +new Date(1968, 9, 3);
// let oneDay = 24 * 3600 * 1000;
// let date = [];
// let data = [Math.random() * 300];
// for (let i = 1; i < 20000; i++) {
//   var now = new Date((base += oneDay));
//   date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
//   data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
// }

// // 各个图表数据的存放
// onMounted(() => {
//   // 条形图（各个换电站每月订单）
//   const barChartInstance = echarts.init(barChart.value);
//   barChartInstance.setOption({
//     title: {
//       text: '每月订单',
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'shadow'
//       }
//     },
//     toolbox: {
//       show: true,
//       orient: 'vertical',
//       left: 'right',
//       top: 'center',
//       feature: {
//         mark: { show: true },
//         dataView: { show: true, readOnly: false },
//         magicType: { show: true, type: ['line', 'bar', 'stack'] },
//         restore: { show: true },
//         saveAsImage: { show: true }
//       }
//     },
//     xAxis: [
//       {
//         type: 'category',
//         axisTick: { show: false },
//         data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
//       }
//     ],
//     yAxis: [
//       {
//         type: 'value'
//       }
//     ],
//     series: [
//       {
//         name: '换电站1',
//         type: 'bar',
//         barGap: 0,
//         label: labelOption,
//         emphasis: {
//           focus: 'series'
//         },
//         data: [320, 332, 301, 334, 390, 320, 332, 301, 334, 390, 400, 500]
//       },
//       {
//         name: '换电站2',
//         type: 'bar',
//         label: labelOption,
//         emphasis: {
//           focus: 'series'
//         },
//         data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290, 114, 180]
//       },
//       {
//         name: '换电站3',
//         type: 'bar',
//         label: labelOption,
//         emphasis: {
//           focus: 'series'
//         },
//         data: [150, 232, 201, 154, 190, 150, 232, 201, 154, 190, 180, 190]
//       },
//       {
//         name: '换电站4',
//         type: 'bar',
//         label: labelOption,
//         emphasis: {
//           focus: 'series'
//         },
//         data: [98, 77, 101, 99, 40, 98, 77, 101, 99, 40, 80, 100]
//       }
//     ]
//   });
//   // 折线图（本周每日充电总车次）
//   const lineChartInstance = echarts.init(lineChart.value);
//   lineChartInstance.setOption({
//     title: {
//       text: '本周每日总充电车次',
//     },
//     xAxis: {
//       type: 'category',
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line',
//         smooth: true
//       }
//     ]
//   });
//   // 饼状图（换电站维修订单统计）
//   const pieChartInstance = echarts.init(pieChart.value);
//   pieChartInstance.setOption({
//     title: {
//       text: '换电站维修订单统计',
//     },
//     tooltip: {
//       trigger: 'item',
//       formatter: '{a} <br/>{b} : {c} ({d}%)'
//     },
//     toolbox: {
//       show: true,
//       feature: {
//         mark: { show: true },
//         dataView: { show: true, readOnly: false },
//         restore: { show: true },
//         saveAsImage: { show: true }
//       }
//     },
//     series: [
//       {
//         name: '数据详情',
//         type: 'pie',
//         radius: [20, 140],

//         roseType: 'area',
//         itemStyle: {
//           borderRadius: 5
//         },
//         data: [
//           { value: 30, name: '换电站1' },
//           { value: 28, name: '换电站2' },
//           { value: 26, name: '换电站3' },
//           { value: 24, name: '换电站4' },
//         ]
//       }
//     ]
//   });
//   // 面积图（）
//   const chartDomInstance = echarts.init(chartDom.value);
//   chartDomInstance.setOption({
//     tooltip: {
//       trigger: 'axis',
//       position: function (pt) {
//         return [pt[0], '10%'];
//       }
//     },
//     title: {
//       left: 'center',
//       text: '总电量统计'
//     },
//     toolbox: {
//       feature: {
//         dataZoom: {
//           yAxisIndex: 'none'
//         },
//         restore: {},
//         saveAsImage: {}
//       }
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: date
//     },
//     yAxis: {
//       type: 'value',
//       boundaryGap: [0, '100%']
//     },
//     dataZoom: [
//       {
//         type: 'inside',
//         start: 0,
//         end: 10
//       },
//       {
//         start: 0,
//         end: 10
//       }
//     ],
//     series: [
//       {
//         name: 'Fake Data',
//         type: 'line',
//         symbol: 'none',
//         sampling: 'lttb',
//         itemStyle: {
//           color: 'rgb(255, 70, 131)'
//         },
//         areaStyle: {
//           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//             {
//               offset: 0,
//               color: 'rgb(255, 158, 68)'
//             },
//             {
//               offset: 1,
//               color: 'rgb(255, 70, 131)'
//             }
//           ])
//         },
//         data: data
//       }
//     ]
//   });
// });


</script>

<style scoped>
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